# Technical Specification: Threshold Commerce Architecture

**Document ID:** TCA-V1.0
**Author:** Manus AI
**Date:** February 24, 2026
**Status:** Proposed Addendum for Master Brief V1.1

---

## 1. Overview & Architectural Principle

This document provides the detailed technical specification for the **Threshold Commerce Architecture**, as proposed in the Master Brief Addendums. It bridges the gap between the anonymous `Steepee` and the authenticated `Creative Scholar`.

The guiding principle is **respectful authentication**. The process must feel like a natural deepening of the practice, not a transactional interruption. We will achieve this through a passwordless "magic link" flow that preserves the portal's "no sign-up" ethos while establishing the secure, persistent identity required for commerce and continued engagement.

This architecture is a direct application of the **Triakis Protocol**. The anonymous experience is the stable **Base Tetrahedron**. The act of purchasing is a **Stellated Peak**—an elevation of engagement. This architecture ensures the path to that peak is stable, secure, and geometrically sound.

---

## 2. User Authentication Flow: The Veil-Crossing

This sequence begins when the `Steepee` meets the commerce threshold (two Sage exchanges) and decides to purchase.

1.  **Threshold Met:** The front-end (`steeping-portal-v4.jsx`) detects the condition and reveals the CTA for the `$44 Guidebook` and `$777 Journey`.
2.  **Initiate Purchase:** The user clicks a purchase CTA. Instead of a checkout form, the **Veil-Crossing Modal** is presented.
3.  **Email Submission:** The modal contains a single email input field and a submit button. The user enters their email and submits. This action triggers a `POST` request to `/api/auth/magic-link`.
4.  **Magic Link Sent:** The server generates a single-use, time-limited authentication token, stores its hash, and sends an email containing a unique login link to the user.
5.  **Link Clicked:** The user opens the email and clicks the magic link. This opens a new tab directed to `/api/auth/callback?token=[TOKEN]`. The portal front-end should display a "Check your email for a link to continue" message.
6.  **Authentication & Session Creation:** The server validates the token. Upon success, it creates a user record if one doesn't exist, deletes the used token, and generates a session JWT (JSON Web Token). The server responds with a redirect back to the portal's main URL, setting the session JWT as a secure, `HttpOnly` cookie.
7.  **Authenticated State:** The portal front-end reloads. It now detects the session cookie and transitions to an authenticated state. The user's `Resonant Signature` and chat history are now associated with their persistent identity. The Veil-Crossing Modal reappears, now presenting the final purchase options.
8.  **Stripe Checkout:** The user selects their desired product (`Guidebook` or `Journey`). This triggers a `POST` request to the authenticated `/api/stripe/checkout-session` endpoint. The server returns a Stripe Checkout session URL. The front-end redirects the user to Stripe to complete the payment.
9.  **Purchase Completion:** After a successful payment, Stripe redirects the user back to a dedicated `?purchase=success` page on the portal. A server-side Stripe webhook (`checkout.session.completed`) has already updated the user's record in the database, granting them access to the purchased content.

---

## 3. Database Schema (Supabase/Firebase)

Three tables are required to support this architecture.

### `users` table

Stores persistent information about authenticated Creative Scholars.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary Key. Auto-generated UUID. |
| `email` | `text` | User's email address. Must be unique. |
| `created_at` | `timestamp` | Timestamp of user creation. |
| `resonant_signature` | `text` | The user's answer to "Who do I Think I Am?" Associated on first auth. |

### `auth_tokens` table

Stores single-use tokens for the magic link flow.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary Key. |
| `user_email` | `text` | The email the token was sent to. |
| `token_hash` | `text` | A SHA-256 hash of the generated token. **Never store the raw token.** |
| `expires_at` | `timestamp` | Timestamp for when the token becomes invalid (e.g., 15 minutes from creation). |
| `created_at` | `timestamp` | Timestamp of token creation. |

### `purchases` table

Links users to the products they have purchased.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary Key. |
| `user_id` | `uuid` | Foreign Key, references `users.id`. |
| `product_id` | `text` | The identifier for the purchased product (e.g., `prod_guidebook`, `prod_journey`). |
| `stripe_session_id` | `text` | The Stripe Checkout Session ID for reference. |
| `created_at` | `timestamp` | Timestamp of the purchase. |

---

## 4. API Endpoints (Next.js API Routes)

These routes handle the server-side logic for the entire flow.

### `POST /api/auth/magic-link`

*   **Authentication:** Public.
*   **Body:** `{ email: string }`
*   **Logic:**
    1.  Validate the email format.
    2.  Generate a cryptographically secure random string (32 bytes, hex-encoded) as the raw token.
    3.  Hash the token using SHA-256.
    4.  Set an expiry time (15 minutes from now).
    5.  Store the `email`, `token_hash`, and `expires_at` in the `auth_tokens` table.
    6.  Construct the magic link URL: `https://your-portal-domain.com/api/auth/callback?token=[RAW_TOKEN]`.
    7.  Use a transactional email service (e.g., Resend, SendGrid) to send the link to the user's email.
    8.  Respond with `200 OK`.

### `GET /api/auth/callback`

*   **Authentication:** Public.
*   **Query Params:** `{ token: string }`
*   **Logic:**
    1.  Extract the raw token from the query parameters.
    2.  Hash the incoming token.
    3.  Query the `auth_tokens` table for a matching `token_hash`.
    4.  If not found or if `expires_at` is in the past, redirect to an error page (`/auth/error?reason=invalid_token`).
    5.  If valid, retrieve the `user_email`.
    6.  Delete the token from `auth_tokens` to prevent reuse.
    7.  Find or create a user in the `users` table with the `user_email`.
    8.  Generate a JWT session token containing the `user.id` and `user.email`.
    9.  Set the JWT as a secure, `HttpOnly` cookie with a reasonable expiry (e.g., 30 days).
    10. Respond with a 302 redirect to the portal's main URL (`/`).

### `POST /api/stripe/checkout-session`

*   **Authentication:** Required (valid JWT session cookie).
*   **Body:** `{ productId: string, priceId: string }`
*   **Logic:**
    1.  Verify the JWT and extract the `user.id`.
    2.  Initialize the Stripe Node.js library with the secret key.
    3.  Create a Stripe Checkout Session using `stripe.checkout.sessions.create()`.
    4.  Pass the `user.id` in the `client_reference_id` field. This is critical for the webhook.
    5.  Provide `success_url` and `cancel_url`.
    6.  Respond with `200 OK` and the `{ checkoutUrl: session.url }`.

### `POST /api/stripe/webhook`

*   **Authentication:** Public, but requires Stripe signature verification.
*   **Body:** Stripe event object.
*   **Logic:**
    1.  Verify the `Stripe-Signature` header to ensure the request is from Stripe.
    2.  Listen for the `checkout.session.completed` event type.
    3.  When the event occurs, extract the session object.
    4.  Retrieve the `user.id` from `session.client_reference_id`.
    5.  Retrieve the purchased product ID from the session line items.
    6.  Insert a new record into the `purchases` table with the `user_id` and `product_id`.
    7.  Respond to Stripe with `200 OK` to acknowledge receipt.

---

## 5. Security Considerations

*   **Environment Variables:** All secrets (`JWT_SECRET`, `STRIPE_SECRET_KEY`, `DATABASE_URL`, `EMAIL_API_KEY`) must be stored as environment variables on the server and never exposed client-side.
*   **Token Security:** Magic link tokens must be single-use and have a short expiry. Always store a hash of the token, never the raw value.
*   **Cookie Security:** Session JWTs must be transmitted in `HttpOnly`, `Secure` (in production), and `SameSite=Strict` cookies to mitigate XSS and CSRF attacks.
*   **Webhook Security:** Always verify the signature of incoming Stripe webhooks using `stripe.webhooks.constructEvent()` to prevent forged requests.
*   **Rate Limiting:** Apply rate limiting to the `/api/auth/magic-link` endpoint to prevent abuse (e.g., email spamming).

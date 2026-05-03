# STEEPERVERSE GO-LIVE ROADMAP
### From Laboratory to Live — A Step-by-Step Field Guide
**April 2026 — Updated after Supabase Session completion**

---

## CURRENT STATUS

| Session | What | Status |
|---|---|---|
| Session 01 | Supabase Configuration | ✅ Complete |
| Session 02 | Stripe Products | ✅ Complete |
| Session 03 | Edge Functions | ✅ Complete (Local) |
| Session 04 | AuthOverlay Wiring | ✅ Complete |
| Session 05 | Bluehost Deployment | ⬜ Last step |

---

## ✅ SESSION 01: SUPABASE — COMPLETE

Everything below has been confirmed done.

- ✅ `access_tier` column added to `steeper_profiles` with correct values (`interactive`, `journeyer`, `cohort`, `single_steep`, `depth_semester`)
- ✅ RLS enabled on `steeper_profiles` — own profile read + service role tier update
- ✅ RLS enabled on `steeping_ledgers` — practitioners access their own rows only
- ✅ Magic link email template updated — Invitational Register, your voice
- ✅ Redirect URLs set — localhost for testing, live domain slot ready
- ✅ Sessions page reviewed — free tier defaults confirmed correct, no changes needed

---

## ✅ SESSION 02: STRIPE — CREATING YOUR PRODUCTS (COMPLETE)

You have successfully created the full product ecosystem in Stripe.

**Your Canonical Price IDs:**
```
Tier 1 — The Journeyer ($44/yr)      : price_1TQvWgFooCmmg6KQTbIEmCmi
Tier 2 — Cohort Sessions ($777)      : price_1TSkRDFooCmmg6KQbiCjCFm1
Tier 3a — Single Steep (1) ($222)    : price_1TSkgcFooCmmg6KQ8TzFYWKQ
Tier 3b — Single Steeps (3) ($600)   : price_1TSkoiFooCmmg6KQg7vTIZaJ
Tier 4 — The Depth Semester ($2,222) : price_1TSl1oFooCmmg6KQFOQIjcJC
```

**Save your API Keys before moving on:**
```
Stripe Publishable Key (pk_test_...):    ________________
Stripe Secret Key (sk_test_...):         ________________
```

Session 02 is complete.

---

## ⬜ SESSION 03: EDGE FUNCTIONS — THE INVISIBLE INFRASTRUCTURE

### What are Edge Functions?
Edge Functions are small programs that run on Supabase's servers (not in your browser, not on Bluehost). They do two things:

1. **`create-checkout-session`** — When a practitioner clicks a tier upgrade button, this function safely creates a Stripe payment page and sends them to it. It keeps your Stripe secret key on the server where no one can see it.

2. **`stripe-webhook`** — After a practitioner pays, Stripe tells this function "payment succeeded," and the function updates their `access_tier` in your Supabase database to `engaged` or `inneractive`. This is what actually unlocks the features.

### What you need first — Supabase CLI
The CLI is a command-line tool that lets you deploy these functions from your computer to Supabase. You install it once.

**Open your PowerShell / Terminal and run:**
```powershell
npm install supabase --save-dev
```

Then, from inside your project folder:
```powershell
npx supabase login
```

This will open a browser window asking you to authorize. Click **Authorize**. You only do this once.

---

### Step 3A — Create the Checkout Function

In your PowerShell, from inside the `steeping-v5-laboratory` folder, run:
```powershell
npx supabase functions new create-checkout-session
```

This creates a new file at:
```
steeping-v5-laboratory/supabase/functions/create-checkout-session/index.ts
```

Open that file and **replace everything in it** with the following. **Before pasting, fill in your two Price IDs where marked:**

```typescript
import Stripe from 'https://esm.sh/stripe@12.0.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

// ── CANONICAL PRICE IDs ────────────────────────────────────────────────────
const PRICE_IDS: Record<string, string | undefined> = {
  journeyer:      'price_1TQvWgFooCmmg6KQTbIEmCmi', // $44 (Annual)
  cohort:         'price_1TSkRDFooCmmg6KQbiCjCFm1', // $777
  single_steep_1: 'price_1TSkgcFooCmmg6KQ8TzFYWKQ', // $222
  single_steep_3: 'price_1TSkoiFooCmmg6KQg7vTIZaJ', // $600
  depth_semester: 'price_1TSl1oFooCmmg6KQFOQIjcJC', // $2,222
};
// ───────────────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  const { tier, user_id, return_url } = await req.json();

  const mode = tier === 'journeyer' ? 'subscription' : 'payment';

  const session = await stripe.checkout.sessions.create({
    mode: mode,
    line_items: [{ price: PRICE_IDS[tier], quantity: 1 }],
    client_reference_id: user_id,
    success_url: `${return_url}?tier=${tier}&success=1`,
    cancel_url: return_url,
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

> [!NOTE]
> `Deno.env.get('STRIPE_SECRET_KEY')` means the function reads your secret key from a secure environment variable — you never paste the actual key into this file. You set the variable separately in Step 3C.

---

### Step 3B — Create the Webhook Function

Run:
```powershell
npx supabase functions new stripe-webhook
```

Open `supabase/functions/stripe-webhook/index.ts` and **replace everything** with:

```typescript
import Stripe from 'https://esm.sh/stripe@12.0.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// ── CANONICAL PRICE IDs MAP ────────────────────────────────────────────────
const TIER_MAP: Record<string, string> = {
  'price_1TQvWgFooCmmg6KQTbIEmCmi': 'journeyer',
  'price_1TSkRDFooCmmg6KQbiCjCFm1': 'cohort',
  'price_1TSkgcFooCmmg6KQ8TzFYWKQ': 'single_steep',
  'price_1TSkoiFooCmmg6KQg7vTIZaJ': 'single_steep',
  'price_1TSl1oFooCmmg6KQFOQIjcJC': 'depth_semester',
};
// ───────────────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    Deno.env.get('STRIPE_WEBHOOK_SECRET')!
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;
    const priceId = (session as any).line_items?.data?.[0]?.price?.id;
    const newTier = TIER_MAP[priceId] ?? 'engaged';

    await supabase
      .from('steeper_profiles')
      .update({ access_tier: newTier })
      .eq('id', userId);
  }

  return new Response('ok', { status: 200 });
});
```

---

### Step 3C — Store Your Secrets Securely

These are the secure environment variables the functions read. You set them once and they live on Supabase's servers — never in your code files.

Run this line in PowerShell to store your Stripe Secret Key. (You only need the secret key since the Price IDs are hardcoded in the functions):

```powershell
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
```

> [!NOTE]
> `STRIPE_WEBHOOK_SECRET` gets set in Step 3E after you register the webhook in Stripe — you don't have that value yet.

---

### Step 3D — Deploy Both Functions to Supabase

```powershell
npx supabase functions deploy create-checkout-session
npx supabase functions deploy stripe-webhook
```

If successful, you'll see something like:
```
Deployed Functions create-checkout-session (took Xs)
Deployed Functions stripe-webhook (took Xs)
```

---

### Step 3E — Register the Webhook in Stripe

Now you need to tell Stripe where to send the "payment succeeded" notification.

1. Go to **Stripe Dashboard → Developers → Webhooks**
2. Click **+ Add endpoint**
3. In the **Endpoint URL** field, enter:
   ```
   https://[YOUR-SUPABASE-PROJECT-REF].supabase.co/functions/v1/stripe-webhook
   ```
   *(Find your project ref in Supabase: Settings → General → Reference ID)*

4. Under **Events to listen to**, click **+ Select events**, search for and select:
   ```
   checkout.session.completed
   ```

5. Click **Add endpoint**

6. On the webhook detail page, click **Reveal** next to **Signing secret**. Copy this value — it starts with `whsec_`.

7. Run:
   ```powershell
   npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
   ```

8. Re-deploy the webhook function so it picks up the new secret:
   ```powershell
   npx supabase functions deploy stripe-webhook
   ```

Session 03 is complete. I (Antigravity) have generated the `create-checkout-session` and `stripe-webhook` files locally in your repository. You simply need to deploy them and set the secrets via the Supabase CLI.

---

## ✅ SESSION 04: AUTHOVERLAY WIRING (COMPLETE)

I have successfully wired the Layer 2 and Layer 3 buttons in `AuthOverlay.jsx`. They now trigger the `create-checkout-session` edge function to redirect practitioners to Stripe Checkout. You can safely run `npm run build` and move to deployment.

---

## ⬜ SESSION 05: DEPLOYMENT TO BLUEHOST

### Your setup
- **Existing site:** `thealienschool.com` (hosted on Bluehost shared hosting)
- **Target URL:** `http://thealienschool.com/steeping`
- **Deployment method:** Upload built files to Bluehost via cPanel File Manager

> [!NOTE]
> **Why not Vercel or Netlify?**
> Since `thealienschool.com` already lives on Bluehost, the most seamless path is to deploy the Steeping Space as a subdirectory of that same host. Vercel and Netlify would give you a separate domain (e.g. `creativesteeping.netlify.app`), which means managing two hosting accounts. Bluehost can serve the Vite build as static files perfectly well — it just requires a few extra configuration steps for SPA routing. Netlify remains a solid option if you ever want to give the Steeping Space its own domain in the future. Stay with Bluehost for now.

---

### Step 5A — Update the Vite Config for the Subdirectory

Before building, you need to tell your Vite app that it lives at `/steeping/` rather than at the root of the domain. Open:

```
steeping-v5-laboratory/vite.config.js
```

Find the `defineConfig({...})` block and add `base: '/steeping/'`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/steeping/',   // ← ADD THIS LINE
})
```

---

### Step 5B — Create a Production Environment File

In the `steeping-v5-laboratory` folder, create a file called `.env.production` (note the dot at the start). Add these two lines with your actual Supabase values:

```
VITE_SUPABASE_URL=https://[your-project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

*(Find both in Supabase → Settings → API)*

> [!CAUTION]
> `.env.production` contains your anon key — this is safe to include in the build (it's designed to be public-facing). Do NOT put your Stripe secret key or Supabase service role key in here. Those live only in Supabase Edge Function secrets (Step 3C).

---

### Step 5C — Build the App

In PowerShell, from inside `steeping-v5-laboratory`:

```powershell
npm run build
```

When complete, a `dist/` folder is created inside `steeping-v5-laboratory/`. This folder contains your entire app — HTML, CSS, JavaScript — ready to upload.

---

### Step 5D — Add the SPA Routing File

Because the Steeping Space is a single-page React app, Bluehost needs a small instruction file to handle page navigation correctly. Without it, refreshing any page or following a direct link will give a 404 error.

Inside the `dist/` folder, create a new file called `.htaccess` with exactly this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /steeping/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /steeping/index.html [L]
</IfModule>
```

---

### Step 5E — Upload to Bluehost

1. Log in to **Bluehost cPanel**
2. Click **File Manager**
3. Navigate to **public_html/**
4. Create a new folder called `steeping` (so the path is `public_html/steeping/`)
5. Open that folder, then click **Upload**
6. Upload **all the contents** of your `dist/` folder into `public_html/steeping/`

   The folder should end up looking like this on Bluehost:
   ```
   public_html/
   └── steeping/
       ├── index.html
       ├── .htaccess
       └── assets/
           ├── index-[hash].js
           └── index-[hash].css
   ```

> [!IMPORTANT]
> Make sure `.htaccess` uploads correctly — it's a hidden file (starts with a dot) and some systems hide it by default. In Bluehost File Manager, make sure **Show Hidden Files** is enabled in the Settings.

---

### Step 5F — Update Supabase Redirect URLs (Final)

Now that you have a live URL, go back to:

`Supabase → Authentication → URL Configuration`

**Update Site URL to:**
```
http://thealienschool.com/steeping
```

**Add to Redirect URLs:**
```
http://thealienschool.com/steeping/**
```

This ensures magic link emails point to your live domain instead of localhost.

---

### Step 5G — Add Stripe Webhook for Live Domain (When Ready for Live Mode)

When you're ready to go from Stripe test mode to live mode:

1. In Stripe, toggle **Test mode OFF** (switch to Live mode)
2. Recreate both Products (Engaged + Inneractive) in Live mode — get new Price IDs
3. Run:
   ```powershell
   npx supabase secrets set STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY
   ```
4. Register the webhook again in Live mode pointing to your Supabase function URL
5. Set the new `whsec_` signing secret
6. Redeploy both functions

---

### Step 5H — Smoke Test (Final Checklist)

Run through this sequence after upload:

```
□ Open http://thealienschool.com/steeping in a browser
□ Entrance screen loads correctly
□ Enter a name → portal phase loads
□ Submit an email → magic link email arrives with correct copy
□ Click magic link → redirects to thealienschool.com/steeping (not localhost)
□ Complete a vessel → [ POUR — COMPLETE THIS STEEP ] appears
□ Completion ceremony overlay fires and dismisses
□ Test on a mobile device — scroll, touch targets, Steeping Notes navigation
□ Test Reading Lens (accessibility) — Atkinson Hyperlegible loads
```

---

## PENDING ENHANCEMENTS (Post-Launch)

| ID | Enhancement | Effort | Ready When |
|---|---|---|---|
| EH-03 | TURAO algorave ambient mode on Note 17 | 2 hrs | Launch stable |
| EH-05 | Sage history persistence for L2+ (Supabase) | 2 hrs | Session 01 ✅ |
| EH-07 | AuthOverlay → Stripe Checkout wiring | 1 hr code | Sessions 02+03 done |
| EH-08 | Post-payment success page | 1 hr | Session 03 done |
| EH-09 | Ontological Observatory L3 gating | 2 hrs | `useTier` live ✅ |
| EH-10 | L1 'Canned' Sage (Wayfinding & Encouragement) | 3 hrs | Pre-launch |
| EH-11 | Guide to the Steeperverse (Funnel Integration) | 2 hrs | Pre-launch |

---

## PRICE ARCHITECTURE — CONFIRMED

| Layer | Tier | Price | Billing | Narrative |
|---|---|---|---|---|
| L1 | Interactive | Free | - | Foundational access. Canned Sage Wayfinding. |
| L2 | The Journeyer | $44 | Annual | *Self-guided immersive reality experience. Full API Sage.* |
| L3 | Cohort Sessions | $777 | One-time | *One steep per week, one live session per steep.* |
| L3 | Single Steep (1) | $222 | One-time | *Bring Your Own Tea hour with KzA.* |
| L3 | Single Steeps (3) | $600 | One-time | *Three sessions across one month.* |
| L3 | The Depth Semester | $2,222 | One-time | *Full access and co-creative journey.* |

---

*Roadmap updated: April 2026 — post Supabase Session*
*Build status: ✅ Clean · Exit 0 · 2732 modules*
*Protocol version: 3.1 — Parts I–IX active*
*Live target: http://thealienschool.com/steeping via Bluehost*

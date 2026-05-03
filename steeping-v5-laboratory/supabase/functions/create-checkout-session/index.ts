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

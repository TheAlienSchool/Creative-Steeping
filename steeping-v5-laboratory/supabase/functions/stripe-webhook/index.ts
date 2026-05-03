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

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;
    const priceId = (session as any).line_items?.data?.[0]?.price?.id;
    const newTier = TIER_MAP[priceId] ?? 'engaged';

    if (userId) {
        await supabase
        .from('steeper_profiles')
        .update({ access_tier: newTier })
        .eq('id', userId);
    }
  }

  return new Response('ok', { status: 200 });
});

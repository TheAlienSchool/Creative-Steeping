import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xrryuzvfwuedzxdoknwi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_0Utn1nPlYepOicri4s4BPw_t_1Twii3';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  const { data: profiles, error: pError } = await supabase.from('steeper_profiles').select('*');
  const { data: ledgers, error: lError } = await supabase.from('steeping_ledgers').select('*');
  const { data: circles, error: cError } = await supabase.from('steeping_circles').select('*');
  
  console.log('Profiles count:', profiles?.length, 'Error:', pError?.message);
  console.log('Ledgers count:', ledgers?.length, 'Error:', lError?.message);
  console.log('Circles count:', circles?.length, 'Error:', cError?.message);
  
  if (profiles) console.log('Profiles sample:', profiles.slice(0, 3));
  if (ledgers) console.log('Ledgers sample:', ledgers.slice(0, 3));
  if (circles) console.log('Circles sample:', circles.slice(0, 3));
}
main();

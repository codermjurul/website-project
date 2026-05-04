import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ygoacbxqwqoxnbxjjhdq.supabase.co';
const supabaseAnonKey = 'sb_publishable_o9FsOfKcX8kHQrF2xICjsA_VzK_WpJ7';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('cars').select('id, image');
  console.log(JSON.stringify(data, null, 2));
}
check();

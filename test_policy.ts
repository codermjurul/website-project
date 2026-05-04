import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ygoacbxqwqoxnbxjjhdq.supabase.co';
const supabaseAnonKey = 'sb_publishable_o9FsOfKcX8kHQrF2xICjsA_VzK_WpJ7';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    const { data, error } = await supabase.from('cars').select('*');
    console.log('Select works?', error ? error : 'YES, ' + data?.length + ' records');
}

test();

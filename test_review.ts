import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ygoacbxqwqoxnbxjjhdq.supabase.co';
const supabaseAnonKey = 'sb_publishable_o9FsOfKcX8kHQrF2xICjsA_VzK_WpJ7';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    const newReviews = [{id: "local_123", userName: "Demo API test", rating: 5, comment: "It works", date: "2024-05-04"}];
    const { error } = await supabase.from('cars').update({ reviews: newReviews }).eq('id', '1');
    console.log('Update Error:', error);
}

test();

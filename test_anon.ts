import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ygoacbxqwqoxnbxjjhdq.supabase.co';
const supabaseAnonKey = 'sb_publishable_o9FsOfKcX8kHQrF2xICjsA_VzK_WpJ7';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    if (authError) {
        console.log('Anon Sign In Error:', authError);
    } else {
        console.log('Signed in anonymously!');
        const newCar = {
            id: `anon_user_${Date.now()}`,
            brand: 'TestAnon',
            model: 'TestAnon',
            year: 2023,
            price: 1000,
            importation: 'Local',
            condition: 'Good',
            fuelType: 'Petrol',
            transmission: 'Automatic',
            mileage: 100,
            description: 'Test2',
            image: 'test2.jpg',
            ownerId: authData.user?.id || 'demo-user-id',
            createdAt: new Date().toISOString()
        };

        const { error } = await supabase.from('cars').insert(newCar);
        console.log('Insert Error after Anon Auth:', error);
    }
}

test();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ygoacbxqwqoxnbxjjhdq.supabase.co';
const supabaseAnonKey = 'sb_publishable_o9FsOfKcX8kHQrF2xICjsA_VzK_WpJ7';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const newCar = {
      id: `user_${Date.now().toString()}`,
      brand: 'Test',
      model: 'Test',
      year: 2023,
      price: 1000,
      importation: 'Local',
      condition: 'Good',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      mileage: 100,
      description: 'Test',
      image: 'test.jpg',
      reviews: []
    };

    const { error } = await supabase.from('cars').insert({
        ...newCar,
        ownerId: 'demo-user-id',
        createdAt: new Date().toISOString()
      });
      console.log('Error:', error);
}

test();

// src/data/cars.ts
// This file contains the mock data for our application. 
// Using mock data allows us to demonstrate the functionality to your teacher without needing a complex backend database.

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  importation: 'Local' | 'Imported';
  condition: 'Excellent' | 'Good' | 'Fair';
  mileage: number; // in km
  fuelType: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  transmission: 'Automatic' | 'Manual';
  image: string;
  description: string;
  reviews: Review[];
}

export const mockCars: Car[] = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 2750000,
    importation: 'Local',
    condition: 'Excellent',
    mileage: 15000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/2021_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282021-10-21%29_01.jpg/1280px-2021_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282021-10-21%29_01.jpg',
    description: 'A reliable and fuel-efficient mid-size sedan perfect for daily commuting.',
    reviews: [
      { id: 'r1', userName: 'John D.', rating: 5, comment: 'Amazing fuel economy, very smooth ride.', date: '2023-10-12' },
      { id: 'r2', userName: 'Sarah M.', rating: 4, comment: 'Good car, but the infotainment system could be better.', date: '2023-11-05' }
    ]
  },
  {
    id: '2',
    brand: 'Honda',
    model: 'Civic',
    year: 2021,
    price: 2420000,
    importation: 'Imported',
    condition: 'Good',
    mileage: 30000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/2022_Honda_Civic_Sport_%28facelift%2C_blue%29%2C_front_8.21.22.jpg/1280px-2022_Honda_Civic_Sport_%28facelift%2C_blue%29%2C_front_8.21.22.jpg',
    description: 'Sporty compact car with excellent handling and spacious interior.',
    reviews: [
      { id: 'r3', userName: 'Mike T.', rating: 4, comment: 'Love the sporty look.', date: '2024-01-15' }
    ]
  },
  {
    id: '3',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2023,
    price: 4400000,
    importation: 'Imported',
    condition: 'Excellent',
    mileage: 5000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/2019_Tesla_Model_3_Performance_AWD_%28facelift%2C_red%29%2C_front_8.15.19.jpg/1280px-2019_Tesla_Model_3_Performance_AWD_%28facelift%2C_red%29%2C_front_8.15.19.jpg',
    description: 'All-electric sedan with cutting edge technology and autopilot features.',
    reviews: [
      { id: 'r4', userName: 'Alex W.', rating: 5, comment: 'The acceleration is unbelievable!', date: '2024-02-20' }
    ]
  },
  {
    id: '4',
    brand: 'Ford',
    model: 'Mustang',
    year: 2019,
    price: 3850000,
    importation: 'Local',
    condition: 'Fair',
    mileage: 60000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/2019_Ford_Mustang_GT_fastback_%28facelift%2C_orange%29%2C_front_8.15.19.jpg/1280px-2019_Ford_Mustang_GT_fastback_%28facelift%2C_orange%29%2C_front_8.15.19.jpg',
    description: 'Classic American muscle car with a powerful V8 engine.',
    reviews: []
  },
  {
    id: '5',
    brand: 'Nissan',
    model: 'Leaf',
    year: 2020,
    price: 1980000,
    importation: 'Local',
    condition: 'Good',
    mileage: 45000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/sixty/2019_Nissan_Leaf_ZE1_E+_%28facelift%29%2C_front_9.18.19.jpg/1280px-2019_Nissan_Leaf_ZE1_E+_%28facelift%29%2C_front_9.18.19.jpg',
    description: 'Affordable electric vehicle, great for city driving.',
    reviews: [
      { id: 'r5', userName: 'Emma O.', rating: 4, comment: 'Perfect first EV for me. Range is okay.', date: '2023-09-10' }
    ]
  },
  {
    id: '6',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2018,
    price: 1650000,
    importation: 'Imported',
    condition: 'Good',
    mileage: 80000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/2019_Toyota_Corolla_sedan_%28facelift%2C_white%29%2C_front_8.15.19.jpg/1280px-2019_Toyota_Corolla_sedan_%28facelift%2C_white%29%2C_front_8.15.19.jpg',
    description: 'The standard for reliability. Runs forever with basic maintenance.',
    reviews: []
  }
];

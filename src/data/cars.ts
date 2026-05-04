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
    image: 'https://res.cloudinary.com/dc1ydrkx7/image/upload/q_auto/f_auto/v1777924820/Toyota_Camry_V0012_t1fd4q.avif',
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
    image: 'https://res.cloudinary.com/dc1ydrkx7/image/upload/q_auto/f_auto/v1777924820/Honda_Civic_e-HEV_Sport_June_30_2024_xiky6b.jpg',
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
    image: 'https://res.cloudinary.com/dc1ydrkx7/image/upload/q_auto/f_auto/v1777924822/Tesla_Model_3_Buyers_Guide_qhddus.avif',
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
    image: 'https://res.cloudinary.com/dc1ydrkx7/image/upload/q_auto/f_auto/v1777924820/Ford_Mustang_Bronze_Pack_Thumbnail_ekab0c.jpg',
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
    image: 'https://res.cloudinary.com/dc1ydrkx7/image/upload/q_auto/f_auto/v1777924820/2026_Nissan_Leaf_oz5sjl.avif',
    description: 'Affordable electric vehicle, great for city driving.',
    reviews: [
      { id: 'r5', userName: 'Emma O.', rating: 4, comment: 'Perfect first EV for me. Range is okay.', date: '2023-09-10' }
    ]
  },
  {
    id: '6',
    brand: 'Toyota',
    model: 'GT86',
    year: 2018,
    price: 1650000,
    importation: 'Imported',
    condition: 'Good',
    mileage: 80000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    image: 'https://res.cloudinary.com/dc1ydrkx7/image/upload/q_auto/f_auto/v1777924821/Toyota_GT86_Front_View_Sept_17_2012_b2ig04.jpg',
    description: 'A brilliant sports car. Handles exceptionally and brings joy to everyday driving.',
    reviews: []
  }
];

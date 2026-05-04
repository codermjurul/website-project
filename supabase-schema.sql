-- Create the cars table
CREATE TABLE "cars" (
  "id" TEXT PRIMARY KEY,
  "ownerId" TEXT NOT NULL,
  "brand" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "price" BIGINT NOT NULL,
  "importation" TEXT NOT NULL,
  "condition" TEXT NOT NULL,
  "fuelType" TEXT NOT NULL,
  "transmission" TEXT NOT NULL,
  "mileage" INTEGER NOT NULL,
  "image" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "sellerName" TEXT,
  "sellerEmail" TEXT,
  "reviews" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "createdAt" TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE "cars" ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read cars
CREATE POLICY "Anyone can read cars"
ON "cars"
FOR SELECT
USING (true);

-- Allow authenticated users to insert a car
CREATE POLICY "Authenticated users can create cars"
ON "cars"
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update cars (either their own, or adding a review)
CREATE POLICY "Authenticated users can update cars"
ON "cars"
FOR UPDATE
USING (auth.role() = 'authenticated');

-- Allow users to delete their own cars
CREATE POLICY "Users can delete their own cars"
ON "cars"
FOR DELETE
USING (auth.uid()::text = "ownerId");

-- Insert Mock Data
INSERT INTO "cars" ("id", "ownerId", "brand", "model", "year", "price", "importation", "condition", "fuelType", "transmission", "mileage", "image", "description", "sellerName", "sellerEmail", "reviews", "createdAt") VALUES
('1', 'admin-seed-id', 'Toyota', 'Camry', 2022, 2750000, 'Local', 'Excellent', 'Hybrid', 'Automatic', 15000, 'https://pixabay.com/images/download/ahsing888-car-7095541_1920.jpg', 'A reliable and fuel-efficient mid-size sedan perfect for daily commuting.', 'AutoTrade', 'support@autotrade.com', '[{"id": "r1", "userName": "John D.", "rating": 5, "comment": "Amazing fuel economy, very smooth ride.", "date": "2023-10-12"}, {"id": "r2", "userName": "Sarah M.", "rating": 4, "comment": "Good car, but the infotainment system could be better.", "date": "2023-11-05"}]'::jsonb, '2023-10-10T10:00:00Z'),
('2', 'admin-seed-id', 'Honda', 'Civic', 2021, 2420000, 'Imported', 'Good', 'Petrol', 'Automatic', 30000, 'https://pixabay.com/images/download/domenik2212-honda-4384888_1920.jpg', 'Sporty compact car with excellent handling and spacious interior.', 'AutoTrade', 'support@autotrade.com', '[{"id": "r3", "userName": "Mike T.", "rating": 4, "comment": "Love the sporty look.", "date": "2024-01-15"}]'::jsonb, '2023-10-10T10:00:00Z'),
('3', 'admin-seed-id', 'Tesla', 'Model 3', 2023, 4400000, 'Imported', 'Excellent', 'Electric', 'Automatic', 5000, 'https://pixabay.com/images/download/capitalstreet_fx06-tesla-5937063_1920.jpg', 'All-electric sedan with cutting edge technology and autopilot features.', 'AutoTrade', 'support@autotrade.com', '[{"id": "r4", "userName": "Alex W.", "rating": 5, "comment": "The acceleration is unbelievable!", "date": "2024-02-20"}]'::jsonb, '2023-10-10T10:00:00Z'),
('4', 'admin-seed-id', 'Ford', 'Mustang', 2019, 3850000, 'Local', 'Fair', 'Petrol', 'Manual', 60000, 'https://pixabay.com/images/download/domaxi198-shelby-3821709_1920.jpg', 'Classic American muscle car with a powerful V8 engine.', 'AutoTrade', 'support@autotrade.com', '[]'::jsonb, '2023-10-10T10:00:00Z'),
('5', 'admin-seed-id', 'Nissan', 'Leaf', 2020, 1980000, 'Local', 'Good', 'Electric', 'Automatic', 45000, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/2019_Nissan_Leaf_ZE1_40_kWh%2C_front_8.15.19.jpg/1280px-2019_Nissan_Leaf_ZE1_40_kWh%2C_front_8.15.19.jpg', 'Affordable electric vehicle, great for city driving.', 'AutoTrade', 'support@autotrade.com', '[{"id": "r5", "userName": "Emma O.", "rating": 4, "comment": "Perfect first EV for me. Range is okay.", "date": "2023-09-10"}]'::jsonb, '2023-10-10T10:00:00Z'),
('6', 'admin-seed-id', 'Toyota', 'GT86', 2018, 1650000, 'Imported', 'Good', 'Petrol', 'Automatic', 80000, 'https://pixabay.com/images/download/hscarphotographie-luxury-car-6602359_1920.jpg', 'A brilliant sports car. Handles exceptionally and brings joy to everyday driving.', 'AutoTrade', 'support@autotrade.com', '[]'::jsonb, '2023-10-10T10:00:00Z');

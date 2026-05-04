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

-- Allow anyone to create cars
CREATE POLICY "Anyone can create cars"
ON "cars"
FOR INSERT
WITH CHECK (true);

-- Allow anyone to update cars
CREATE POLICY "Anyone can update cars"
ON "cars"
FOR UPDATE
USING (true);

-- Allow anyone to delete cars
CREATE POLICY "Anyone can delete cars"
ON "cars"
FOR DELETE
USING (true);

-- Insert Mock Data
INSERT INTO "cars" ("id", "ownerId", "brand", "model", "year", "price", "importation", "condition", "fuelType", "transmission", "mileage", "image", "description", "sellerName", "sellerEmail", "reviews", "createdAt") VALUES
('1', 'admin-seed-id', 'Toyota', 'Camry', 2022, 2750000, 'Local', 'Excellent', 'Hybrid', 'Automatic', 15000, 'https://res.cloudinary.com/dc1ydrkx7/image/upload/q_auto/f_auto/v1777924820/Toyota_Camry_V0012_t1fd4q.avif', 'A reliable and fuel-efficient mid-size sedan perfect for daily commuting.', 'AutoTrade', 'support@autotrade.com', '[{"id": "r1", "userName": "John D.", "rating": 5, "comment": "Amazing fuel economy, very smooth ride.", "date": "2023-10-12"}, {"id": "r2", "userName": "Sarah M.", "rating": 4, "comment": "Good car, but the infotainment system could be better.", "date": "2023-11-05"}]'::jsonb, '2023-10-10T10:00:00Z'),
('2', 'admin-seed-id', 'Honda', 'Civic', 2021, 2420000, 'Imported', 'Good', 'Petrol', 'Automatic', 30000, 'https://res.cloudinary.com/dc1ydrkx7/image/upload/q_auto/f_auto/v1777924820/Honda_Civic_e-HEV_Sport_June_30_2024_xiky6b.jpg', 'Sporty compact car with excellent handling and spacious interior.', 'AutoTrade', 'support@autotrade.com', '[{"id": "r3", "userName": "Mike T.", "rating": 4, "comment": "Love the sporty look.", "date": "2024-01-15"}]'::jsonb, '2023-10-10T10:00:00Z'),
('3', 'admin-seed-id', 'Tesla', 'Model 3', 2023, 4400000, 'Imported', 'Excellent', 'Electric', 'Automatic', 5000, 'https://res.cloudinary.com/dc1ydrkx7/image/upload/q_auto/f_auto/v1777924822/Tesla_Model_3_Buyers_Guide_qhddus.avif', 'All-electric sedan with cutting edge technology and autopilot features.', 'AutoTrade', 'support@autotrade.com', '[{"id": "r4", "userName": "Alex W.", "rating": 5, "comment": "The acceleration is unbelievable!", "date": "2024-02-20"}]'::jsonb, '2023-10-10T10:00:00Z'),
('4', 'admin-seed-id', 'Ford', 'Mustang', 2019, 3850000, 'Local', 'Fair', 'Petrol', 'Manual', 60000, 'https://res.cloudinary.com/dc1ydrkx7/image/upload/q_auto/f_auto/v1777924820/Ford_Mustang_Bronze_Pack_Thumbnail_ekab0c.jpg', 'Classic American muscle car with a powerful V8 engine.', 'AutoTrade', 'support@autotrade.com', '[]'::jsonb, '2023-10-10T10:00:00Z'),
('5', 'admin-seed-id', 'Nissan', 'Leaf', 2020, 1980000, 'Local', 'Good', 'Electric', 'Automatic', 45000, 'https://res.cloudinary.com/dc1ydrkx7/image/upload/q_auto/f_auto/v1777924820/2026_Nissan_Leaf_oz5sjl.avif', 'Affordable electric vehicle, great for city driving.', 'AutoTrade', 'support@autotrade.com', '[{"id": "r5", "userName": "Emma O.", "rating": 4, "comment": "Perfect first EV for me. Range is okay.", "date": "2023-09-10"}]'::jsonb, '2023-10-10T10:00:00Z'),
('6', 'admin-seed-id', 'Toyota', 'GT86', 2018, 1650000, 'Imported', 'Good', 'Petrol', 'Automatic', 80000, 'https://res.cloudinary.com/dc1ydrkx7/image/upload/q_auto/f_auto/v1777924821/Toyota_GT86_Front_View_Sept_17_2012_b2ig04.jpg', 'A brilliant sports car. Handles exceptionally and brings joy to everyday driving.', 'AutoTrade', 'support@autotrade.com', '[]'::jsonb, '2023-10-10T10:00:00Z');

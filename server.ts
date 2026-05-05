import express from "express";
import cors from "cors";
import path from "path";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Derive __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new Database('cars.db', { verbose: console.log });

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS cars (
    id TEXT PRIMARY KEY,
    ownerId TEXT,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    price REAL NOT NULL,
    importation TEXT NOT NULL,
    condition TEXT NOT NULL,
    mileage INTEGER NOT NULL,
    fuelType TEXT NOT NULL,
    transmission TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    carId TEXT NOT NULL,
    userName TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    date TEXT NOT NULL,
    isHidden INTEGER DEFAULT 0,
    FOREIGN KEY (carId) REFERENCES cars(id) ON DELETE CASCADE
  );
`);

// Mock Data seeding
const seedCount = db.prepare('SELECT COUNT(*) as count FROM cars').get() as {count: number};
if (seedCount.count === 0) {
  console.log("Seeding initial data...");
  const insertCar = db.prepare(`
    INSERT INTO cars (id, brand, model, year, price, importation, condition, mileage, fuelType, transmission, image, description)
    VALUES (@id, @brand, @model, @year, @price, @importation, @condition, @mileage, @fuelType, @transmission, @image, @description)
  `);
  
  const insertReview = db.prepare(`
    INSERT INTO reviews (id, carId, userName, rating, comment, date, isHidden)
    VALUES (@id, @carId, @userName, @rating, @comment, @date, @isHidden)
  `);

  const mockCars = [
    {
      id: '1', brand: 'Toyota', model: 'Camry', year: 2022, price: 2750000,
      importation: 'Local', condition: 'Excellent', mileage: 15000, fuelType: 'Hybrid', transmission: 'Automatic',
      image: 'https://res.cloudinary.com/dc1ydrkx7/image/upload/q_auto/f_auto/v1777924820/Toyota_Camry_V0012_t1fd4q.avif',
      description: 'A reliable and fuel-efficient mid-size sedan perfect for daily commuting.',
      reviews: [
        { id: 'r1', userName: 'John D.', rating: 5, comment: 'Amazing fuel economy, very smooth ride.', date: '2023-10-12' },
        { id: 'r2', userName: 'Sarah M.', rating: 4, comment: 'Good car, but the infotainment system could be better.', date: '2023-11-05' }
      ]
    },
    {
      id: '2', brand: 'Honda', model: 'Civic', year: 2021, price: 2420000,
      importation: 'Imported', condition: 'Good', mileage: 30000, fuelType: 'Petrol', transmission: 'Automatic',
      image: 'https://res.cloudinary.com/dc1ydrkx7/image/upload/q_auto/f_auto/v1777924820/Honda_Civic_e-HEV_Sport_June_30_2024_xiky6b.jpg',
      description: 'Sporty compact car with excellent handling and spacious interior.',
      reviews: [
        { id: 'r3', userName: 'Mike T.', rating: 4, comment: 'Love the sporty look.', date: '2024-01-15' }
      ]
    },
    {
      id: '3', brand: 'Tesla', model: 'Model 3', year: 2023, price: 4400000,
      importation: 'Imported', condition: 'Excellent', mileage: 5000, fuelType: 'Electric', transmission: 'Automatic',
      image: 'https://res.cloudinary.com/dc1ydrkx7/image/upload/q_auto/f_auto/v1777924822/Tesla_Model_3_Buyers_Guide_qhddus.avif',
      description: 'All-electric sedan with cutting edge technology and autopilot features.',
      reviews: [
        { id: 'r4', userName: 'Alex W.', rating: 5, comment: 'The acceleration is unbelievable!', date: '2024-02-20' }
      ]
    },
    {
      id: '4', brand: 'Ford', model: 'Mustang', year: 2019, price: 3850000,
      importation: 'Local', condition: 'Fair', mileage: 60000, fuelType: 'Petrol', transmission: 'Manual',
      image: 'https://res.cloudinary.com/dc1ydrkx7/image/upload/q_auto/f_auto/v1777924820/Ford_Mustang_Bronze_Pack_Thumbnail_ekab0c.jpg',
      description: 'Classic American muscle car with a powerful V8 engine.',
      reviews: []
    },
    {
      id: '5', brand: 'Nissan', model: 'Leaf', year: 2020, price: 1980000,
      importation: 'Local', condition: 'Good', mileage: 45000, fuelType: 'Electric', transmission: 'Automatic',
      image: 'https://res.cloudinary.com/dc1ydrkx7/image/upload/q_auto/f_auto/v1777924820/2026_Nissan_Leaf_oz5sjl.avif',
      description: 'Affordable electric vehicle, great for city driving.',
      reviews: [
        { id: 'r5', userName: 'Emma O.', rating: 4, comment: 'Perfect first EV for me. Range is okay.', date: '2023-09-10' }
      ]
    },
    {
      id: '6', brand: 'Toyota', model: 'GT86', year: 2018, price: 1650000,
      importation: 'Imported', condition: 'Good', mileage: 80000, fuelType: 'Petrol', transmission: 'Automatic',
      image: 'https://res.cloudinary.com/dc1ydrkx7/image/upload/q_auto/f_auto/v1777924821/Toyota_GT86_Front_View_Sept_17_2012_b2ig04.jpg',
      description: 'A brilliant sports car. Handles exceptionally and brings joy to everyday driving.',
      reviews: []
    }
  ];

  const transaction = db.transaction((cars) => {
    for (const car of cars) {
      insertCar.run({
        id: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        importation: car.importation,
        condition: car.condition,
        mileage: car.mileage,
        fuelType: car.fuelType,
        transmission: car.transmission,
        image: car.image,
        description: car.description
      });
      for (const review of car.reviews) {
        insertReview.run({
          id: review.id,
          carId: car.id,
          userName: review.userName,
          rating: review.rating,
          comment: review.comment,
          date: review.date,
          isHidden: 0
        });
      }
    }
  });

  transaction(mockCars);
}

// ============== API Pipeline with RAW SQL ==============

// Get ALL cars (with their reviews)
app.get("/api/cars", (req, res) => {
  try {
    const cars = db.prepare("SELECT * FROM cars").all();
    const reviews = db.prepare("SELECT * FROM reviews").all();

    // Map reviews to cars
    const result = cars.map((car: any) => ({
      ...car,
      reviews: reviews.filter((r: any) => r.carId === car.id).map((r: any) => ({
        ...r,
        isHidden: r.isHidden === 1
      }))
    }));

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new Car
app.post("/api/cars", (req, res) => {
  try {
    const data = req.body;
    const insertCar = db.prepare(`
      INSERT INTO cars (id, ownerId, brand, model, year, price, importation, condition, mileage, fuelType, transmission, image, description)
      VALUES (@id, @ownerId, @brand, @model, @year, @price, @importation, @condition, @mileage, @fuelType, @transmission, @image, @description)
    `);
    
    insertCar.run({
      id: data.id,
      ownerId: data.ownerId || null,
      brand: data.brand,
      model: data.model,
      year: data.year,
      price: data.price,
      importation: data.importation,
      condition: data.condition,
      mileage: data.mileage,
      fuelType: data.fuelType,
      transmission: data.transmission,
      image: data.image,
      description: data.description
    });
    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new review
app.post("/api/cars/:id/reviews", (req, res) => {
  try {
    const carId = req.params.id;
    const data = req.body;
    
    const insertReview = db.prepare(`
      INSERT INTO reviews (id, carId, userName, rating, comment, date, isHidden)
      VALUES (@id, @carId, @userName, @rating, @comment, @date, 0)
    `);
    
    insertReview.run({
      id: data.id,
      carId: carId,
      userName: data.userName,
      rating: data.rating,
      comment: data.comment,
      date: data.date
    });
    
    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle review visibility
app.put("/api/cars/:id/reviews/:reviewId/visibility", (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const { isHidden } = req.body;
    
    const updateReview = db.prepare(`
      UPDATE reviews SET isHidden = @isHidden WHERE id = @reviewId
    `);
    updateReview.run({
      isHidden: isHidden ? 1 : 0,
      reviewId: reviewId
    });
    
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Reset database (for seed purposes)
app.post("/api/seed", (req, res) => {
    try {
        db.exec("DELETE FROM reviews");
        db.exec("DELETE FROM cars");
        // We will just let the backend naturally re-seed on next restart, or we can just send "ok".
        // Actually, best is to just restart server to re-seed or call seed code if needed.
        res.status(200).json({ success: true, message: "Refresh server to re-seed entirely" });
    } catch(err: any) {
        res.status(500).json({ error: err.message });
    }
});


// ============== Start Server with Vite Middleware ==============

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

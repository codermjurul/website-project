import { useState, useEffect } from 'react';
import { Car } from '../data/cars';

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = async () => {
    try {
      const res = await fetch('/api/cars');
      if (!res.ok) throw new Error('Failed to fetch cars');
      const data = await res.json();
      setCars(data || []);
    } catch (err: any) {
      console.error('Error fetching cars:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const seedDatabase = async () => {
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to seed database');
      await fetchCars(); // refresh local state
    } catch (err: any) {
      console.error('Error seeding database:', err.message);
      throw err;
    }
  };

  const addCar = async (car: Car) => {
    try {
      // Optimistically add to local state immediately
      setCars(prev => [car, ...prev]);

      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(car),
      });
      if (!res.ok) throw new Error('Failed to add car');
    } catch (err: any) {
      console.error('Error adding car:', err.message);
      throw err;
    }
  };

  const addReview = async (carId: string, review: Car['reviews'][0]) => {
    try {
      const carToUpdate = getCar(carId);
      if (!carToUpdate) throw new Error("Car not found");

      const newReviews = [...(carToUpdate.reviews || []), review];
      
      // Optimistically add to local state immediately
      setCars(prevCars => prevCars.map(c => c.id === carId ? { ...c, reviews: newReviews } : c));

      const res = await fetch(`/api/cars/${carId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      if (!res.ok) throw new Error('Failed to add review');
    } catch (err: any) {
      console.error('Error adding review:', err.message);
      throw err;
    }
  };

  const toggleReviewVisibility = async (carId: string, reviewId: string, isHidden: boolean) => {
    try {
      const carToUpdate = getCar(carId);
      if (!carToUpdate) throw new Error("Car not found");

      const newReviews = (carToUpdate.reviews || []).map(r => 
        r.id === reviewId ? { ...r, isHidden } : r
      );
      
      // Optimistically add to local state immediately
      setCars(prevCars => prevCars.map(c => c.id === carId ? { ...c, reviews: newReviews } : c));

      const res = await fetch(`/api/cars/${carId}/reviews/${reviewId}/visibility`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isHidden }),
      });
      if (!res.ok) throw new Error('Failed to toggle review visibility');
    } catch (err: any) {
      console.error('Error toggling review visibility:', err.message);
      throw err;
    }
  };

  const getCar = (id: string): Car | undefined => {
    return cars.find(c => c.id === id);
  };

  return { cars, loading, error, addCar, addReview, toggleReviewVisibility, getCar, seedDatabase };
}


import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Car, mockCars } from '../data/cars';

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data, error } = await supabase.from('cars').select('*');
        if (error) throw error;
        setCars(data || []);
      } catch (err: any) {
        console.error('Error fetching cars:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();

    const subs = supabase
      .channel('cars-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cars' }, () => {
        fetchCars();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subs);
    };
  }, []);

  const seedDatabase = async () => {
    try {
      // Use demo user ID since auth is disabled
      const ownerId = 'admin-seed-id';

      for (const car of mockCars) {
        const { error } = await supabase.from('cars').upsert({
          ...car,
          ownerId: ownerId,
          createdAt: new Date().toISOString()
        });
        if (error) throw error;
      }
    } catch (err: any) {
      console.error('Error seeding database:', err.message);
      throw err;
    }
  };

  const addCar = async (car: Car) => {
    try {
      const ownerId = 'demo-user-id';

      // Optimistically add to local state immediately
      setCars(prev => [car, ...prev]);

      const { error } = await supabase.from('cars').insert({
        ...car,
        ownerId: ownerId,
        createdAt: new Date().toISOString()
      });
      
      if (error) {
        // If it's an RLS error, we don't throw immediately so the demo user doesn't get blocked entirely,
        // BUT we should throw if we want the form to show the error. Let's throw the error.
        // The optimistic update will stay in memory until a refresh.
        throw error;
      }
    } catch (err: any) {
      console.error('Error adding car:', err.message);
      // For demo purposes, we added the car locally so it shows up in the feed.
      // We still throw so the form can show a warning or clear the loading state.
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

      const { error } = await supabase.from('cars').update({ reviews: newReviews }).eq('id', carId);
      
      if (error) {
        throw error;
      }
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

      const { error } = await supabase.from('cars').update({ reviews: newReviews }).eq('id', carId);
      
      if (error) throw error;
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

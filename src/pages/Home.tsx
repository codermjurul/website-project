import React from 'react';
import { Link } from 'react-router-dom';
import { useCars } from '../hooks/useCars';
import { useCompare } from '../hooks/useCompare';
import { ShieldCheck, Tags, Search, ArrowRightLeft } from 'lucide-react';

// Home component: Renders the landing page of the application,
// displaying a hero section, features outline, and a few featured cars.
export function Home() {
  const { cars } = useCars();
  const { compareIds, toggleCompare } = useCompare();
  // Get a few featured cars to display on the homepage
  const featuredCars = cars.slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-white rounded-2xl p-8 sm:p-12 border border-gray-200 text-center space-y-6 shadow-sm">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          Find your perfect drive.
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore, compare, and negotiate prices on the best local and imported cars. 
          A clean, transparent way to buy your next vehicle.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link 
            to="/browse" 
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-sm flex items-center gap-2"
          >
            <Search size={18} />
            Start Browsing
          </Link>
        </div>
      </section>

      {/* Features Outline */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg">
            <Search size={22} />
          </div>
          <h3 className="font-semibold text-lg">Compare easily</h3>
          <p className="text-gray-600 text-sm">Put cars side-by-side to make the right choice based on specs and price.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg">
            <Tags size={22} />
          </div>
          <h3 className="font-semibold text-lg">Make an Offer</h3>
          <p className="text-gray-600 text-sm">See a car you like but the price is high? Negotiate and make your best offer.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg">
            <ShieldCheck size={22} />
          </div>
          <h3 className="font-semibold text-lg">Trusted Reviews</h3>
          <p className="text-gray-600 text-sm">Read opinions and experiences from other buyers before making a decision.</p>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured Cars</h2>
          <Link to="/browse" className="text-blue-600 hover:text-blue-700 font-medium text-sm transition">
            View all
          </Link>
        </div>

        {cars.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
             <p className="text-gray-500 mb-4">No cars available. Please run the Supabase schema script setup.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
            <Link 
              key={car.id} 
              to={`/car/${car.id}`} 
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition duration-200 group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img 
                  src={car.image} 
                  alt={`${car.brand} ${car.model}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'; }} // Fallback image shown if the main image URL fails to load
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-gray-800">
                  {car.year}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-900">
                    {car.brand} {car.model}
                  </h3>
                  <span className="font-bold text-blue-600">
                    ৳{car.price.toLocaleString()} {/* Currency set to BDT (Bangladeshi Taka) for local market */}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {car.description}
                </p>
                
                {/* Meta details footer */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>{car.mileage.toLocaleString()} km</span>
                    <span>&middot;</span>
                    <span>{car.importation}</span>
                    <span>&middot;</span>
                    <span>{car.condition}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleCompare(car.id);
                    }}
                    className={`flex items-center justify-center p-2 rounded-full transition-colors ${
                      compareIds.includes(car.id)
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    aria-label="Toggle Compare"
                    title={compareIds.includes(car.id) ? "Remove from Compare" : "Add to Compare"}
                  >
                    <ArrowRightLeft size={16} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
        )}
      </section>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Car } from '../data/cars';
import { useCars } from '../hooks/useCars';
import { useCompare } from '../hooks/useCompare';
import { Filter, SlidersHorizontal, Plus, ArrowRightLeft } from 'lucide-react';

// Browse component: Renders a browseable list of all cars,
// including real-time text search, brand/category filtering, and sorting functionality.
export function Browse() {
  const { cars, loading, seedDatabase } = useCars();
  const { compareIds, toggleCompare } = useCompare();
  const allCars = cars;
  
  // --- State for Filtering and Sorting ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('All');
  const [filterImport, setFilterImport] = useState('All');
  const [sortBy, setSortBy] = useState('price-asc');

  // We derive the list of unique brands for our filter dropdown
  const brands = useMemo(() => ['All', ...Array.from(new Set(allCars.map(car => car.brand)))], [allCars]);

  // --- Filtering & Sorting Logic ---
  // useMemo ensures we only recalculate when dependencies change
  const filteredCars = useMemo(() => {
    let result = [...allCars];

    // Filter by Search (Brand or Model)
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        car => car.brand.toLowerCase().includes(lowerSearch) || 
               car.model.toLowerCase().includes(lowerSearch)
      );
    }

    // Filter by Brand
    if (filterBrand !== 'All') {
      result = result.filter(car => car.brand === filterBrand);
    }

    // Filter by Importation type
    if (filterImport !== 'All') {
      result = result.filter(car => car.importation === filterImport);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'year-new': return b.year - a.year;
        case 'year-old': return a.year - b.year;
        default: return 0;
      }
    });

    return result;
  }, [searchTerm, filterBrand, filterImport, sortBy, allCars]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      
      {/* Sidebar / Filters */}
      <aside className="w-full md:w-64 space-y-6 flex-shrink-0">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Filter size={18} />
            Filters
          </h2>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Search</label>
          <input 
            type="text" 
            placeholder="Search make or model..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Brand Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Brand</label>
          <select 
            value={filterBrand} 
            onChange={(e) => setFilterBrand(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Importation Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Importation</label>
          <select 
            value={filterImport} 
            onChange={(e) => setFilterImport(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="All">All Origins</option>
            <option value="Local">Local</option>
            <option value="Imported">Imported</option>
          </select>
        </div>
      </aside>


      {/* Main Content (Grid) */}
      <div className="flex-1 space-y-6">
        
        {/* Top bar (Count & Sort) */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600 font-medium">
            Showing <span className="font-bold text-gray-900">{filteredCars.length}</span> cars
          </p>
          
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <SlidersHorizontal size={16} className="text-gray-500" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border-none bg-transparent focus:ring-0 font-medium text-gray-700 cursor-pointer"
            >
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="year-new">Year (Newest first)</option>
              <option value="year-old">Year (Oldest first)</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">Loading cars...</p>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No cars found matching your criteria.</p>
            <div className="mt-6 flex justify-center gap-4">
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterBrand('All');
                  setFilterImport('All');
                }}
                className="text-blue-600 font-medium text-sm hover:underline"
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
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
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">
                      {car.brand} <br/><span className="text-gray-600 text-sm font-medium">{car.model}</span>
                    </h3>
                    <span className="font-bold text-blue-600">
                      ৳{car.price.toLocaleString()} {/* Currency set to BDT (Bangladeshi Taka) for local market */}
                    </span>
                  </div>
                  
                  <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-gray-500">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-gray-100 px-2 py-1 rounded">{car.fuelType}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">{car.transmission}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">{car.condition} Condition</span>
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
      </div>
    </div>
  );
}

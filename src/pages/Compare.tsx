import React from 'react';
import { Link } from 'react-router-dom';
import { useCars } from '../hooks/useCars';
import { useCompare } from '../hooks/useCompare';
import { X, ArrowRightLeft, Info, Plus } from 'lucide-react';

// Compare component: Shows a side-by-side specification table for up to 3 selected cars,
// allowing users to contrast their features directly.
export function Compare() {
  const { compareIds, toggleCompare, clearCompare } = useCompare();
  const { cars, loading } = useCars();

  // Find the actual car objects to compare based on the IDs stored in local state
  const carsToCompare = cars.filter(car => compareIds.includes(car.id));

  // Helper row component for the comparison table
  const SpecRow = ({ label, values, isBold = false }: { label: string, values: React.ReactNode[], isBold?: boolean }) => (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition">
      <td className="py-4 px-4 text-sm font-medium text-gray-500 w-1/4">{label}</td>
      {values.map((v, i) => (
        <td key={i} className={`py-4 px-4 text-sm ${isBold ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
           {v}
        </td>
      ))}
      {/* Fill empty cells if comparing fewer than 3 cars */}
      {Array.from({ length: 3 - values.length }).map((_, i) => (
         <td key={`empty-${i}`} className="py-4 px-4 text-sm text-gray-400 italic bg-gray-50/30">
            Empty slot
         </td>
      ))}
    </tr>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <ArrowRightLeft className="text-blue-600" />
            Compare Cars
          </h1>
          <p className="text-gray-500 mt-2">Evaluate specifications side-by-side to find the perfect match.</p>
        </div>
        
        {carsToCompare.length > 0 && (
          <button 
            onClick={clearCompare}
            className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 active:scale-95 px-3 py-1.5 rounded transition-all"
          >
            Clear All
          </button>
        )}
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-4 shadow-sm">
          <p className="text-gray-500 max-w-md mx-auto">
            Loading cars...
          </p>
        </div>
      ) : carsToCompare.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
            <Info size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">No cars selected for comparison</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Go to the browse page or individual car details to add up to 3 cars to your comparison list.
          </p>
          <div className="pt-2">
            <Link to="/browse" className="inline-block bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium px-6 py-2.5 rounded-lg transition-all shadow-sm">
              Browse Cars
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            {/* Table Header: Car Images and Basic Info */}
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-4 w-1/4 align-bottom">
                  <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Features</span>
                </th>
                {carsToCompare.map(car => (
                  <th key={car.id} className="p-4 w-1/4 relative group">
                    <button 
                      onClick={() => toggleCompare(car.id)}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-red-500 hover:text-white active:scale-90 text-gray-500 p-1.5 rounded-full shadow-sm transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100"
                      aria-label="Remove from compare"
                    >
                      <X size={14} />
                    </button>
                    <Link to={`/car/${car.id}`} className="block">
                      <div className="h-32 rounded-lg overflow-hidden mb-3 bg-gray-100">
                        <img 
                          src={car.image} 
                          alt={car.model} 
                          className="w-full h-full object-cover hover:scale-105 transition" 
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'; }} // Fallback image shown if the main image URL fails to load
                        />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 leading-tight hover:text-blue-600 transition">
                        {car.brand} {car.model}
                      </h3>
                      <div className="text-xl font-extrabold text-blue-600 mt-1">
                        ৳{car.price.toLocaleString()} {/* Currency set to BDT (Bangladeshi Taka) for local market */}
                      </div>
                    </Link>
                  </th>
                ))}
                {/* Empty Placeholders for Header */}
                {Array.from({ length: 3 - carsToCompare.length }).map((_, i) => (
                  <th key={`empty-header-${i}`} className="p-4 w-1/4 bg-gray-50/50 border-l border-gray-100">
                    <div className="h-32 border-2 border-dashed border-gray-200 rounded-lg mb-3 flex items-center justify-center bg-gray-50">
                      <Plus className="text-gray-300" size={24} />
                    </div>
                    <Link to="/browse" className="text-sm font-medium text-blue-600 hover:underline mx-auto text-center block">
                      Add Car
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Table Body: Specifications */}
            <tbody>
              <SpecRow label="Year" values={carsToCompare.map(c => c.year)} />
              <SpecRow label="Mileage" values={carsToCompare.map(c => `${c.mileage.toLocaleString()} km`)} />
              <SpecRow label="Fuel Type" values={carsToCompare.map(c => c.fuelType)} />
              <SpecRow label="Transmission" values={carsToCompare.map(c => c.transmission)} />
              <SpecRow label="Condition" values={carsToCompare.map(c => c.condition)} isBold />
              <SpecRow label="Importation" values={carsToCompare.map(c => c.importation)} />
              <SpecRow 
                label="Reviews" 
                values={carsToCompare.map(c => 
                  c.reviews.length > 0 
                  ? `${c.reviews.length} review${c.reviews.length > 1 ? 's' : ''}` 
                  : 'No reviews'
                )} 
              />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

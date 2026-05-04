import React, { useState } from 'react';
import { CheckCircle2, CarFront, UploadCloud, X, AlertCircle } from 'lucide-react';
import { Car } from '../data/cars';
import { useAuth } from '../contexts/AuthContext';
import { useCars } from '../hooks/useCars';

// SellCar component: Provides a form for users to list their own car for sale.
// It uses Firebase to persist these user-submitted listings.
export function SellCar() {
  const { user, signIn } = useAuth();
  const { addCar } = useCars();
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Controlled form state to manage user inputs
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    importation: 'Local',
    condition: 'Good',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    mileage: '',
    description: '',
    sellerName: '',
    sellerEmail: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be signed in to list a car.");
      return;
    }
    
    // Create the new car listing matching the Car interface
    const newCar: Car = {
      id: `user_${Date.now().toString()}`, // Generate a random unique ID for each listing
      brand: formData.brand,
      model: formData.model,
      year: Number(formData.year),
      price: Number(formData.price),
      importation: formData.importation as any,
      condition: formData.condition as any,
      fuelType: formData.fuelType as any,
      transmission: formData.transmission as any,
      mileage: Number(formData.mileage),
      description: formData.description,
      image: imagePreview || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800', // Use uploaded image or default placeholder
      reviews: [] // Initialize with no reviews
    };

    try {
      await addCar(newCar);
      setSuccess(true);
      setError(null);
      
      // Reset form fields
      setFormData({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        importation: 'Local',
        condition: 'Good',
        fuelType: 'Petrol',
        transmission: 'Automatic',
        mileage: '',
        description: '',
        sellerName: '',
        sellerEmail: ''
      });
      setImagePreview(null);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError("There was a problem listing your car. Make sure you are authenticated and have filled all fields correctly.");
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300 flex flex-col items-center justify-center py-20">
        <UploadCloud className="text-gray-300 w-24 h-24 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Sign in to sell your car</h2>
        <p className="text-gray-500 max-w-md text-center">To ensure the quality of our listings, you must be signed in to post a vehicle on AutoTrade.</p>
        <button onClick={signIn} className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md mt-4">
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <CarFront className="text-blue-600" size={32} />
          Sell Your Car
        </h1>
        <p className="text-gray-500 mt-2">List your car on AutoTrade and reach thousands of potential buyers.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm relative">
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-3 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 size={24} className="text-green-500" />
            <span className="font-medium animate-pulse">Your car has been listed successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 0: Photos */}
          <div>
            <h3 className="font-bold text-lg border-b border-gray-100 pb-2 mb-4 text-gray-900">Vehicle Photos</h3>
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mt-2 flex justify-center rounded-xl border-2 border-dashed px-6 py-10 transition relative ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
            >
              {imagePreview ? (
                <div className="relative w-full max-w-md">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="rounded-lg object-cover w-full h-56 border border-gray-200 shadow-sm" 
                    onError={(e) => { e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'; }} // onError fallback ensures a placeholder shows if the image URL ever fails to load
                  />
                  <button 
                    type="button" 
                    onClick={removeImage} 
                    className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 active:scale-95 transition-all shadow-sm"
                    aria-label="Remove image"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-transparent font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-500">PNG, JPG, WEBP formats supported</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 1: Vehicle Basics */}
          <div>
            <h3 className="font-bold text-lg border-b border-gray-100 pb-2 mb-4 text-gray-900">Vehicle Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Make / Brand</label>
                <input required type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Toyota" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input required type="text" name="model" value={formData.model} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Camry" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input required type="number" name="year" value={formData.year} onChange={handleChange} min={1900} max={new Date().getFullYear() + 1} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (km)</label>
                <input required type="number" name="mileage" value={formData.mileage} onChange={handleChange} min={0} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="15000" />
              </div>
            </div>
          </div>

          {/* Section 2: Specifications */}
          <div>
            <h3 className="font-bold text-lg border-b border-gray-100 pb-2 mb-4 text-gray-900">Specifications</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Importation</label>
                <select name="importation" value={formData.importation} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Local">Local</option>
                  <option value="Imported">Imported</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select name="condition" value={formData.condition} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Pricing & Description */}
          <div>
            <h3 className="font-bold text-lg border-b border-gray-100 pb-2 mb-4 text-gray-900">Pricing & Description</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (৳)</label> {/* Currency set to BDT (Bangladeshi Taka) for local market */}
                <input required type="number" name="price" value={formData.price} onChange={handleChange} min={0} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg" placeholder="2750000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Describe the vehicle's features, history, and any other relevant details..."></textarea>
              </div>
            </div>
          </div>

          {/* Section 4: Seller Info */}
          <div>
            <h3 className="font-bold text-lg border-b border-gray-100 pb-2 mb-4 text-gray-900">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input required type="text" name="sellerName" value={formData.sellerName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input required type="email" name="sellerEmail" value={formData.sellerEmail} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md text-lg">
            List Car for Sale
          </button>
        </form>
      </div>
    </div>
  );
}

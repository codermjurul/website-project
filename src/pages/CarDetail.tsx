import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Review } from '../data/cars';
import { useCars } from '../hooks/useCars';
import { useCompare } from '../hooks/useCompare';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, CheckCircle2, AlertCircle, Plus, Minus, MessageSquare, Star, ArrowRightLeft, Eye, EyeOff } from 'lucide-react';

// CarDetail component: Displays full details, specs, and a user review section for a single car.
// Also provides functionality to leave a review and make a simulated counter-offer.
export function CarDetail() {
  const { id } = useParams<{ id: string }>();
  const { compareIds, toggleCompare } = useCompare();
  const { cars, loading, addReview, toggleReviewVisibility } = useCars();
  
  const { user, signIn } = useAuth();
  
  // Find the car based on the URL parameter ID
  const car = cars.find(c => c.id === id);

  // Modal State for 'Make an Offer'
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState<string>('');
  const [offerSent, setOfferSent] = useState(false);

  // --- Review Form State ---
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  
  // useState controls the temporary success message visibility
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Cars are coming from firestore now, so we no longer need localStorage for reviews
  const allReviews = car?.reviews || [];

  // --- Price Fairness Logic ---
  // Start with a base price depending on the car's condition
  let basePrice = 0;
  if (car?.condition === 'Excellent') basePrice = 3500000;
  else if (car?.condition === 'Good') basePrice = 2500000;
  else if (car?.condition === 'Fair') basePrice = 1500000;
  else basePrice = 2000000; // Default fallback

  // Adjust the base price downward by 50000 BDT for every year older the car is compared to 2024
  const yearDiff = 2024 - (car?.year || 2024);
  const yearAdjustment = yearDiff > 0 ? yearDiff * 50000 : 0;

  // Adjust the base price downward by 1 BDT for every km of mileage above 20000 km
  const mileageAdjustment = (car?.mileage || 0) > 20000 ? ((car?.mileage || 0) - 20000) * 1 : 0;

  // The result of this calculation is the "fair market price"
  const fairMarketPrice = basePrice - yearAdjustment - mileageAdjustment;

  // Compare the car's actual price to the fair market price
  let priceLabel = 'Fair Price';
  let priceColorClass = 'text-yellow-600 bg-yellow-50 border-yellow-200';
  
  // If the car's price is more than 10% below fair market price → label is "Good Deal" with green color
  if ((car?.price || 0) < fairMarketPrice * 0.9) {
    priceLabel = 'Good Deal';
    priceColorClass = 'text-green-600 bg-green-50 border-green-200';
  } 
  // If the car's price is more than 10% above fair market price → label is "Overpriced" with red color
  else if ((car?.price || 0) > fairMarketPrice * 1.1) {
    priceLabel = 'Overpriced';
    priceColorClass = 'text-red-600 bg-red-50 border-red-200';
  }
  // Otherwise, it remains "Fair Price" with yellow color

  // --- Loan & EMI Calculator State ---
  // The down payment input value (defaults to 20% of the car price)
  const [downPayment, setDownPayment] = useState<number>(0);
  
  // Initialize down payment when car loads
  useEffect(() => {
    if (car) {
      setDownPayment(Math.round(car.price * 0.2));
    }
  }, [car]);

  // The loan term in months (defaults to 36)
  const [loanTerm, setLoanTerm] = useState<number>(36);
  // The annual interest rate percentage (defaults to 9)
  const [interestRate, setInterestRate] = useState<number>(9);

  // --- Loan Calculations ---
  // Loan Amount = Car Price minus Down Payment (cannot be negative)
  const loanAmount = Math.max(0, (car?.price || 0) - downPayment);
  // Monthly interest rate calculation: (annual rate / 12) / 100
  const monthlyInterestRate = interestRate / 12 / 100;
  
  // Calculating Monthly EMI using the formula: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
  // where P is loan amount, R is monthly interest rate, N is number of months
  let monthlyEmi = 0;
  if (monthlyInterestRate > 0) {
    const emiNumerator = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm);
    const emiDenominator = Math.pow(1 + monthlyInterestRate, loanTerm) - 1;
    monthlyEmi = emiDenominator > 0 ? (emiNumerator / emiDenominator) : 0;
  } else {
    // If interest rate is 0, EMI is simply loan amount divided by loan term
    monthlyEmi = loanTerm > 0 ? loanAmount / loanTerm : 0;
  }

  // Total Payment = Monthly EMI multiplied by number of months
  const totalPayment = monthlyEmi * loanTerm;
  // Total Interest = Total Payment minus Loan Amount
  const totalInterest = Math.max(0, totalPayment - loanAmount);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car) return;
    if (!user) {
      signIn();
      return;
    }

    // Create the new review object
    const newReview: Review = {
      id: `local_${Date.now()}`,
      userName: reviewName || user.displayName || 'Anonymous',
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      setIsSubmittingReview(true);
      await addReview(car.id, newReview);
      
      // Clear form fields
      setReviewName('');
      setReviewRating(5);
      setReviewComment('');
      
      setReviewError(null);
      // Show success message
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setReviewError(err.message || 'Failed to add review. Try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Loading car details...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Car Not Found</h2>
        <p className="text-gray-500 mt-2 mb-6">The car you are looking for does not exist or has been removed.</p>
        <Link to="/browse" className="text-blue-600 font-medium hover:underline">Return to Browse</Link>
      </div>
    );
  }

  const isAddingToCompare = compareIds.includes(car.id);

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOfferSent(true);
    setTimeout(() => {
      setOfferSent(false);
      setIsOfferModalOpen(false);
      setOfferAmount('');
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-300">
      <Link to="/browse" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition">
        <ArrowLeft size={16} /> Back to listings
      </Link>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Image & Basic Info */}
        <div className="space-y-6">
          <div className="bg-gray-100 rounded-2xl overflow-hidden h-[400px]">
            <img 
              src={car.image} 
              alt={`${car.brand} ${car.model}`} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'; }} // Fallback image shown if the main image URL fails to load
            />
          </div>

          {/* Condition Overview Box */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-green-500" size={20} />
              Condition Overview
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              This vehicle is in <strong className="text-gray-900">{car.condition.toLowerCase()}</strong> condition. 
              {car.condition === 'Excellent' && ' It shows minimal signs of wear and has been meticulously maintained.'}
              {car.condition === 'Good' && ' It has some minor cosmetic wear typical for its age but runs perfectly.'}
              {car.condition === 'Fair' && ' It shows noticeable wear and tear but is mechanically sound.'}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Mileage</span>
                <span className="font-semibold text-gray-900">{car.mileage.toLocaleString()} km</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Import Status</span>
                <span className="font-semibold text-gray-900">{car.importation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-extrabold text-gray-900">{car.brand} {car.model}</h1>
              <span className="text-3xl font-bold text-blue-600">৳{car.price.toLocaleString()}</span> {/* Currency set to BDT (Bangladeshi Taka) for local market */}
            </div>
            <p className="text-sm text-gray-500 font-medium mb-4">Year: {car.year}</p>

            {/* Price Fairness Indicator */}
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-3 py-1 text-sm font-semibold border rounded-full ${priceColorClass}`}>
                {priceLabel}
              </span>
              <span className="text-xs text-gray-500">Based on condition, mileage, and model year</span>
            </div>

            <p className="text-gray-700 leading-relaxed mb-8">
              {car.description}
            </p>

            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium py-3 rounded-lg transition-all shadow-sm">
                Buy Now
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setIsOfferModalOpen(true)}
                  className="bg-white hover:bg-gray-50 active:scale-95 text-gray-900 border border-gray-300 font-medium py-3 rounded-lg transition-all shadow-sm"
                >
                  Make an Offer
                </button>
                <button 
                  onClick={() => toggleCompare(car.id)}
                  className={`border font-medium py-3 rounded-lg transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2
                    ${isAddingToCompare 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' 
                      : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'}`}
                >
                  <ArrowRightLeft size={16} />
                  {isAddingToCompare ? 'Remove Compare' : 'Add to Compare'}
                </button>
              </div>
            </div>
          </div>

          {/* Details Specifications */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold text-lg mb-4">Specifications</h3>
            <ul className="divide-y divide-gray-100 text-sm">
              <li className="py-3 flex justify-between">
                <span className="text-gray-500">Fuel Type</span>
                <span className="font-medium text-gray-900">{car.fuelType}</span>
              </li>
              <li className="py-3 flex justify-between">
                <span className="text-gray-500">Transmission</span>
                <span className="font-medium text-gray-900">{car.transmission}</span>
              </li>
              <li className="py-3 flex justify-between">
                <span className="text-gray-500">Condition</span>
                <span className="font-medium text-gray-900">{car.condition}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Loan & EMI Calculator Section */}
      <section className="bg-white p-6 md:p-8 rounded-xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-6">Loan & EMI Calculator</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Price (BDT)</label>
              <input 
                type="text" 
                readOnly
                value={`৳${car.price.toLocaleString()}`}
                className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment (BDT)</label>
              <input 
                type="number" 
                min={0}
                max={car.price}
                value={downPayment || ''}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term</label>
              <select 
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
              >
                <option value={12}>12 months</option>
                <option value={24}>24 months</option>
                <option value={36}>36 months</option>
                <option value={48}>48 months</option>
                <option value={60}>60 months</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Interest Rate (%)</label>
              <input 
                type="number" 
                min={0}
                step={0.1}
                value={interestRate || ''}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          
          {/* Output Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-center items-center text-center">
              <span className="text-gray-500 text-sm font-medium mb-1">Loan Amount</span>
              <span className="text-xl font-bold text-gray-900">৳{loanAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col justify-center items-center text-center">
              <span className="text-blue-600 text-sm font-medium mb-1">Monthly EMI</span>
              <span className="text-2xl font-bold text-blue-700">৳{monthlyEmi.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-center items-center text-center">
              <span className="text-gray-500 text-sm font-medium mb-1">Total Interest</span>
              <span className="text-lg font-semibold text-gray-800">৳{totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-center items-center text-center">
              <span className="text-gray-500 text-sm font-medium mb-1">Total Payment</span>
              <span className="text-lg font-semibold text-gray-800">৳{totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-white p-6 md:p-8 rounded-xl border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare size={24} className="text-blue-600" />
          <h2 className="text-2xl font-bold">User Experience & Reviews</h2>
        </div>

        {allReviews.length === 0 ? (
          <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            No reviews yet for this vehicle. Be the first to buy and leave a review!
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {allReviews.map(review => (
              <div key={review.id} className={`p-4 border border-gray-100 rounded-lg shadow-sm ${review.isHidden ? 'bg-gray-100 opacity-60' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-900">{review.userName} {review.isHidden && '(Hidden)'}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleReviewVisibility(car.id, review.id, !review.isHidden)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                      title={review.isHidden ? "Unhide Review" : "Hide Review"}
                    >
                      {review.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <div className="flex items-center text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                </div>
                {!review.isHidden ? (
                  <p className="text-sm text-gray-600 italic mb-3">"{review.comment}"</p>
                ) : (
                  <p className="text-sm text-gray-400 italic mb-3">This review has been hidden.</p>
                )}
                <div className="text-xs text-gray-400">{review.date}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Leave a Review Section */}
      <section className="bg-white p-6 md:p-8 rounded-xl border border-gray-200">
        <h3 className="text-xl font-bold mb-6">Leave a Review</h3>
        {reviewError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500" />
            {reviewError}
          </div>
        )}
        {reviewSuccess ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-3">
            <CheckCircle2 size={20} className="text-green-500" />
            Review submitted! Thank you.
          </div>
        ) : (
          <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input 
                type="text" 
                required
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className={`p-1 focus:outline-none transition-colors ${reviewRating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                  >
                    <Star size={24} fill="currentColor" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea 
                required
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Share your experience..."
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={isSubmittingReview}
              className={`text-white font-medium py-2.5 px-6 rounded-lg transition-all shadow-sm ${isSubmittingReview ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
            >
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </section>

      {/* Make an Offer Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
            {!offerSent ? (
               <form onSubmit={handleOfferSubmit} className="space-y-4">
                 <h2 className="text-xl font-bold text-gray-900 text-center">Make an Offer</h2>
                 <p className="text-sm text-gray-500 text-center mb-6">
                   List price is <strong className="text-gray-900">৳{car.price.toLocaleString()}</strong>. Send your counter-offer to the seller. {/* Currency set to BDT (Bangladeshi Taka) for local market */}
                 </p>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Your Offer (৳)</label> {/* Currency set to BDT (Bangladeshi Taka) for local market */}
                   <input 
                     type="number" 
                     required
                     max={car.price} 
                     min={100}
                     value={offerAmount}
                     onChange={(e) => setOfferAmount(e.target.value)}
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg font-medium"
                     placeholder={`E.g. ৳${car.price > 50000 ? car.price - 50000 : car.price}`}
                   />
                 </div>

                 <div className="flex gap-3 mt-6">
                   <button 
                     type="button" 
                     onClick={() => setIsOfferModalOpen(false)}
                     className="flex-1 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-800 font-medium py-2.5 rounded-lg transition-all"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit" 
                     className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium py-2.5 rounded-lg transition-all"
                   >
                     Send Offer
                   </button>
                 </div>
               </form>
            ) : (
               <div className="text-center py-8 space-y-4">
                 <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                   <CheckCircle2 size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900">Offer Sent!</h3>
                 <p className="text-sm text-gray-500">The seller will review your offer of ৳{Number(offerAmount).toLocaleString()} and get back to you shortly.</p> {/* Currency set to BDT (Bangladeshi Taka) for local market */}
               </div>
            )}
           
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { CarDetail } from './pages/CarDetail';
import { Compare } from './pages/Compare';
import { SellCar } from './pages/SellCar';

// Main App component: Acts as the root component for routing
export default function App() {
  return (
    // BrowserRouter manages URL paths and history for React Router
    <AuthProvider>
      <BrowserRouter>
        {/* Routes is a container for all the Route definitions */}
        <Routes>
          {/* The top-level Route wraps everything in the Layout component, establishing the common header and structure */}
          <Route path="/" element={<Layout />}>
            {/* Default child route matching "/" which loads the Home page */}
            <Route index element={<Home />} />
            {/* Route for "/browse", which mounts the Browse page to see all cars */}
            <Route path="browse" element={<Browse />} />
            {/* Dynamic route matching "/car/:id", passing the provided :id parameter to the CarDetail page */}
            <Route path="car/:id" element={<CarDetail />} />
            {/* Route for "/compare", mounting the Compare page to contrast selected cars */}
            <Route path="compare" element={<Compare />} />
            {/* Route for "/sell", presenting the form to list a new car */}
            <Route path="sell" element={<SellCar />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

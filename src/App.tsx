/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { CarDetail } from './pages/CarDetail';
import { Compare } from './pages/Compare';
import { SellCar } from './pages/SellCar';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="browse" element={<Browse />} />
          <Route path="car/:id" element={<CarDetail />} />
          <Route path="compare" element={<Compare />} />
          <Route path="sell" element={<SellCar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

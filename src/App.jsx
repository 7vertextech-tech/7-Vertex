import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import ServiceDetailPage from './ServiceDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
    </Routes>
  );
}

export default App;
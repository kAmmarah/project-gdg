import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Routines from './pages/Routines';
import Mindfulness from './pages/Mindfulness';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="routines" element={<Routines />} />
          <Route path="mindfulness" element={<Mindfulness />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import {Dashboard} from './pages/Dashboard';
import {GoalSaverPage} from './pages/GoalSaverPage'
// import Goals from './pages/Goals';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/goals" element={<GoalSaverPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

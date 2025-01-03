import React from 'react';
import AdminDashboard from './Pages/AdminPages/AdminDashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () =>{

  return(
    
    <Router>
      <Routes>
         <Route path='/' element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
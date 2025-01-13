import React from 'react';
// import AdminDashboard from './Pages/AdminPages/AdminDashboard';
import Login from './Pages/Login';
import Dasboard from './Pages/AdminPages/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () =>{

  return(
    
    <Router>
      <Routes>
         <Route path='/' element={<Login />} />
         <Route path='/admin' element={<Dasboard />} />
      </Routes>
    </Router>
  )
}

export default App
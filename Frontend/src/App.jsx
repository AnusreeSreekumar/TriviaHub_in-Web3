import React, {useState} from 'react';
// import AdminDashboard from './Pages/AdminPages/AdminDashboard';
import Login from './Pages/Login';
import Dasboard from './Pages/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () =>{

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return(
    
    <Router>
      <Routes>
         <Route path='/' element={<Login setIsLoggedIn={setIsLoggedIn} />} />
         <Route path='/admin' element={<Dasboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </Router>
  )
}

export default App
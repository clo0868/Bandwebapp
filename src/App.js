import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Home from "./home";
import Login from "./login";
import Signup from "./signup";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  
  return (
    <>
    <div>
        <ul className=" nav-navbar list-unstyled d-flex m-0 p-2 px-4">
          <li className='nav-item'>
            <Link className='link-dark' to="/">Home</Link>
          </li>
           <li className="ms-auto nav-item"><Link className='link-dark' to="/login"><i className="fas fa-sign-in-alt"></i></Link></li>
           <li className="ms-auto nav-item"><Link className='link-dark'  onClick={() => {sessionStorage.clear()}} to="/login"><i className="fas fa-sign-out-alt"></i></Link></li>  
        </ul>
        <hr/>
      </div>
      <Routes>
        
        <Route index path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        
      </Routes>
    </>
    
  );
  
}

export default App;

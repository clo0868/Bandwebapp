import React,{useState,useEffect} from 'react';
import { Routes, Route, Link, useLocation,useSearchParams } from "react-router-dom";
import Home from "./home";
import Login from "./login";
import Signup from "./signup";
import Competition from './competition';
import { ProtectedRoute } from "./components/ProtectedRoute";
import axios from 'axios';
import Scheduler from './components/Scheduler';
function App() {
  let location = useLocation();
  const token = sessionStorage.TOKEN
  const [user, setUser] = useState()
  const [searchParams, setSearchParams] = useSearchParams({query:''});
  useEffect(() => {
    axios({
      method: 'POST',
      url: './user',
      headers: {
          Authorization: `Bearer ${token}`,
        },
    }).then(res => {
      setUser(res.data)
      //console.log(location);
    }).catch(e => {
      if(e.response.data.error === 'User not approved!'){
        setUser({user:e.response.data.error})
      }else{
        e = new Error();
      }
      
    })
  },[location])
  function handleChange(event) {
    event.preventDefault();
    let params = {query:event.target.value}
    setSearchParams(params);
  }
  
  return (
    <>
    <div className='navbar-sticky grid shadow-sm'>
        <ul className="list-unstyled row align-items-center text-center m-0 p-2 px-4">
          <li className='col-4'><Link className='link-dark' to="/">Home</Link></li>
          {location.pathname === '/' ? (
          <li className='col-4 d-flex justify-content-center'>            
            <form className="search-bar input-group border rounded-pill " >
              <input className="form-control ps-3 border-0 rounded-pill" placeholder='Search:' type="text" onChange={handleChange} value={new URLSearchParams(searchParams).get('query')} />         
            </form>
          </li>
          ):(
            <li className='col-4'></li>
          )
          }
          
          {user ? 
          <li className="col-4">
            <Link className='link-dark '  onClick={() => { setUser();sessionStorage.clear();}} to="/login">
              <i className="fas fa-sign-out-alt"></i>
            </Link>
          </li>
          :
          <li className="col-4">
            <Link className='link-dark' to="/signup">
              <i className="fas fa-user-plus"></i>
            </Link>
            <Link className='link-dark ms-4' to="/login">
              <i className="fas fa-sign-in-alt"></i>
            </Link>
          </li>}  
        </ul>
        
      </div>
      <Routes>
        
        <Route index path="/" element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        } />
        <Route index path="/competition" element={
          <ProtectedRoute>
            <Competition />
          </ProtectedRoute>
        } />
        <Route index path="/scheduler" element={
          <ProtectedRoute>
            <Scheduler />
          </ProtectedRoute>
        } />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        
      </Routes>
    </>
    
  );
  
}

export default App;

import React,{useState,useEffect} from 'react';
import { Routes, Route, Link, useLocation,useSearchParams } from "react-router-dom";
import Home from "./home";
import Login from "./login";
import Signup from "./signup";
import Competition from './competition';
import { ProtectedRoute } from "./components/ProtectedRoute";
import axios from 'axios';
import Scheduler from './components/Scheduler';
import ApproveUsers from './components/ApproveUsers';
import AllUsers from './components/AllUsers'
import Account from './components/Account'
import AddChildren from './components/AddChildren';
import Judge from './judge';

function App() {
  let location = useLocation();
  const token = sessionStorage.TOKEN
  const [user, setUser] = useState()
  const [searchParams, setSearchParams] = useSearchParams({query:''});
  const [notifs, setNotifs] = useState(0);
  useEffect(() => {
    //get notifications if any
    //do it any time the location changes or if the user logs in or out 
    axios({
      method: 'POST',
      url: 'https://pipe-band-server.herokuapp.com/approve_notif',
      headers: {
          Authorization: `Bearer ${token}`,
        },
    }).then(res => {
      setNotifs(res.data)
    }).catch(e => {
        e = new Error();     
    })
  }, [token,location]);

  
  useEffect(() => {
    //get the user data when the user logs in 
    axios({
      method: 'POST',
      url: 'https://pipe-band-server.herokuapp.com/user',
      headers: {
          Authorization: `Bearer ${token}`,
        },
    }).then(res => {
      setUser(res.data)
    }).catch(e => {
      //if the user isnt approved display the message
      if(e.response.data && e.response.data.error === 'User not approved!'){
        setUser({user:e.response.data.error})

      }else{
        //if not user is unauthorized to view info so dont 
        if(e.response.status === 403){
          sessionStorage.removeItem('TOKEN')
        }else{
          //display any other error messages 
          e = new Error();
        }
        
        
      }
      
    })
  },[token])

  function handleChange(event) {
    //function to change URL anytime the user uses the search bar on the home page 
    event.preventDefault();
    let params = {query:event.target.value}
    setSearchParams(params);
  }
  
  //HTML for navbar
  //including routes for the rest of the site 
  return (
    <>
    <div className='navbar-sticky grid shadow-sm'>
        <ul className="list-unstyled row align-items-center text-center m-0 p-2 px-4">
          <li className='col-4'><Link className='link-dark text-decoration-none' to="/">PipeBand</Link></li>
          {
          //only show search bar on home page 
          //if not still have empty column to seperate sections 
          location.pathname === '/' ? (
          <li className='col-4 d-flex justify-content-center'>            
              <input className=" search-bar form-control ps-3 border rounded-pill" placeholder='Search:' type="text" onChange={handleChange} value={new URLSearchParams(searchParams).get('query')} />         
            
          </li>
          ):(
            <li className='col-4'></li>
          )
          }
          
          {
          //check if the user is logged in 
          //if so display log out and other buttons 
          //instead of log in and signup 
          user ? 
          <li className="col-4">
            {
            //only displays this links if the user is a steward or judge 
            (user.user.user_type === 5 || user.user.user_type === 4) && 
              <>
                  <Link className='link-dark me-5' to='/users'>
                    <i className="fas fa-user-friends"></i>
                  </Link>

                  <Link className='relative link-dark me-5' to="/approve">              
                    <i className="fas fa-user-check"></i>
                    {
                    //show notification icon if there are any 
                    notifs.length > 0 &&
                      <span className='account-notification'>{notifs.length}</span>
                    }
                    
                  </Link>    
                  
              </>
                
              }
            <Link className='me-5 link-dark' to='/account'>
              <i className="fas fa-user"></i>
            </Link>
            <Link className='link-dark'  onClick={() => { setUser();sessionStorage.clear();}} to="/login">              
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
        {/* 
        routes for the page 
        any routes requiring login are wrapped in the protected route tag 
        this checks for valid token before loading page 
        login and signup arent as they cant be logged in to see these pages 
        the rest are.

        for future use the admin only pages can be wrapped in another admin route tag
        but for now its done seperatly on each page as it requires a sperate api call to the server 
        
        */}
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
        <Route index path="/approve" element={
          <ProtectedRoute>
            <ApproveUsers />
          </ProtectedRoute>
        } />
        <Route index path="/users" element={
          <ProtectedRoute>
            <AllUsers />
          </ProtectedRoute>
        } />
        <Route index path="/account" element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        } />
        <Route index path="/addchildren" element={
          <ProtectedRoute>
            <AddChildren />
          </ProtectedRoute>
        } />
        <Route index path="/judge" element={
          <ProtectedRoute>
            <Judge />
          </ProtectedRoute>
        } />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        
      </Routes>
    </>
    
  );
  
}

export default App;

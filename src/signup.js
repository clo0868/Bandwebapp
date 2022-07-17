import React, {useState,useEffect} from 'react';
import { useNavigate,Link } from "react-router-dom";

import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  useEffect(() => {
    if(sessionStorage.TOKEN){
      navigate("/")
    }
  },[])

  const handleSubmitSignup = async e => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      console.log("incorrect passwords")
    }else {
      // send the username and password to the server
      axios({
        method: 'POST',
        url: './signup',
        data: { user: username, pass: password },
      }).then(res => {
          sessionStorage.setItem("TOKEN", res.data.token);
          navigate("/")
      }).catch(e => {
        e = new Error();
      })
    }

  };

  return(
    <div className="container-fluid">
      <div className="d-flex justify-content-center">
        <div className="card p-5 py-4 mt-5 text-center">
          <h1 className="pb-3">Sign Up</h1>
         <form className="login" onSubmit={handleSubmitSignup}>
           <div className="mb-3">
           <input type="text" className="form-control" value={username} onChange={({ target }) => setUsername(target.value)} placeholder="Username" />
           </div>
           <div className="mb-3">
           <input type="password" className="form-control" value={password} onChange={({ target }) => setPassword(target.value)} placeholder="Password" />
           </div>
           <div className="mb-3">
           <input type="password" className="form-control" value={passwordConfirm} onChange={({ target }) => setPasswordConfirm(target.value)} placeholder="Confirm Password" />
           </div>
           <button className="btn btn-primary px-3"type="submit" name="submit">Sign Up</button>
         </form>
         <Link to="/login" className=" mt-3 link-dark text-center">Already have an account? Login here.</Link>
       </div>
      </div>
    </div>
  )
};

export default Signup;

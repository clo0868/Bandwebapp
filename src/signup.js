import React, {useState,useEffect,useRef} from 'react';
import { useNavigate,Link } from "react-router-dom";

import axios from 'axios';

const Signup = () => {
  const user_ref = useRef(null);
  const pass_ref = useRef(null);
  const pass_confirm_ref = useRef(null);


  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [accountType, setAccountType] = useState(0);
  useEffect(() => {
    if(sessionStorage.TOKEN){
      navigate("/")
    }
  },[])

  useEffect(() => {
    axios({
      method: 'POST',
      url: './check_existing_user',
      data: { user: username},
    }).then(res => {
      const user_input = user_ref.current; 
      if(username.length > 0 && res.data.length > 0){
        user_input.className = " form-control is-invalid";
      }else{
        user_input.className = " form-control";        
      }
    }).catch(e => {
      e = new Error();
    })

  },[username])

  const handleSubmitSignup = async e => {
    e.preventDefault();
    const pass_input = pass_ref.current; 
    const pass_confirm_input = pass_confirm_ref.current; 


    if (password !== passwordConfirm) {
      pass_input.className = " form-control is-invalid";
      pass_confirm_input.className = " form-control is-invalid";
      setPasswordConfirm("")
      setPassword("")
    }else {
      pass_input.className = " form-control";        
      pass_confirm_input.className = " form-control ";


      // send the username and password to the server
      axios({
        method: 'POST',
        url: './signup',
        data: { user: username, pass: password,type: accountType},
      }).then(res => {
          sessionStorage.setItem("TOKEN", res.data.token);
          navigate("/")
      }).catch(e => {
        e = new Error();
      })
    }

  };
  function unerror(){
    const pass_confirm_input = pass_confirm_ref.current; 
    const pass_input = pass_ref.current; 
    pass_confirm_input.className = " form-control"; 
    pass_input.className = " form-control";
  }

  return(
    <div className="container-fluid">
      <div className="d-flex justify-content-center">
        <div className="card login-card p-5 py-4 mt-5 text-center">
          <h1 className="pb-3">Sign Up</h1>
         <form className="login" onSubmit={handleSubmitSignup} >
           <div className="mb-3">
              <div className="input-group login-input">
                <input type="text" ref={user_ref} className="form-control " value={username} onChange={({ target }) => setUsername(target.value)} placeholder="Username"  required/>
                <div className="invalid-feedback">
                  Username Already Taken
                </div>
              </div>           
            </div>
           <div className="mb-3">
              <div className="input-group login-input">
                <input type="password" ref={pass_ref} onSelect={unerror} className="form-control" value={password} onChange={({ target }) => setPassword(target.value)} placeholder="Password"  required/>
              </div>           
            </div>
           <div className="mb-3">
              <div className="input-group login-input">
                <input type="password" ref={pass_confirm_ref} onSelect={unerror} className="form-control" value={passwordConfirm} onChange={({ target }) => setPasswordConfirm(target.value)} placeholder="Confirm Password"  required/>
                <div className="invalid-feedback">
                  Passwords do not match.
                </div>
              </div>
           </div>
           <div className="mb-3">
           <select className="form-select login-input"  value={accountType} onChange={({ target }) => setAccountType(target.value)} aria-label="Default select example" required>
            <option value="0">Student</option>
            <option value="2">Parent</option>
            <option value="3">Teacher</option>
          </select>
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

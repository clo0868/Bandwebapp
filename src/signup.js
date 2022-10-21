import React, {useState,useEffect,useRef} from 'react';
import { useNavigate,Link } from "react-router-dom";

import axios from 'axios';

const Signup = () => {

  //setup refs for all inputs 
  const name_ref = useRef(null);
  const user_ref = useRef(null);
  const email_ref = useRef(null);
  const pass_ref = useRef(null);
  const pass_confirm_ref = useRef(null);
  


  const navigate = useNavigate();

  //state of all inputs 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [accountType, setAccountType] = useState('0');



  useEffect(() => {
    //checks existing username when ever the user types
    //should really have a debounce to limit api calls or do it locally 
    axios({
      method: 'POST',
      url: 'https://pipe-band-server.herokuapp.com/check_existing_user',
      data: { user: username},
    }).then(res => {
      const user_input = user_ref.current;
      //changes bootstrap if the username is already taken  
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

    //get current refs 
    const pass_input = pass_ref.current; 
    const pass_confirm_input = pass_confirm_ref.current;
    
    
        
    if (password !== passwordConfirm) {
      //if passwords dont match tell the user and reset the inputs 
      pass_input.className = " form-control is-invalid";
      pass_confirm_input.className = " form-control is-invalid";
      setPasswordConfirm("")
      setPassword("")
    }else{
      //inputs are fine
      pass_input.className = " form-control";        
      pass_confirm_input.className = " form-control ";
      
      // send users data to the server
      axios({
        method: 'POST',
        url: 'https://pipe-band-server.herokuapp.com/signup',
        data: { username:username,email:email, name:name, pass: password,type: accountType},
      }).then(res => {

          //on success log user in by setting JWT and redirecting to home page 
          sessionStorage.setItem("TOKEN", res.data.token);
          navigate("/")
      }).catch(e => {
        e = new Error();
      })
        
      
    }
      
    

  };
  function unerror(){
    
    //when the user clicks on input remove any error CSS or bootstrap 
    const pass_confirm_input = pass_confirm_ref.current; 
    const pass_input = pass_ref.current; 
    pass_confirm_input.className = " form-control"; 
    pass_input.className = " form-control";

  }


  //displays HTML for signup form 
  return(
    <div className="container-fluid">
      <div className="d-flex justify-content-center">
        <div className="card login-card p-5 py-4 mt-5 text-center">
          <h1 className="pb-3">Sign Up</h1>
         <form className="login" onSubmit={handleSubmitSignup} >
         <div className="mb-3">
          <div className="input-group login-input">
            <input type="text" ref={name_ref} className="form-control me-2 " value={name} onChange={({ target }) => setName(target.value)} placeholder="Name"  required/>
          </div>           
        </div>   
          
            <div className="mb-3">
              <div className="input-group login-input">
              <input type="text" ref={user_ref} className="form-control me-2 " value={username} onChange={({ target }) => setUsername(target.value)} placeholder="Username"  required/>
              <div className="invalid-feedback">
                  Username Already Taken
                </div>
              </div>           
            </div>
            <div className="mb-3">
              <div className="input-group login-input">
                <input type="email" ref={email_ref} className="form-control" value={email} onChange={({ target }) => setEmail(target.value)} placeholder="Email"  required/>
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
            <option value="3">Tutor</option>
            <option value="4">Steward</option>
            <option value="5">Judge</option>
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

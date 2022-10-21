import React, { useEffect, useState,useRef} from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";



const Login = () => {
  let navigate = useNavigate();

  useEffect(() => {
    //if the user is logged in redirect to home page 
    if(sessionStorage.getItem("TOKEN")){
      navigate("/")
    }
  },[])
  
  const user_ref = useRef(null);
  const pass_ref = useRef(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function loginUser(user) {

    //get input refs 
    const user_input = user_ref.current; 
    const pass_input = pass_ref.current; 

    //send info to server 
    return axios({
        method: 'POST',
        url: 'https://pipe-band-server.herokuapp.com/login',
        data: { 
          user:user.username,
          pass:user.password,
        },
      }).then(res => {
        //no error so user was logged in succesfully
        user_input.className = " form-control"; 
        pass_input.className = " form-control";

        //set JWT in browser session storage 
        sessionStorage.setItem("TOKEN", res.data.token);

        //redirect to home page 
        navigate("/")
      }).catch(e => {
        //returned error then input found no match
        //form is invalid so changes in bootstrap 
        user_input.className = " form-control is-invalid";
        pass_input.className = " form-control is-invalid";
        setPassword("")
      })
   }

  const handleSubmit = async e => {
    //used beacause async is a pain 
    e.preventDefault();
    loginUser({
      username,
      password
    });
  }

  function unerror(){
    //remove errors when inputs are selected 
    const user_input = user_ref.current; 
    const pass_input = pass_ref.current; 
    user_input.className = " form-control"; 
    pass_input.className = " form-control";
  }


                          
  //displays HTML for login page 
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-center">
        <div className="card login-card justify-content-center mt-5 p-5">
          <h1 className="text-center">Login</h1>
          <form className="" onSubmit={handleSubmit}>
            <div className="my-3">
              <div className="input-group login-input">
                <input type="text" ref={user_ref} onSelect={unerror} className="form-control " value={username} onChange={({ target }) => setUsername(target.value)} placeholder="Username"  required/>
              </div>
            </div>
            <div className="mb-4">
              <div className="input-group login-input">
                <input type="password" ref={pass_ref} onSelect={unerror}  className="form-control" value={password} onChange={({ target }) => setPassword(target.value)} placeholder="Password"  required/>
                <div className="invalid-feedback text-center">
                  <p>Incorrect Username or Password</p>

                  
                </div>
              </div> 
            </div>
            <div className="text-center mb-3">
              <button type="submit" className="btn btn-primary" name="submit">Login</button>
            </div>
          </form>
          <Link to="/signup" className="link-dark text-center">Create A New Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

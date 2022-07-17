import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";



const Login = () => {
  let navigate = useNavigate();
  useEffect(() => {
    //console.log(sessionStorage.getItem("TOKEN"));
    if(sessionStorage.getItem("TOKEN")){
      navigate("/")
    }
  },[])
  

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function loginUser(user) {
    return axios({
        method: 'POST',
        url: './login',
        data: { 
          user:user.username,
          pass:user.password,
        },
      }).then(res => {
        sessionStorage.setItem("TOKEN", res.data.token);
        navigate("/")
      }).catch(e => {
        e = new Error();
      })
   }

  const handleSubmit = async e => {
    e.preventDefault();
    loginUser({
      username,
      password
    });
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-center">
        <div className="card justify-content-center mt-5 p-5">
          <h1 className="text-center">Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="my-3">
              <input type="text" className="form-control" value={username} onChange={({ target }) => setUsername(target.value)} placeholder="Username" />
            </div>
            <div className="mb-4">
              <input type="password" className="form-control" value={password} onChange={({ target }) => setPassword(target.value)} placeholder="Password" />
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

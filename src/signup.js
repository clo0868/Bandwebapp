import React, {useState,useEffect,useRef} from 'react';
import { useNavigate,Link } from "react-router-dom";

import axios from 'axios';

const Signup = () => {
  const first_ref = useRef(null);
  const last_ref = useRef(null);
  const user_ref = useRef(null);
  const email_ref = useRef(null);
  const pass_ref = useRef(null);
  const pass_confirm_ref = useRef(null);
  const student_ref = useRef(null)


  const navigate = useNavigate();
  const [firstname, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [accountType, setAccountType] = useState('0');
  const [names, setNames] = useState([]);
  const [student, setStudent] = useState('');
  useEffect(() => {
    if(sessionStorage.TOKEN){
      navigate("/")
    }
    axios({
      method: 'POST',
      url: './get_existing_names',
    }).then(res => {  
      setNames(res.data)
    }).catch(e => {
      e = new Error();
    })
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
    console.log(names.map(name => Object.values(name)));
    const merged_names = names.map(name => Object.values(name).slice(1).join(" "))
    if (password !== passwordConfirm) {
      pass_input.className = " form-control is-invalid";
      pass_confirm_input.className = " form-control is-invalid";
      setPasswordConfirm("")
      setPassword("")
    }if ((merged_names.every(name => name !== student) && accountType === "2") || (student !== '' && (accountType === '1' || accountType === '3'))) {
      const student_input = student_ref.current;
      console.log(student);
      console.log(merged_names);
      student_input.className = " form-control is-invalid";
    }else{
      pass_input.className = " form-control";        
      pass_confirm_input.className = " form-control ";
      if(accountType === '2'){
        const student_input = student_ref.current;
        student_input.className = " form-control";
      }
      // send the username and password to the server
      axios({
        method: 'POST',
        url: './signup',
        data: { username:username,student:(accountType === 2 ? names[merged_names.indexOf(student)].userID:null),email:email, firstname: firstname, lastname: lastName, pass: password,type: accountType},
      }).then(res => {
          sessionStorage.setItem("TOKEN", res.data.token);
          navigate("/")
      }).catch(e => {
        e = new Error();
      })
    }

  };
  function unerror(){
    if(accountType === '2'){
      const student_input = student_ref.current;
      student_input.className = " form-control";
    }
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
           {(accountType === '0'||accountType === '3'||accountType === '4'||accountType === '5') ? (
          <div className="mb-3">
          <div className="input-group login-input">
            <input type="text" ref={first_ref} className="form-control me-2 " value={firstname} onChange={({ target }) => setFirstName(target.value)} placeholder="First Name"  required/>
            <input type="text" ref={last_ref} className="form-control " value={lastName} onChange={({ target }) => setLastName(target.value)} placeholder="Last Name"  required/>
          </div>           
        </div>          
          ):(null)}
           {accountType === '2'&&
           <div className="mb-3">
            <div className="dropdown">
              <div id="studentDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              <input type="text" ref={student_ref} onSelect={unerror} className='form-control' value={student} onChange={({ target }) => setStudent(target.value)} placeholder="Students Name"  required/>
              <div className="invalid-feedback">
                  This Student Does Not Exist. Please Select An Existing Student.
              </div>
              </div>
              <ul className="dropdown-menu student-dropdown" aria-labelledby="studentDropdown">
                {names.map((name,index) => {
                  
                  return (
                    <div key={index}>
                    {(name.first_name.startsWith(student)||name.last_name.startsWith(student)) ? (
                      <li onClick={() => {setStudent(name.first_name+' '+name.last_name)}} className='student-dropdown-item ps-1'>{name.first_name+' '+name.last_name}</li>
                    ):(null)}
                    </div>
                  )
                })}
              </ul>
              
            </div>
           </div>
           }
          <button className="btn btn-primary px-3"type="submit" name="submit">Sign Up</button>

         </form>
         <Link to="/login" className=" mt-3 link-dark text-center">Already have an account? Login here.</Link>
       </div>
      </div>
    </div>
  )
};

export default Signup;

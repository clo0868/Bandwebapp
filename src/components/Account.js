import React,{useEffect,useState,useRef} from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';

const Account = () => {
    const first_ref = useRef(null);
    const last_ref = useRef(null);
    const user_ref = useRef(null);
    const email_ref = useRef(null);
    var childRefs = useRef([])

    let navigate = useNavigate();
    const token = sessionStorage.TOKEN
    const [children, setChildren] = useState([]);
    const [loading,setLoading] = useState(true)
    const [firstname, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [accountType, setAccountType] = useState('0');
    const [names, setNames] = useState([]);
    const [prevUsername, setPrevUsername] = useState('');
    const [prevChildren, setPrevChildren] = useState([]);
    const [valid, setValid] = useState(false);

    useEffect(() => {
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/user',
            headers: {
                Authorization: `Bearer ${token}`,
              },
          }).then(res => {
            setFirstName(res.data.user.first_name)
            setLastName(res.data.user.last_name)
            setEmail(res.data.user.email)
            setPrevUsername(res.data.user.user)
            setUsername(res.data.user.user)
            setAccountType(res.data.user.user_type)
            if (res.data.children) {
                setPrevChildren(res.data.children)
                setChildren(res.data.children.map(name => Object.values(name).slice(1,3).join(" ")))
            }
            setLoading(false)
          }).catch(e => {
            
                e = new Error();
            
          })
          axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/get_existing_names',
          }).then(res => {  
            setNames(res.data)
            console.log(res.data);
          }).catch(e => {
            e = new Error();
          })
    }, []);
    useEffect(() => {
        axios({
          method: 'POST',
          url: 'https://pipe-band-server.herokuapp.com/check_existing_user',
          data: { user: username},
        }).then(res => {
          const user_input = user_ref.current; 
          if( username.length > 0 && username !== prevUsername && res.data.length > 0){
            user_input.className = " form-control is-invalid";
            setValid(false)
          }else{
            setValid(true)
            user_input.className = " form-control";        
          }
    
        }).catch(e => {
          e = new Error();
        })
    
      },[username])

    function unerror(index){          
            const child_input = childRefs.current[index];
            child_input.className = " form-control";    
      }
      function unerrorEmail(){          
        const email_input = email_ref.current
        email_input.className =" form-control";    
  }
    function handleAccountUpdate(){            
            // send the username and password to the server

            const email_input = email_ref.current; 
            if(email_input.value.slice(1,email_input.length-1).includes('@')){
                email_input.className = "form-control";

            }else{
                email_input.className = "form-control is-invalid";

            }

            axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/update_account',
            headers: {
                Authorization: `Bearer ${token}`,
              },
            data: { username:username,email:email, firstname: firstname, lastname: lastName},
            }).then(res => {
                console.log(res.data);
            }).catch(e => {
            e = new Error();
            })
      }

      function updateChildren(){
        console.log(children);
        console.log(prevChildren);
        if (children.length === 0 ) return null

        const filter_names = names.filter((name) => {
            return name.parent === 0 || prevChildren.some((child) => {return child.userID === name.userID})
        })
        const merged_names = filter_names.map(name => Object.values(name).slice(1,3).join(" "))
        var validate_children = children.every((stud_name,index) => {
          const children_input = childRefs.current[index];
          if (merged_names.every((name) => name !== stud_name)) {
            children_input.className = " form-control is-invalid";
            return false
          }else{
            children_input.className = " form-control";
            return true
          }
        })   
        if (validate_children) {

            const send_children = []
            children.forEach((child) => {
                send_children.push(filter_names[merged_names.indexOf(child)])
            });
            console.log(send_children);
            axios({
                method: 'POST',
                url: 'https://pipe-band-server.herokuapp.com/update_children',
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
                data:{
                    children:send_children
                },
              }).then(res => {  
              }).catch(e => {
                e = new Error();
              })
            
        }

      }

    return (
        <div className='container-fluid comp-container'>
            <div className='grid'>
                <div className='row'>
                    <div className='col-2 shadow-sm comp-height'>

                    </div>
                    <div className='col-8 text-center approve-users-body'>
                        <button onClick={() => navigate(-1)} className='btn account-back'><i className="fas fa-arrow-left"></i></button>
                        {loading ? (
                            <>
                            
                            </>
                        ):(
                            <>
                                <form className="form-control m-2 p-2" >
                                    <h4 className='mb-3'>Your Account Details:</h4>
                                    <div className="mb-3 grid">
                                        <div className="row">
                                            <div className='col-6'>
                                                <div className='form-floating'>
                                                <input type="text" ref={first_ref} id='floatingFirstnameInput' className="form-control" value={firstname} onChange={({ target }) => setFirstName(target.value)} placeholder="First Name"  required/>
                                                <label htmlFor="floatingFirstnameInput">Firstname</label>
                                                </div>
                                            </div>
                                            <div className='col-6'>
                                                <div className='form-floating'>
                                                <input type="text" ref={last_ref} id='floatingLastnameInput' className="form-control " value={lastName} onChange={({ target }) => setLastName(target.value)} placeholder="Last Name"  required/>
                                                <label htmlFor="floatingLastnameInput">Lastname</label>
                                                </div>                                                
                                            </div>
                                        </div>           
                                    </div>         
                                    <div className="mb-3">
                                        <div className="form-floating">
                                            <input type="text" ref={user_ref} className="form-control" id='floatingUsernameInput' value={username} onChange={({ target }) => setUsername(target.value)} placeholder="Username"  required/>
                                            <label htmlFor="floatingUsernameInput">Username</label>
                                            <div className="invalid-feedback">
                                                Username Already Taken
                                            </div>
                                        </div>           
                                    </div>
                                    <div className="mb-3">
                                        <div className="form-floating">
                                            <input type="email" ref={email_ref} onFocus={unerrorEmail} className="form-control" id="floatingEmailInput" value={email} onChange={({ target }) => setEmail(target.value)} placeholder="Email"  required/>
                                            <label htmlFor="floatingEmailInput">Email address</label>
                                            <div className="invalid-feedback">
                                                Email must be of form example@example.co.nz
                                            </div>
                                        </div>
                                    </div>                                   
                                    <button disabled={!valid} onClick={() => {handleAccountUpdate()}} className="btn btn-primary px-3" type="button" name="submit">Update Account</button>
                                </form>                                
                                {accountType === 2 &&
                                <div className='form-control text-center m-2 p-2'>
                                    <h5 className='m-2'>Edit Students</h5>
                                    <div className="">
                                    {children.map((child,index) => {
                                        
                                        const filter_names = names.filter((name) => {
                                        return !children.some((child) => {
                                            return child === (name.first_name+' '+name.last_name)
                                        })
                                        }).filter((name) => {
                                            return name.parent === 0 || prevChildren.some((child) => {return child.userID === name.userID})
                                        })
                                        return(
                                        <>
                                        <div key={index} className=" mb-3 dropdown ">
                                            <div id="studentDropdown" className='input-group' data-bs-toggle="dropdown" aria-expanded="false">  
                                            <input id={'student'+index} type="text" ref={(element) => childRefs.current[index] = element } onSelect={() => {unerror(index)}} className='form-control' value={child} onChange={(event) => setChildren(values => values.map((value,i) => { return i === index ? event.target.value:value}))} aria-describedby="add-child" placeholder="Students Name"  required/>
                                            

                                            {children.length > 1 &&
                                            <button onClick={() => {setChildren((values) => values.filter((_, i) => i !== index));}} className="btn btn-outline-primary" type="button" id="add-child">X</button>

                                            }
                                            
                                            {index === children.length-1 &&
                                            <button onClick={() => {setChildren(prevChilds => [...prevChilds,''])}} className="btn btn-outline-primary" type="button" id="add-child">Add Student</button>
                                            }
                                            <div className="invalid-feedback">
                                                This Student Does Not Exist. Please Select An Existing Student.
                                            </div>
                                            </div>
                                            <ul className="dropdown-menu student-dropdown" aria-labelledby="studentDropdown">
                                            {filter_names.map((name,ind) => {
                                                return (
                                                <div key={ind}>
                                                {((name.first_name+' '+name.last_name).toLowerCase().match(child.toLowerCase()) !== null) ? (
                                                    <li onClick={() => {setChildren(values => values.map((value,i) => { return i === index ? name.first_name+' '+name.last_name:value}))}} className='student-dropdown-item ps-1'>{name.first_name+' '+name.last_name}</li>
                                                ):(null)}
                                                </div>
                                                )
                                            })}
                                            </ul>
                                            
                                        </div>
                                        
                                        </>
                                        )
                                    })}
                                    
                                    </div>
                                    <button className='btn btn-primary mt-2' onClick={() => {updateChildren()}}>Update Students</button>
                                    </div>
                                    }

                               
                            
                            </>
                        )}
                        
                    </div>
                    <div className='col-2 shadow-sm comp-height'>

                    </div>

                </div>

            </div>
            
            
        </div>
    );
}

export default Account;

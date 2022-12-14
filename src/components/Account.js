import React,{useEffect,useState,useRef} from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const Account = () => {
    //input references 
    const name_ref = useRef(null);
    const user_ref = useRef(null);
    const email_ref = useRef(null);
    var childRefs = useRef([])

    let navigate = useNavigate();
    const token = sessionStorage.TOKEN

    //a lot of the state varibale are double to store old variables and present ones
    //could be done with an array
    const [children, setChildren] = useState([]);
    const [loading,setLoading] = useState(true)
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [accountType, setAccountType] = useState('0');
    const [names, setNames] = useState([]);
    const [prevUsername, setPrevUsername] = useState('');
    const [prevChildren, setPrevChildren] = useState([]);
    const [valid, setValid] = useState(false);
    const [confirmAccountOpen, setConfirmAccountOpen] = useState(false);
    const [confirmChildrenOpen, setConfirmChildrenOpen] = useState(false);
    const [accUpdateBtn, setAccUpdateBtn] = useState(0);
    const compmodalstyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };

    useEffect(() => {
      //api calls on mount 
      //gets user data and autofills inputs 
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/user',
            headers: {
                Authorization: `Bearer ${token}`,
              },
          }).then(res => {
            setName(res.data.user.user_name)
            setEmail(res.data.user.email)
            setPrevUsername(res.data.user.user)
            setUsername(res.data.user.user)
            setAccountType(res.data.user.user_type)
            if (res.data.children) {
                setPrevChildren(res.data.children)
                console.log(res.data.children);
                setChildren(res.data.children)
            }
            setLoading(false)
          }).catch(e => {
            
                e = new Error();
            
          })
          //list of existing student names 
          axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/get_existing_names',
            
          }).then(res => {  
            setNames(res.data)
          }).catch(e => {
            e = new Error();
          })
    }, []);
    useEffect(() => {
      //when username changes check if the username is already taken 
      //adjust bootstrap validation accordingly 
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
            //removes error once clicked        
            const child_input = childRefs.current[index];
            child_input.className = " form-control";    
      }
      function unerrorEmail(){ 
        //removes bootstrap validation on click          
        const email_input = email_ref.current
        email_input.className =" form-control";    
  }
    function handleAccountUpdate(){            
            // send updated account details to api 
            setAccUpdateBtn(1)        

            axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/update_account',
            headers: {
                Authorization: `Bearer ${token}`,
              },
            data: { username:username,email:email, name:name},
            }).then(res => {
                setAccUpdateBtn(2)
            }).catch(e => {
            e = new Error();
            })
      }

      function handleChildrenUpdate(){
        setAccUpdateBtn(1)      
        //updates students linked to a parent account 

        //find matching users for the students selected 
        const filter_names = names.filter((name) => {
          return name.parent === 0 || prevChildren.some((child) => {return child.userID === name.userID})
        })
        

        //send data to api 
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/update_children',
            headers: {
                Authorization: `Bearer ${token}`,
              },
            data:{
                children:children
            },
          }).then(res => {  
            setAccUpdateBtn(2)      
          }).catch(e => {
            e = new Error();
          })
            
        

      }
      function handleConfirmChildren(){
        //checks to see if all student inputs are valid 


        //if no children return nothing 
        if (children.length === 0 ) return null

        //find all users selected by user 
        const filter_names = names.filter((name) => {
            return name.parent === 0 || prevChildren.some((child) => {return child.userID === name.userID})
        })
       

        //check if all student inputs are valid 
        if(children.every((stud,index) => {
          const children_input = childRefs.current[index];
          console.log(stud);
          if (filter_names.every((name) => name.user_name !== stud.user_name)) {
            children_input.className = " form-control is-invalid";
            return false
          }else{
            children_input.className = " form-control";
            return true
          }
        })){
          setAccUpdateBtn(0)      
          setConfirmChildrenOpen(true)
        }   

      }
      function handleConfirmAccount(){

        //check if email is valid
        const email_input = email_ref.current; 
        if(email.slice(1,email.length-1).includes('@')){
            email_input.className = "form-control";
            setAccUpdateBtn(0)
            setConfirmAccountOpen(true)
        }else{
            email_input.className = "form-control is-invalid";

        }

      }

      
      const ConfirmUpdateAccount = () => {
        //HTML that displays when user has submitted account form
        //has confirmation and back buttons 
        return (
          <div>
            <Modal
                open={confirmAccountOpen}
                onClose={() => setConfirmAccountOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={compmodalstyle}>
                    <button onClick={() => setConfirmAccountOpen(false)} type="button" className="close-button btn-close" aria-label="Close"></button>
                    <div className='text-center p-3'>
                      <h5>Confirm The Changes to Your Account</h5>
                      <div className='grid text-start p-4'>
                        <div className='row m-2 mt-0'>
                          <p> Name: {name}</p>
                        </div>
                        <div className='row m-2'>
                          <p>Username: {username}</p>
                        </div>
                        <div className='row m-2'>
                          <p>Email: {email}</p>
                        </div>
                        

                      </div>
                      {accUpdateBtn !== 1 ? (
                        <button onClick={() => {accUpdateBtn === 0 ?  handleAccountUpdate() : setConfirmAccountOpen(false)}} className='m-2 btn btn-primary'>{accUpdateBtn === 0 ? 'Confirm Changes' : <i className="fas fa-check"></i> }</button>
                      ):(                        
                        <button className='btn btn-outline-primary'><div className='loader-sm'></div></button>
                      )}
                      
                      
                    </div>
                </Box>
            </Modal> 
            
          </div>
        );
      }
      const ConfirmUpdateChildren = () => {

        //same as confirm account update 
        //but for the students 
        //confirm and back buttons but displays the students they have selected 
        return (
          <div>
            <Modal
                open={confirmChildrenOpen}
                onClose={() => setConfirmChildrenOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={compmodalstyle}>
                    <button onClick={() => setConfirmChildrenOpen(false)} type="button" className="close-button btn-close" aria-label="Close"></button>
                    <div className='text-center p-3'>
                      <h5>Confirm These Changes</h5>
                      <div className='grid text-start p-4'>
                        {children.map((child,index) => {
                          console.log(child);
                          return(
                            
                              <div key={index} className='row'>
                                <p>{index+1}. {child.user_name}</p>
                              </div>
                            
                          )
                        })}
                        

                      </div>
                      {accUpdateBtn !== 1 ? (
                        <button onClick={() => {accUpdateBtn === 0 ?  handleChildrenUpdate() : setConfirmChildrenOpen(false)}} className='m-2 btn btn-primary'>{accUpdateBtn === 0 ? 'Confirm Changes' : <i className="fas fa-check"></i> }</button>
                      ):(
                        <>
                        <button className='btn btn-outline-primary'><div className='loader-sm'></div></button>
                        </>
                      )}
                      
                      
                    </div>
                </Box>
            </Modal> 
            
          </div>
        );
      }
      
    //displays HTML for the page
    return (
      
        <div className='container-fluid comp-container'>
          <ConfirmUpdateAccount />
          <ConfirmUpdateChildren />
            <div className='grid'>
                <div className='row'>
                    <div className='col-2 shadow-sm comp-height'>

                    </div>
                    <div className='col-8 text-center approve-users-body'>
                        <button onClick={() => navigate(-1)} className='btn account-back'><i className="fas fa-arrow-left"></i></button>
                        {loading ? (
                          //nothing displays on loading 
                          //although a skeleton may be useful here 
                            <>

                            </>
                        ):(
                            <>
                                <form className="form-control m-2 p-2" >
                                    <h4 className='mb-3'>Your Account Details:</h4>
                                    <div className="mb-3">
                                            
                                      <div className='form-floating'>
                                        <input type="text" ref={name_ref} id='floatingFirstnameInput' className="form-control" value={name} onChange={({ target }) => setName(target.value)} placeholder="Name"  required/>
                                        <label htmlFor="floatingFirstnameInput">Name</label>
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
                                    <button disabled={!valid} onClick={() => {handleConfirmAccount()}} className="btn btn-primary px-3" type="button" name="submit">Update Account</button>
                                </form>                                
                                {accountType === 2 &&
                                <div className='form-control text-center m-2 p-2'>
                                    <h5 className='m-2'>Edit Students</h5>
                                    <div className="">
                                    {
                                    
                                    children.map((child,index) => {
                                      console.log(children);
                                        //area where parents can select the students linked to their account
                                        // alot of variables are named children when it should be student.
                                        //filters already selected students out of autocomplete list 
                                        const filter_names = names.filter((name) => {
                                        return !children.some((child) => {
                                          //returns true if children have already been selected by the current user
                                            return child.user_name === (name.user_name)
                                        })
                                        }).filter((name) => {
                                          //only returns true if the student has no linked parent account 
                                          //or if there is a parent linked but its this user 
                                            return name.parent === 0 || prevChildren.some((child) => {return child.userID === name.userID})
                                        })

                                        //HTML for the inputs 
                                        return(
                                        <div key={index}>
                                        <div  className=" mb-3 dropdown ">
                                            <div id="studentDropdown" className='input-group' data-bs-toggle="dropdown" aria-expanded="false">  
                                            <input id={'student'+index} type="text" ref={(element) => childRefs.current[index] = element } onSelect={() => {unerror(index)}} className='form-control' value={child.user_name} onChange={(event) => setChildren(values => values.map((value,i) => { return i === index ? {...value ,user_name:event.target.value}:value}))} aria-describedby="add-child" placeholder="Students Name"  required/>
                                            

                                            {children.length > 1 &&
                                            //remove student button 
                                            <button onClick={() => {setChildren((values) => values.filter((_, i) => i !== index));}} className="btn btn-outline-primary" type="button" id="add-child">X</button>

                                            }
                                            
                                            {index === children.length-1 &&
                                            //add another student button 
                                            <button onClick={() => {setChildren(prevChilds => [...prevChilds,{user_name:''}])}} className="btn btn-outline-primary" type="button" id="add-child">Add Student</button>
                                            }
                                            <div className="invalid-feedback">
                                                This Student Does Not Exist. Please Select An Existing Student.
                                            </div>
                                            </div>
                                            <ul className="dropdown-menu student-dropdown" aria-labelledby="studentDropdown">
                                            {filter_names.map((name,ind) => {
                                              console.log(name);
                                              console.log(child);
                                              //dropdown menu for auto complete 
                                              //displays students from the list of filtered names 
                                                return (
                                                <div key={ind}>
                                                {((child) && ((name.user_name).toLowerCase().match(child.user_name.toLowerCase()) !== null)) ? (
                                                    <li onClick={() => {setChildren(values => values.map((value,i) => { return i === index ? name:value}))}} className='student-dropdown-item ps-1'>{name.user_name}</li>
                                                ):(null)}
                                                </div>
                                                )
                                            })}
                                            </ul>
                                            
                                        </div>
                                        
                                        </div>
                                        )
                                    })}
                                    
                                    </div>
                                    <button className='btn btn-primary mt-2' onClick={() => {handleConfirmChildren()}}>Update Students</button>
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

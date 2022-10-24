import React, {useState,useEffect,useRef} from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';

const AddChildren = () => {
    const token = sessionStorage.TOKEN

    const navigate = useNavigate();

    var childRefs = useRef([])
    const [names,setNames] = useState();
    const [children, setChildren] = useState([{user_name:''}]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
      //get existing student accounts on mount 
        axios({
          method: 'POST',
          url: 'https://pipe-band-server.herokuapp.com/get_existing_names',
        }).then(res => {  
          setNames(res.data)
          setLoading(false)
        }).catch(e => {
          e = new Error();
        })
      },[])

      function updateChildren(){
      //function to validate inputs and send data to server 

      //filter out all students who already have parents 
        const filter_names = names.filter((student) => {
          return student.parent === 0
        })

        //function that will return true if all inputs are valid 
        var validate_children = children.every((stud_name,index) => {

          //get ref of the current input
          const children_input = childRefs.current[index];

          //returns true if the selected student isnt in the list of filtered names 
          if (names.every((student) => student.user_name !== stud_name.user_name)) {

            //this student cant be selected
            //return invalid input 
            children_input.className = " form-control is-invalid";
            return false
          }else{

            //student can be selected 
            //input is valid
            children_input.className = " form-control";
            return true
          }
        })   
        if (validate_children) {

          //if all inputs are valid
          //format the data to send to server
            
            
            //send students data to server 
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
                //on complete send user to home page  
                navigate("/")
              }).catch(e => {
                e = new Error();
              })
            
        }

      }
      function unerror(index){
        
        //remove bootstrap errors on select 
        const children_input = childRefs.current[index];
        children_input.className = " form-control";
        
            
          
      }
         

      //displays HTML for the page
      //has the input form from accounts page so the parent account can select student accounts to be linked
      //user cannot navigate to other pages without doing this 
    return (
        <>
        {loading ? (
          // no current loading skeletons but can be added 
            <>

            </>

        ) : (
            <div className="container-fluid">
                <div className='d-flex justify-content-center p-5'>
                    <div className='p-3 login-card m-5 text-center'>
                        <h5 className='m-2 mb-4'>Add Students</h5>
                    {
                      //this couldve been done elsewhere idk why here 
                      //not gonna touch it just in case 

                    //function produces filtered names list 
                    children.map((child,index) => {
                      const filter_names = names.filter((student) => {

                        // returns true if current name isnt already selected 
                          return !children.some((child) => {
                            return child.user_name === (student.user_name)
                          })   
                      }).filter((name) => {
                        //returns true when name doesnt have any selected parent 
                        return name.parent === 0
                    })


                return(
                    
                    <div key={index} className=" mb-3 dropdown">
                    <div id="studentDropdown" className='input-group' data-bs-toggle="dropdown" aria-expanded="false">              
                    <input type="text" ref={(element) => childRefs.current[index] = element } onSelect={() => {unerror(index)}} className='form-control' value={child.user_name} onChange={(event) => setChildren(values => values.map((value,i) => { return i === index ? event.target.value:value}))} aria-describedby="add-child" placeholder="Students Name"  required/>
                    
                    {
                    //remove a student button 
                    children.length > 1 &&
                        <button onClick={() => {setChildren((values) => values.filter((_, i) => i !== index));}} className="btn btn-outline-primary" type="button">X</button>

                    }
                    
                    {
                    //add another student button 
                    index === children.length-1 &&
                        <button onClick={() => {setChildren(prevChilds => [...prevChilds,''])}} id="studentDropdown" data-bs-toggle="dropdown" className="btn btn-outline-primary" type="button">Add Student</button>
                    }
                    <div className="invalid-feedback">
                        This Student Does Not Exist. Please Select An Existing Student.
                    </div>
                    </div>
                    
                    <ul className="dropdown-menu student-dropdown" aria-labelledby="studentDropdown">
                        {filter_names.map((student,ind) => {
                          //displays dropdown list of filtered names to autocomplete form 
                        return (
                            <div key={ind}>
                            {((student.user_name).toLowerCase().match(child.user_name) !== null) ? (
                            <li onClick={() => {setChildren(values => values.map((value,i) => { return i === index ? {...value,user_name:student}:value}))}} className='student-dropdown-item ps-1'>{student.user_name}</li>
                            ):(null)}
                            </div>
                        )
                        })}
                    </ul>
                    
                    </div>
                    
                    
                )
                })}
                        <button className='btn btn-primary' onClick={updateChildren}>Confirm</button>

                        <div>
                            <p className='text-decoration-underline mt-3 link-dark text-center'>Student Not Here? Make Sure They Already Have an Account</p>
                        </div>
                    </div>
                    

                </div>
                
            
           </div>

        )}
        
        </>
    );
}

export default AddChildren;

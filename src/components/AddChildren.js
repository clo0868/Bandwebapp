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
        const filter_names = names.filter((student) => {
          return student.parent === 0
        })

        var validate_children = children.every((stud_name,index) => {
          const children_input = childRefs.current[index];
          if (names.every((student) => student.user_name !== stud_name.user_name)) {
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
                send_children.push(filter_names[names.indexOf(child)])
                console.log(send_children);
            });
            
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
                console.log(res);
                navigate("/")
              }).catch(e => {
                e = new Error();
              })
            
        }

      }
      function unerror(index){
       
        const children_input = childRefs.current[index];
        children_input.className = " form-control";
        
            
          
      }
         


    return (
        <>
        {loading ? (
            <>

            </>

        ) : (
            <div className="container-fluid">
                <div className='d-flex justify-content-center p-5'>
                    <div className='p-3 login-card m-5 text-center'>
                        <h5 className='m-2 mb-4'>Add Students</h5>
                    {children.map((child,index) => {
                      const filter_names = names.filter((student) => {
                          return !children.some((child) => {
                            return child.user_name === (student.user_name)
                          })   
                      }).filter((name) => {
                        return name.parent === 0
                    })
                return(
                    
                    <div key={index} className=" mb-3 dropdown">
                    <div id="studentDropdown" className='input-group' data-bs-toggle="dropdown" aria-expanded="false">              
                    <input type="text" ref={(element) => childRefs.current[index] = element } onSelect={() => {unerror(index)}} className='form-control' value={child.user_name} onChange={(event) => setChildren(values => values.map((value,i) => { return i === index ? event.target.value:value}))} aria-describedby="add-child" placeholder="Students Name"  required/>
                    
                    {children.length > 1 &&
                        <button onClick={() => {setChildren((values) => values.filter((_, i) => i !== index));}} className="btn btn-outline-primary" type="button">X</button>

                    }
                    
                    {index === children.length-1 &&
                        <button onClick={() => {setChildren(prevChilds => [...prevChilds,''])}} id="studentDropdown" data-bs-toggle="dropdown" className="btn btn-outline-primary" type="button">Add Student</button>
                    }
                    <div className="invalid-feedback">
                        This Student Does Not Exist. Please Select An Existing Student.
                    </div>
                    </div>
                    <ul className="dropdown-menu student-dropdown" aria-labelledby="studentDropdown">
                        {filter_names.map((student,ind) => {
                          console.log(student);
                        return (
                            <div key={ind}>
                            {((student.user_name).toLowerCase().match(child) !== null) ? (
                            <li onClick={() => {setChildren(values => values.map((value,i) => { return i === index ? student:value}))}} className='student-dropdown-item ps-1'>{student.user_name}</li>
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

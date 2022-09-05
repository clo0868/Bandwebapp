import React, {useState,useEffect,useRef} from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';

const AddChildren = () => {
    const token = sessionStorage.TOKEN

    const navigate = useNavigate();

    var childRefs = useRef([])
    const [names,setNames] = useState();
    const [children, setChildren] = useState(['']);
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
        const filter_names = names.filter((name) => {
          return name.parent === 0
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
                      const filter_names = names.filter((name) => {
                          return !children.some((child) => {
                            return child === (name.first_name+' '+name.last_name)
                          })   
                      }).filter((name) => {
                        return name.parent === 0
                    })
                return(
                    
                    <div key={index} className=" mb-3 dropdown">
                    <div id="studentDropdown" className='input-group' data-bs-toggle="dropdown" aria-expanded="false">              
                    <input type="text" ref={(element) => childRefs.current[index] = element } onSelect={() => {unerror(index)}} className='form-control' value={child} onChange={(event) => setChildren(values => values.map((value,i) => { return i === index ? event.target.value:value}))} aria-describedby="add-child" placeholder="Students Name"  required/>
                    
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
                        {filter_names.map((name,ind) => {
                        return (
                            <div key={ind}>
                            {((name.first_name+' '+name.last_name).toLowerCase().match(child) !== null) ? (
                            <li onClick={() => {setChildren(values => values.map((value,i) => { return i === index ? name.first_name+' '+name.last_name:value}))}} className='student-dropdown-item ps-1'>{name.first_name+' '+name.last_name}</li>
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

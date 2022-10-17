import React,{useEffect,useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';

const AllUsers = () => {
    const token = sessionStorage.TOKEN
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState();
    

    useEffect(() => {
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/non_admin_users',
            headers: {
                Authorization: `Bearer ${token}`,
              },
          }).then(res => {
            setAllUsers(res.data)
          }).catch(e => {
             e = new Error();            
          })
    }, []);
    




    return (
        <div className='container-fluid comp-container'>
            <div className='grid'>
                <div className='row'>
                    <div className='col-2 shadow-sm comp-height'>

                    </div>
                    <div className='col-8 text-center approve-users-body'>
                        <button onClick={() => navigate(-1)} className='btn approve-users-back'><i className="fas fa-arrow-left"></i></button>
                        {allUsers &&
                        <div className='grid m-3 mx-5'>
                        <div className='row text-start'>
                            <div className='col-4 border border-top-0'>
                                <h5 className='border-bottom ms-2'>Students:</h5>
                                {allUsers.filter((V) => {return V.user_type === 0}).map((user,index) => {
                                    return(
                                        <>
                                            <p className='ms-2'>{index+1}. {user.user_name}</p>
                                        </>
                                    )
                                })}
                                {allUsers.filter((V) => {return V.user_type === 0}).length === 0 &&
                                    <p className='ms-2'>No Students</p>
                                }
                            </div>
                            <div className='col-4 border border-top-0'>
                                <h5 className='border-bottom ms-2'>Parents:</h5>
                                {allUsers.filter((V) => {return V.user_type === 2}).map((user,index) => {
                                    return(
                                        <>
                                            <p className='ms-2'>{index+1}. {user.user_name} </p>
                                            <ul>
                                                {allUsers.filter((v) => {return v.user_type === 0 && v.parent === user.userID}).map((child,child_index) => {
                                                    return(
                                                        <>
                                                            <p className='ms-3'>{child_index+1}. {child.user_name}</p>
                                                        </>
                                                    )
                                                })}
                                            </ul>
                                        </>
                                    )
                                })}
                                {allUsers.filter((V) => {return V.user_type === 2}).length === 0 &&
                                    <p className='ms-2'>No Parents</p>
                                }

                            </div>
                            <div className='col-4 border border-top-0'>
                                <h5 className='border-bottom ms-2'>Tutors:</h5>
                                {allUsers.filter((V) => {return V.user_type === 3}).map((user,index) => {
                                    return(
                                        <>
                                            <p className='ms-2'>{index+1}. {user.user_name}</p>
                                        </>
                                    )
                                })}
                                {allUsers.filter((V) => {return V.user_type === 3}).length === 0 &&
                                    <p className='ms-2'>No Tutors</p>
                                }

                            </div>
                        </div>
                    </div>
                        
                        }
                        
                    </div>
                    <div className='col-2 shadow-sm comp-height'>

                    </div>

                </div>

            </div>
            
            
        </div>
    );
}

export default AllUsers;

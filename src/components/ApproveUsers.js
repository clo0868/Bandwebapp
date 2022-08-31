import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { useInView } from "react-intersection-observer";
import {useNavigate} from "react-router-dom";






const ApproveUsers = () => {
    const token = sessionStorage.TOKEN
    let navigate = useNavigate();

    const [officials, setOfficials] = useState();

    useEffect(() => {
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/officials',
            headers: {
                Authorization: `Bearer ${token}`,
              },
          }).then(res => {
            setOfficials(res.data)
          }).catch(e => {
             e = new Error();            
          })
        
    },[])

    function DisplayUsers(props){
        const app_users = props.users.filter((v) => {return v.user_approve === 1})
        const un_app_users = props.users.filter((v) => {return v.user_approve === 0})

        function handleApprove(user){
            
            axios({
                method: 'POST',
                url: 'https://pipe-band-server.herokuapp.com/approve_user',
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  data: { 
                    userID:user.userID,
                  },
              }).then(res => {
                if (app_users[0].user_type === 5) {
                    setOfficials(values => ({...values,judge:values.judge.map((v) => {return v.userID === user.userID ? {...v,user_approve:1}:v})}))
                }   
                if (app_users[0].user_type === 4) {
                    setOfficials(values => ({...values,steward:values.steward.map((v) => {return v.userID === user.userID ? {...v,user_approve:1}:v})}))
                }
              }).catch(e => {
                e = new Error();
              })
              axios({
                method: 'POST',
                url: 'https://pipe-band-server.herokuapp.com/delete_approve_notif',
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
                data:{
                    user,
                },
              }).then(res => {
              }).catch(e => {
                 e = new Error();            
              })   
        }

        function UnAppUserCard(props){
            const user = props.user
            const { card_ref, inView } = useInView({
                triggerOnce: true,
                threshold: 0.75
              });

            useEffect(() => {
                axios({
                    method: 'POST',
                    url: 'https://pipe-band-server.herokuapp.com/seen_approve_notif',
                    headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    data:{
                        user,
                    },
                  }).then(res => {
                  }).catch(e => {
                     e = new Error();            
                  })             
            }, [inView]);
            
            //console.log(user);
            return(
                <div className='card m-2 p-2'>
                    <div ref={card_ref} className='ps-3 d-flex flex-row align-items-center'>
                        <p>{user.first_name}</p>
                        <p className='ms-1'>{user.last_name}</p>
                        <button onClick={() => {handleApprove(user)}} className='ms-auto btn btn-sm btn-primary'>Approve</button>
                    </div>
                </div>
            )
        }
        return(
            <>
            <div className='m-3'>
                <h5>Un-Approved {app_users[0].user_type === 5 ? 'Judges':'Stewards'}</h5>
            {un_app_users.map((user,index) => {
                return(
                    <div key={index}>
                        <UnAppUserCard user={user}/>
                    </div>
                )
            })}
            {un_app_users.length === 0 &&
                <p className='mt-2'>No Un-Approved {app_users[0].user_type === 5 ? 'Judges':'Stewards'} </p>
            }
            </div>

            <div className='m-3'>
                <h5>Approved {app_users[0].user_type === 5 ? 'Judges':'Stewards'}</h5>
            {app_users.map((user,index) => {
                return(
                    <div key={index} className='card m-2 p-2'>
                        <div className='d-flex ps-3 flex-row'>
                            <p>{user.first_name}</p>

                            <p className='ms-1'>{user.last_name}</p>
                        </div>
                    </div>
                )
            })}
            </div>
            
            
            </>
        )

    }

    return (
        <div className='container-fluid comp-container'>
            <div className='grid'>
                <div className='row'>
                    <div className='col-2 shadow-sm comp-height'>

                    </div>
                    <div className='col-8 text-center approve-users-body'>
                    <button onClick={() => navigate(-1)} className='btn approve-users-back'><i className="fas fa-arrow-left"></i></button>

                        <div className='grid'>
                            <div className='row '>

                                <div className='col-6'>
                                    {officials &&
                                        <DisplayUsers users={officials.steward}/>
                                    }
                                    
                                </div>
                                <div className='col-6'>
                                    {officials &&
                                        <DisplayUsers users={officials.judge}/>
                                    }                                
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-2 shadow-sm comp-height'>

                    </div>
                </div>
            </div>        
        </div>
    );
}

export default ApproveUsers;

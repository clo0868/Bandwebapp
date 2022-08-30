import React,{useState,useEffect} from 'react';
import axios from 'axios';





const ApproveUsers = () => {
    const token = sessionStorage.TOKEN
    const [officials, setOfficials] = useState();
    useEffect(() => {
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/officials',
            headers: {
                Authorization: `Bearer ${token}`,
              },
          }).then(res => {
            console.log(res.data);
            setOfficials(res.data)
          }).catch(e => {
             e = new Error();            
          })
        
    },[])

    function DisplayUsers(props){
        const app_users = props.users.filter((v) => {return v.user_approve === 1})
        const un_app_users = props.users.filter((v) => {return v.user_approve === 0})

        function handleApprove(user){
            const userID = user.userID
            axios({
                method: 'POST',
                url: 'https://pipe-band-server.herokuapp.com/approve_user',
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  data: { 
                    userID,
                  },
              }).then(res => {
                console.log(res);
                console.log(officials);
                if (app_users[0].user_type === 5) {
                    setOfficials(values => ({
                        ...values,
                        judge:values.judge.map((v) => {return v.userID === userID ? {...v,user_approve:1}:v})
                    }))
                    console.log(officials);
                }   
                if (app_users[0].user_type === 4) {
                    setOfficials(values => ({
                        ...values,
                        steward:values.steward.map((v) => {return v.userID === userID ? {...v,user_approve:1}:v})

                    }))
                    console.log(officials);

                }
              }).catch(e => {
                e = new Error();
              })
        }

        function UnAppUserCard(props){
            const user = props.user
            console.log(user);
            return(
                <div className='card m-2 p-2'>
                    <div className='d-flex flex-row align-items-center'>
                        <p>{user.first_name}</p>
                        <p className='ms-1'>{user.last_name}</p>
                        <button onClick={() => {handleApprove(user)}} className='ms-auto btn btn-sm btn-primary'>Approve</button>
                    </div>
                </div>
            )
        }
        return(
            <>
            <div className='m-2'>
                <h5>Un-Approved {app_users[0].user_type === 5 ? 'Judges':'Stewards'}</h5>
            {un_app_users.map((user,index) => {
                return(
                    <div key={index}>
                        <UnAppUserCard user={user}/>
                    </div>
                )
            })}
            {un_app_users.length === 0 &&
                <p>No Un-Approved {app_users[0].user_type === 5 ? 'Judges':'Stewards'} </p>
            }
            </div>

            <div className='m-2'>
                <h5>Approved {app_users[0].user_type === 5 ? 'Judges':'Stewards'}</h5>
            {app_users.map((user,index) => {
                return(
                    <div key={index} className='card m-2 p-2'>
                        <div className='d-flex flex-row'>
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
                    <div className='col-8 text-center'>
                        <div className='grid'>
                            <div className='row'>
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

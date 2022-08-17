import React, {useState,useEffect} from 'react';
import {useLocation} from "react-router-dom";
import axios from'axios';
const Scheduler = () => {
    var data = useLocation();
    const token = sessionStorage.TOKEN
    const compID = data.state.compID
    const [schedule, setSchedule] = useState({});
    const [eventGrade, setEventGrade] = useState();
    const [loading, setLoading] = useState(false);
    const [comp, setComp] = useState();
    const [userList, setUserList] = useState([]);
    function createSchedule(){
        setLoading(true)
        axios({
            method: 'POST',
            url: './create_schedule',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {  
                compID:compID, 
            },
        }).then(res => {
            setSchedule(res.data)
            setLoading(false)
        }).catch(e => {
            e = new Error();
        })
    }
    useEffect(() => {
        setLoading(true)
        axios({
            method: 'POST',
            url: './comp_users',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: { 
                compID,
              },
        }).then(res => {
            setUserList(res.data)
        }).catch(e => {
            e = new Error();
        })
        axios({
            method: 'POST',
            url: './event_grade_name',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(res => {
            setEventGrade(res.data)
        }).catch(e => {
            e = new Error();
        })
        axios({
            method: 'POST',
            url: './comp_data',
            headers: {
                Authorization: `Bearer ${token}`,
              },
              data: { 
                compID,
              },
          }).then(res => {
            setComp(res.data[0])
            setLoading(false)
          }).catch(e => {
            e = new Error();
          })
    }, []);

    function shortenTime(time){
        if (time.length === 10) {return time.slice(0,4)+time.slice(8)}
        if (time.length === 11) {return time.slice(0,5)+time.slice(9)}        
        //{(new Date(new Date(schedule.comp_data.comp_start_time).getTime()+60000*start_time)).toLocaleTimeString().slice(0,4)} 
        //{(new Date(new Date(schedule.comp_data.comp_start_time).getTime()+60000*start_time)).toLocaleTimeString().slice(8)}
    }
    return (
        <div className='container-fluid'>
                <div className='grid'>
                    <div className='row'>
                        <div className='col-1 shadow-sm min-vh-100'> 
                        </div>
                        <div className='col-10 text-center '>
                            <div className='mt-5 text-center'>
                                {Reflect.ownKeys(schedule).length === 0 && 
                                   <button className='btn btn-primary' onClick={() => {createSchedule()}}>Create Schedule</button>
                                }
                                <div className='mt-5 sch-grid'> 
                                {loading ? (
                                    <div className='d-flex flex-column justify-content-center align-items-center'>
                                        <div className='loader'>

                                        </div>
                                        <p className='mt-2' >Getting Schedule..</p>
                                    </div>
                                    
                                ):(            
                                    <>
                                    {Reflect.ownKeys(schedule).length === 0 && userList.length > 0 && eventGrade && comp && comp.comp_schedule !== '0' &&
                                    
                                        <>       

                                            <h1>{comp.comp_name}</h1>
                                            <h5>{new Date(comp.comp_start_time).toLocaleTimeString()} {new Date(comp.comp_start_time).toDateString()}</h5>
                                            <div className='grid text-center '>
                                                <div className='row mx-2'>
                                                    
                                                    {JSON.parse(comp.comp_schedule).map((room,room_index) => {
                                                        //const schedule = JSON.parse(comp.comp_schedule)
                                                        const room_data = JSON.parse(comp.comp_rooms)[room_index]    
                                                        return(
                                                            <div key={room_index} className='col-3 p-0 mb-5'>
                                                                <div>
                                                                    <h3>Room {room_data.room_name}</h3>
                                                                    <p>Judge: {room_data.room_judge} </p>
                                                                    <p>Steward: {room_data.room_steward} </p>
                                                                </div>
                                                                

                                                            
                                                                    
                                                                {room.return_room.map((event,event_index) => {
                                                                    //const start_time = (room.return_room.slice(0,event_index).reduce((t,v) => {return t+v.time},0))+room.delay

                                                                    return(
                                                                        <>
                                                                        <table className='table border-start border-end table-striped m-0' key={event_index}>
                                                                            <thead>
                                                                                <tr>
                                                                                    <th scope='col'>Start Time:</th>
                                                                                    <th scope='col'>{eventGrade.grades[event.return_event[0].entry.gradeID-1].grade_name} {eventGrade.events[event.return_event[0].entry.eventID-1].event_name}</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {event.return_event.map((entry,entry_index) => {
                                                                                    var entry_user = {}
                                                                                    userList.forEach((user) => {
                                                                                        if (user.userID === entry.entry.userID) {
                                                                                            entry_user = user
                                                                                        }
                                                                                        return null
                                                                                    })
                                                                                    return(
                                                                                        <tr key={entry_index}>
                                                                                            <th scope="row">{shortenTime((new Date(new Date(comp.comp_start_time).getTime()+60000*entry.play_time)).toLocaleTimeString())}</th>
                                                                                            <td>{entry_user.first_name.charAt(0).toUpperCase() + entry_user.first_name.slice(1)} {entry_user.last_name.charAt(0).toUpperCase() + entry_user.last_name.slice(1)}</td>                                                            
                                                                                        </tr>
                                                                                    )
                                                                                })}
                                                                                
                                                                            </tbody>
                                                                        </table>
                                                                        </>
                                                                    )
                                                                })}
                                                                
                                                            </div>
                                                        )
                                                    })}

                                                    
                                                </div>
                                            

                                            </div>
                                            
                                        </>
                                    }
                                       
                            
                                    {eventGrade && Reflect.ownKeys(schedule).length > 0 &&
                                        <>
                                            <h1>{schedule.comp_data.comp_name}</h1>
                                            <h5>{new Date(schedule.comp_data.comp_start_time).toLocaleTimeString()} {new Date(schedule.comp_data.comp_start_time).toDateString()}</h5>
                                            <div className='grid text-center '>
                                                <div className='row'>
                                                    
                                                    {schedule.sch_res.map((room,room_index) => {
                                                        const room_data = JSON.parse(schedule.comp_data.comp_rooms)[room_index]    
                                                        return(
                                                            <div key={room_index} className='col-3 p-0'>
                                                                <div>
                                                                    <h3>Room {room_data.room_name}</h3>
                                                                    <p>Judge: {room_data.room_judge} </p>
                                                                    <p>Steward: {room_data.room_steward} </p>
                                                                </div>
                                                                

                                                            
                                                                    
                                                                {room.return_room.map((event,event_index) => {
                                                                    const start_time = (room.return_room.slice(0,event_index).reduce((t,v) => {return t+v.time},0))+room.delay

                                                                    return(
                                                                        <>
                                                                        <table className='table border-start border-end table-striped mx-2' key={event_index}>
                                                                            <thead>
                                                                                <tr>
                                                                                    <th scope='col'>{shortenTime((new Date(new Date(schedule.comp_data.comp_start_time).getTime()+60000*start_time)).toLocaleTimeString())}</th>
                                                                                    <th scope='col'>{eventGrade.grades[event.return_event[0].entry.gradeID-1].grade_name} {eventGrade.events[event.return_event[0].entry.eventID-1].event_name}</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {event.return_event.map((entry,entry_index) => {
                                                                                    var entry_user = {}
                                                                                    schedule.user_data.forEach((user) => {
                                                                                        if (user.userID === entry.entry.userID) {
                                                                                            entry_user = user
                                                                                        }
                                                                                        return null
                                                                                    })
                                                                                    return(
                                                                                        <tr key={entry_index}>
                                                                                            <th scope="row">{shortenTime((new Date(new Date(schedule.comp_data.comp_start_time).getTime()+60000*entry.play_time)).toLocaleTimeString())}</th>
                                                                                            <td>{entry_user.first_name.charAt(0).toUpperCase() + entry_user.first_name.slice(1)} {entry_user.last_name.charAt(0).toUpperCase() + entry_user.last_name.slice(1)}</td>                                                            
                                                                                        </tr>
                                                                                    )
                                                                                })}
                                                                                
                                                                            </tbody>
                                                                        </table>
                                                                        </>
                                                                    )
                                                                })}
                                                                
                                                            </div>
                                                        )
                                                    })}

                                                    
                                                </div>
                                            

                                            </div>
                                            
                                        </>
                                    }
                                    
                                
                                </>
                            )}
                                </div>
                                            
                            </div>
                        </div>
                        <div className='col-1 shadow-sm min-vh-100'> 
                            
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default Scheduler;

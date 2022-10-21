import React, {useState,useEffect} from 'react';
import {useLocation,useNavigate} from "react-router-dom";
import axios from'axios';
const Scheduler = () => {
    var location = useLocation();
    var navigate = useNavigate();
    const token = sessionStorage.TOKEN
    const compID = location.state.compID
    const [schedule, setSchedule] = useState({});
    const [eventGrade, setEventGrade] = useState();
    const [loading, setLoading] = useState(false);
    const [comp, setComp] = useState();
    const [userList, setUserList] = useState([]);


    function createSchedule(){
        setLoading(true)
        //creates schedule for a given competition 
        //uses scheduling algorithm 
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/create_schedule',
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
        //gets data for all users entered in the competition 
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/comp_users',
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

        //gets events and grades from db 
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/event_grade_name',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(res => {
            setEventGrade(res.data)
        }).catch(e => {
            e = new Error();
        })

        //gets the competition data 
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/comp_data',
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

    //function to shorten time from 00:00.00 to 00:00
    function shortenTime(time){
        if (time.length === 10) {return time.slice(0,4)+time.slice(8)}
        if (time.length === 11) {return time.slice(0,5)+time.slice(9)}        
    }

    //displays Html for the page 
    return (
        <div className='container-fluid'>
                <div className='grid'>
                    <div className='row'>
                        <div className='col-1 shadow-sm min-vh-100'> 
                        </div>
                        <div className='col-10 text-center '>
                            <div className='mt-5 text-center'>
                                <div className='d-flex justify-content-between m-3'>
                                    <div>
                                        <button onClick={() => navigate(-1)} className='btn btn-primary'>Back</button>
                                    </div>
                                    <div>
                                        
                                    </div>
                                    <div>
                                        {
                                        // button to create new schedule only shows if no schedule is in the db 
                                        Reflect.ownKeys(schedule).length === 0 && comp && comp.comp_rooms !== '0' &&
                                        <button className='btn btn-primary' onClick={() => {createSchedule()}}>Create New Schedule</button>
                                        }

                                    </div>
                                    

                                </div>
                                

                                <div className='mt-5 sch-grid'> 
                                {
                                //displays loading when a new schedule is being created 
                                loading ? (
                                    <div className='d-flex flex-column justify-content-center align-items-center'>
                                        <div className='loader'>

                                        </div>
                                        <p className='mt-2' >Getting Schedule..</p>
                                    </div>
                                    
                                ):(            
                                    <>
                                    {
                                    //shows when no schedule is present and all data has loaded
                                    //so only schedule in the db is present  
                                    Reflect.ownKeys(schedule).length === 0 && userList.length > 0 && eventGrade && comp && comp.comp_schedule !== '0' && comp.comp_rooms !== '0' &&
                                    
                                        <>       

                                            <h1>{comp.comp_name}</h1>
                                            <h5>{new Date(comp.comp_start_time).toLocaleTimeString()} {new Date(comp.comp_start_time).toDateString()}</h5>
                                            <div className='grid text-center '>
                                                <div className='row mx-2'>
                                                    
                                                    {
                                                       
                                                    //parse the schedule as its stored as plaintext in the db 
                                                    JSON.parse(comp.comp_schedule).map((room,room_index) => {
                                                        console.log(comp);
                                                        //parse room data for this room 
                                                        const room_data = JSON.parse(comp.comp_rooms)[room_index]
                                                        
                                                        return(
                                                            <div key={room_index} className='col-3 p-0 mb-5'>
                                                                <div>
                                                                    <h3>Room {room_data.room_name}</h3>
                                                                    <p>Judge: {room_data.room_judge.user_name} </p>
                                                                    <p>Steward: {room_data.room_steward.user_name} </p>
                                                                </div>
                                                                {

                                                                //displays each event individually 
                                                                room.return_room.map((event,event_index) => {

                                                                    //displays html 
                                                                    const start_time = (room.return_room.slice(0,event_index).reduce((t,v) => {return t+v.time},0))+room.delay
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
                                                                                    //displays each individual entry 
                                                                                    var entry_user = {}
                                                                                    userList.forEach((user) => {
                                                                                        if (user.userID === entry.entry.userID) {
                                                                                            //userIDs match so name can be found 
                                                                                            entry_user = user
                                                                                        }
                                                                                        return null
                                                                                    })

                                                                                    //displays user card 
                                                                                    return(
                                                                                        <tr key={entry_index}>
                                                                                            <th scope="row">{shortenTime((new Date(new Date(comp.comp_start_time).getTime()+60000*entry.play_time)).toLocaleTimeString())}</th>
                                                                                            <td>{entry_user.user_name}</td>                                                            
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
                                       
                            
                                    {
                                    //similar code displays when schedule is from the server algorithm instead of the stored value 
                                    //happens when a new schedule is made or no schedule had been made yet
                                    eventGrade && Reflect.ownKeys(schedule).length > 0 &&
                                        <>
                                            <h1>{schedule.comp_data.comp_name}</h1>
                                            <h5>{new Date(schedule.comp_data.comp_start_time).toLocaleTimeString()} {new Date(schedule.comp_data.comp_start_time).toDateString()}</h5>
                                            <div className='grid text-center '>
                                                <div className='row'>
                                                    
                                                    {
                                                    //displays schedule 
                                                    schedule.sch_res.map((room,room_index) => {

                                                        //parse room data for the given room 
                                                        const room_data = JSON.parse(schedule.comp_data.comp_rooms)[room_index]    

                                                        //display html 
                                                        return(
                                                            <div key={room_index} className='col-3 p-0'>
                                                                <div>
                                                                    <h3>Room {room_data.room_name}</h3>
                                                                    <p>Judge: {room_data.room_judge.user_name} </p>
                                                                    <p>Steward: {room_data.room_steward.user_name} </p>
                                                                </div>
                                                                

                                                            
                                                                    
                                                                {
                                                                //displays event data individually 
                                                                room.return_room.map((event,event_index) => {
                                                                    const start_time = (room.return_room.slice(0,event_index).reduce((t,v) => {return t+v.time},0))+room.delay
                                                                    
                                                                    //display event html 
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
                                                                                {
                                                                                //returns each individual entry 
                                                                                event.return_event.map((entry,entry_index) => {
                                                                                    var entry_user = {}
                                                                                    schedule.user_data.forEach((user) => {
                                                                                        //matches user data 
                                                                                        if (user.userID === entry.entry.userID) {
                                                                                            entry_user = user
                                                                                        }
                                                                                        return null
                                                                                    })
                                                                                    //returns entry html 
                                                                                    return(
                                                                                        <tr key={entry_index}>
                                                                                            <th scope="row">{shortenTime((new Date(new Date(schedule.comp_data.comp_start_time).getTime()+60000*entry.play_time)).toLocaleTimeString())}</th>
                                                                                            <td>{entry_user.user_name}</td>                                                            
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
                                    {
                                        //display message if rooms havent been configured yet 
                                    Reflect.ownKeys(schedule).length === 0 && userList.length > 0 && eventGrade && comp && comp.comp_schedule !== '0' && comp.comp_rooms === '0' &&
                                    <>
                                    <h5>Rooms have not been Configured</h5>
                                    <p>Configure the room to be able to create schedules</p>
                                    </>
                                    }
                                    {
                                    //display message if first schedule hasnt been made yet
                                    Reflect.ownKeys(schedule).length === 0 && userList.length > 0 && eventGrade && comp && comp.comp_schedule === '0' && comp.comp_rooms !== '0' &&
                                    <>
                                    <h5>No current schedule</h5>
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

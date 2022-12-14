import React,{useState,useEffect} from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
const ConfigCompForm = (props) => {
    
    //get props 
    const token = props.token
    const compID = props.comp.compID

    const [activeStep, setActiveStep] = useState(0);
    const [rooms, setRooms] = useState([{room_name:'',room_judge:{user_name:''},room_steward:{user_name:''}}]);
    const [comp, setComp] = useState();
    const [loading, setLoading] = useState(true);
    const [officialNames, setOfficialNames] = useState();

    useEffect(() => {
        //official names and competition data apis 
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/officials',
            headers: {
                Authorization: `Bearer ${token}`,
              },
          }).then(res => {
            //filter judges and stewards where user is approved
            //done so unapproved users may be needed to be accessed 
            var res_stew = res.data.steward.filter((v,i) => {
                return v.user_approve === 1
            })
            var res_judge = res.data.judge.filter((v,i) => {
                return v.user_approve === 1
            })
            setOfficialNames({steward:res_stew,judge:res_judge})
          }).catch(e => {
            e = new Error();
          })
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

            //check if rooms have already been configured 
            //when rooms state is set page displays room data first 
            if (res.data[0].comp_rooms !== '0') {
                setRooms(JSON.parse(res.data[0].comp_rooms))
            }
            setLoading(false)
          }).catch(e => {
            e = new Error();
          })
          
    }, []);

    function handleConfigCompForm(){ 
        //on sumbit send data to configure rooms api        
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/config_rooms',
            headers: {
                Authorization: `Bearer ${token}`,
              },
            data: { 
              rooms:rooms,
              compID:comp.compID,
            },
          }).then(res => {
            setActiveStep(2)
          }).catch(e => {
            e = new Error();
          })
    }

    function handleEditRooms(){
        //removes plaintext rooms from competition data 
        setComp((prevComp) => {
            return{
                ...prevComp,
                comp_rooms:'0',
            }
        })
    }
    function handleResetRooms(){

        //removes room data from db entry 
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/reset_rooms',
            headers: {
                Authorization: `Bearer ${token}`,
              },
            data: { 
                comp:comp
            },
          }).then(res => {
            setActiveStep(4)
          }).catch(e => {
            e = new Error();
          })
    }

    return (
        <div className='modal-size d-flex text-center flex-column justify-content-top max-height'>
            {
                //display custom skeleton loading 
            loading ? (
                <>
                <div>
                    <h5>Entries have closed</h5>
                    <p>Create rooms and assign judges</p>
                </div>
                <div className='grid'>
                <div className='p-1 compevent d-flex justify-content-center'>
                <Skeleton className='m-1' width={200} height={38}/>
                <Skeleton className='m-1' width={200} height={38}/>
                <Skeleton className='m-1' width={200} height={38}/>
                <Skeleton className='ms-auto mt-2' width={64} height={30} />
                </div>
                <div className=' p-1 compevent d-flex justify-content-center'>
                <Skeleton className='m-1' width={200} height={38}/>
                <Skeleton className='m-1' width={200} height={38}/>
                <Skeleton className='m-1' width={200} height={38}/>
                <Skeleton className='ms-auto mt-2' width={64} height={30} />
                </div>
                <div className=' p-1 compevent d-flex justify-content-center'>
                <Skeleton className='m-1' width={200} height={38}/>
                <Skeleton className='m-1' width={200} height={38}/>
                <Skeleton className='m-1' width={200} height={38}/>
                <Skeleton className='ms-auto mt-2' width={64} height={30} />
                </div>
                <div className=' p-1 compevent d-flex justify-content-center'>
                <Skeleton className='m-1' width={200} height={38}/>
                <Skeleton className='m-1' width={200} height={38}/>
                <Skeleton className='m-1' width={200} height={38}/>
                <Skeleton className='ms-auto mt-2' width={64} height={30} />
                </div>
                <div className=' p-1 d-flex'>
                    <Skeleton className='mt-3' width={122} height={36}/>
                    <div className='mt-3 ms-auto'><Skeleton  width={180} height={36}/></div>
                    
                </div>
                </div>
                
                </>

            ):(
                <>
                {activeStep === 0 && comp.comp_rooms === '0' && rooms.length !== 0 &&
                    <>
                        <div>
                            <h5>Entries have closed</h5>
                            <p>Create rooms and assign judges</p>
                        </div>
                        <div className='mt-3 p-2 compevent'>
                            <div>
                                {
                                //filter official names by removing names already selected to judge or steward 
                                //this avoids users selecting the same user twice 
                                officialNames && rooms.map((room,index) => {
                                    var judges = officialNames.judge.filter((judge) => {
                                        //filter through judges and check if user matches 
                                        if (rooms.some((room) => {
                                            //
                                            return (room.room_judge.user_name).match(judge.user_name) !== null 
                                            
                                            
                                        })){
                                            return false
                                        }else{
                                            return true
                                        }
                                    })
                                    var stewards = officialNames.steward.filter((steward) => {
                                        //filter through stewards and check if the user matches 
                                        if (rooms.some((room) => {
                                                                                       
                                            return (room.room_steward.user_name).match(steward.user_name) !== null
                                            
                                        })){
                                            return false
                                        }else{
                                            return true
                                        }
                                    })
                                return(
                                    <div key={"key"+index} className='d-flex align-items-center'>
                                        
                                        <div className='form-floating'>
                                        <input id='RoomNameInput' className='m-1 form-control config-input' placeholder='  Room Name' value={room.room_name} onChange={(event) => {setRooms(values => values.map((value,i) => { return i === index ? {...value, room_name:event.target.value}:value}));}} type='text'></input>
                                        <label htmlFor="RoomNameInput">Room Name:</label>
                                        </div>
                                        <div className="dropdown">
                                            <div id={'judgeDropdown'+index} data-bs-toggle="dropdown" className='form-floating' aria-expanded="false">
                                            <input id='JudgeNameInput' type="text" className='form-control' value={room.room_judge.user_name} onChange={(event) => {setRooms(values => values.map((value,i) => { return i === index ? {...value, room_judge:{user_name:event.target.value}}:value}));}} />
                                            <label htmlFor="JudgeNameInput">Judge:</label>
                                            </div>
                                            <ul className="dropdown-menu student-dropdown" aria-labelledby={'judgeDropdown'+index}>
                                                
                                                {judges.map((judge,ind) => { 
                                                    //displays list of unselected judges 
                                                    //user can select a name to autofil the form field      
                                                return (
                                                    <div key={ind}>
                                                    {(judge.user_name.toLowerCase()).startsWith(room.room_judge.user_name.toLowerCase()) ? (
                                                    <li onClick={() => {
                                                        //sets input value to selected name 
                                                        setRooms(values => values.map((value,i) => {return i === index ? {...value, room_judge:judge}:value}))
                                                    }} 
                                                    className='student-dropdown-item ps-1'
                                                    >{judge.user_name}</li>
                                                    ):(null)}
                                                    </div>
                                                )
                                                })}
                                            </ul>                                            
                                        </div>
                                        <div className="dropdown">
                                            <div id={'stewardDropdown'+index} data-bs-toggle="dropdown" className='form-floating' aria-expanded="false">
                                            <input id='StewardNameInput' type="text" className='form-control' value={room.room_steward.user_name} onChange={(event) => {setRooms(values => values.map((value,i) => { return i === index ? {...value, room_steward:{user_name:event.target.value}}:value}));}} />
                                            <label htmlFor="StewardNameInput">Steward:</label>
                                            </div>
                                            <ul className="dropdown-menu student-dropdown" aria-labelledby={'stewardDropdown'+index}>
                                                {stewards.map((steward,ind) => {  
                                                    //displays list of unselected stewards 
                                                    //user can select a name to autofil the form field    
                                                return (
                                                    <div key={ind}>
                                                    {(steward.user_name.toLowerCase()).startsWith(room.room_steward.user_name.toLowerCase()) ? (
                                                    <li onClick={() => {
                                                        //sets input value to selected name 
                                                        setRooms(values => values.map((value,i) => {return i === index ? {...value, room_steward:steward}:value}))
                                                    }} 
                                                    className='student-dropdown-item ps-1'
                                                    >{steward.user_name}</li>
                                                    ):(null)}
                                                    </div>
                                                )
                                                })}
                                            </ul>                                            
                                        </div>                                        
                                        
                                        
                                    <button onClick={() => {
                                        //removes a room from the competition 
                                        setRooms((values) => values.filter((_, i) => i !== index));
                                        }} 
                                        className='btn-border-none ms-2' 
                                        size='small'
                                        >X</button>

                                    </div>
                                );
                                })}
                            </div>
                        </div> 
                        <div className='d-flex p-2'>
                            <button className='btn-border-none mt-3 m-1' onClick={() => {
                                //adds an extra room 
                                setRooms(prevRooms => [...prevRooms, {room_name:'',room_judge:{user_name:''},room_steward:{user_name:''}}])
                                }}
                                >Add Room</button>
                            <button className='btn-border-none ms-auto mt-3 ' onClick={() => {setActiveStep(1)}} >Configure Rooms</button>                            
                        </div> 
                    </>
                
                }
                {activeStep === 0 && comp.comp_rooms !== '0' && 
                    <>
                    <div>
                        <h5>Entries have closed</h5>
                        <p>Rooms have already been configured</p>
                    </div>
                    {JSON.parse(comp.comp_rooms).map((room,index) => { 
                        //displays room data if rooms have already been configured 
                        return(
                            <div key={index}>
                                <div className='grid text-start'>
                                {room &&                                    
                                    <div className='row'>
                                        <p className='col-2'>{room.room_name}</p>
                                        <p className='col-5'>Judge: {room.room_judge.user_name}</p>
                                        <p className='col-5'>Steward: {room.room_steward.user_name}</p>
                                    </div>                                    
                                }
                                </div>
                                
                            </div>
                        )
                    })}
                    <div>
                    <button className=' btn-border-none mt-3'  onClick={() => {handleEditRooms()}} >Edit Rooms</button>
                    {comp.comp_rooms !== 0 &&
                        <button className='btn-border-none ms-3 mt-3'  onClick={() => {setActiveStep(3)}} >Reset Rooms</button>
                    }

                    </div>
                    
                    </>
                }
                {activeStep === 1 &&
                
                <>
                    <h5 className='mb-4'>Confirm These Rooms and Judges</h5>
                    {rooms.map((room,index) => {
                        //display room data for user to confirm  
                        return(
                            <div key={index}>
                                <div className='grid text-start'>
                                {room &&                                    
                                    <div className='row'>
                                        <p className='col-2'>{room.room_name}</p>
                                        <p className='col-5'>Judge: {room.room_judge.user_name}</p>
                                        <p className='col-5'>Steward: {room.room_steward.user_name}</p>
                                    </div>                                    
                                }
                                </div>
                            </div>
                        )
                    })}
                    <div>
                    <button className=' btn-border-none mt-3' onClick={() => {setActiveStep(0)}} >Back</button>
                    <button className=' btn-border-none ms-3 mt-3'  onClick={() => {handleConfigCompForm()}} >Confirm</button>

                    </div>                  
                    
                </>
                }
                {activeStep === 2 &&
                    <>
                        <h5 className='mb-4'>Rooms have successfully been configuered as followed</h5>
                        <ul>
                        {rooms.map((room,index) => { 
                            //success page to confirm configure worked 
                        return(
                            <div key={index}>
                                <div className='grid text-start'>
                                {room &&                                    
                                    <div className='row'>
                                        <p className='col-2'>{room.room_name}</p>
                                        <p className='col-5'>Judge: {room.room_judge.user_name}</p>
                                        <p className='col-5'>Steward: {room.room_steward.user_name}</p>
                                    </div>                                    
                                }
                                </div>
                            </div>
                        )
                    })}
                    </ul>
                    
                    </>
                }
                {activeStep === 3 && 
                <div className='text-center'>
                <h5 className='mb-4'>Reset Rooms for {comp.comp_name}</h5>
                {
                //user cant reset rooms if none exist 
                comp.comp_rooms === '0' && 
                    <div>                        
                        <p>You have no rooms configured</p>            
                    </div>
                
                }
                {JSON.parse(comp.comp_rooms).map((room,index) => {
                    //displays room data so user can confirm they want to reset it  
                        return(
                            <div key={index}>
                                <div className='grid text-start'>
                                {room &&                                    
                                    <div className='row'>
                                        <p className='col-2'>{room.room_name}</p>
                                        <p className='col-5'>Judge: {room.room_judge.user_name}</p>
                                        <p className='col-5'>Steward: {room.room_steward.user_name}</p>
                                    </div>                                    
                                }
                                </div>
                                
                            </div>
                        )
                    })}
                <button className=' btn-border-none mt-3'  onClick={() => {setActiveStep(0); }} >Back</button>
                {
                //only let the user reset if rooms exist 
                comp.comp_rooms !== '0' &&
                    <button className='btn-border-none ms-3 mt-3' onClick={() => {handleResetRooms()}} >Confirm</button>
                }
            </div>
            }
            {activeStep === 4 && 
                <div className='m-2'>
                <h5 className='mb-4'>Rooms have been reset for {comp.comp_name}</h5>
                {JSON.parse(comp.comp_rooms).map((room,index) => {
                    //confirmation page to confirm rooms were succesfully reset  
                        return(
                            <div key={index}>
                                <div className='grid text-start'>
                                {room &&                                    
                                    <div className='row'>
                                        <p className='col-2'>{room.room_name}</p>
                                        <p className='col-5'>Judge: {room.room_judge.user_name}</p>
                                        <p className='col-5'>Steward: {room.room_steward.user_name}</p>
                                    </div>                                    
                                }
                                </div>
                                
                            </div>
                        )
                    })}
            </div>
            }
                </>

            )} 
        </div>
    );
}

export default ConfigCompForm;

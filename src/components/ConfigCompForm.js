import React,{useState,useEffect} from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
const ConfigCompForm = (props) => {
    const token = props.token
    const compID = props.comp.compID
    const [activeStep, setActiveStep] = useState(0);
    const [rooms, setRooms] = useState([{room_name:'',room_judge:'',room_steward:''}]);
    const [comp, setComp] = useState();
    const [loading, setLoading] = useState(true);
    const [officialNames, setOfficialNames] = useState({});
    useEffect(() => {
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
            if (res.data[0].comp_rooms !== '0') {
                setRooms(JSON.parse(res.data[0].comp_rooms))
            }
            setLoading(false)
          }).catch(e => {
            e = new Error();
          })
          axios({
            method: 'POST',
            url: './offical_names',
            headers: {
                Authorization: `Bearer ${token}`,
              },
          }).then(res => {
            console.log(res.data);
            setOfficialNames(res.data)
          }).catch(e => {
            e = new Error();
          })
    }, []);
    function handleConfigCompForm(){        
        axios({
            method: 'POST',
            url: './config_rooms',
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
        //const comp_rooms = comp.comp_rooms
        //console.log(rooms);
        //console.log(comp);
        setComp((prevComp) => {
            return{
                ...prevComp,
                comp_rooms:'0',
            }
        })
    }
    function handleResetRooms(){
        axios({
            method: 'POST',
            url: './reset_rooms',
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
            {loading ? (
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
                            <form>
                                {rooms.map((room,index) => {
                                    var judges = officialNames.judge.filter((name) => {
                                        if (rooms.some((room) => {
                                            return room.room_judge.match(name.first_name) !== null && room.room_judge.match(name.last_name) !== null
                                        })){
                                            return false
                                        }else{
                                            return true
                                        }
                                    })
                                    var stewards = officialNames.steward.filter((name) => {
                                        if (rooms.some((room) => {
                                            return room.room_steward.match(name.first_name) !== null && room.room_steward.match(name.last_name) !== null
                                        })){
                                            return false
                                        }else{
                                            return true
                                        }
                                    })
                                return(
                                    <div key={"nonce"+index} className='d-flex align-items-center'>
                                        
                                        <div className='form-floating'>
                                        <input id='RoomNameInput' className='m-1 form-control config-input' placeholder='  Room Name' value={room.room_name} onChange={(event) => {setRooms(values => values.map((value,i) => { return i === index ? {...value, room_name:event.target.value}:value}));}} type='text'></input>
                                        <label for="RoomNameInput">Room Name:</label>
                                        </div>
                                        <div className="dropdown">
                                            <div id={'judgeDropdown'+index} data-bs-toggle="dropdown" className='form-floating' aria-expanded="false">
                                            <input id='JudgeNameInput' type="text" className='form-control' value={room.room_judge} onChange={(event) => {setRooms(values => values.map((value,i) => { return i === index ? {...value, room_judge:event.target.value}:value}));}} />
                                            <label htmlFor="JudgeNameInput">Judge:</label>
                                            </div>
                                            <ul className="dropdown-menu student-dropdown" aria-labelledby={'judgeDropdown'+index}>
                                                
                                                {judges.map((name) => {                                                
                                                return (
                                                    <div key={index}>
                                                    {(name.last_name.toLowerCase().startsWith(room.room_judge.toLowerCase())||(name.first_name.toLowerCase()+" "+name.last_name.toLowerCase()).startsWith(room.room_judge.toLowerCase())) ? (
                                                    <li onClick={() => {setRooms(values => values.map((value,i) => {return i === index ? {...value, room_judge:name.first_name+' '+name.last_name}:value}))}} className='student-dropdown-item ps-1'>{name.first_name+' '+name.last_name}</li>
                                                    ):(null)}
                                                    </div>
                                                )
                                                })}
                                            </ul>                                            
                                        </div>
                                        <div className="dropdown">
                                            <div id={'stewardDropdown'+index} data-bs-toggle="dropdown" className='form-floating' aria-expanded="false">
                                            <input id='StewardNameInput' type="text" className='form-control' value={room.room_steward} onChange={(event) => {setRooms(values => values.map((value,i) => { return i === index ? {...value, room_steward:event.target.value}:value}));}} />
                                            <label htmlFor="StewardNameInput">Steward:</label>
                                            </div>
                                            <ul className="dropdown-menu student-dropdown" aria-labelledby={'stewardDropdown'+index}>
                                                {stewards.map((name) => {  
                                                return (
                                                    <div key={index}>
                                                    {(name.last_name.toLowerCase().startsWith(room.room_steward.toLowerCase())||(name.first_name.toLowerCase()+" "+name.last_name.toLowerCase()).startsWith(room.room_steward.toLowerCase())) ? (
                                                    <li onClick={() => {setRooms(values => values.map((value,i) => {return i === index ? {...value, room_steward:name.first_name+' '+name.last_name}:value}))}} className='student-dropdown-item ps-1'>{name.first_name+' '+name.last_name}</li>
                                                    ):(null)}
                                                    </div>
                                                )
                                                })}
                                            </ul>                                            
                                        </div>                                        
                                        
                                        
                                    <Button onClick={() => {setRooms((values) => values.filter((_, i) => i !== index));}} className='ms-2' size='small'variant="contained">X</Button>

                                    </div>
                                );
                                })}
                            </form>
                        </div> 
                        <div className='d-flex p-2'>
                            <Button className='mt-3 m-1' variant="contained" onClick={() => {setRooms(prevRooms => [...prevRooms, {room_name:'',room_judge:'',room_steward:''}])}}>Add Room</Button>
                            <Button className=' ms-auto mt-3 ' variant="contained" onClick={() => {setActiveStep(1)}} >Configure Rooms</Button>                            
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
                        return(
                            <div key={index}>
                                <div className='grid text-start'>
                                {room &&                                    
                                    <div className='row'>
                                        <p className='col-4'>{room.room_name}</p>
                                        <p className='col-4'>Judge: {room.room_judge}</p>
                                        <p className='col-4'>Steward: {room.room_steward}</p>
                                    </div>                                    
                                }
                                </div>
                                
                            </div>
                        )
                    })}
                    <div>
                    <Button className='mt-3' variant="contained" onClick={() => {handleEditRooms()}} >Edit Rooms</Button>
                    {comp.comp_rooms !== 0 &&
                        <Button className=' ms-3 mt-3' variant="contained" onClick={() => {setActiveStep(3)}} >Reset Rooms</Button>
                    }

                    </div>
                    
                    </>
                }
                {activeStep === 1 &&
                
                <>
                    <h5 className='mb-4'>Confirm These Rooms and Judges</h5>
                    {rooms.map((room,index) => { 
                        return(
                            <div key={index}>
                                <div className='grid text-start'>
                                {room &&                                    
                                    <div className='row'>
                                        <p className='col-4'>{room.room_name}</p>
                                        <p className='col-4'>Judge: {room.room_judge}</p>
                                        <p className='col-4'>Steward: {room.room_steward}</p>
                                    </div>                                    
                                }
                                </div>
                            </div>
                        )
                    })}
                    <div>
                    <Button className='mt-3' variant="contained" onClick={() => {setActiveStep(0)}} >Back</Button>
                    <Button className=' ms-3 mt-3' variant="contained" onClick={() => {handleConfigCompForm()}} >Confirm</Button>

                    </div>                  
                    
                </>
                }
                {activeStep === 2 &&
                    <>
                        <h5>Rooms have successfully been configuered as followed</h5>
                        <ul>
                        {rooms.map((room,index) => { 
                        return(
                            <div key={index}>
                                <div className='grid text-start'>
                                {room &&                                    
                                    <div className='row'>
                                        <p className='col-4'>{room.room_name}</p>
                                        <p className='col-4'>Judge: {room.room_judge}</p>
                                        <p className='col-4'>Steward: {room.room_steward}</p>
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
                {comp.comp_rooms === '0' && 
                    <div>                        
                        <p>You have no rooms configured</p>            
                    </div>
                
                }
                {JSON.parse(comp.comp_rooms).map((room,index) => { 
                        return(
                            <div key={index}>
                                <div className='grid text-start'>
                                {room &&                                    
                                    <div className='row'>
                                        <p className='col-4'>{room.room_name}</p>
                                        <p className='col-4'>Judge: {room.room_judge}</p>
                                        <p className='col-4'>Steward: {room.room_steward}</p>
                                    </div>                                    
                                }
                                </div>
                                
                            </div>
                        )
                    })}
                <Button className='mt-3' variant="contained" onClick={() => {setActiveStep(0); }} >Back</Button>
                {comp.comp_rooms !== '0' &&
                    <Button className=' ms-3 mt-3' variant="contained" onClick={() => {handleResetRooms()}} >Confirm</Button>
                }
            </div>
            }
            {activeStep === 4 && 
                <div className='m-2'>
                <h5 className='mb-4'>Rooms have been reset for {comp.comp_name}</h5>
                {JSON.parse(comp.comp_rooms).map((room,index) => { 
                        return(
                            <div key={index}>
                                <div className='grid text-start'>
                                {room &&                                    
                                    <div className='row'>
                                        <p className='col-4'>{room.room_name}</p>
                                        <p className='col-4'>Judge: {room.room_judge}</p>
                                        <p className='col-4'>Steward: {room.room_steward}</p>
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

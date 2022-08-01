import React,{useState,useEffect} from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const EntryForm = (props) => {
    var comp = props.comp
    const user = props.user
    const token = props.token
    const compEventGrade = JSON.parse(comp.comp_events);
    const [eventGrade, setEventGrade] = useState();
    const [entryChecked, setEntryChecked] = useState(Array.apply(null, Array(compEventGrade.length)).map(i => i=false));
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [existingEntry, setExistingEntry] = useState([]);
    useEffect(() => {
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
            url: './check_existing_entry',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {  
                compID:comp.compID 
            },
        }).then(res => {
            setExistingEntry(res.data)
            setLoading(false)
        }).catch(e => {
            e = new Error();
        })
    },[])
    function handleSubmitEntryForm(){
        axios({
            method: 'POST',
            url: './create_entries',
            headers: {
                Authorization: `Bearer ${token}`,
              },
            data: { 
                entries:entryChecked,
                comp_events:compEventGrade, 
                compID:comp.compID 
            },
          }).then(res => {
            console.log(res.data);
            setActiveStep(2)
          }).catch(e => {
            e = new Error();
          })

    }
    function handleEditEntry(){
        const eventIndexes = existingEntry.map((entry,index) => compEventGrade.findIndex((event,index) => event.event === entry.eventID && event.grade === entry.gradeID))
        eventIndexes.map((index) => {
            setEntryChecked(values => values.map((value,i) => {return i === index ? !value:value }));
            return null
        })
        setExistingEntry([])
        
    }
    return ( 
        <div>
            {loading ? (
            <div className='text-center p-3'>
                <Skeleton className='mb-2' width={590} height={56} count={8}/>
            </div>

        ):(
            <div>
            {activeStep === 0 && existingEntry.length === 0 &&
                <div className=' text-center m-3 pt-2'>
                    <h5>Enter Events for {user.user}</h5>
                    <div className='grid entry-form'>
                    {compEventGrade.map((field,index) => {
                        return(
                        <div key={index} className="form-check row m-1 border">
                            <div className=' d-flex align-items-center p-3'>
                                <input onChange={() => {
                                setEntryChecked(values => values.map((value,i) => {return i === index ? !value:value }));
                                }} checked={entryChecked[index]} className="form-check-input" type="checkbox" value={entryChecked[index]}
                                />

                                {eventGrade &&
                                <p className='ps-3 p-0 m-0'>{eventGrade.grades[field.grade-1].grade_name} Grade {eventGrade.events[field.event-1].event_name}</p>
                                }                            
                            </div>         
                        </div>
                        );
                    })}
                </div>  
                <Button className='mt-3' variant="contained" onClick={() => {setActiveStep(1); console.log(entryChecked);}} >Enter</Button>
            </div>
            }
            {activeStep === 0 && existingEntry.length !== 0 &&
            <div className='text-center'>
                <h5>{user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1)} {user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1)} has already entered these events:</h5>
                <ul className='mt-2'>
                {existingEntry.map((entry,index) => { 
                    return(
                        <div key={index}>
                            {eventGrade &&
                            <li key={index} className='text-start'>
                                <p>{eventGrade.grades[entry.gradeID-1].grade_name} Grade {eventGrade.events[entry.eventID-1].event_name}</p>
                            </li>
                            }
                        </div>
                    )
                })}
                </ul>
                <Button className='mt-3' variant="contained" onClick={() => {handleEditEntry()}} >Edit Entries</Button>

            </div>
            
            }
            {activeStep === 1 &&
            <div className='text-center'>
                <h5>Confirm Your Entries for {user.user}</h5>
                {entryChecked.every((v) => (v === false)) && 
                    <div>
                        <p>You have not entered any events</p>            
                    </div>
                
                }
                {entryChecked.map((entry,index) => { 
                    return(
                        <div key={index}>
                            <ul>
                            {entry &&
                            <li className='text-start'>
                                <p>{eventGrade.grades[compEventGrade[index].grade-1].grade_name} Grade {eventGrade.events[compEventGrade[index].event-1].event_name}</p>
                            </li>
                            }
                            </ul>
                        </div>
                    )
                })}
                <Button className='mt-3' variant="contained" onClick={() => {setActiveStep(0); console.log(entryChecked);}} >Back</Button>
                {entryChecked.some((v) => (v === true)) &&
                    <Button className=' ms-3 mt-3' variant="contained" onClick={() => {handleSubmitEntryForm()}} >Confirm</Button>
                }
            </div>
            }
            {activeStep === 2 &&
            <div className='m-2'>
                <h5>{user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1)} {user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1)} has succesfully entered these events</h5>
                {entryChecked.map((entry,index) => { 
                    return(
                        <div key={index}>
                            <ul>
                            {entry &&
                            <li className='text-start'>
                                <p>{eventGrade.grades[compEventGrade[index].grade-1].grade_name} Grade {eventGrade.events[compEventGrade[index].event-1].event_name}</p>
                            </li>
                            }
                            </ul>
                        </div>
                    )
                })}
            </div>
            }
            </div>
        )}
    </div> 
         
    );
}

export default EntryForm;

import React,{useState,useEffect} from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const EntryForm = (props) => {
    var comp = props.comp
    const token = props.token
    const users = props.user
    const compEventGrade = JSON.parse(comp.comp_events);
    const [user, setUser] = useState(users[0]);
    const [eventGrade, setEventGrade] = useState();
    const [entryChecked, setEntryChecked] = useState(Array.apply(null, Array(compEventGrade.length)).map(i => i=false));
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [existingEntry, setExistingEntry] = useState([]);
    useEffect(() => {
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
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/check_existing_entry',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {  
                compID:comp.compID, 
                user:users[0].userID,
            },
        }).then(res => {
            setExistingEntry(res.data)
            setLoading(false)
        }).catch(e => {
            e = new Error();
        })
    },[user,])
    function handleSubmitEntryForm(){
        axios({
            method: 'POST',
            url: './create_entries',
            headers: {
                Authorization: `Bearer ${token}`,
              },
            data: { 
                user:user.userID,
                entries:entryChecked,
                comp_events:compEventGrade, 
                compID:comp.compID 
            },
          }).then(res => {
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
    function handleDeleteEntry(){
        axios({
            method: 'POST',
            url: './create_entries',
            headers: {
                Authorization: `Bearer ${token}`,
              },
            data: { 
                user:user.userID,
                entries:null,
                comp_events:compEventGrade, 
                compID:comp.compID 
            },
          }).then(res => {
            setActiveStep(4)
          }).catch(e => {
            e = new Error();
          })
    }


    function EntryInput(){
        function Checkbox(props){
            const field = props.field
            const index = props.index
            return(
                <div key={index} className="form-check row m-1 border">
                    <div className=' d-flex align-items-center p-2'>
                        <input onChange={() => {
                        setEntryChecked(values => values.map((value,i) => {return i === index ? !value:value }));
                        }} checked={entryChecked[index]} className="form-check-input" type="checkbox" value={entryChecked[index]}
                        />

                        {eventGrade &&
                        <p className='ps-3 p-0 m-0'>{eventGrade.grades[field.grade-1].grade_name} {eventGrade.events[field.event-1].event_name}</p>
                        }                            
                    </div>         
                </div>

            )

        }
        return(
            <>
            <div className=' text-center m-3 pt-2'>
                <h5 className='mb-4'>Enter Events for {user.first_name} {user.last_name}</h5>
                    <div className='grid entry-form'>
                    {compEventGrade.map((field,index) => {
                        return(
                            <Checkbox key={index} field={field} index={index} />
                        );
                    })}
                </div>  
                <button className='btn-border-none mt-3' disabled={entryChecked.every((v) => {return v === false})}  onClick={() => {setActiveStep(1)}} >Enter</button>
            </div>
            </>
        )
    }
    function AlreadyEntered(){
        return(
        <>
            <h5 className='mb-4'>{user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1)} {user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1)} has already entered these events:</h5>
            <ul className=''>
            {existingEntry.map((entry,index) => { 
                return(
                    <div key={index}>
                        {eventGrade &&
                        <li key={index} className='text-start'>
                            <p>{eventGrade.grades[entry.gradeID-1].grade_name} {eventGrade.events[entry.eventID-1].event_name}</p>
                        </li>
                        }
                    </div>
                )
            })}
            </ul>
            <div className=''>
                <button className='btn-border-none mt-3'  onClick={() => {handleEditEntry()}} >Edit Entries</button>
                {existingEntry.length > 0 &&
                    <button className='btn-border-none ms-3 mt-3'  onClick={() => {setActiveStep(3)}} >Delete Entries</button>
                }
            </div>
        </>
        )

    }
    function ConfirmEntries(){
        return(
        <>
        <div className='text-center'>
                <h5 className='mb-4'>Confirm Your Entries for {user.user}</h5>
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
                                <p>{eventGrade.grades[compEventGrade[index].grade-1].grade_name} {eventGrade.events[compEventGrade[index].event-1].event_name}</p>
                            </li>
                            }
                            </ul>
                        </div>
                    )
                })}
                <button className='btn-border-none mt-3' onClick={() => {setActiveStep(0)}} >Back</button>
                {entryChecked.some((v) => (v === true)) &&
                    <button className='btn-border-none ms-3 mt-3' onClick={() => {handleSubmitEntryForm()}} >Confirm</button>
                }
            </div>
        
        </>
        )
    }
    function EntriesSuccess(){
        return(
        <>
            <div className='m-2'>
                <h5 className='mb-2'>{user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1)} {user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1)} has succesfully entered these events</h5>
                {entryChecked.map((entry,index) => { 
                    return(
                        <div key={index}>
                            <ul>
                            {entry &&
                            <li className='text-start'>
                                <p>{eventGrade.grades[compEventGrade[index].grade-1].grade_name} {eventGrade.events[compEventGrade[index].event-1].event_name}</p>
                            </li>
                            }
                            </ul>
                        </div>
                    )
                })}
            </div>
        </>
        )
    }
    function DeleteEntries(){
        return(
        <>
        <div className='text-center'>
                <h5 className='mb-4'>Remove Entries for {user.user}</h5>
                {existingEntry.length === 0 && 
                    <div>                        
                        <p>You have not entered any events</p>            
                    </div>
                
                }
                {existingEntry.map((entry,index) => { 
                    return(
                        <div key={index}>
                            <ul>
                            {entry &&
                            <li className='text-start'>
                                <p>{eventGrade.grades[compEventGrade[index].grade-1].grade_name} {eventGrade.events[compEventGrade[index].event-1].event_name}</p>
                            </li>
                            }
                            </ul>
                        </div>
                    )
                })}
                <button className=' btn-border-none mt-3' onClick={() => {setActiveStep(0)}} >Back</button>
                {existingEntry.length > 0 &&
                    <button className='btn-border-none ms-3 mt-3'onClick={() => {handleDeleteEntry()}} >Confirm</button>
                }
            </div>
        
        </>
        )
    }
    function DeleteEntriesSuccess(){
        return(
        <>
        <div className='m-2'>
            <h5 className='mb-4'> Deleted all events for {user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1)} {user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1)}</h5>
            {existingEntry.map((entry,index) => { 
                return(
                    <div key={index}>
                        <ul>
                        {entry &&
                        <li className='text-start'>
                            <p>{eventGrade.grades[compEventGrade[index].grade-1].grade_name} {eventGrade.events[compEventGrade[index].event-1].event_name}</p>
                        </li>
                        }
                        </ul>
                    </div>
                )
            })}
        </div>
        
        </>
        )
    }
    return ( 
        <div className='modal-size d-flex justify-content-center max-height '>
        {loading ? (
            <div className='text-center p-3'>
                <Skeleton className='mb-2' width={590} height={56} count={8}/>
            </div>

        ):(
            <div className='text-center d-flex flex-column justify-content-center p-4 '>
                {users.length > 1 && activeStep === 0 &&
                    <select  onChange={({ target }) => {console.log(users[target.value],user); setUser(users[target.value])}} className="select-child form-select" aria-label="Default select example">
                    { users.map((child,index) => {
                        return(
                            <option  key={index} value={index}>{child.first_name} {child.last_name}</option>
                        )
                    })}
                    
                    </select>

                }
                
            {activeStep === 0 && existingEntry.length === 0 &&
                <EntryInput/>
            }
            {activeStep === 0 && existingEntry.length !== 0 &&
                <AlreadyEntered/>            
            }
            {activeStep === 1 &&
                <ConfirmEntries/>
            }
            {activeStep === 2 &&
                <EntriesSuccess/>
            }
            {activeStep === 3 && 
                <DeleteEntries/>
            }
            {activeStep === 4 && 
                <DeleteEntriesSuccess/>
            }
            </div>
        )}
    </div> 
         
    );
}

export default EntryForm;

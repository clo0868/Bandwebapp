import React, {useEffect,useState} from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
const EntriesByUserDisplay = (props) => {
    var comp = props.comp
    const token = props.token
    const [entries,setEntries] = useState([]);
    const [eventGrade, setEventGrade] = useState();
    const [loading, setLoading] = useState(true);
    const [searchUser, setSearchUser] = useState('');
    const [activeMode, setActiveMode] = useState(0);
    const [editUser, setEditUser] = useState();
    const [activeStep, setActiveStep] = useState(0);
    const compEventGrade = JSON.parse(comp.comp_events);

    //entry check array has list of all events and whether they are ticked or not 
    //starts of all events are unticked 
    const [entryChecked, setEntryChecked] = useState(Array.apply(null, Array(compEventGrade.length)).map(i => i=false));


    useEffect(() => {
        setLoading(true)
        //gets list of all entries for the competition 
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/comp_entries',
            headers: {
                Authorization: `Bearer ${token}`,
              },
            data: { 
              comp
            },
          }).then(res => {
            setEntries(res.data)  
            setLoading(false)    
          }).catch(e => {
            e = new Error();
          })

          //returns event and grade names from the database 
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
    },[])

    //effect to switch from view mode to edit mode 
    useEffect(() => {
        // get a list of all the entries for the user they are editing
        const user_entries = entries.filter((entry,index) => {
            return entry.userID === editUser.userID
        })
        //find all the event and grade names for that event 
        const eventIndexes = user_entries.map((entry,index) => compEventGrade.findIndex((event,index) => event.event === entry.eventID && event.grade === entry.gradeID))
        
        //set the entries checked array to match what the user had already entered 
        eventIndexes.map((index) => {
            setEntryChecked(values => values.map((value,i) => {return i === index ? !value:value }));
            return null
        }) 
        
    }, [editUser]);

    function deleteAllEntries(user,comp){
        //tell the database to delete all entries for a user at a comp 
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/delete_user_entries',
            headers: {
                Authorization: `Bearer ${token}`,
              },
            data: { 
              user,
              comp
            },
          }).then(res => {
          }).catch(e => {
            e = new Error();
          })
          //remove the entries from the screen 
            setEntries(prevEntries => prevEntries.filter((v) => {
                return v.userID !== user.userID
            }))
    }
    function deleteEntry(entry){
        //deletes a specific entry from the database 
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/delete_entry',
            headers: {
                Authorization: `Bearer ${token}`,
              },
            data: { 
              entry
            },
          }).then(res => {
          }).catch(e => {
            e = new Error();
          })
          //remove that entry from the screen 
          setEntries(prevEntries => prevEntries.filter((v) => {
            return v.entryID !== entry.entryID
        }))
    }
    function handleSubmitEntryForm(user,entryChecked,compEventGrade,comp,user_entries){
        //edits entries for the user specified 

        //send updated entry data to server 
        //deletes old ones and makes new ones
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/create_entries',
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
            //copy out the entries 
            const copy = [...entries];

            //filter out the previous entries for the user that were removed 
            const removed_prev = copy.filter((v) => {
                return (user_entries.every((entry) => {return entry.entryID !== v.entryID}))
            })
            //add new entries back to array 
            res.data.result.forEach((element,index) => {
                
                removed_prev.push(element)
                if (index === res.data.result.length-1) {
                    //set the entries to the resulting array 
                    setEntries(removed_prev)
                }
                
            });
            setActiveStep(2)
          }).catch(e => {
            e = new Error();
          })

    }
    function AdminEntryForm(props){
        //when changed to edit mode switches to this form for the admin to edit entries 
        const user = editUser
        const comp = props.comp
        //get all of the users entries 
        const user_entries = entries.filter((entry) => {
            return entry.userID === user.userID
        })
        function Checkbox(props){
            //checkbox component 
            const field = props.field
            const index = props.index
            //displays the checkbox
            return(
                <div key={index} className="form-check row m-1 border">
                    <div className=' d-flex align-items-center p-2'>
                        <input onChange={() => {
                        setEntryChecked(values => values.map((value,i) => {return i === index ? !value:value }));
                        }} checked={entryChecked[index]} className="form-check-input" type="checkbox" value={entryChecked[index]}
                        />

                        {
                        //makes sure eventgrade is set before displaying 
                        eventGrade &&
                        <p className='ps-3 p-0 m-0'>{eventGrade.grades[field.grade-1].grade_name} {eventGrade.events[field.event-1].event_name}</p>
                        }                            
                    </div>         
                </div>

            )

        }
        //displays step for the admin to edit entries 
        return(
            <>
            <div className=' text-center m-3 pt-2'>
                {
                //on first step show list of checkboxes auto completed to current entries 
                activeStep === 0 &&
                <>
                <h5 className='mb-4'>Enter Events for {user.user_name}</h5>
                <div className='grid entry-form'>
                    {compEventGrade.map((field,index) => {
                        //array of checkboxes 
                        return(
                            <Checkbox key={index} field={field} index={index} />
                        );
                    })}
                </div>  
                <button className='btn-border-none mt-3' disabled={entryChecked.every((v) => {return v === false})} onClick={() => {setActiveStep(1)}} >Enter</button>
                </>
                }
                {
                //confirmation step of entry procces 
                activeStep === 1 &&
                <>
                <h5 className='mb-4'>Confirm Your Entries for {user.user_name}</h5>
                {
                //error message when admin has not entered any events 
                entryChecked.every((v) => (v === false)) && 
                    <div>                        
                        <p>You have not entered any events</p>            
                    </div>
                
                }
                {entryChecked.map((entry,index) => { 
                    //return list of updated entries for the user 
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
                {
                //makes sure at least on event has been entered 
                entryChecked.some((v) => (v === true)) &&
                    <button className='btn-border-none ms-3 mt-3' onClick={() => {handleSubmitEntryForm(user,entryChecked,compEventGrade,comp,user_entries)}} >Confirm</button>
                }
                </>
                }
                {
                //succes message 
                activeStep === 2 &&
                <>
                <div className='m-2'>
                    <h5 className='mb-2'>{user.user_name} has succesfully been entered in these events</h5>
                    {entryChecked.map((entry,index) => { 
                        //displays list of events entered 
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
                }
            
            </div>
            
            </>
        )
    }
    //displays html for the page 
    return (
        <div className='text-center'>
            <h5>Current entries for {comp.comp_name}</h5>
            <div className=' mt-2 grid entry-form'>
        {
        //checks if page is still waiting on api 
        loading ? (
            <div>
                
                <Skeleton className='mb-2' width={600} height={52} count={8}/>

            </div>

        ):(
            <div>
                {(activeMode !== 3) ? (
                <>
                    <div className='d-flex justify-content-center m-2'>                    
                    <input className=" search-bar form-control ps-3 border rounded-pill"
                    placeholder='Search:'
                    type="text"
                    onChange={(event) => {setSearchUser(event.target.value)}}
                    value={searchUser} />         
                </div>
                <div className="accordion" id="entriesAccordion">
                {[...new Map(entries.map(item => [item['userID'], item])).values()].map((user,index) => {
                    const user_entries = entries.filter((entry,index) => {
                        return entry.userID === user.userID
                    })
                    
                    return(
                        <div key={index}>
                            {eventGrade && ((user.user_name).toLowerCase().match(searchUser) !== null) ? (
                               
                                <div className="accordion-item mb-2">
                                <h2 className="accordion-header" id={"heading"+index}>
                                <button className="accordion-button collapsed grid" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse"+index} aria-expanded="false" aria-controls={"collapse"+index}>
                                    <div className='w-100 row align-items-center'>
                                        <div className='col-6'>
                                        <p>{user.user_name}</p>
                                        </div>
                                        <div className='col-6 text-end pe-4'>
                                        {activeMode === 1 && <button onClick={() => {deleteAllEntries(user,comp)}} className='btn btn-primary btn-sm'>Delete All Entries</button>}
                                        {activeMode === 2 && <button onClick={() => {setActiveMode(3); setEditUser(user)}} className='btn btn-primary btn-sm'>Edit Entries</button>}
                                        </div>
                                    </div>
                                    
                                </button>
                                </h2>
                                <div id={"collapse"+index} className="accordion-collapse collapse " aria-labelledby={"heading"+index} data-bs-parent="#entriesAccordion">
                                <div className="accordion-body">
                                    {user_entries.map((entry,index) => {
                                        return(
                                            <div key={index} className='border-bottom m-2 grid'>
                                                <div className='row align-items-center'>
                                                    <div className='col-6 text-start'>
                                                        <p>{index+1}.  {eventGrade.grades[entry.gradeID-1].grade_name} {eventGrade.events[entry.eventID-1].event_name}</p>
                                                    </div>
                                                    <div className='col-6 text-end'>
                                                        {activeMode === 1 && <button onClick={() => {deleteEntry(entry)}} className='btn btn-primary btn-sm m-1'>Delete Entry</button>}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}                                
                                
                                </div>
                                </div>
                            </div>  
                               
                            ):(null)}
                        </div>
                    )
                })}
                {entries.length === 0 && 
                    <div className='m-5'>
                        <p>There are currently no entries in this competition </p>
                    </div>
                }
                </div>
                </>
                
                ):(
                    <AdminEntryForm comp={comp} />
                )}
                
                
            </div>

        )}
        </div>
        <div className=' mt-2 d-flex flex-row justify-content-around'>
            {activeMode === 0 &&
            <>
            <button onClick={() => {setActiveMode(2)}} className='btn btn-primary'>Edit Entries</button>
            <button onClick={() => {setActiveMode(1)}} className='btn btn-primary'>Remove Entries</button>
            </>
            }
            {activeMode !== 0 &&
                <button className='btn btn-primary' onClick={() => {setActiveMode(0)}}>Back</button>
            }
            
        </div>
            
    </div>
        
    );
}

export default EntriesByUserDisplay;

import React, {useEffect,useState} from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
const EntriesDisplay = (props) => {
    const comp = props.comp
    const token = props.token
    const compEventGrade = JSON.parse(comp.comp_events);
    const [entries,setEntries] = useState([]);
    const [eventGrade, setEventGrade] = useState();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setLoading(true)

        //gets entry data for all entries in this competition 
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
          }).catch(e => {
            e = new Error();
          })

          //gets all event and grade names from db 
          axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/event_grade_name',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(res => {
            setEventGrade(res.data)
            setLoading(false)
        }).catch(e => {
            e = new Error();
        })
    },[])

    //displays html for the page 
    return (
        <div className='text-center'>
            <h5>Current entries for {comp.comp_name}</h5>
            <div className=' mt-2 grid entry-form'>
        {
        //shows skeletons when loading 
        loading ? (
            <div>
                
                <Skeleton className='mb-2' width={600} height={52} count={8}/>

            </div>

        ):(
            <div>
                <div className="accordion" id="entriesAccordion">
            {
            //maps out each event in the competition 
            compEventGrade.map((field,index) => {

                //filter entries for the specific event 
                var event_entries = entries.filter(value => value.gradeID === field.grade && value.eventID === field.event);

                //displays html for the modal 
                return(
                    <div key={index}>
                        {
                        //checks eventgrade is set 
                        eventGrade && 
                        <div className="accordion-item mb-2">
                            <h2 className="accordion-header" id={"heading"+index}>
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse"+index} aria-expanded="false" aria-controls={"collapse"+index}>
                                {eventGrade.grades[field.grade-1].grade_name} {eventGrade.events[field.event-1].event_name}
                            </button>
                            </h2>
                            <div id={"collapse"+index} className="accordion-collapse collapse" aria-labelledby={"heading"+index} data-bs-parent="#entriesAccordion">
                            <div className="accordion-body">
                                {event_entries.map((entry,index) => {
                                    //maps out every entry in the event and displays names 
                                    return(
                                        <div key={index} className='border-bottom text-start'>
                                            <p>{index+1}.  {entry.user_name}</p>
                                        </div>
                                    );
                                })}
                                {
                                //message for when no entries are made
                                event_entries.length === 0 &&
                                    <div className='m-2'>
                                        <p>There are currently no entries in this event</p>
                                    </div>
                                }
                            
                            </div>
                            </div>
                        </div>                            
                        }
                    </div>
                )
            })}
            </div>
            </div>

        )}
        </div>
            
            
    </div>
        
    );
}

export default EntriesDisplay;

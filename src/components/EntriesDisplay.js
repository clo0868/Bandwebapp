import React, {useEffect,useState} from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
const EntriesDisplay = (props) => {
    var comp = props.comp
    const token = props.token
    const compEventGrade = JSON.parse(comp.comp_events);
    const [entries,setEntries] = useState([]);
    const [eventGrade, setEventGrade] = useState();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true)
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
    return (
        <div className='text-center'>
            <h5>Current entries for {comp.comp_name}</h5>
            <div className=' mt-2 grid entry-form'>
        {loading ? (
            <div>
                
                <Skeleton className='mb-2' width={600} height={52} count={8}/>

            </div>

        ):(
            <div>
                <div className="accordion" id="entriesAccordion">
            {compEventGrade.map((field,index) => {
                var event_entries = entries.filter(value => value.gradeID === field.grade && value.eventID === field.event);
                return(
                    <div key={index}>
                        {eventGrade && 
                        <div className="accordion-item mb-2">
                            <h2 className="accordion-header" id={"heading"+index}>
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse"+index} aria-expanded="false" aria-controls={"collapse"+index}>
                                {eventGrade.grades[field.grade-1].grade_name} {eventGrade.events[field.event-1].event_name}
                            </button>
                            </h2>
                            <div id={"collapse"+index} className="accordion-collapse collapse" aria-labelledby={"heading"+index} data-bs-parent="#entriesAccordion">
                            <div className="accordion-body">
                                {event_entries.map((entry,index) => {
                                    return(
                                        <div key={index} className='border-bottom text-start'>
                                            <p>{index+1}.  {entry.user}</p>
                                        </div>
                                    );
                                })}
                            
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

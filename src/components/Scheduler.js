import React, {useState} from 'react';
import {useLocation} from "react-router-dom";

const Scheduler = () => {
    var data = useLocation();
    const compID = data.state.compID
    const [output, setOutput] = useState('');
    function createSchedule(){
        setOutput("schedule")
    }
    return (
        
        <div className=' container-fluid-big d-flex flex-column text-center justify-content-center align-items-center'>
            <button onClick={() => {createSchedule()}}>Create Schedule</button>
            <div>
                <p>{compID}</p>
                <p>{output}</p>
            </div>
                        
        </div>
    );
}

export default Scheduler;

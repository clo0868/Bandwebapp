import React, {useState,useEffect} from 'react';
import {useLocation} from "react-router-dom";
import axios from'axios';
const Scheduler = () => {
    var data = useLocation();
    const token = sessionStorage.TOKEN
    const compID = data.state.compID
    const [output, setOutput] = useState('');
    function createSchedule(){
        axios({
            method: 'POST',
            url: './get_entries',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {  
                compID:compID, 
            },
        }).then(res => {
            var data = res.data
            setOutput(JSON.stringify(res.data))
        }).catch(e => {
            e = new Error();
        })
    }

    useEffect(() => {
        
    },[])
    return (
        
        <div className=' container-fluid-big d-flex flex-column text-center justify-content-center align-items-center'>
            <button onClick={createSchedule()}>Create Schedule</button>
            <div>
                <p>{compID}</p>
                <p>{output}</p>
            </div>
                        
        </div>
    );
}

export default Scheduler;

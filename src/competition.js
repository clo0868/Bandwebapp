import React from 'react';
import {useLocation} from "react-router-dom";

const Competition = () => {
    var data = useLocation();
    const comp = data.state.comp
    const comp_start_time = new Date(comp.comp_start_time)
    return (
        <div className='container-fluid comp-container'>
            <div className='grid'>
                <div className='row'>
                    <div className='col-2 shadow-sm comp-height'>

                    </div>
                    <div className='col-8 text-center'>
                        <div className='grid m-3 '>
                            <div className='row border-bottom border-3'>
                                <div className='col text-start'>
                                    <h5>{comp.comp_name}</h5>
                                    <p>{comp.comp_location}</p>
                                </div>
                                <div className='col text-end'>
                                    <h5>{comp_start_time.toDateString()}</h5>
                                    <p>{comp_start_time.toLocaleTimeString()}</p>
                                </div>
                            </div> 
                            <div className='row shadow-sm'>
                                {JSON.stringify(comp.comp_schedule)}
                            </div>
                        </div>
                    </div>
                    <div className='col-2 shadow-sm comp-height'>

                    </div>

                </div>

            </div>
            
            
        </div>
    );
}

export default Competition;

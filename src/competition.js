import React, {useState,useEffect} from 'react';
import {useLocation} from "react-router-dom";
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import axios from'axios';
import EntryForm from './components/EntryForm.js'
import CompInfoSkeleton from './components/CompInfoSkeleton.js';
import ConfigCompForm from './components/ConfigCompForm.js';
import EntriesDisplay from './components/EntriesDisplay.js';


const Competition = () => {
    const token = sessionStorage.TOKEN
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState();
    const [enteropen, setEnteropen] = useState(false);
    const [configopen, setConfigopen] = useState(false);
    const [entviewopen, setEntviewopen] = useState(false);


    const compmodalstyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    useEffect(() => {
        setLoading(true)
        axios({
            method: 'POST',
            url: './user',
            headers: {
                Authorization: `Bearer ${token}`,
              },
          }).then(res => {
            setUser(res.data)
            setLoading(false)
          }).catch(e => {
          })
    },[])
    var data = useLocation();
    const comp = data.state.comp
    const comp_start = new Date(comp.comp_start_time)
    const comp_start_time = comp_start.getTime()
    const ent_open = new Date(comp.ent_open_time).getTime()
    const ent_close = new Date(comp.ent_close_time).getTime()
    const current_time = new Date().getTime()
    return (
        <div className='container-fluid comp-container'>
            <div className='grid'>
                <div className='row'>
                    <div className='col-2 shadow-sm comp-height'>

                    </div>
                    <div className='col-8 text-center'>
                        {loading ? (
                            <div>
                                <CompInfoSkeleton/>
                            </div>

                        ) : (
                            <div className='grid m-3 '>
                                <div className='row border-bottom border-3'>
                                    <div className='col text-start'>
                                        <h5>{comp.comp_name}</h5>
                                        <p>{comp.comp_location}</p>
                                    </div>
                                    <div className='col text-end'>
                                        <h5>{comp_start.toDateString()}</h5>
                                        <p>{comp_start.toLocaleTimeString()}</p>
                                    </div>
                                </div> 
                            {current_time > ent_close && current_time < comp_start_time && comp.comp_schedule !== '0' &&
                                <div className='row'>
                                    <p> you have a schedule</p>
                                </div>                              
                            }
                            {user && user.user_type === 0 && ent_close > current_time &&
                                <div className='row'>
                                    <Button onClick={() => setConfigopen(true)} variant='contained'>Configure Competition</Button>
                                    <Modal
                                        open={configopen}
                                        onClose={() => setConfigopen(false)}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={compmodalstyle}>
                                            <button onClick={() => setConfigopen(false)} type="button" className="close-button btn-close" aria-label="Close"></button>
                                            <ConfigCompForm />
                                        </Box>
                                    </Modal> 
                                    
                                </div>
                            
                            }
                            {ent_open < current_time && 
                                <div className='row'>
                                <Button onClick={() => setEntviewopen(true)} variant='contained'>View Entries</Button>
                                <Modal
                                    open={entviewopen}
                                    onClose={() => setEntviewopen(false)}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={compmodalstyle}>
                                        <button onClick={() => setEntviewopen(false)} type="button" className="close-button btn-close" aria-label="Close"></button>
                                        <EntriesDisplay token={token} comp={comp}/>
                                    </Box>
                                </Modal>     
                                </div> 
                            }
                            {user && user.user_type === 0 && ent_open < current_time && ent_close > current_time &&
                            <>
                            <div className='row'>
                                <Button onClick={() => setEnteropen(true)} variant='contained'>Enter Competition</Button>
                                <Modal
                                    open={enteropen}
                                    onClose={() => setEnteropen(false)}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={compmodalstyle}>
                                        <button onClick={() => setEnteropen(false)} type="button" className="close-button btn-close" aria-label="Close"></button>
                                        <EntryForm user={user} token={token} comp={comp}/>
                                    </Box>
                                </Modal>   
                            </div>  
                            </>                                             
                            } 
                        </div>
                            
                        )}
                        
                    </div>
                    <div className='col-2 shadow-sm comp-height'>

                    </div>

                </div>

            </div>
            
            
        </div>
    );
}

export default Competition;

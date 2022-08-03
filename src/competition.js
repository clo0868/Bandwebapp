import React, {useState,useEffect} from 'react';
import {useLocation} from "react-router-dom";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axios from'axios';
import EntryForm from './components/EntryForm.js'
import CompInfoSkeleton from './components/CompInfoSkeleton.js';
import ConfigCompForm from './components/ConfigCompForm.js';
import EntriesDisplay from './components/EntriesDisplay.js';


const Competition = () => {
    var data = useLocation();
    const token = sessionStorage.TOKEN
    const compID = data.state.comp.compID
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState();
    const [enteropen, setEnteropen] = useState(false);
    const [configopen, setConfigopen] = useState(false);
    const [entviewopen, setEntviewopen] = useState(false);
    const [child, setChild] = useState({});
    const [comp, setComp] = useState({});
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
        console.log(compID);
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
          }).catch(e => {
            e = new Error();
          })
        axios({
            method: 'POST',
            url: './user',
            headers: {
                Authorization: `Bearer ${token}`,
              },
          }).then(res => {
            setUser(res.data.user)
            if (res.data.result) {
                setChild(res.data.result[0])
            }
            setLoading(false)
          }).catch(e => {
            if(e.response.data.error === 'User not approved!'){
                setUser({user:e.response.data.error})
                console.log('Your Account has not been approved yet');
            }else{
                e = new Error();
            }
          })
    },[])
    
    
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
                        {user && user.user === "User not approved!" &&
                            <div className='shadow-sm m-2'>
                                <h5>{user.user}</h5>
                                <p className='m-0'>Please wait for your account to be approved</p>
                                <p>Contact an admin if this was a mistake</p>                             
                            </div>
                            }
                        {loading ? (
                            <div>
                                <CompInfoSkeleton/>
                            </div>

                        ) : (
                            <div className='grid m-3'>
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
                                <div className=' row m-2'>
                                    <p> you have a schedule</p>
                                </div>                              
                            }
                            {user && user.user_type === 4 && ent_close > current_time &&
                                <div className=' row m-2'>
                                    <button onClick={() => setConfigopen(true)} className='btn btn-primary'>Configure Competition</button>
                                    <Modal
                                        open={configopen}
                                        onClose={() => setConfigopen(false)}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={compmodalstyle}>
                                            <button onClick={() => setConfigopen(false)} type="button" className="close-button btn-close" aria-label="Close"></button>
                                            <ConfigCompForm token={token} comp={comp} />
                                        </Box>
                                    </Modal> 
                                    
                                </div>
                            
                            }
                            {((user && user.user_type === 4 && ent_open < current_time)||(user && user.user_type === 5 && ent_open < current_time)) ? (
                                <div className=' row m-2'>
                                <button onClick={() => setEntviewopen(true)} className='btn btn-primary'>View Entries</button>
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
                            ):null}
                            {user && user.user_type === 0 && ent_open < current_time && ent_close > current_time &&
                            <>
                            <div className=' row m-2'>
                                <button onClick={() => setEnteropen(true)} className='btn btn-primary'>Enter Competition</button>
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
                            {user && user.user_type === 2 &&
                            <div className=' row m-2'>
                                <button onClick={() => setEnteropen(true)} className='btn btn-primary'>Enter For {child.first_name.charAt(0).toUpperCase() + child.first_name.slice(1)} {child.last_name.charAt(0).toUpperCase() + child.last_name.slice(1)}</button>
                                <Modal
                                    open={enteropen}
                                    onClose={() => setEnteropen(false)}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={compmodalstyle}>
                                        <button onClick={() => setEnteropen(false)} type="button" className="close-button btn-close" aria-label="Close"></button>
                                        <EntryForm user={user.user_type === 2 ? child:user} token={token} comp={comp}/>
                                    </Box>
                                </Modal> 
                            
                            </div>
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
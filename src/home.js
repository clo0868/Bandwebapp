import React,{useEffect,useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CompForm from './components/CompForm'
import EntriesDisplay from './components/EntriesDisplay.js'
import EntryForm from './components/EntryForm.js'
import HomeSkeletonCard from './components/HomeSkeletonCard';
import {Link} from "react-router-dom";

import axios from 'axios';

const Home = () => {
    const token = sessionStorage.TOKEN
    const [data,setData]= useState([])
    const [user, setUser] = useState()
    const [compopen, setCompopen] = useState(false);
    const [entviewopen, setEntviewopen] = useState(false);
    const [enteropen, setEnteropen] = useState(false);
    const [loading, setLoading] = useState(true);
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
        axios({
            method: 'POST',
            url: './user',
            headers: {
                Authorization: `Bearer ${token}`,
              },
          }).then(res => {
            setUser(res.data)
          }).catch(e => {
          })
        axios({
            method: 'POST',
            url: './comp_data',
            headers: {
                Authorization: `Bearer ${token}`,
              },
          }).then(res => {
            setData(res.data)
            setLoading(false)
          }).catch(e => {
            e = new Error();
          })
    },[])
    return (
        <>
            <div className='container-fluid'>
                <div className='grid'>
                    <div className='row'>
                        <div className='col-2 shadow-sm min-vh-100'> 
                        </div>
                        <div className='col-8 text-center '> 
                            {user && user.user_type === 1 && 
                            <div className='shadow-sm p-3 mt-1'>
                                <Button onClick={() => setCompopen(true)} variant='contained'>Create New Competition</Button>
                                <Modal
                                    open={compopen}
                                    onClose={() => setCompopen(false)}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={compmodalstyle}>
                                        <div className='text-center mb-3'>New Competition</div>
                                        <CompForm/>  
                                    </Box>
                                </Modal>
                            </div>
                            }
                            <div className='grid'>
                                <h4 className='mt-2'>
                                    Competition Calender:
                                </h4>
                                {loading ? (
                                    <HomeSkeletonCard num={5} />
                                ):(
                                    <div>
                                    {data.map((comp,index) => {
                                    const comp_start_time = new Date(comp.comp_start_time)
                                    const ent_open = new Date(comp.ent_open_time).getTime()
                                    const ent_close = new Date(comp.ent_close_time).getTime()
                                    const current_date = new Date().getTime()
                                    return(
                                        <div key={index} className='row m-2 mt-3'>
                                            <div className='card p-2 shadow-sm '>
                                                <div className='grid '>
                                                    <div className='row'>
                                                        <div className='col text-start'>
                                                            <h5>{comp.comp_name}</h5>
                                                            <p>{comp.comp_location}</p>
                                                        </div>
                                                        <div className='col text-end'>
                                                            <h5>{comp_start_time.toDateString()}</h5>
                                                            <p>{comp_start_time.toLocaleTimeString()}</p>
                                                        </div>
                                                    </div> 
                                                    <div className='row'>
                                                        <div className='col text-start'>
                                                        {user && user.user_type === 0 && current_date > ent_open &&
                                                        <>
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
                                                        </>                                             
                                                        } 
                                                            
                                                        </div>
                                                        <div className='col text-center'>
                                                            <Link className='text-decoration-none text-white' to="/competition" state={{comp:comp}} ><Button variant='contained'>More Info</Button></Link>
                                                        
                                                        </div>
                                                        <div className='col text-end'>
                                                            {user && user.user_type === 0 && ent_open < current_date && ent_close > current_date &&
                                                            <>
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
                                                            </>                                             
                                                            } 
                                                        </div>
                                                    </div>                                               
                                                </div>
                                            </div>                                        
                                        </div>
                                    )
                                    })}
                                </div>
                                    
                                )}
                                
                            </div>
                            
                        </div>
                        <div className='col-2 shadow-sm min-vh-100'> 
                            
                        </div>
                    </div>
                </div>
            </div>        
        </>
        
    );
}

export default Home;

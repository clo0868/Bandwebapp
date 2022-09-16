import React, {useState,useEffect} from 'react';
import {useLocation,useNavigate} from "react-router-dom";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axios from'axios';
import EntryForm from './components/EntryForm.js'
import CompInfoSkeleton from './components/CompInfoSkeleton.js';
import ConfigCompForm from './components/ConfigCompForm.js';
import EntriesDisplay from './components/EntriesDisplay.js';
import EntriesByUserDisplay from './components/EntriesByUserDisplay.js';
import {Link} from "react-router-dom";
import DeleteComp from './components/DeleteComp.js';


const Competition = (props) => {
    const token = sessionStorage.TOKEN
    const { search } = useLocation();
    const get_array = new URLSearchParams(search)
    const compID = get_array.get('compID')
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState();
    const [enteropen, setEnteropen] = useState(false);
    const [configopen, setConfigopen] = useState(false);
    const [entviewopen, setEntviewopen] = useState(false);
    const [entuserviewopen, setEntuserviewopen] = useState(false);
    const [children, setChildren] = useState({});
    const [comp, setComp] = useState({});

    let navigate = useNavigate();

    const compmodalstyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '1px solid #000',
        boxShadow: 24,
        p: 4,
      };

    useEffect(() => {
        setLoading(true)
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/comp_data',
            headers: {
                Authorization: `Bearer ${token}`,
              },
              data: { 
                compID,
              },
          }).then(res => {
            setComp(res.data[0])
            setLoading(false)
          }).catch(e => {
            e = new Error();
          })
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/user',
            headers: {
                Authorization: `Bearer ${token}`,
              },
          }).then(res => {
            setUser(res.data.user)
            if (res.data.children) {
                setChildren(res.data.children)
            }
            
          }).catch(e => {
            if(e.response.data && e.response.data.error === 'User not approved!'){
                setUser({user:e.response.data.error})
                console.log('Your Account has not been approved yet');
            }else{
                e = new Error();
            }
          })
    },[])
    
    
    const comp_start = new Date(comp.comp_start_time)
    //const comp_start_time = comp_start.getTime()
    const ent_open = new Date(comp.ent_open_time).getTime()
    const ent_close = new Date(comp.ent_close_time).getTime()
    const current_time = new Date().getTime()
    function shortenTime(time){
        if (time.length === 10) {return time.slice(0,4)+time.slice(7)}
        if (time.length === 11) {return time.slice(0,5)+time.slice(8)} 
    }
    

    
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
                            <>
                            {/* this is a jsx comment */}
                            {/* */}
                            <div className='grid m-3'>
                                <div className='row mb-2'>
                                    <div className='col text-start d-flex align-items-center'>
                                        <button onClick={() => navigate(-1)} className='btn'><i className="fas fa-arrow-left"></i></button>
                                        <h4 className='ps-2'>{comp.comp_name}</h4>
                                    </div>
                                    <div className='col d-flex align-items-center'>
                                        <h5 className='ms-auto'>{comp.comp_location}</h5>                                        
                                    </div>
                                </div>
                                <div className='row pb-3 border-bottom border-3'>
                                    <div className='col text-start'>                                        
                                        <p>{shortenTime(new Date(comp_start).toLocaleTimeString())}</p>
                                        <p className='mt-1'>Entries Open: {shortenTime(new Date(comp.ent_open_time).toLocaleTimeString())} {new Date(comp.ent_open_time).toDateString()} </p>
                                    </div>
                                    <div className='col text-end'>
                                        <p>{comp_start.toDateString()}</p>
                                        
                                        <p className='mt-1'>Entries Close: {shortenTime(new Date(comp.ent_close_time).toLocaleTimeString())} {new Date(comp.ent_close_time).toDateString()} </p>
                                    </div>
                                </div> 

                            </div>
                            

                            <div className='grid m-3  '>                    
                            {((user && user.user_type === 4 && ent_open < current_time)||(user && user.user_type === 5 && ent_open < current_time)) ? (
                                <>
                                
                                <div className=' row m-2 d-flex justify-content-center'>
                                <button onClick={() => setEntviewopen(true)} className='comppagebtn btn btn-primary'>View Entries</button>
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
                                {user.user_type === 4 &&
                                <div className=' row m-2 d-flex justify-content-center'>
                                <button onClick={() => setEntuserviewopen(true)} className='comppagebtn btn btn-primary'>View Entries By User</button>
                                <Modal
                                    open={entuserviewopen}
                                    onClose={() => setEntuserviewopen(false)}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={compmodalstyle}>
                                        <button onClick={() => setEntuserviewopen(false)} type="button" className="close-button btn-close" aria-label="Close"></button>
                                        <EntriesByUserDisplay token={token} comp={comp}/>
                                    </Box>

                                </Modal>     
                                </div>
                                
                                }
                                
                                </> 
                            ):null}
                            {user && user.user_type === 4 && ent_open < current_time &&
                                <div className=' row m-2 d-flex justify-content-center'>
                                    <button onClick={() => setConfigopen(true)} className='comppagebtn btn btn-primary'>Configure Competition</button>
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

                            {user && user.user_type === 0 && ent_open < current_time && ent_close > current_time &&
                            <>
                            <div className=' row m-2 d-flex justify-content-center'>
                                <button onClick={() => setEnteropen(true)} className='comppagebtn btn btn-primary'>Enter Competition</button>
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
                            {user && user.user_type === 2 && ent_open < current_time && ent_close > current_time &&
                            <div className=' row m-2 d-flex justify-content-center'>
                                <button onClick={() => setEnteropen(true)} className='comppagebtn btn btn-primary'>Enter Competition</button>
                                <Modal
                                    open={enteropen}
                                    onClose={() => setEnteropen(false)}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={compmodalstyle}>
                                        <button onClick={() => setEnteropen(false)} type="button" className="close-button btn-close" aria-label="Close"></button>
                                        <EntryForm user={user.user_type === 2 ? children:user} token={token} comp={comp}/>
                                    </Box>
                                </Modal> 
                            
                            </div>
                            }
                            {user && user.user_type === 4 && ent_open < current_time &&
                            
                                <div className='row m-2 d-flex justify-content-center'>
                                    <button className='comppagebtn btn btn-primary'><Link className=' text-decoration-none text-white' state={{compID:compID}} to='/scheduler'>Go to Scheduler</Link></button>
                                </div>
                            }
                            {user && (user.user_type === 1 || user.user_type === 4) &&
                                <div className='row m-2 d-flex justify-content-center'>
                                    <DeleteComp comp={comp} />
                                </div>
                            }
                        </div>
                        </>
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

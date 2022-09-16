import React,{useEffect,useState} from 'react';
import {useNavigate} from "react-router-dom";

import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CompForm from './components/CompForm'
import EntriesDisplay from './components/EntriesDisplay.js'
import EntryForm from './components/EntryForm.js'
import HomeSkeletonCard from './components/HomeSkeletonCard';
import {Link,useLocation} from "react-router-dom";

import axios from 'axios';

const Home = (props) => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const query = new URLSearchParams(search)
    const token = sessionStorage.TOKEN
    const [data,setData]= useState([])
    const [user, setUser] = useState()
    const [compopen, setCompopen] = useState(false);
    const [entviewopen, setEntviewopen] = useState(false);
    const [enteropen, setEnteropen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [children, setChildren] = useState();
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
            url: 'https://pipe-band-server.herokuapp.com/user',
            headers: {
                Authorization: `Bearer ${token}`,
              },
          }).then(res => {
            setUser(res.data.user)
            if (res.data.user.user_type === 2 && res.data.children.length === 0) {
                navigate('/addchildren')
            }
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
          
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/all_comp_data',
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
    function DisplayComps(props){
        var data = props.data
        const query = props.query
        if (query) {
             data = data.filter((comp) =>  { return comp.comp_name.toLowerCase().match(query.toLowerCase()) !== null || comp.comp_location.toLowerCase().match(query.toLowerCase()) !== null } )            
        }
        function shortenTime(time){
            if (time.length === 10) {return time.slice(0,4)+time.slice(7)}
            if (time.length === 11) {return time.slice(0,5)+time.slice(8)} 
        }
        
        return(
            <>
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
                                        <p>{shortenTime(comp_start_time.toLocaleTimeString())}</p>
                                    </div>
                                </div> 
                                <div className='row mt-3'>
                                    <div className='col text-start'>
                                    {user && (user.user_type === 4 || user.user_type === 5) && current_date > ent_open &&
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
                                        <Link className='text-decoration-none text-white' to={"/competition?compID="+comp.compID}><Button variant='contained'>More Info</Button></Link>
                                    
                                    </div>
                                    <div className='col text-end'>
                                        {user && user.user_type === 0 && ent_open < current_date && ent_close > current_date &&
                                        <div>
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
                                        } 
                                        {user && user.user_type === 2 && children && ent_open < current_date && ent_close > current_date &&
                                        <div>
                                        <Button onClick={() => setEnteropen(true)} variant='contained'>Enter Competition</Button>
                                        <Modal
                                            open={enteropen}
                                            onClose={() => setEnteropen(false)}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                        >
                                            <Box sx={compmodalstyle}>
                                                <button onClick={() => setEnteropen(false)} type="button" className="close-button btn-close" aria-label="Close"></button>
                                                <EntryForm user={children ? children:user}  token={token} comp={comp}/>
                                            </Box>
                                        </Modal>     
                                        </div>                                             
                                        } 
                                        {user && user.user_type === 5 && comp_start_time < current_date &&
                                        <div>
                                            <Link className='text-decoration-none text-white' to={"/judge?compID="+comp.compID}><Button variant='contained'>Judge</Button></Link>
                                        </div>
                                        }
                                    </div>
                                </div>                                               
                            </div>
                        </div>                                        
                    </div>
                )
                })}
                <div className='mt-2'>
                    <p className='text-muted'>End of Competitions</p>
                </div>
            </div>
                
            )}
            
            </>

        )
    }

    return (
        <>
            <div className='container-fluid'>
                <div className='grid'>
                    <div className='row'>
                        <div className='col-2 shadow-sm min-vh-100'> 
                        </div>
                        <div className='col-8 text-center '> 
                            {user && user.user === "User not approved!" &&
                            <div className='shadow-sm m-2'>
                                <h5>{user.user}</h5>
                                <p className='m-0'>Please wait for your account to be approved</p>
                                <p>Contact an admin if this was a mistake</p>                             
                            </div>
                            }
                            {user && user.user !== "User not approved!" && user.user_type === 4 && 
                            <div className='shadow-sm p-3 mt-1'>
                                <Button onClick={() => setCompopen(true)} variant='contained'>Create New Competition</Button>
                                <Modal
                                    open={compopen}
                                    onClose={() => setCompopen(false)}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={compmodalstyle}>
                                    <button onClick={() => setCompopen(false)} type="button" className="close-button btn-close" aria-label="Close"></button>

                                        <div className='text-center mb-3'>New Competition</div>
                                        <CompForm  />  
                                    </Box>
                                </Modal>
                            </div>
                            }
                            <div className='grid'>
                                <h4 className='mt-2'>
                                    Competition Calender:
                                </h4>
                                <DisplayComps data={data} query={query.get('query')} />                                
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

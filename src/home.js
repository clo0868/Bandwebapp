import React,{useEffect,useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CompForm from './components/CompForm'

import axios from 'axios';

const Home = () => {
    const token = sessionStorage.TOKEN
    const [data,setData]= useState("")
    const [user, setUser] = useState()
    const [compopen, setCompopen] = React.useState(false);
    const handleCompOpen = () => setCompopen(true);
    const handleCompClose = () => setCompopen(false);

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
                                <Button onClick={handleCompOpen} variant='contained'>Create New Competition</Button>
                                <Modal
                                    open={compopen}
                                    onClose={handleCompClose}
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
                            {data}
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

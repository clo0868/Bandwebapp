import React,{useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axios from 'axios';
import {useNavigate} from "react-router-dom";


const DeleteComp = (props) => {
    //delete comp modal 
    const token = sessionStorage.TOKEN
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

    const navigate = useNavigate();
    const comp = props.comp
    const [deleteCompOpen, setDeleteCompOpen] = useState(false);

    function deleteComp(compID){
        //once the user confirms delete the competition 
        axios({
            method: 'POST',
            url: 'https://pipe-band-server.herokuapp.com/delete_comp',
            headers: {
                Authorization: `Bearer ${token}`,
              },
              data: { 
                compID,
              },
          }).then(res => {
            navigate('/')
          }).catch(e => {
            e = new Error();
          })
    }

    //just a confirm modal so users dont accidentally delete competitions 
    return (
        <>
            <button className='comppagebtn btn btn-primary' onClick={() => {setDeleteCompOpen(true)}}>Delete Competiton</button>
            <Modal
                open={deleteCompOpen}
                onClose={() => setDeleteCompOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={compmodalstyle}>
                    <button onClick={() => setDeleteCompOpen(false)} type="button" className="close-button btn-close" aria-label="Close"></button>
                    <div className='text-center p-4'>
                        <div className='modal-header d-flex flex-column'>
                            <i sx="color:red" className="far fa-times-circle text-danger fa-7x"></i>
                            <h5 className='mt-3'>Are You Sure?</h5>
                        </div>
                        <div className='modal-body'>
                            <p>Do you really want to delete this competition?</p>
                            <p>This cannot be undone.</p>
                        </div>
                        <div className='modal-footer d-flex flex-row justify-content-center'>
                            <button onClick={() => {setDeleteCompOpen(false)}} className='me-2 btn btn-primary'>Cancel</button>
                            <button onClick={() => {deleteComp(comp.compID)}} className='ms-2 btn btn-danger'>Delete</button>

                        </div>
                        
                    </div>
                </Box>
            </Modal>     
        </>
    );
}

export default DeleteComp;

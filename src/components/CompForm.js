import React,{useState,useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import axios from 'axios';
const steps = ['Competition Details','Competition Entries', 'Create Competition Events'];

const CompForm = () => {
  const token = sessionStorage.TOKEN
  const [eventGrade, setEventGrade] = useState({});

  useEffect(() => {
    axios({
        method: 'POST',
        url: './event_grade_name',
        headers: {
            Authorization: `Bearer ${token}`,
          },
      }).then(res => {
        setEventGrade(res.data)
      }).catch(e => {
        e = new Error();
      })
},[])


    const [compDateValue, setCompDateValue] = useState(new Date());
    const [compname,setCompname] = useState("");
    const [complocation, setComplocation] = useState("");
    const [activeStep, setActiveStep] = useState(0);
    const [entStartDateValue, setEntStartDateValue] = useState(new Date());
    const [entEndDateValue, setEntEndDateValue] = useState(new Date());
    const [eventfields, setEventfields] = useState([{event:'',grade:''}]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <div className='mt-3'>
            <div className='d-flex'>
              <div className=' text-start'>
                <h5>{compname}</h5>
                <p>{complocation}</p>              
              </div>
              <div className='ms-auto text-end'>
                <h5>{compDateValue.toDateString()}</h5>
                <p>{compDateValue.toLocaleTimeString()}</p>
              </div>
            </div>
            <div className='d-flex'>
              <p>Entries open: </p>
              <p className='ms-auto'>{entStartDateValue.toDateString()} {entStartDateValue.toLocaleTimeString()}</p>
            </div>
            <div className='d-flex'>
              <p>Entries close: </p>
              <p className='ms-auto'>{entEndDateValue.toDateString()} {entEndDateValue.toLocaleTimeString()}</p>
            </div>
            <div className='compevent'>
              <h5>Events:</h5>
              {eventfields.map((event,index) => {
                return <p key={index}>Event {index+1}: {eventGrade.grades[event.grade].grade_name} grade {eventGrade.events[event.event].event_name}</p>
              })}

            </div>
          </div>
          
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div>
            {activeStep === 0 &&
                <div className='mt-3'>
                    <TextField 
                      required
                      className='mt-3' 
                      fullWidth 
                      id="standard-basic" 
                      label="Competition Name:" 
                      variant="standard" 
                      value={compname}
                      onChange={(event) => {
                      setCompname(event.target.value);
                      }}
                      />
                    <div className='mt-5' >
                      <LocalizationProvider  dateAdapter={AdapterDateFns}>
                          <DateTimePicker
                              required
                              fullWidth
                              renderInput={(props) => <TextField {...props} />}
                              label="Competition Start Time"
                              value={compDateValue}
                              onChange={(newCompDateValue) => {
                              setCompDateValue(newCompDateValue);
                              }}
                          />
                      </LocalizationProvider>
                    </div>
                    <TextField 
                      required
                      className='mt-3' 
                      fullWidth 
                      id="standard-basic" 
                      label="Competition Location:" 
                      variant="standard" 
                      value={complocation}
                      onChange={(event) => {
                      setComplocation(event.target.value);
                      }}
                      />
                </div>              
            }
            {activeStep === 1 &&
                <div className='mt-3'>
                  <div className='mb-4'>
                    <LocalizationProvider  dateAdapter={AdapterDateFns}>
                          <DateTimePicker
                              required
                              fullWidth
                              renderInput={(props) => <TextField {...props} />}
                              label="Entries Open"
                              value={entStartDateValue}
                              onChange={(newEntStartDateValue) => {
                              setEntStartDateValue(newEntStartDateValue);
                              }}
                              maxDateTime={entEndDateValue}
                          />
                      </LocalizationProvider>
                    </div>
                    <div>
                      <LocalizationProvider  dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                          fullWidth
                          required
                          renderInput={(props) => <TextField {...props} />}
                          label="Entries Close"
                          value={entEndDateValue}
                          onChange={(newEntEndDateValue) => {
                          setEntEndDateValue(newEntEndDateValue);
                          }}
                          maxDateTime={compDateValue}
                      />
                  </LocalizationProvider>  
                  </div>                
                </div>            
            }
            {activeStep === 2 &&
            <div>
              <div className='mt-3 compevent'>
                {eventfields.map((field,index) => {
                  return(
                    <div key={"nonce"+index} className='d-flex align-items-center'>
                      <h5>Event {index+1}:</h5>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
                        <InputLabel id="demo-simple-select-label">Grade</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={field.grade}
                          label="Age"
                          autoWidth
                          onChange={(event) => {setEventfields(values => values.map((value,i) => { return i === index ? {...value, grade:event.target.value}:value}));}}
                        >
                          {eventGrade.grades.map((grade,index) => {
                            return <MenuItem key={index} value={index}>{grade.grade_name}</MenuItem>
                          })}
                        </Select>
                      </FormControl>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
                        <InputLabel id="demo-simple-select-label">Event</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={field.event}
                          label="Age"
                          autoWidth
                          onChange={(event) => {setEventfields(values => values.map((value,i) => { return i === index ? {...value, event:event.target.value}:value}));}}
                        >
                          {eventGrade.events.map((event,index) => {
                            return <MenuItem key={index} value={index}>{event.event_name}</MenuItem>
                          })}
                        </Select>
                      </FormControl>
                      <Button onClick={() => {setEventfields((values) => values.filter((_, index) => index !== 0))}} className='ms-auto mt-1 me-2' size='small'variant="contained">X</Button>

                    </div>
                  );
                })}
              </div>  
              <Button className='mt-3' variant="contained" onClick={() => {setEventfields(prevEventfields => [...prevEventfields, {event:'',grade:''}])}}>+</Button>
            </div>
            }

          </div>
          <Box className='mt-2' sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext}>
              Next
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

export default CompForm;

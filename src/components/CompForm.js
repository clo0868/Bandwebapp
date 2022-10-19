import React,{useState,useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import axios from 'axios';
const steps = ['Competition Details','Competition Entries', 'Create Competition Events'];

const CompForm = (props) => {
  const old_comp = props.comp
  const token = sessionStorage.TOKEN
  const [eventGrade, setEventGrade] = useState({});

  useEffect(() => {
    //getting event and grades data 
    axios({
        method: 'POST',
        url: 'https://pipe-band-server.herokuapp.com/event_grade_name',
        headers: {
            Authorization: `Bearer ${token}`,
          },
      }).then(res => {
        setEventGrade(res.data)
      }).catch(e => {
        e = new Error();
      })
},[])


    const [compDateValue, setCompDateValue] = useState(old_comp ? new Date(old_comp.comp_start_time) : new Date());
    const [compname,setCompname] = useState(old_comp ? old_comp.comp_name : '');
    const [complocation, setComplocation] = useState(old_comp ? old_comp.comp_location : '');
    const [activeStep, setActiveStep] = useState(0);
    const [entStartDateValue, setEntStartDateValue] = useState(old_comp ? new Date(old_comp.ent_open_time) : new Date());
    const [entEndDateValue, setEntEndDateValue] = useState(old_comp ? new Date(old_comp.ent_close_time) : new Date());
    const [eventfields, setEventfields] = useState(old_comp ? JSON.parse(old_comp.comp_events) : [{event:'',grade:''}]);
    const [btnLoader, setBtnLoader] = useState(0);

  const handleNext = () => {
    //set next step
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    console.log(activeStep);
  };

  const handleBack = () => {
    //check if loader needs reseting but just going back a step 
    if (activeStep === 4 ) {
      setActiveStep((prevActiveStep) => prevActiveStep - 2);
      setBtnLoader(0)
    }else{
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
    
  };

  const handleReset = () => {  
    //resets data back to original by updating DB entry to old data 
    const compID = old_comp.compID  
    const form_data = [old_comp.comp_name,old_comp.comp_start_time,old_comp.comp_location,old_comp.ent_open_time,old_comp.ent_close_time,old_comp.comp_events,compID]
    axios({
      method: 'POST',
      url: 'https://pipe-band-server.herokuapp.com/update_comp',
      headers: {
          Authorization: `Bearer ${token}`,
        },
      data: { 
        form_data
      },
    }).then(res => {
      console.log(res.data);
    setCompDateValue(new Date(old_comp.comp_start_time))
    setComplocation(old_comp.comp_location)
    setCompname(old_comp.comp_name)
    setEntStartDateValue(new Date(old_comp.ent_open_time))
    setEntEndDateValue(new Date(old_comp.ent_close_time))
    setEventfields(JSON.parse(old_comp.comp_events))
    setBtnLoader(0)
    setActiveStep(0);
    }).catch(e => {
      e = new Error();
    })
  };
  const handleSubmit = () => {
    //creates competition : gets data from state 
    setBtnLoader(1)
    
    if (old_comp) {
      const compID = old_comp.compID
      const form_data = [compname,compDateValue,complocation,entStartDateValue,entEndDateValue,eventfields,compID]
      //if old comp exists send data to update api 
      axios({
        method: 'POST',
        url: 'https://pipe-band-server.herokuapp.com/update_comp',
        headers: {
            Authorization: `Bearer ${token}`,
          },
        data: { 
          form_data
        },
      }).then(res => {
        setBtnLoader(2)
        setActiveStep(4)
      }).catch(e => {
        e = new Error();
      })
      
    }else{
      const form_data = [compname,compDateValue,complocation,entStartDateValue,entEndDateValue,eventfields]
      //if no old comp exists send data to create new comp api 
      axios({
        method: 'POST',
        url: 'https://pipe-band-server.herokuapp.com/create_comp',
        headers: {
            Authorization: `Bearer ${token}`,
          },
        data: { 
          form_data
        },
      }).then(res => {
        setBtnLoader(2)
        setActiveStep(4)
      }).catch(e => {
        e = new Error();
      })

    }
    
  };
  return (
    <Box sx={{ width: '100%' }}>
      
      
      {
      //confirmation and completion steps of the form 
      (activeStep === steps.length||activeStep === steps.length + 1) && 
      <>
        <Stepper activeStep={activeStep}>
        {
        //MUI stepper 
        steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
        <React.Fragment>
          <div className='mt-3 text-center'>
          {
          //display message on api result 
          activeStep === 4 &&
                <h5 className='mb-2'>{old_comp ? 'Competition Updated Succesfully' : 'Competition Created Succesfully'} </h5>
              }
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
              {eventGrade && eventfields.map((event,index) => {

                //check if all event fields were filled out properly 
                if(event.grade === ''||event.event === ''){
                  return <p>Empty field please go back</p>
                }
                //display list of events selected 
                return <p key={index}>Event {index+1}: {eventGrade.grades[event.grade-1].grade_name} grade {eventGrade.events[event.event-1].event_name}</p>
              })}

            </div>
          </div>
          
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <button
              className='btn-border-none'
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </button>
            <Box sx={{ flex: '1 1 auto' }} />
            {old_comp  && activeStep === 4 &&
            <button className='btn-border-none' onClick={() => {setActiveStep(5)}}>Reset</button>
            }
            {btnLoader !== 1 ? (
              <button onClick={() => {handleSubmit()}} disabled={btnLoader === 2} className='btn-border-none'>{btnLoader === 0 ? (old_comp ? 'Update' : 'Create') : <i className="fas fa-check"></i> }</button>
            ):(                        
              <button className='btn btn-outline-primary'><div className='loader-sm'></div></button>
            )}

          </Box>
        </React.Fragment>
      </>
      }
             
      {activeStep < steps.length && 
      <>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <React.Fragment>
          <div>
            {
            //form section for name location and start time 
            activeStep === 0 &&
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
            {
            //form section for entry timespan 
            activeStep === 1 &&
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
            {
            //form section for selecting events 
            activeStep === 2 &&
              <div>
                <div className='mt-3 compevent'>
                  {eventfields.map((field,index) => {
                    //mapping out all events 
                    //initially this value is an emtpy event and grade 
                    //two selects are used to select what grade and event each event will be 
                    //buttons are to either add another event field or to remove an event 
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
                            onChange={(event) => {
                              //set current events grade value to the selected value
                              setEventfields(values => values.map((value,i) => { return i === index ? {...value, grade:event.target.value}:value}));
                            }}
                          >
                            {eventGrade.grades.map((grade,index) => {
                              return <MenuItem key={index} value={index+1}>{grade.grade_name}</MenuItem>
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
                            onChange={(event) => {
                              //set current events event value to the selected value
                              setEventfields(values => values.map((value,i) => { return i === index ? {...value, event:event.target.value}:value}));
                            }}
                          >
                            {eventGrade.events.map((event,index) => {
                              return <MenuItem key={index} value={index+1}>{event.event_name}</MenuItem>
                            })}
                          </Select>
                        </FormControl>
                        <button onClick={() => {
                          //remove current event from the array 
                          setEventfields((values) => values.filter((_, i) => i !== index))
                          }} 
                          className=' btn-border-none ms-auto me-2' 
                          size='small'
                          >X</button>

                      </div>
                    );
                  })}
                </div>  
                <button className='mt-3 btn-border-none' onClick={() => {setEventfields(prevEventfields => [...prevEventfields, {event:'',grade:''}])}}>+</button>
              </div>
            }
            

          </div>
          {/* back and next buttons to navigate through steps */}
          <Box className='mt-2' sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <button
              className='btn-border-none'
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </button>
            <Box sx={{ flex: '1 1 auto' }} />
            <button className='btn-border-none'
            disabled={(activeStep === 0 && (compname === '' || complocation === ''))||(activeStep === 2 && eventfields.some((v) => {return(v.event === '' || v.grade === '')}))||(activeStep === 1 && entStartDateValue >= entEndDateValue)} 
            onClick={handleNext}>
              Next
            </button>
          </Box>
        </React.Fragment>
      </>
        
      }
      {
      //confirm reset step
      activeStep === steps.length + 2 &&
      <React.Fragment>
            <div className='m-5 p-5'>
                <h5>Are You Sure You Want to Revert These Changes?</h5>

                <div className='d-flex flex-row justify-content-evenly mt-5'>
                  <button onClick={() => {setActiveStep(4)}} className='btn btn-danger'>Back</button>
                  <button onClick={() => {handleReset()}} className='btn btn-primary'>Confirm</button>
                </div>

                
            </div>
            
      </React.Fragment>
      }
    </Box>
  );
}

export default CompForm;

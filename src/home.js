import React,{useEffect,useState} from 'react';
import axios from 'axios';

const Home = () => {
    const token = sessionStorage.TOKEN
    const [data,setData]= useState("")
    useEffect(() => {
        axios({
            method: 'POST',
            url: './data',
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
        <div>
            lol
            {data}
        </div>
    );
}

export default Home;

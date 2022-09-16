import React from 'react';
import {useLocation} from "react-router-dom";


const Judge = () => {


    const { search } = useLocation();
    const get_array = new URLSearchParams(search)
    const compID = get_array.get('compID')

    return (
        <div>
            {compID}
        </div>
    );
}

export default Judge;

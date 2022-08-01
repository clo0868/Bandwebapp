import React from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const CompInfoSkeleton = () => {
    return (
        <div className='container-fluid border-bottom border-3'>
            <div className='grid m-3'>
                <div className='row'>
                    <div className='col-6 text-start'>
                        <Skeleton  inline={true} height={25} width={240}/>
                    </div>
                    <div className='col-6 text-end'>
                        <Skeleton  inline={true} height={25} width={150}/>
                    </div>
                </div>  
                <div className='row mt-1'>
                    <div className='col-6 text-start'>
                        <Skeleton  inline={true} height={15} width={300}/>
                    </div>
                    <div className='col-6 text-end'>
                        <Skeleton  inline={true} height={15} width={250}/>
                    </div>
                </div> 
            </div>
        </div>
    );
}

export default CompInfoSkeleton;

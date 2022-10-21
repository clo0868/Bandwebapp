import React from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
const HomeSkeletonCard = (props) => {
    var n = props.num
    const keys = [...Array(n).keys()];

    //generic card skeletons for home page card 
    //takes in a number of variable 
    return (
      <div>
        {keys.map((i) => (
          <div key={i} className='mt-3 skel-card card grid p-3'>
            <div className='row'>
                <div className='col-6 text-start'>
                    <Skeleton  inline={true} height={25} width={200}/>
                </div>
                <div className='col-6 text-end'>
                    <Skeleton  inline={true} height={25} width={150}/>
                </div>
            </div>  
            <div className='row'>
                <div className='col-6 text-start'>
                    <Skeleton  inline={true} height={15} width={300}/>
                </div>
                <div className='col-6 text-end'>
                    <Skeleton  inline={true} height={15} width={250}/>
                </div>
            </div> 
            <div className='row mt-3'>
                <div className='col-4 text-start'>
                    <Skeleton  inline={true} height={25} width={120}/>
                </div>
                <div className='col-4 text-middle'>
                    <Skeleton  inline={true} height={25} width={120}/>
                </div>
                <div className='col-4 text-end'>
                    <Skeleton  inline={true} height={25} width={120}/>
                </div>
            </div>                                                              
        </div>
        ))}
      </div>
    );
}

export default HomeSkeletonCard;

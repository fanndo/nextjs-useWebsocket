import React, { useRef, useState } from 'react'
import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
import { Typography } from '@mui/material';

Chart.register(ArcElement);

const styles = {
  total:{
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    width:  '50%',
    height: '50%',
  }
}




const Graphics = () => {

  const Data = [
    {
      id: 1,
      year: 2016,
      userGain: 70.6,
      userLost: 823
    },
    {
      id: 2,
      year: 2017,
      userGain: 29.4,
      userLost: 234
    }
  ];
  

  const doughnutChartRef = useRef();
  const [chartData] = useState({
    datasets: [
      {
        labels: Data.map((data) => data.year),
        data: Data.map((data) => data.userGain),
        backgroundColor: ['#9696FF','#5B5C8C' ],
        borderWidth: 0
      }
    ]
  });

  return (
    <div style={{   
      position: 'relative',
      margin: 'auto',
      maxWidth: '243px',
      }} >
      <Doughnut 
        data={chartData}
        ref={doughnutChartRef}
      />
       <div style={ styles.total }>
          <div style={{ display:'flex', justifyContent:'center', padding:'.5rem' }}>
            <Typography variant="h2" component="span"
                fontWeight={400}
                fontSize={10}
              >
                Total Operado
              </Typography>

          </div>
        

       </div>
    </div>
  )
}

export default Graphics
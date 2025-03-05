import React, { useEffect, useState } from 'react'
import ApiIcon from '@mui/icons-material/Api';
import PageTitle from '../../Components/PageTitle';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useLocation, useNavigate } from 'react-router-dom';


const ApiDashboard = () => {

  const navigate = useNavigate();
  const location = useLocation(); 
  const titleIcon = <ApiIcon />
 
  
  return (
    <div>
      {/* <PageTitle titleText={'APIs'} titleIcon={titleIcon}/> */}
      
      
    </div>
  )
}

export default ApiDashboard;
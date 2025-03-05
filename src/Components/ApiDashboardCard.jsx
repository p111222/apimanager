import React, { useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Rating } from "@mui/material"; // ✅ Import MUI Rating

const ApiDashboardCard = () => {


    return (
        <div>
            <Card
                sx={{
                    maxWidth: 240,
                    borderRadius: "0.5rem",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",

                }}
            >

                <CardContent sx={{ padding: 0 }}>
                    <div className='h-[320px]'>
                        <div className='h-[150px] w-full bg-gradient-to-r from-[#1D059C] to-[#2D0034]  flex items-center justify-center'>
                            <p className="text-white font-normal text-7xl shadow-2xl">Pi</p>
                        </div>
                        <div>
                            <div>
                                <p className=' flex mt-3 ms-3 text-xl font-extralight'>PizzaShackAPI</p>
                                <p className='flex mt-0 ms-3 text-xs text-gray-500 '>By:Jane Roe</p>
                            </div>
                            <div className='flex justify-between ms-3 me-3 mt-1'>
                                <div className=''>
                                    <p className='flex justify-start font-extralight'>1.0.0</p>
                                    <p className='flex justify-start text-xs text-gray-500 mt-1'>Version</p>
                                </div>

                                <div className='flex flex-col justify-start'>
                                    <p className='flex justify-start font-extralight'>/pizzashack</p>
                                    <p className='flex justify-start text-xs text-gray-500 mt-1'>Context</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-start ms-3 mt-7">
                            <Rating value={4.5} precision={0.5} readOnly />
                            <p className='flex justify-start text-xs text-gray-500 mt-1'>4.5/5.0 (1users)</p>
                        </div>
                    </div>

                </CardContent>

            </Card>

        </div>
    )
}

export default ApiDashboardCard
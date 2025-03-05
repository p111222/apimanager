import React, { useState } from 'react'

const PageTitle = ({ titleText, titleIcon, extraIcons = [] }) => {

    return (
        <div className='mb-5'>
            <div className='flex items-center justify-between'>
                <div className="flex items-center gap-4">
                    <>
                        {titleIcon}
                    </>
                    <h1 className='text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>{titleText}</h1>

                </div>
                <div className="flex gap-4">
                    {extraIcons.map((icon, index) => (
                        <span
                            key={index}
                            onClick={icon.onClick}
                            className={`cursor-pointer ${  
                            icon.isActive ? "text-orange-500" : "hover:text-gray-600"
                            }`}

                        >
                            {icon.icon}
                        </span>
                    ))}
                </div>
            </div>
            <hr className='mt-2 w-full border-gray-400' />
        </div>
    )
}

export default PageTitle
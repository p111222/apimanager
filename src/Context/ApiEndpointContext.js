import React, { createContext, useState } from 'react'

export const ApiEndpointContext = createContext();

export const ApiEndpointContextProvider = ({ children }) => {
    const [endpoint, setEndpoint] = useState(null);
    const [activeTab, setActiveTab] = useState("generalInfo"); 
    const [selectedApiName, setSelectedApiName] = useState('');

    return (
        <ApiEndpointContext.Provider value={{ endpoint, setEndpoint, activeTab, setActiveTab, selectedApiName, setSelectedApiName }}>
            {children}
        </ApiEndpointContext.Provider>
    )
}


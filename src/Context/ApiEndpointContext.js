import React, { createContext, useState } from 'react'

export const ApiEndpointContext = createContext();

export const ApiEndpointContextProvider = ({ children }) => {
    const [endpoint, setEndpoint] = useState(null)
    return (
        <ApiEndpointContext.Provider value={{ endpoint, setEndpoint }}>
            {children}
        </ApiEndpointContext.Provider>
    )
}


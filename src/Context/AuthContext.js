import React, { useState, createContext, useEffect } from 'react'

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [sessionValidity, setSessionValidity] = useState(null);

    return (
        <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, sessionValidity, setSessionValidity }}>
            {children}
        </AuthContext.Provider>
    )
}

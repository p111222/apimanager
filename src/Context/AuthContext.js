// import React, { useState, createContext, useEffect } from 'react'

// export const AuthContext = createContext();

// export const AuthContextProvider = ({ children }) => {
//     const [user, setUser] = useState(null)
//     const [accessToken, setAccessToken] = useState(null)
//     const [sessionValidity, setSessionValidity] = useState(null);

//     return (
//         <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, sessionValidity, setSessionValidity }}>
//             {children}
//         </AuthContext.Provider>
//     )
// }


import React, { useState, createContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [sessionValidity, setSessionValidity] = useState(null);
    const [loginTime, setLoginTime] = useState(null);

    const updateUser = (userData) => {
        setUser(userData);
        if (userData) {
            setLoginTime(new Date().toISOString());
        } else {
            setLoginTime(null);
        }
    };

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                setUser: updateUser,  
                accessToken, 
                setAccessToken, 
                sessionValidity, 
                setSessionValidity,
                loginTime,
                setLoginTime
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
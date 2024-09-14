import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [roleId, setRoleId] = useState(null);
    const [userId, setUserId] = useState(null);

    return (
        <UserContext.Provider value={{ roleId, setRoleId, userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};

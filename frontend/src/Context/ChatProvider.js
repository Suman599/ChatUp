import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo) {
            navigate("/");  // Redirect if no userInfo found
        } else {
            setUser(userInfo);
        }
    }, [navigate]);

    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => useContext(ChatContext);

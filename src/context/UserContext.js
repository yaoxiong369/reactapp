import React, {useState} from 'react';
import UserService from "../service/UserService";
import cookie from "react-cookies";
import {message} from "antd";
import {Navigate} from "react-router";


export const UserContext = React.createContext({})

export function UserContextProvider(props) {
    let [user, setUser] = useState(null);


    let signin = (userInput, callback) => {
        console.log("userInput", userInput);
        return UserService.signin(userInput, (userInfo) => {
            setUser(userInfo);
            message.warn("userInfo(login):"+ userInfo);
            callback();
        });
    };

    let signout = (callback) => {
        return UserService.signout(() => {
            message.warn("userInfo(logoutn):"+ user);
            setUser(null);
            callback();
        });
    };

    let value = {user, signin, signout};

    return <UserContext.Provider value={value}>{props.children}</UserContext.Provider>;
}


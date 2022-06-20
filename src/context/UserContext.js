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
            const obj = {
                userInfo,
                expire: new Date().getTime() + 1000 * 60 * 30
            };
            localStorage.setItem('user', JSON.stringify(obj));
            callback();
        });
    };

    let signout = (callback) => {
        return UserService.signout(() => {
            localStorage.removeItem('user');
            setUser(null);
            callback();
        });
    };

    let value = {user, signin, signout};

    return <UserContext.Provider value={value}>{props.children}</UserContext.Provider>;
}


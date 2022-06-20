import React, {useContext} from 'react';
import {UserContext} from "../context/UserContext";
import {Navigate, useLocation} from "react-router-dom";


export default function AuthRoute(props) {
    let currentUser = useContext(UserContext);
    let location = useLocation();
    const storage = localStorage.getItem('user');
    const time = new Date().getTime();
    if (storage) {
        const obj = JSON.parse(storage);
        if (time < obj.expire) {
            currentUser.user = obj.userInfo;
        } else {
            localStorage.removeItem('user');
        }
    }

    console.log("currentUser", currentUser);
    if (!currentUser.user) {
        return <Navigate to="/login" state={{from: location}} replace={true}/>;
    }

    return props.children;
}
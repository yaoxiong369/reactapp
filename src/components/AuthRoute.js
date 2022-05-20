import React, {useContext} from 'react';
import {UserContext} from "../context/UserContext";
import {Navigate, useLocation} from "react-router-dom";


export default function AuthRoute(props) {
    let currentUser = useContext(UserContext);
    let location = useLocation();
    console.log("currentUser", currentUser);
    if (!currentUser.user) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    return props.children;
}
import {useState, useEffect, useContext} from 'react';

import "../../css/login.css"
import "../../css/bootstrap.min.css"
import {UserContext} from "../../context/UserContext";
import {useLocation, useNavigate} from "react-router";
import {message} from "antd";

const Login = () => {
    let auth = useContext(UserContext);
    const [userInput, setUserInput] = useState({username: "admin", password: 111111});
    let navigate = useNavigate();


    function handleSubmit() {
        auth.signin(userInput, () => {
            navigate("/listcommodity", {replace: true});
        });
    }

    return (
        <div>
            <div id="login-bg" className="container-fluid">

                <div className="bg-img"></div>
                <div className="bg-color"></div>
            </div>


            <div className="container" id="login">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="login">

                            <h1>Login</h1>


                            <div className="form">
                                <div className="form-group">
                                    <input className="form-control" id="exampleInputEmail1"
                                        // type="email"
                                           value="admin" readonly="readonly"
                                           aria-describedby="emailHelp" placeholder="Enter email"
                                        // onChange={(e) => {
                                        //     userInput.username = e.target.value
                                        // }}
                                    />

                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control" id="exampleInputPassword1"
                                           value="111111" readonly="readonly"
                                           placeholder="Password"
                                        // onChange={(e) => {
                                        //     userInput.password = e.target.value
                                        // }}
                                    />
                                </div>

                                <br/>
                                <button onClick={handleSubmit} className="btn btn-lg btn-block btn-success">Sign in</button>
                            </div>


                        </div>

                    </div>
                </div>
            </div>

        </div>


    );
}


export default Login;
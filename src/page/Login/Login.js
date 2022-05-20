import {useState, useEffect, useContext} from 'react';

import "../../css/login.css"
import "../../css/bootstrap.min.css"
import {UserContext} from "../../context/UserContext";
import {useLocation, useNavigate} from "react-router";

const Login = () => {
    let auth = useContext(UserContext);
    const [userInput,setUserInput] = useState({});
    let navigate = useNavigate();
    let location = useLocation();
    let from = location.state?.from?.pathname || "/";

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


                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input className="form-control" id="exampleInputEmail1"
                                        // type="email"
                                           aria-describedby="emailHelp" placeholder="Enter email"
                                           onChange={(e) => {
                                               userInput.username = e.target.value
                                           }}/>

                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control" id="exampleInputPassword1"
                                           placeholder="Password" onChange={(e) => {
                                        userInput.password = e.target.value
                                    }}/>
                                </div>

                                <div className="form-check">

                                    <label className="switch">
                                        <input type="checkbox"/>
                                        <span className="slider round"></span>
                                    </label>
                                    <label className="form-check-label" htmlFor="exampleCheck1">Remember me</label>

                                    <label className="forgot-password"><a href="#">Forgot Password?</a></label>

                                </div>

                                <br/>
                                <button type="submit" className="btn btn-lg btn-block btn-success">Sign in</button>
                            </form>


                        </div>

                    </div>
                </div>
            </div>

        </div>


    );
}


export default Login;
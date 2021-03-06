import axios from 'axios';
import {message} from "antd";

const USER_API_BASE_URL = "/admin/acl";

class UserService {
    isAuthenticated = false;

    signin(userInput, callback) {
        axios.create({withCredentials: true}).post(USER_API_BASE_URL + '/login', userInput)
            .then((res) => {
                    if (res && res.data && res.data.success && res.data.data) {
                        this.isAuthenticated = true;
                        callback(res.data.data.object);
                    } else {
                        message.error("login fail!");
                    }
                }
            )
            .catch((res) => {
                console.log("res", res);
                message.error("exception");
            });
        // setTimeout(callback, 100); // fake async
    };

    signout(callback) {
        axios.get(USER_API_BASE_URL + '/index/logout')
            .then((res) => {
                    if (res && res.data && res.data.success && res.data.data) {
                        this.isAuthenticated = false;
                        callback();
                    } else {
                        message.error("logout fail!");
                    }
                }
            )
            .catch((res) => {
                console.log("res", res);
                message.error("exception");
            });
    };
}

export default new UserService();
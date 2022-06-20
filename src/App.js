import React from 'react';
import 'antd/dist/antd.css';
import './App.css';
import {Layout} from 'antd';
import Layout1 from './page/Layout1'
import {HashRouter as Router, Route, Routes} from 'react-router-dom';
import NotFound from "./page/NotFound/NotFound";
import ListCommodity from "./page/Commodity/ListCommodity";
import PurchaseList from "./page/Purchase/PurchaseList";
import OrderList from "./page/Order/OrderList";
import OrderAdd from "./page/Order/OrderAdd";
import Plan from "./page/Aggregation/Plan";
import AuthRoute from "./components/AuthRoute";
import {UserContextProvider} from "./context/UserContext";
import Login from "./page/Login/Login";


const {Header, Content, Footer} = Layout;


function App() {


    return (
        <div className="App">
            <UserContextProvider>
                <Router>

                    <Routes>
                        {/*<Route exact path="/" render={() => <Redirect to="/app/dashboard/index" push />} />*/}
                        <Route  element={<Layout1/>}>
                            <Route path="/" element={<AuthRoute><ListCommodity/></AuthRoute>}/>
                            <Route path="/listcommodity" element={<AuthRoute><ListCommodity/></AuthRoute>}/>
                            <Route path="/purchaselist" element={<AuthRoute><PurchaseList/></AuthRoute>}>
                                <Route path=":commodityId" element={<AuthRoute><PurchaseList/></AuthRoute>}/>                            </Route>
                            <Route path="/listorder" element={<AuthRoute><OrderList/></AuthRoute>}/>
                            <Route path="/addorder" element={<AuthRoute><OrderAdd/></AuthRoute>}/>

                            <Route path="/test" element={
                                <AuthRoute>
                                    <Plan/>
                                </AuthRoute>}/>

                        </Route>
                        {/*<Route path="/app" element={<AuthRoute><ListCommodity/></AuthRoute>}/>*/}
                        <Route path="/404" element={<NotFound/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </Router>
            </UserContextProvider>
        </div>
    );
}


export default App;

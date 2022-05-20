import React, {useContext} from 'react';
import 'antd/dist/antd.css';
import '../App.css';
import {Button, Col, Layout, Menu, Row} from 'antd';
import {Link, Outlet} from "react-router-dom";
import {LogoutOutlined, UserOutlined} from "@ant-design/icons";
import {UserContext} from "../context/UserContext";
import {useNavigate} from "react-router";

const {Header, Content, Footer} = Layout;

const Layout1 = () => {
    const auth = useContext(UserContext);
    let navigate = useNavigate();

    const handleLogout = () => {
        auth.signout( () => {
            navigate("/login", {replace: true});
        });
    }

    return (
        <Layout className="layout">
            <Header>
                <div className="logo"/>
                <Row justify="space-between">
                    <Col span={16}>
                        <Menu style={{padding: '0px 100px'}} theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                            <Menu.Item key={1}> <Link to='/listcommodity'>Commodity</Link> </Menu.Item>
                            <Menu.Item key={2}> <Link to='/listorder'>Order</Link> </Menu.Item>
                            <Menu.Item key={3}> <Link to='/test'>Aggregation</Link> </Menu.Item>
                        </Menu>
                    </Col>

                    <Col span={4}>
                        <Button type="primary" shape="round" onClick={handleLogout} icon={<LogoutOutlined />} size="large"/>
                    </Col>
                </Row>

            </Header>
            <Content style={{padding: '20px 200px'}}>

                <div className="site-layout-content">
                    <div className="site-card-wrapper">
                        <Outlet/>
                    </div>
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    )
}




export default Layout1
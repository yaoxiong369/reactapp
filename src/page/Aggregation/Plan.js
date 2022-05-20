import {Button, Card, Col, Divider, message, Row, Space, Table, Tag, Timeline} from "antd";
import Chart from "./Chart";
import Login from "../Login/Login";
import OrderService from "../../service/OrderService";
import React, {useEffect, useState} from "react";
import {Link, Navigate} from "react-router-dom";
import {FileAddOutlined} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import {useNavigate} from "react-router";

const Plan = () => {
    const [orderCount, setOrderCount] = useState([]);
    const [revenue, setRevenue] = useState([]);
    const [timeLines, setTimeLines] = useState([]);
    let navigate = useNavigate();




    const getOrderTimeLine = () => {
        OrderService.getOrderTimeLine().then(
            (res) => {
                if (res && res.data && res.data.success && res.data.data) {
                    setTimeLines(res.data.data.object);
                } else if (res.data.code == 20002) {
                    navigate("/login" ,{replace: true});
                } else {
                    message.error("get time line fail!");
                }
            }
        ).catch(
            (res) => {
                message.error("get time line exception!");
                return null;
            }
        )
    }

    const getOrderDayAggregation = () => {
        OrderService.getOrderDayAggregation().then(
            (res) => {
                if (res && res.data && res.data.success && res.data.data) {
                    setOrderCount(res.data.data.object);
                }else if (res.data.code == 20002) {
                    navigate("/login" ,{replace: true});
                } else {
                    message.error("create charts fail!");
                }
            }
        ).catch(
            (res) => {
                message.error("exception!");
                return null;
            }
        )
    }

    const revenueDayAggregation = () => {
        OrderService.getRevenueDayAggregation().then(
            (res) => {
                if (res && res.data && res.data.success && res.data.data) {
                    setRevenue(res.data.data.object);
                }else if (res.data.code == 20002) {
                    navigate("/login" ,{replace: true});
                } else {
                    message.error("create charts fail!");
                }
            }
        ).catch(
            (res) => {
                message.error("exception!");
                return null;
            }
        )
    }

    useEffect(() => {
        let id = setInterval(() => {
            getOrderTimeLine();
        }, 10000)
        getOrderTimeLine();
        getOrderDayAggregation();
        revenueDayAggregation();
        return ()=>clearInterval(id);
    }, [])

    return (


        <div>
            <Row gutter={16}>
                <Col span={18} order={1}>
                    <div>
                        <Chart indice={orderCount} titleName='Daily Orders' yAxisName='Order quantity'
                               id='orderCount'></Chart>
                        <Divider/>
                        <Chart indice={revenue} titleName='Daily Revenue' yAxisName='Revenue' id='revenue'></Chart>
                    </div>
                </Col>
                <Col span={6} order={2} style={{backgroundColor: '#fff'}}>
                    <Card title="Timeline" size="small">
                        <Timeline>
                            {timeLines.map(
                                timeLine => {
                                    let color = {
                                        "create order": "green",
                                        "finish order": "blue"
                                    };
                                    return (
                                        <Timeline.Item color={color[timeLine.status]}>
                                            <Tag color={color[timeLine.status]}>
                                                <Space direction="vertical" size={1}>
                                                    <div>{timeLine.updateDate}</div>
                                                    <div>{timeLine.status}</div>
                                                    <div>{timeLine.orderNumber}</div>
                                                </Space>
                                            </Tag>
                                        </Timeline.Item>
                                    )
                                }
                            )}


                        </Timeline>
                    </Card>

                </Col>
            </Row>

        </div>
    )
}


export default Plan;
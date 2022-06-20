import React, {useEffect, useState} from 'react';
import {Button, Col, DatePicker, Divider, message, Popconfirm, Row, Space, Table, Tag} from "antd";
import {CheckSquareOutlined, DeleteOutlined, FileAddOutlined, FormatPainterOutlined} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import OrderService from "../../service/OrderService";
import {Link, Router} from "react-router-dom";
import {useNavigate} from "react-router";

const {RangePicker} = DatePicker;


const OrderList = () => {
    let navigate = useNavigate();
    const [data, setData] = useState([]);
    const [condition, setCondition] = useState({});//{"commodityId": params.commodityId}
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        totalPage: 10,
        pageSize: 5
    })
    const [search, setSearch] = useState({});

    const columns = [
        {
            title: 'Order Number',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',

        },
        {
            title: 'Create Date',
            dataIndex: 'createDate',
            key: 'createDate',
        },
        {
            title: 'Remarks',
            key: 'remarks',
            dataIndex: 'remarks',
        },
        {
            title: 'Customer Number ',
            key: 'customerNumber',
            dataIndex: 'customerNumber',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (text) => {
                let color = {
                    0: {"statusName": "create", "color": "green"},
                    1: {"statusName": "finish", "color": "blue"},
                    2: {"statusName": "delete", "color": "red"}
                };
                try {
                    return <Tag color={color[text].color}>{color[text].statusName}</Tag>
                } catch (e) {
                    return null;
                }
            },
        },
        ,
        {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Link
                        to={{pathname: "/addorder?orderNumber=" + record.orderNumber + "&remarks=" + record.remarks + "&customerNumber=" + record.customerNumber}}>
                        <FormatPainterOutlined style={{fontSize: '16px', color: '#5555FF'}}/>
                    </Link>
                    <a>
                        <Popconfirm
                            placement="top"
                            title="Are you sure to delete this order"
                            onConfirm={() => updataOrderStatus(record.orderNumber, "delete")}
                            okText="Yes"
                            cancelText="No"
                        >
                            <DeleteOutlined style={{fontSize: '16px', color: '#FF0000'}}/>
                        </Popconfirm>
                    </a>
                    <a>
                        <Popconfirm
                            placement="top"
                            title="Are you sure to finish this order"
                            onConfirm={() => updataOrderStatus(record.orderNumber, "finish")}
                            okText="Yes"
                            cancelText="No"
                        >
                            <CheckSquareOutlined style={{fontSize: '16px', color: '#00DD00'}}/>
                        </Popconfirm>
                    </a>
                </Space>
            ),
        },
    ];

    // updataOrderStatus(record.orderNumber,"delete")
    function updataOrderStatus(orderNumber, type, e) {
        const request = (type == "delete") ? OrderService.deleteOrder(orderNumber) : OrderService.finishOrder(orderNumber);

        request.then((res) => {
                if (res && res.data && res.data.success) {
                    message.success("operation success!");
                    getOrderList(pageInfo.currentPage, pageInfo.pageSize);
                } else if (res.data.code == 20002) {
                    navigate("/login", {replace: true});
                } else {
                    message.error(res.data.message);
                }
            }
        )
            .catch((res) => {
                message.error("delete order list excepte!");
            });
    }


    const getOrderList = (page = 1, pageSize = 10) => {
        console.log("page condition", condition);
        OrderService.getOrderList(page, pageSize, condition)
            .then((res) => {
                    console.log("res ", res);
                    if (res && res.data && res.data.success && res.data.data) {
                        setData(res.data.data.object);
                        setPageInfo({
                            currentPage: page,
                            totalPage: res.data.data.total,
                            pageSize: pageSize,
                        });
                    } else if (res.data.code == 20002) {
                        navigate("/login", {replace: true});
                    } else {
                        message.error("get order list fail!");
                    }
                }
            )
            .catch((res) => {
                console.log("res", res);
                alert("error get order list");
                // alert(res.data.message);
            });
    }

    useEffect(() => {
        getOrderList();
    }, []);

    return (
        <div>
            <Row gutter={16}>
                <Col span={6} order={1}>
                    <Link to="/addorder">
                        <Button type="primary" shape="round" icon={<FileAddOutlined/>} size='large'/>
                    </Link>
                </Col>
                <Col span={6} order={2}>

                </Col>
                <Col span={6} order={3}>
                    <RangePicker size='large' format='YYYY-MM-DD HH:mm:ss' onChange={(dates, datesString) => {
                        if (datesString.length = 2) {
                            // setCondition({createDateRangeStart:datesString[0],createDateRangeEnd:datesString[1]});
                            condition.createDateRangeStart = datesString[0];
                            condition.createDateRangeEnd = datesString[1];
                        }
                    }}/>
                </Col>
                <Col span={6} order={4}>
                    <Search placeholder="input search text" size='large' onSearch={(value) => {
                        condition.keyword = value;
                        console.log("condition", condition);
                        getOrderList();
                    }} enterButton/>
                </Col>
            </Row>

            <Divider dashed/>

            <Table columns={columns} dataSource={data}
                   pagination={{
                       pageSize: 5, total: pageInfo.totalPage,
                       current: pageInfo.currentPage,
                       showTotal: total => `Total ${pageInfo.totalPage} items`,
                       onChange: getOrderList
                   }}/>

        </div>
    );
};


export default OrderList;



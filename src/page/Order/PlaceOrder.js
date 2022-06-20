import React, {useState} from "react";
import OrderService from "../../service/OrderService";
import {Avatar, Button, Col, Divider, Form, Input, message, Modal, Row, Space} from "antd";
import {FileAddOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router";
import JsonUtile from "../../util/JsonUtile";


const Detail = ({visible, onCreate, onCancel, orderData, orderNumber,totalPrice,itemCount, remarks,customerNumber}) => {


    const [form] = Form.useForm();
    const formItemLayout =
        {
            labelCol: {span: 5},
            wrapperCol: {span: 15},
        };



    return (
        <Modal
            afterClose={()=>{form.resetFields();}}
            width={600}
            visible={visible}
            title="Place order"
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                onCreate(orderNumber,remarks,customerNumber);
            }}
        >
            <Form
                {...formItemLayout}
                form={form}
                layout="horizontal"
                name="form_in_modal"
                initialValues={{
                    modifier: 'public',
                }}
            >
                <Space direction="vertical">
                    <Input addonBefore="Order Number" defaultValue={orderNumber}/>
                    <Input addonBefore="Customer Number" defaultValue={customerNumber} onChange={(e)=>{customerNumber=e.target.value}}/>
                    <Input addonBefore="Remarks"  defaultValue={remarks} onChange={(e)=>{remarks=e.target.value}}/>
                </Space>
                <Divider dashed/>
                {orderData.map(data => {
                    return (
                        <Row gutter={[16, 16]} justify="space-between"
                             style={{borderBottomWidth: 1, borderBottomColor: 777}} align="middle">
                            <Col span={4} offset={1}>
                                <Space>
                                    <Avatar size={48}
                                            src={(data.picture && JsonUtile.jsonToString(data.picture)['url1'])  == null ?
                                                'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png' : JsonUtile.jsonToString(data.picture)['url1']}/>
                                    <p> {data.name} </p>
                                </Space>
                            </Col>
                            <Col span={4} offset={1}>
                                ${data.sellPrice}*{data.quantity}
                            </Col>
                        </Row>)
                })}
                <Row justify="end">
                    <Col span={7}>
                        Total:
                        <Space>
                            {itemCount}  items / $ {totalPrice}
                        </Space>
                    </Col>
                </Row>

                {/*<Table columns={columns} dataSource={orderData} pagination={false}/>*/}

            </Form>
        </Modal>

    );
};


const PlaceOrder = (props) => {
    let navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    const [orderData, setOrderData] = useState([]);
    const getPlaceOrderDetail = (orderNumber) => {
        let ajaxData = [];
        OrderService.getOrderDetailByOrderNumber(orderNumber).then(
            (res) => {
                if (res && res.data && res.data.success && res.data.data) {
                    const placeOrder = res.data.data.object;
                    if (placeOrder) {
                        for (var i = 0, l = placeOrder.length; i < l; i++) {
                            ajaxData.push({
                                picture: placeOrder[i].picture,
                                name: placeOrder[i].name,
                                sellPrice: placeOrder[i].sellPrice,
                                quantity: placeOrder[i].quantity,
                            });
                        }
                        setOrderData(ajaxData);
                    }
                }else if (res.data.code == 20002) {
                    navigate("/login" ,{replace: true});
                } else {
                    message.error("get order detail fail!");
                }
            }
        ).catch(
            (res) => {
                message.error("get order detail excepte!");
            }
        )
    }


    const onCreate = (orderNumber,remarks,customerNumber) => {

        let customerOrder = {};
        customerOrder.orderNumber = orderNumber;
        customerOrder.remarks = remarks;
        customerOrder.customerNumber = customerNumber;
        console.log("orderNumber", customerOrder);
        if(orderData.length>0){
            const request = OrderService.placeOrder(customerOrder);
            request.then(res => {
                if (res.data.success) {
                    message.success(res.data.message);
                    Modal.destroyAll();
                    setVisible(false);
                    navigate("/listorder" ,{replace: true});
                }else if (res.data.code == 20002) {
                    navigate("/login" ,{replace: true});
                } else {
                    message.error(res.data.message);
                }
            });
        }else{
            message.error("请选择商品！");
        }

    };

    return (
        <div>
            <Button type="primary" shape="round" icon={<FileAddOutlined/>} size='large'
                    onClick={() => {
                        getPlaceOrderDetail(props.orderNumber);
                        setVisible(true);
                    }}/>

            <Detail
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
                orderData={orderData}
                orderNumber={props.orderNumber}
                totalPrice={props.totalPrice}
                itemCount={props.itemCount}
                remarks={props.remarks}
                customerNumber={props.customerNumber}
            />
        </div>
    );
};

export default PlaceOrder;


const columns = [
    {
        title: 'Picture',
        dataIndex: 'picture',
        key: 'picture',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Sell Price',
        dataIndex: 'sellPrice',
        key: 'sellPrice',
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
    },
];
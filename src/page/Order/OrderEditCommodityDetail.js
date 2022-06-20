import React, {useRef, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Modal, Form, Input, Radio, Divider, Table, InputNumber, message} from 'antd';
import {SettingOutlined} from "@ant-design/icons";
import CommodityService from "../../service/CommodityService";
import OrderService from "../../service/OrderService";
import {useNavigate} from "react-router";


const Detail = ({visible, onCreate, onCancel, commodtiyWithPurchase}) => {
    console.log("commodtiyWithPurchase", commodtiyWithPurchase)
    let orderDetailMap = new Map();
    const volumeInput = useRef(null);
    const [order, setOrder] = useState({})
    const purchaseListJson = JSON.parse(commodtiyWithPurchase.purchases);
    const [form] = Form.useForm();
    const formItemLayout =
        {
            labelCol: {span: 5},
            wrapperCol: {span: 15},
        };

    const data = [];

    function handleInput(purchase, value) {
        console.log('purchase', purchase);
        console.log('value', value);
        purchase.salesVolume = value
        if (purchase.id != null) {
            orderDetailMap.set(purchase.id, purchase);
        }

    }

    form.setFieldsValue({name: commodtiyWithPurchase.name});
    form.setFieldsValue({remain: commodtiyWithPurchase.remain});
    form.setFieldsValue({unit: commodtiyWithPurchase.unit});
    form.setFieldsValue({commodityId: commodtiyWithPurchase.id});


    if (purchaseListJson) {
        form.setFieldsValue({sellPrice: purchaseListJson[0].sellPrice});
        for (var i = 0, l = purchaseListJson.length; i < l; i++) {
            console.log("purchaseListJson[n]", purchaseListJson[i])
            data.push({
                key: purchaseListJson[i].id,
                purchasePrice: purchaseListJson[i].sellPrice,
                createDate: purchaseListJson[i].createDate,
                remain: purchaseListJson[i].remain,
                salesVolume: <InputNumber min={0.0} max={100000.0} defaultValue={0.0} step="1.0" ref={volumeInput}
                                          onChange={handleInput.bind(this, purchaseListJson[i])}
                />,
            });
        }
    }


    return (
        <Modal
            afterClose={() => {
                form.resetFields();
            }}
            width={600}
            visible={visible}
            title="Order options"
            okText="Create"
            cancelText="Cancel"
            destroyOnClose={true}
            onCancel={onCancel}
            onOk={() => {

                let orderDetail = []
                orderDetailMap.forEach(function (value, key, mapObj) {
                    orderDetail.push(value)
                })
                console.log("orderDetail", orderDetail)

                form.setFieldsValue({"purchases": orderDetail})
                form
                    .validateFields()
                    .then((values) => {
                        console.log("values", values)
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
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
                <Form.Item
                    name="name"
                    label="name"
                >
                    <Input disabled/>
                </Form.Item>
                <Form.Item name="remain" label="remain">
                    <Input disabled/>
                </Form.Item>
                <Form.Item
                    name="unit"
                    label="unit"
                >
                    <Input disabled/>
                </Form.Item>
                <Form.Item
                    name="commodityId"
                    label="commodityId"
                    hidden={true}
                >
                    <Input disabled/>
                </Form.Item>
                <Form.Item name="sellPrice" label="Sell Price">
                    <InputNumber min={0.0} max={100000.0} defaultValue={0.0} step="0.1"/>
                </Form.Item>
                <Form.Item
                    name="purchases"
                    label="purchases"
                    hidden={true}
                >
                    <Input disabled/>
                </Form.Item>
                <Divider/>

                <span> Purchase List </span>
                <Table columns={columns} dataSource={data} pagination={{pageSize: 50}} scroll={{y: 240}}/>,

            </Form>
        </Modal>
    );
};

const OrderEditCommodityDetail = (props) => {
    let navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    const onCreate = (values) => {
        values.orderNumber = props.orderNumber
        console.log('Received values of form: ', values);
        const request = OrderService.createOrder(values);

        request.then(res => {
            console.log('response: ', res);
            if (res.data.success) {
                message.success(res.data.message);
                Modal.destroyAll();
                setVisible(false);
                let innerTotalPrice = 0;
                let innerItemCount = 0;
                values.purchases.forEach(function (value, key, mapObj) {
                    innerTotalPrice += value.salesVolume * values.sellPrice;
                    innerItemCount += value.salesVolume;
                });
                console.log('innerTotalPrice ', innerTotalPrice);
                console.log('innerItemCount ', innerItemCount);
                props.setTotalPriceAndItemCount(innerTotalPrice, innerItemCount);
                // navigate("/addorder", {replace: true});
            } else if (res.data.code == 20002) {
                navigate("/login", {replace: true});
            } else {
                message.error(res.data.message);
            }
        });
    };

    return (
        <div>
            <Button type="primary" shape="round" onClick={() => {
                if (props.commodtiyWithPurchase.purchases) {
                    setVisible(true);
                } else {
                    message.warn("商品没有采购信息");
                }

            }} icon={<SettingOutlined/>} size='small'/>

            <Detail
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
                commodtiyWithPurchase={props.commodtiyWithPurchase}

            />
        </div>
    );
};

export default OrderEditCommodityDetail;


const columns = [
    {
        title: 'Create Date',
        dataIndex: 'createDate',
        width: 120,
    },
    {
        title: 'Purchase Price',
        dataIndex: 'purchasePrice',
        width: 120,
    },
    {
        title: 'Remain',
        dataIndex: 'remain',
        width: 80,
    },
    {
        title: 'Sales Volume',
        dataIndex: 'salesVolume',
        width: 80,
    },
];





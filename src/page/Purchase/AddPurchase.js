import React, {useEffect, useState} from 'react';
import {Form, Input, Modal, Select, InputNumber, Space, DatePicker, message} from 'antd';
import JsonUtile from "../../util/JsonUtile";
import CommodityService from "../../service/CommodityService";
import PurchaseService from "../../service/PurchaseService";
import CategoryService from "../../service/CategoryService";
import {EditOutlined} from "@ant-design/icons";
import moment from 'moment';
import {useNavigate} from "react-router-dom";

const {Option} = Select;

const AddPurchase = ({visible, onCreate, onCancel, unit_name, commodity, purchase,storageLocation}) => {
    const [form] = Form.useForm();
    form.setFieldsValue({"unit": unit_name});
    form.setFieldsValue({"commodityId": commodity.id});
    let expirationFormateDate = null;
    let title = "Create a new " + commodity.name + " purchase";


    if (purchase != null) {
        console.log("purchase", purchase);
        form.setFieldsValue({"id": purchase.id});
        form.setFieldsValue({"purchasePrice": purchase.purchasePrice});
        form.setFieldsValue({"purchaseQuantity": purchase.purchaseQuantity});
        form.setFieldsValue({"unit": purchase.unit});
        form.setFieldsValue({"commodityId": purchase.commodityId});
        form.setFieldsValue({"sellPrice": purchase.sellPrice});
        form.setFieldsValue({"expirationDate": moment(purchase.expirationDate, 'YYYY-MM-DD')});
        form.setFieldsValue({"storageLocation": purchase.storageLocation});

    }




    return (
        <Modal
            afterClose={()=>{form.resetFields();}}
            visible={visible}
            title={title}
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        values.expirationDate = expirationFormateDate;
                        console.log("kk1", values);
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{
                    modifier: 'public',
                    // 'purchasePrice': 123222,
                    // 'purchaseQuantity': purchase.purchaseQuantity
                }}
                // onFinish={onFinish}
            >
                <Form.Item label="id"
                           name="id"
                           hidden={true}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="purchase price"
                    name="purchasePrice"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the purchase price!',
                        },
                    ]}
                >

                    <InputNumber min={0.0} max={100000.0} defaultValue={0.0} step="0.01" controls={false}/>

                </Form.Item>
                <Form.Item
                    label="purchase quantity"
                    name="purchaseQuantity"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the quantity!',
                        },
                    ]}
                >

                    <InputNumber min={0.0} max={100000.0} defaultValue={0.0} addonAfter={unit_name}
                                 controls={false}/>

                </Form.Item>
                <Form.Item
                    label="unit"
                    name="unit"
                    hidden={true}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="commodityId"
                    name="commodityId"
                    hidden={true}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="sell price"
                    name="sellPrice"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the sell price!',
                        },
                    ]}
                >

                    <InputNumber min={0.0} max={100000.0} defaultValue={0.0} step="0.01" controls={false}/>

                </Form.Item>
                <Form.Item
                    label="expiration date"
                    name="expirationDate"
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: 'Please input the expiration date!',
                    //     },
                    // ]}
                >

                    <DatePicker onChange={(date, dateString) => {
                        expirationFormateDate = dateString
                    }} format='YYYY-MM-DD'/>

                </Form.Item>

                <Form.Item label="storage location"
                           name="storageLocation"
                           hasFeedback
                           rules={[{required: true, message: 'Please select locale!'}]}>
                    <Select allowClear>
                        {storageLocation.map(
                            location => {
                                return (
                                    <Option key={location.id} value={location.name}>{location.name}</Option>
                                )
                            }
                        )}
                    </Select>
                </Form.Item>

            </Form>
        </Modal>
    );
};

const AddPurchasePage = (props) => {
    const [visible, setVisible] = useState(false);
    let unit_name = props.unit_obj ? props.unit_obj['name'] : null;
    let commodity = props.commodity;
    let purchase = props.purchase;//== null ? {}:props.purchase;
    let navigate = useNavigate();
    console.log('commodity: ', commodity);

    const onCreate = (values) => {
        const request = props.purchase == null ? PurchaseService.createPurchase(values) : PurchaseService.updatePurchase(values);


        request.then(res => {

            if (res.data.success) {
                message.success(res.data.message);
                Modal.destroyAll();
                setVisible(false);
                navigate("/listcommodity" ,{replace: true});
            }else if (res.data.code == 20002) {
                navigate("/login" ,{replace: true});
            } else {
                message.error(res.data.message);
            }
        });
    };

    let trigerElement;
    if (props.action === 'add') {
        let pictureJson = props.picture;
        let pictureUrl = (pictureJson && JsonUtile.jsonToString(pictureJson)['url1']) == null ?
            'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png' : JsonUtile.jsonToString(pictureJson)['url1'];

        trigerElement = <img alt="example" style={{width: '100%'}} onClick={() => {
            setVisible(true);
        }} src={pictureUrl}/>
    } else {
        trigerElement = <EditOutlined key="edit" onClick={() => {
            setVisible(true);
        }}/>
    }

    return (

        <div>
            {trigerElement}
            <AddPurchase
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
                unit_name={unit_name}
                commodity={commodity}
                purchase={purchase}
                storageLocation={props.storageLocation}
            />
        </div>
    );
};

export default AddPurchasePage;
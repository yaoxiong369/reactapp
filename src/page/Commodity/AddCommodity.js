import React, {useState} from 'react';
import {Button, Form, Input, message, Modal, Select} from 'antd';
import PicturesWall from '../../components/PicturesWall'
import {EditOutlined, PlusCircleOutlined} from "@ant-design/icons";
import CommodityService from "../../service/CommodityService";
import {useNavigate} from 'react-router-dom'
import JsonUtile from "../../util/JsonUtile";


const {Option} = Select;

const AddCommodity = ({visible, onCreate, onCancel, categorys, units, commodity}) => {

    const [form] = Form.useForm();

    const arr = new Array()
    if (commodity) {
        form.setFieldsValue({id: commodity.id});
        form.setFieldsValue({name: commodity.name});
        form.setFieldsValue({categoryName: commodity.categoryName});
        form.setFieldsValue({picture: commodity.picture});
        form.setFieldsValue({remarks: commodity.remarks});
        form.setFieldsValue({categoryId: commodity.categoryId});
        form.setFieldsValue({unit: commodity.unit});
        if ((commodity.picture && JsonUtile.jsonToString(commodity.picture)['url1']) != null) {

            let json = JsonUtile.jsonToString(commodity.picture);

            let i = 0;

            for (let k in json) {
                arr[i++] = {
                    uid: k,
                    name: 'image.png',
                    status: 'done',
                    url: json[k],
                }
            }
            console.log('arr', arr)
        }

    }

    return (
        <Modal
            visible={visible}
            title="Commodity"
            okText="Create"
            cancelText="Cancel"
            destroyOnClose={true}
            afterClose={()=>{form.resetFields();}}
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
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
                }}
            >
                <Form.Item label="id"
                           name="id"
                           hidden={true}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                >
                    <PicturesWall form={form} arr={arr}/>
                </Form.Item>
                <Form.Item label="picture"
                           name="picture"
                           hidden={true}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="name"
                    label="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the name of commodity!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item label="categoryName"
                           name="categoryName"
                           hidden={true}>
                    <Input/>
                </Form.Item>
                <Form.Item label="categoryId"
                           name="categoryId"
                           rules={[{required: true, message: 'Please select category!'}]}>
                    <Select allowClear onChange={function (value, option) {
                        form.setFieldsValue({categoryName: option.key});
                    }}>

                        {categorys != null && categorys.map(category => {
                            return (
                                <Option key={category.name} value={category.id}>{category.name}</Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="Unit"
                           name="unit"
                           rules={[{required: true, message: 'Please select unit!'}]}>
                    <Select allowClear>
                        {units != null && units.map(unit => {
                            return (
                                <Option key={unit.id} value={unit.id}>{unit.name}</Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name="remarks"   label="Description">
                    <Input type="textarea"/>
                </Form.Item>

            </Form>
        </Modal>
    );
};

const CollectionsPage = (props) => {
    const [visible, setVisible] = useState(false);
    let navigate = useNavigate();

    const onCreate = (values) => {

        const request = props.commodity == null ? CommodityService.createCommodity(values) : CommodityService.updateCommodity(values);

        request.then(res => {
            console.log('response: ', res);
            if (res.data.success) {
                message.success(res.data.message);
                Modal.destroyAll();
                setVisible(false);
                navigate("/listcommodity" ,{replace: true});
            } else if (res.data.code == 20002) {
                navigate("/login" ,{replace: true});
            } else {
                message.error(res.data.message);
            }
        });

    };

    let trigerElement;
    if (props.action === 'add') {
        trigerElement =  <Button type="primary" shape="round" onClick={() =>{setVisible(true)}} icon={<PlusCircleOutlined/>} size='large'>
                              Add Commodity
                         </Button>
    } else {
        trigerElement = <EditOutlined key="edit" onClick={() => {
            setVisible(true);
        }}/>
    }

    return (
        <div>
            {trigerElement}
            <AddCommodity
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
                categorys={props.categorys}
                units={props.units}
                commodity={props.commodity}
            />
        </div>
    );
};

const EditCommodity = () => {
    const [visible, setVisible] = useState(false);
    const onCreate = (values) => {
        console.log('Received values of form: ', values);
        setVisible(false);
    };

    return (
        <div>


            <AddCommodity
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
            />
        </div>
    );

}

export default CollectionsPage;
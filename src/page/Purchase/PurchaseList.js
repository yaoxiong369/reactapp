import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {message, Space, Table} from 'antd';
import PurchaseService from "../../service/PurchaseService";
import {useParams} from "react-router-dom";
import AddPurchasePage from "./AddPurchase";
import CommodityService from "../../service/CommodityService";
import CategoryService from "../../service/CategoryService";
import {useNavigate} from "react-router";


const PurchaseList = (props) => {
    let navigate = useNavigate();
    let params = useParams();
    const [data, setData] = useState([]);
    const [units, setUnits] = useState([]);
    const [commodity, setCommodity] = useState({});
    const [condition, setCondition] = useState({"commodityId": params.commodityId});
    const [storageLocation, setStorageLocation] = useState([]);

    useEffect(() => {
        getPurchaseList();
        getUnitList();
        getCommodity();
        getStorageLocationList();
    }, [condition]);


    const getStorageLocationList = () => {
        CategoryService.getLocationList().then(
            (res) => {
                if (res && res.data && res.data.success && res.data.data) {
                    setStorageLocation(res.data.data.list);
                }else if (res.data.code == 20002) {
                    navigate("/login" ,{replace: true});
                } else {
                    message.error("get storage location list fail!");
                }
            }
        ).catch(
            (res) => {
                message.error("get storage location list fail!");
            }
        )
    }

    const getCommodity = () => {
        CommodityService.getCommodityById(params.commodityId)
            .then((res) => {
                if (res && res.data && res.data.success && res.data.data) {
                    setCommodity(res.data.data.object);
                }else if (res.data.code == 20002) {
                    navigate("/login" ,{replace: true});
                } else {
                    message.error(res.data.message);
                }
            })
    }

    const getUnitList = () => {
        CategoryService.getUnitList()
            .then((res) => {
                setUnits(res.data.data.list);
                }
            )
            .catch((res) => {
                message.error(res.data.message);
            });
    }


    const getPurchaseList = () => {

        // console.log("P commodityId : "+params.commodityId)
        PurchaseService.getPurchaseList(condition)
            .then((res) => {
                console.log("getPurchaseList res", res);
                if (res && res.data && res.data.success && res.data.data) {
                    setData(res.data.data.list);
                }else if (res.data.code == 20002) {
                    navigate("/login" ,{replace: true});
                } else {
                    message.error(res.data.message);
                }
            }).catch((res) => {
            message.error("get purchase list fail!");
        })
    }

    const columns = [
        {
            title: 'Purchase price',
            dataIndex: 'purchasePrice',
            key: 'purchasePrice',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Purchase quantity',
            dataIndex: 'purchaseQuantity',
            key: 'purchaseQuantity',
        },
        {
            title: 'Sell price',
            dataIndex: 'sellPrice',
            key: 'sellPrice',
        },
        {
            title: 'Remain',
            dataIndex: 'remain',
            key: 'remain',
        },
        {
            title: 'Create Date',
            dataIndex: 'createDate',
            key: 'createDate',
        },
        {
            title: 'Expiration Date',
            dataIndex: 'expirationDate',
            key: 'expirationDate',
        },
        {
            title: 'Storage Location',
            dataIndex: 'storageLocation',
            key: 'storageLocation',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                console.log("render", record),
                    <Space size="middle">
                        <AddPurchasePage commodity={commodity}
                                         unit_obj={units.find(val => val.id == commodity.unit)}
                                         purchase={record}
                                         storageLocation={storageLocation}/>
                        <a>{record.id}</a>
                    </Space>
            ),
        },
    ];

    return (
        <Table columns={columns} dataSource={data}/>
    )
}


export default PurchaseList;
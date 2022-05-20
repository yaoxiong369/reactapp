import React from 'react';
import 'antd/dist/antd.css';
import '../../index.css';
import {Card} from 'antd';
import AddPurchasePage from '../Purchase/AddPurchase'
import CollectionsPage from './AddCommodity'
import {Link, useNavigate} from "react-router-dom";
import {OrderedListOutlined, EllipsisOutlined, SettingOutlined} from '@ant-design/icons';

const {Meta} = Card;

const Card1 = (props) => {
    let navigate = useNavigate();
    const commodity = props.commodity;
    const categorys = props.categorys;
    const units = props.units;


    console.log("Card1", props.storageLocation);
    return (
        <Card
            id={commodity.id}
            bordered={false}
            hoverable
            cover={
                <AddPurchasePage picture={commodity.picture}
                                 commodity={commodity}
                                 unit_obj={units.find(val => val.id == commodity.unit)}
                                 action='add'
                                 storageLocation={props.storageLocation}/>

            }
            actions={[

                <Link to={'/purchaselist/' + commodity.id}> <OrderedListOutlined/> </Link>,
                <CollectionsPage action='edit' commodity={commodity} categorys={categorys} units={units}/>,

            ]}
        >
            <Meta
                title={commodity.name}
                description={commodity.remain == 0 ? "0" : commodity.remain}
            />
        </Card>)
}

export default Card1;
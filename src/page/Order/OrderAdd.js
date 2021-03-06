import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    InputNumber,
    message,
    Modal,
    Pagination,
    Row,
    Space
} from "antd";
import {FileAddOutlined, PlusOutlined} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import OrderEditCommodityDetail from "./OrderEditCommodityDetail";
import CommodityService from "../../service/CommodityService";
import uuid from "react-uuid";
import OrderService from "../../service/OrderService";
import {useSearchParams} from "react-router-dom";
import PlaceOrder from "./PlaceOrder";
import {useNavigate} from "react-router";
import JsonUtile from "../../util/JsonUtile";

const {RangePicker} = DatePicker;
const {Meta} = Card;

const OrderAdd = (props) => {
    const [commodtiyWithPurchases, setCommodtiyWithPurchases] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [itemCount, setItemCount] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [keyword, setKeyword] = useState("");
    let orderNumber = searchParams.get("orderNumber") == null ? uuid() : searchParams.get("orderNumber");
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        pageSize: 9
    })
    let navigate = useNavigate();
    console.log("remarks", searchParams.get("remarks"));
    console.log("customerNumber", searchParams.get("customerNumber"));

    const [loadings, setLoadings] = useState([]);

    const enterLoading = (index) => {
        setLoadings(prevLoadings => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });

        setTimeout(() => {
            setLoadings(prevLoadings => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
        }, 3000);
    };


    const getCommodtiyWithPurchases = (page, pageSize) => {
        CommodityService.getCommodtiyWithPurchases(page, pageSize, orderNumber, keyword).then(
            (res) => {
                if (res && res.data && res.data.success && res.data.data) {
                    console.log("res.data.data.object", res.data.data.object);
                    console.log("orderNumber", orderNumber);
                    setCommodtiyWithPurchases(res.data.data.object);
                    setTotalPrice(res.data.data.totalPrice);
                    setItemCount(res.data.data.itemCount);
                    setPageInfo({
                        currentPage: page,
                        pageSize:pageSize,
                        totalPage: res.data.data.total
                    });
                } else if (res.data.code == 20002) {
                    navigate("/login", {replace: true});
                } else {
                    message.error("get commodtiy fail!");
                }
            }
        ).catch(
            (res) => {
                message.error("get commodtiy list fail!");
            }
        )
    }

    function purchaseByPlus(commodtiyWithPurchase, index) {
        const purchaseListJson = JSON.parse(commodtiyWithPurchase.purchases);
        console.log("loadingNumber", index);

        if (commodtiyWithPurchase.purchases) {
            commodtiyWithPurchase.quantity = commodtiyWithPurchase.quantity != null ? commodtiyWithPurchase.quantity : 1
            var orderVo = {
                "commodityId": commodtiyWithPurchase.id,
                "name": commodtiyWithPurchase.name,
                "sellPrice": purchaseListJson[0].sellPrice,
                "orderNumber": orderNumber,
                "unit": commodtiyWithPurchase.unit,
                "quantity": commodtiyWithPurchase.quantity
            }

            const request = OrderService.createOrder(orderVo);
            enterLoading(index)
            request.then(res => {
                console.log('response: ', res);
                if (res.data.success) {
                    message.success(res.data.message);
                    setTotalPrice(totalPrice + purchaseListJson[0].sellPrice * commodtiyWithPurchase.quantity);
                    setItemCount(itemCount + commodtiyWithPurchase.quantity);
                    commodtiyWithPurchase.remain = commodtiyWithPurchase.remain - commodtiyWithPurchase.quantity;
                    setSearchParams({orderNumber})
                } else if (res.data.code == 20002) {
                    navigate("/login", {replace: true});
                } else {
                    message.error(res.data.message);
                }
            });
        } else {
            message.warn("Please add incoming information???");
        }
    }

    const setTotalPriceAndItemCount = (price, count) => {
        setTotalPrice(totalPrice + price);
        setItemCount(itemCount + count);
        setSearchParams({orderNumber});
    }


    useEffect(() => {
        getCommodtiyWithPurchases(pageInfo.currentPage,pageInfo.pageSize);
    }, [keyword])

    return (


        <div style={{width: 1012}}>
            <Row gutter={16}>
                <Col span={3} order={0}>
                    <h2>{totalPrice}</h2>
                </Col>
                <Col span={3} order={1}>
                    <PlaceOrder orderNumber={orderNumber} totalPrice={totalPrice} itemCount={itemCount}
                                remarks={searchParams.get("remarks")}
                                customerNumber={searchParams.get("customerNumber")}/>
                    {/*<Button type="primary" shape="round" icon={<FileAddOutlined/>} size='large'/>*/}
                </Col>
                <Col span={6} order={2}>

                </Col>
                <Col span={6} order={3}>
                    {/*<RangePicker size='large'/>*/}
                </Col>
                <Col span={6} order={4}>
                    <Search placeholder="input search text" onSearch={(value, event) => {
                        setKeyword(value)
                    }} size='large' enterButton/>
                </Col>
            </Row>
            <Divider dashed/>

            <Row gutter={[24, 24]}>
                {commodtiyWithPurchases.map(
                    (commodtiyWithPurchase, index) => {
                        const description = "remain:" + commodtiyWithPurchase.remain + "(" + commodtiyWithPurchase.unit + ")";
                        return (

                            <Col span={8}>
                                <Card
                                    hoverable
                                    actions={[

                                        <div style={{marginLeft: 10, marginRight: 10}}>
                                            <Row justify="space-between">
                                                <Col span={4}>
                                                    <div style={{width: 50}}>
                                                        <OrderEditCommodityDetail
                                                            setTotalPriceAndItemCount = {setTotalPriceAndItemCount}
                                                            orderNumber={orderNumber}
                                                            commodtiyWithPurchase={commodtiyWithPurchase}/>
                                                    </div>
                                                </Col>
                                                <Col span={6}></Col>

                                                <Col span={6}><Space>
                                                    <InputNumber style={{width: 50}} defaultValue={1} min={1}
                                                                 size="small" onChange={(value) => {
                                                        commodtiyWithPurchase.quantity = value
                                                    }}/>
                                                    <Button type="primary" shape="circle" icon={<PlusOutlined/>}
                                                            size='small' loading={loadings[index]}
                                                            onClick={() => purchaseByPlus(commodtiyWithPurchase, index)}/>
                                                </Space></Col>
                                            </Row>
                                        </div>,
                                    ]}
                                >

                                    <Meta
                                        avatar={<Avatar size={64}
                                                        src={(commodtiyWithPurchase.picture && JsonUtile.jsonToString(commodtiyWithPurchase.picture)['url1']) == null ?
                                                            'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png' : JsonUtile.jsonToString(commodtiyWithPurchase.picture)['url1']}/>}
                                        title={commodtiyWithPurchase.name}
                                        description={description}
                                    />

                                </Card>
                            </Col>

                        )
                            ;
                    }
                )}
            </Row>
            <Row style={{margin: '16px 0'}}>
                <Pagination total={pageInfo.totalPage}
                            current={pageInfo.currentPage}
                            defaultCurrent={1}
                            defaultPageSize={9}
                            showSizeChanger
                            showQuickJumper
                            pageSize={pageInfo.pageSize}
                            pageSizeOptions={[9, 18, 27]}
                            onChange={getCommodtiyWithPurchases}
                            showTotal={total => `Total ${pageInfo.totalPage} items`}
                />

            </Row>
        </div>
    );
};

export default OrderAdd;

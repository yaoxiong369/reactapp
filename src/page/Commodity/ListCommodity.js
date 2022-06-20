import {Col, Menu, message, Pagination, Row} from "antd";
import CollectionsPage from "./AddCommodity";
import Card1 from "./Card1";
import React, {useEffect, useState} from "react";
import CommodityService from "../../service/CommodityService";
import CategoryService from "../../service/CategoryService";
import Search from "antd/es/input/Search";
import {useNavigate} from "react-router";

const ListCommodity = () => {
    let navigate = useNavigate();
    const [commoditys, setCommoditys] = useState([]);
    const [categorys, setCategorys] = useState([]);
    const [units, setUnits] = useState([]);
    const [condition, setCondition] = useState({});
    const [storageLocation, setStorageLocation] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        pageSize: 12
    })

    const getStorageLocationList = () => {
        CategoryService.getLocationList().then(
            (res) => {
                if (res && res.data && res.data.success && res.data.data) {
                    setStorageLocation(res.data.data.list);
                } else if (res.data.code == 20002) {
                    navigate("/login", {replace: true});
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

    const getCategoryAndUnit = () => {
        CategoryService.getCategoryList()
            .then((res) => {
                    setCategorys(res.data.data.list);
                    console.log("getCategoryList", categorys);
                }
            )
            .catch((res) => {
                message.error(res.data.message);
            });
        CategoryService.getUnitList()
            .then((res) => {
                    setUnits(res.data.data.list);
                    console.log("getUnitList", units);
                    console.log("res", res);
                }
            )
            .catch((res) => {
                message.error(res.data.message);
            });
    }

    const handlePage = (page , page_size) => {
        console.log("page condition", condition);
        CommodityService.getCommodityList(page, page_size, condition)
            .then((res) => {
                    setCommoditys(res.data.data.commodityList);
                    setPageInfo({
                        currentPage: page,
                        pageSize:page_size,
                        totalPage: res.data.data.total
                    });

                }
            )
            .catch((res) => {
                console.log("res", res);
                alert("error get commodity list");
            });
    }

    useEffect(() => {
        getCategoryAndUnit();
        getStorageLocationList();
        handlePage(pageInfo.currentPage,pageInfo.pageSize);
    }, [condition]);

    return (
        <Row gutter={16} justify="center" style={{width:1012}}>
            <Col span={6}>
                <Menu onClick={(info) => {
                    console.log("Menu.Item.key", info.key);
                    setCondition({categoryId: info.key});
                }}>
                    <Menu.Item key={0}>ALL</Menu.Item>
                    {categorys.map(
                        category => {
                            return (
                                <Menu.Item
                                    key={category.id}
                                >{category.name}</Menu.Item>
                            );
                        }
                    )}

                </Menu>
            </Col>
            <Col span={18}>
                <Row gutter={8} align="middle" justify="space-around" style={{margin: '0 0 16px'}}>
                    <Col>
                        <strong>Commodity</strong>
                    </Col>
                    <Col span={10}>
                        <Search placeholder="input search text" size='large' onSearch={(value, event) => {
                            setCondition({searchKeyWord: value})
                        }} enterButton/>
                    </Col>
                    <Col span={6}>
                        <CollectionsPage action='add'
                                         categorys={categorys}
                                         units={units}/>
                    </Col>
                </Row>

                <Row gutter={[16, 8]} justify="start">
                    {commoditys.map(
                        commodity => {

                            return (
                                <Col span={6}>
                                    <Card1 commodity={commodity}
                                           categorys={categorys}
                                           units={units}
                                           storageLocation={storageLocation}/>
                                </Col>
                            );
                        }
                    )}


                </Row>
                <Row style={{margin: '16px 0'}}>
                    <Pagination total={pageInfo.totalPage}
                                current={pageInfo.currentPage}
                                defaultCurrent={1}
                                defaultPageSize={12}
                                showSizeChanger
                                showQuickJumper
                                pageSize={pageInfo.pageSize}
                                pageSizeOptions={[12, 24, 36]}
                                onChange={handlePage}
                                showTotal={total => `Total ${pageInfo.totalPage} items`}
                    />

                </Row>

            </Col>
        </Row>
    )
}


export default ListCommodity;
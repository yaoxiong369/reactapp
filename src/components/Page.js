import React from 'react';
import 'antd/dist/antd.css';
import {Pagination} from 'antd';



function Page(props){
    return (
        <Pagination total={props.pageInfo.totalPage}
                    defaultCurrent={props.pageInfo.currentPage}
                    showSizeChanger
                    showQuickJumper
                    pageSize = {9}
                    pageSizeOptions={[9,19,29]}
                    onChange={props.onChange}
                    showTotal={total => `Total ${props.pageInfo.totalPage} items`}
        />
    )
}

export default Page;



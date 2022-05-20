import React from 'react';
import 'antd/dist/antd.css';
import {message, Modal, Upload} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import JsonUtile from '../util/JsonUtile'


function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}


export default class PicturesWall extends React.Component {

    state = {
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: this.props.arr,
    };

    handleCancel = () => this.setState({previewVisible: false});

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChange = ({fileList}) => {
        console.log('handleChange ', {fileList});
        let map = new Map();
        let i = 1;
        fileList.forEach(imgItem => {

            if(imgItem && imgItem.status == 'done' && imgItem.url !=null){
                map.set('url'+ i++,imgItem.url );
            }else if(imgItem && imgItem.status == 'done' && imgItem.response && imgItem.response.success && imgItem.response.data.url) {
                imgItem.thumbUrl = imgItem.response.data.url;
                map.set('url'+ i++,imgItem.thumbUrl);
            }
            this.props.form.setFieldsValue({picture:JsonUtile.mapToJson(map)});
        });
        this.setState({fileList});
    }




    render() {
        const {previewVisible, previewImage, fileList, previewTitle} = this.state;


        const uploadButton = (
            <div>
                <PlusOutlined/>
                <div style={{marginTop: 8}}>Upload</div>
            </div>
        );


        return (
            <>
                <Upload
                    action="/api/commodity/uploadImage"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}

                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </>
        );
    }
}


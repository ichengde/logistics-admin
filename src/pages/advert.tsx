import { environment } from '@/constants';
import request from '@/request';
import { InboxOutlined } from '@ant-design/icons';
import { Card, message, Select, Space, Upload } from 'antd';
import React from 'react';
const { Dragger } = Upload;
const { Option } = Select;

export default () => {
  const props = {
    name: 'file',
    multiple: false,

    onSuccess(ret, file) {
      console.log('onSuccess', ret, file.name);
      if (ret.code === 0) {
        message.success('上传成功', 1000, () => {
          location.href = location.href;
        });
      }
    },

    customRequest({ file, onSuccess, onProgress }) {
      const commit = new FormData();
      commit.append('file', file);

      request
        .post('/logistics/advert/upload', {
          data: commit,
        })
        .then(function (response) {
          onProgress({ percent: Math.round(100).toFixed(2) }, file);

          onSuccess(response, file);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  };

  return (
    <div>
      <Space direction="vertical">
        <Card>
          <h1>当前广告</h1>
          <img
            src={environment.REQUEST_URL + '/logistics/open/advert/get'}
          ></img>
        </Card>
        <Card>
          <h2>广告位上传(建议宽350px高200像素的图片</h2>

          <Dragger listType="picture" {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">拖拽文件到该区域进行上传</p>
            <p className="ant-upload-hint"></p>
          </Dragger>
        </Card>
      </Space>
    </div>
  );
};

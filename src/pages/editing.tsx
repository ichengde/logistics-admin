import { dateFormatShow, room_list, useDetailColumns, dateTimeFormatShow } from '@/constants';
import request from '@/request';
import { Button, Card, Col, DatePicker, Descriptions, Form, Input, InputNumber, message, Row, Table, Space, Popconfirm } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { history, useDispatch } from 'umi';
import styles from './editing.less';
import Title from 'antd/lib/typography/Title';


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 8 },
};




export default (props) => {
  const { params, path } = props.match;
  let { id } = params;
  const [form] = Form.useForm();
  const [logisticsForm] = Form.useForm();

  const isEntering = path === '/entering';

  const dispatch = useDispatch();

  let [orderId, setOrderId]: any = useState({});
  useEffect(() => {
    if (!id) return;
    requestDetail(id);

    requestLogisticsList(id);
  }, [orderId])

  let [logisticsList, setLogisticsList]: any = useState([]);


  const requestLogisticsList = (orderId) => {
    request
      .post(`/logistics/address/list/${orderId}`)
      .then((response) => {
        let { data } = response;
        data = data.map(p => {
          p.time = moment(p.time).format(dateTimeFormatShow);
          p.key = p._id;

          return p;
        })
        setLogisticsList(data);
      });
  }

  const requestDetail = (orderId) => {
    request
      .post(`/logistics/order/detail/${orderId}`)
      .then(function (response) {
        const rD = response.data;
        rD.time = [moment(rD.checkInTime), moment(rD.checkOutTime)]

        form.setFieldsValue(rD);
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  const onFinish = values => {
    let formData = values;
    console.log(formData);
    const ss = function (response) {
      message.info(response.message ?? (path === '/entering' ? '保存成功' : '更新成功'));

      /* 
            dispatch({
              type: 'list/set',
              payload: { floor: parseInt((formData as any).room_number.toString().slice(0, 1)) },
            }); 
      */
      if (response.code === 0) {
        history.push('/list');
      }
      
    }

    const ff = function (error) {
      console.log(error);
    }

    if (path === '/entering') {

      request
        .post('/logistics/order/add', {
          data: formData
        })
        .then(ss)
        .catch(ff);

    } else {

      request
        .post('/logistics/order/update/' + formData._id, {
          data: formData
        })
        .then(ss)
        .catch(ff);

    }

  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const onValuesChange = (value, allValue) => {
    console.log(value, allValue);

  }


  function onChange(value, dateString) {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  }

  function onOk(value) {
    console.log('onOk: ', value);
  }

  return <div className={styles.layout}>

    <Card style={{ margin: 20 }}>
      <Form
        {...layout}
        className={styles.form}
        name="basic"
        onFinish={onFinish}
        form={form}
        onFinishFailed={onFinishFailed}
        onValuesChange={onValuesChange}
      >
        {isEntering === false && <Form.Item label="id"
          name="_id"
          rules={[{ required: isEntering }]}
        >
          <Input disabled={isEntering === false} />
        </Form.Item>}

        <Form.Item label="单号"
          name="serialNumber"
          rules={[{ required: true, message: '请输入单号!' }]}
        >
          <Input disabled={isEntering === false} placeholder="单号" style={{ width: 300 }} />
        </Form.Item>

        <Form.Item label="客户唛头"
          name="nameEn"
          rules={[{ required: true, message: '请输入客户唛头!' }]}
        >
          <Input disabled={isEntering === false} placeholder="客户唛头" style={{ width: 300 }} />
        </Form.Item>

        <Form.Item
          label="客户姓名"
          name="name"
          rules={[{ required: true, message: '请输入客户姓名!' }]}
        >
          <Input placeholder="客户姓名" style={{ width: 300 }} />
        </Form.Item>

        <Form.Item
          label="手机号"
          name="phone"
          rules={[{ required: true, message: '请输入手机号!' }]}
        >
          <Input placeholder="手机号" style={{ width: 300 }} />
        </Form.Item>

        <Form.Item
          label="备注"
          name="remark"
          rules={[]}
        >
          <Input.TextArea rows={5} cols={30} autoSize={true} />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">{isEntering === false ? '更新' : '录入'}</Button>
        </Form.Item>
      </Form>

    </Card>




    {isEntering === false &&
      <> <Card style={{ margin: 20 }}>

        <Title level={3}>物流地址记录</Title>

        <Table pagination={{ pageSize: 9 }} dataSource={logisticsList} columns={[
          {
            key: 'time', dataIndex: 'time', title: '时间',
          }, {
            key: 'address', dataIndex: 'address', title: '地址',
          }, {
            key: 'remark', dataIndex: 'remark', title: '备注',
          },
          /* {
            key: 'updateTime', dataIndex: 'updateTime', title: '更新时间',
          }, */
          {
            title: '操作',
            key: 'action',
            render: (text, record: any) => (
              <Space size="middle">
                <Popconfirm
                  title="确认进行删除吗?"
                  onConfirm={() => {

                    request.get(`/logistics/address/delete/${record._id}`)
                      .then((response) => {
                        message.info(response.message);

                        requestLogisticsList(id);
                      })

                  }}
                  onCancel={() => { }}
                  okText="确定"
                  cancelText="取消"
                >
                  <a href="#">删除</a>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
        />
      </Card>


        <Card style={{ margin: 20 }}>

          <Title level={3}>新增物流地址</Title>
          <Form
            layout={'horizontal'}
            form={logisticsForm}
            initialValues={{}}
            onValuesChange={() => { }}
            onFinish={(values) => {

              const addressEntity = values;

              addressEntity.time = addressEntity.time.valueOf();
              addressEntity.orderId = form.getFieldValue("_id");
              console.log(addressEntity);

              request
                .post(`/logistics/address/add`, {
                  data: addressEntity
                })
                .then(function (response) {
                  message.info(response.message ?? (path === '/entering' ? '保存成功' : '更新成功'));

                  requestLogisticsList(id);

                  logisticsForm.resetFields();
                })
                .catch(function (error) {
                  console.log(error);
                });

              /* requestList(values); */

            }}
          >

            <Space>

              <Form.Item
                label="时间"
                name="time"
                rules={[{ required: true, message: '请输入时间!' }]}
              >
                <DatePicker showTime onChange={onChange} onOk={onOk} />
              </Form.Item>

              <Form.Item
                label="地址"
                name="address"
                rules={[{ required: true, message: '请输入地址!' }]}
              >
                <Input style={{ width: 500 }} />
              </Form.Item>

              <Form.Item
                label="备注"
                name="remark"
              >
                <Input style={{ width: 150 }} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">新增</Button>
              </Form.Item>

            </Space>
          </Form>


        </Card>
      </>}
  </div>;
};
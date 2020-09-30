import { dateTimeFormatShow } from '@/constants';
import request from '@/request';
import { Button, Card, Descriptions, Form, Input, message, Popconfirm, Select, Space, Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { history, useDispatch, useSelector } from 'umi';

const { Option } = Select;


export default (props) => {

  const listFormValue = useSelector((state) => state['list']);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [formLayout, setFormLayout] = useState('inline');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 1000
  });

  const [list, setList] = useState([]);

  const onFormValueChange = (values) => {
    console.log(values);

    dispatch({
      type: 'list/set',
      payload: values,
    });
  };

  /* https://codesandbox.io/s/3nxib?file=/index.js:782-792 */
  const requestSearch = (values) => {

    const { search } = values;

    if (!search) {
      requestList(0);

      return;
    }

    request(`/logistics/order/search/${search}`)
      .then(function (response) {
        let { data } = response;
        data = data.map(a => {
          a.key = a._id;

          return a;
        })

        setList(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const requestList = (pagination) => {
    const { current } = pagination;
    let page = 0;
    if (current) {
      page = current - 1;
    }

    request(`/logistics/order/list/${page}`)
      .then(function (response) {
        let { data } = response;
        data = data.map(a => {
          a.key = a.serialNumber;
          const address = a.address[0];
          if (address) {
            a.currentAddress = address.address;
            a.currentTime = moment(address.time).format(dateTimeFormatShow);
          }

          delete a.address;

          return a;
        });

        console.log(data);

        setList(data);
      })
      .catch(function (error) {
        console.log(error);
      });



  }

  const formItemLayout =
    formLayout === 'horizontal'
      ? {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      }
      : null;

  useEffect(() => {
    requestList(listFormValue);
  }, [])

  const [selectedRowKeys, setSelectedRowKeys]: [any, any] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (r) => {
      setSelectedRowKeys(r);
    },
  };
  const hasSelected = selectedRowKeys.length > 0;



  const handleTableChange = (pagination, filters, sorter) => {
    requestList(pagination);


    console.log(pagination);


    setPagination({
      ...pagination,
    })
  };


  return (
    <div>
      <Card >

        <Form
          {...formItemLayout}
          layout={'inline'}
          form={form}
          initialValues={listFormValue}
          onValuesChange={onFormValueChange}
          onFinish={(values) => { requestSearch(values); }}
        >

          <Space>

            <Form.Item
              label="快递单号/客户姓名/手机号"
              name="search">
              <Input style={{ width: 300 }} >
              </Input>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">搜索</Button>
            </Form.Item>

          </Space>
        </Form>
      </Card>

      <Table
        pagination={pagination}
        rowSelection={rowSelection}
        dataSource={list}
        onChange={handleTableChange}
        columns={[
          {
            key: 'serialNumber', dataIndex: 'serialNumber', title: '快递单号',
          },
          {
            key: 'nameEn', dataIndex: 'nameEn', title: '客户唛头',
          },
          {
            key: 'name', dataIndex: 'name', title: '客户姓名',
          },
          {
            key: 'phone', dataIndex: 'phone', title: '手机号',
          },
          {
            key: 'currentAddress', dataIndex: 'currentAddress', title: '当前地址',
          },
          {
            key: 'currentTime', dataIndex: 'currentTime', title: '更新时间',
          },
          {
            key: 'remark', dataIndex: 'remark', title: '备注',
          },
          {
            title: '操作',
            key: 'action',
            render: (text, record: any) => (
              <Space size="middle">
                <a onClick={() => { history.push(`/editing/${record._id}`); }}>编辑</a>

                <Popconfirm
                  title="确认进行删除吗?"
                  onConfirm={() => {
                    request.get(`/logistics/order/delete/${record._id}`)
                      .then((response) => {
                        if (response.code === 0) {
                          message.info('删除成功');

                          requestList(listFormValue);
                        }
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
        expandable={{
          expandedRowRender: record => <Descriptions title="" layout="vertical"
            column={{ xxl: 6, xl: 6, lg: 4, md: 4, sm: 2, xs: 1 }}>

          </Descriptions>,
          rowExpandable: record => record.name !== 'Not Expandable',
        }} />
    </div >
  );
}



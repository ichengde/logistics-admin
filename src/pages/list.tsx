import { dateTimeFormatShow, environment } from '@/constants';
import request from '@/request';
import {
  CloudDownloadOutlined,
  DownOutlined,
  TableOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  Upload,
  Modal,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { history, useDispatch, useSelector } from 'umi';
const { Option } = Select;
const download = (link) => {
  const a = document.createElement('a');
  a.href = link;

  a.click();
};

const menu = (
  <Menu>
    <Menu.Item
      key="1"
      icon={<TableOutlined />}
      onClick={() => {
        download('./批量增加模板.xls');
      }}
    >
      批量增加模板
    </Menu.Item>
    <Menu.Item
      key="2"
      icon={<TableOutlined />}
      onClick={() => {
        download('./批量更新模板 - 根据快递单号.xls');
      }}
    >
      批量更新模板 - 根据快递单号
    </Menu.Item>

    <Menu.Item
      key="3"
      icon={<TableOutlined />}
      onClick={() => {
        download('./批量更新模板 - 根据备注.xls');
      }}
    >
      批量更新模板 - 根据备注
    </Menu.Item>
  </Menu>
);

export default (props) => {
  const listFormValue = useSelector((state) => state['list']);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [formLayout, setFormLayout] = useState('inline');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 1000,
  });

  const [list, setList] = useState([]);
  const [batchResult, setBatchResult] = useState([]);

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
        data = data.map((a) => {
          a.key = a._id;

          return a;
        });

        setList(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const requestList = (pagination) => {
    const { current } = pagination;
    let page = 0;
    if (current) {
      page = current - 1;
    }

    request(`/logistics/order/list/${page}`)
      .then(function (response) {
        let { data } = response;
        data = data.map((a) => {
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
  };

  const formItemLayout =
    formLayout === 'horizontal'
      ? {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        }
      : null;

  useEffect(() => {
    requestList(listFormValue);
  }, []);

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
    });
  };

  return (
    <div>
      <Card>
        <Form
          {...formItemLayout}
          layout={'inline'}
          form={form}
          initialValues={listFormValue}
          onValuesChange={onFormValueChange}
          onFinish={(values) => {
            requestSearch(values);
          }}
        >
          <Space>
            <Form.Item label="快递单号/客户姓名/手机号" name="search">
              <Input style={{ width: 300 }}></Input>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </Form.Item>
            <Button
              onClick={() => {
                window.open(
                  environment.REQUEST_URL +
                    '/logistics/batch/export?token=' +
                    sessionStorage.getItem('token'),
                );
              }}
            >
              <CloudDownloadOutlined />
              下载数据
            </Button>

            <Dropdown overlay={menu}>
              <Button>
                <CloudDownloadOutlined />
                下载批量模板
                <DownOutlined />
              </Button>
            </Dropdown>

            <Dropdown
              overlay={
                <Menu>
                  {[
                    {
                      url: '/logistics/batch/add',
                      name: '批量添加',
                    },
                    {
                      url: '/logistics/batch/updateByOrderId',
                      name: '批量更新 - 根据快递单号',
                    },
                    {
                      url: '/logistics/batch/updateByRemark',
                      name: '批量更新 - 根据备注',
                    },
                  ].map(({ url, name }, index) => {
                    return (
                      <Menu.Item
                        key={index}
                        icon={<TableOutlined />}
                        onClick={() => {}}
                      >
                        <Upload
                          name={'file'}
                          multiple={false}
                          accept={'.xlsx,.xls'}
                          beforeUpload={(file) => {
                            if (
                              file.type !== 'application/vnd.ms-excel' &&
                              file.type !==
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                            ) {
                              message.error(`${file.name} 不是Excel文件`);
                            }
                            return true;
                          }}
                          customRequest={({ file, onSuccess, onProgress }) => {
                            const commit = new FormData();
                            commit.append('file', file);

                            request
                              .post(url, {
                                data: commit,
                              })
                              .then(function (response) {
                                onProgress({ percent: Math.round(100) }, file);

                                onSuccess(response, file);
                                setBatchResult(JSON.parse(response.data));
                                if (response.code === 0) {
                                  message.success('上传成功', 1000, () => {
                                    location.href = location.href;
                                  });
                                }
                              })
                              .catch(function (error) {
                                console.log(error);
                              });
                          }}
                        >
                          {name}
                        </Upload>
                      </Menu.Item>
                    );
                  })}
                </Menu>
              }
            >
              <Button>
                <UploadOutlined />
                批量动作
                <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
        </Form>
      </Card>

      <Table
        pagination={pagination}
        // rowSelection={rowSelection}
        dataSource={list}
        onChange={handleTableChange}
        columns={[
          {
            key: 'serialNumber',
            dataIndex: 'serialNumber',
            title: '快递单号',
          },
          {
            key: 'nameEn',
            dataIndex: 'nameEn',
            title: '客户唛头',
          },
          {
            key: 'name',
            dataIndex: 'name',
            title: '客户姓名',
          },
          {
            key: 'phone',
            dataIndex: 'phone',
            title: '手机号',
          },
          {
            key: 'currentAddress',
            dataIndex: 'currentAddress',
            title: '当前地址',
          },
          {
            key: 'currentTime',
            dataIndex: 'currentTime',
            title: '更新时间',
          },
          {
            key: 'remark',
            dataIndex: 'remark',
            title: '备注',
          },
          {
            title: '操作',
            key: 'action',
            render: (text, record: any) => (
              <Space size="middle">
                <a
                  onClick={() => {
                    history.push(`/editing/${record._id}`);
                  }}
                >
                  编辑
                </a>

                <Popconfirm
                  title="确认进行删除吗?"
                  onConfirm={() => {
                    request
                      .get(`/logistics/order/delete/${record._id}`)
                      .then((response) => {
                        if (response.code === 0) {
                          message.info('删除成功');

                          requestList(listFormValue);
                        }
                      });
                  }}
                  onCancel={() => {}}
                  okText="确定"
                  cancelText="取消"
                >
                  <a href="#">删除</a>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
        // expandable={{
        //   expandedRowRender: record => <Descriptions title="" layout="vertical"
        //     column={{ xxl: 6, xl: 6, lg: 4, md: 4, sm: 2, xs: 1 }}>

        //   </Descriptions>,
        //   rowExpandable: record => record.name !== 'Not Expandable',
        // }}
      />

      <Modal
        title="批量导入结果"
        visible={batchResult.length > 0}
        footer={
          <Button
            onClick={() => {
              setBatchResult([]);
            }}
          >
            已知
          </Button>
        }
      >
        {batchResult.map((i: any, j) => {
          return (
            <div key={j}>
              {Object.keys(i)
                .map((j) => i[j])
                .join('-')}
            </div>
          );
        })}
      </Modal>
    </div>
  );
};

import { environment } from '@/constants';
import { Button, Form, Input, message } from 'antd';

import React from 'react';
import { history } from 'umi';
import request from '@/request';
import styles from './login.less';
import Title from 'antd/lib/typography/Title';
/* https://github.com/umijs/umi-request */


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 8 },
};

export default () => {
  const onFinish = values => {

    request
      .post('/common/login', {
        data: {
          username: values.username,
          password: values.password,
          app: 'logistics',
        }
      })
      .then(function (response) {
        if (response.token) {
          sessionStorage.setItem('token', response.token);

          history.push('/list');
        }

        message.info(response.message);
      })
      .catch(function (error) {
        console.log(error);
      });

  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return <div>
    <div className={styles.layout}>
      <Form
        {...layout}
        className={styles.form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="账号"
          name="username"
          rules={[{ required: true, message: '请输入账号!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password />
        </Form.Item>

        {/*    <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item> */}

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            登录
        </Button>
        </Form.Item>
      </Form>

    </div>
  </div>;
};
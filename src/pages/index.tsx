import React from 'react';
import styles from './index.less';
import { Button, Space } from 'antd';
import Title from 'antd/lib/typography/Title';
import { history } from 'umi';

export default () => {
  return (
    <div className={styles.layout}>
      <Space direction="vertical">
        <Title>物流管理</Title>
        <Button type="primary" onClick={
          () => {
            history.push('/login');
          }
        }>进入</Button>
      </Space>
    </div>
  );
}

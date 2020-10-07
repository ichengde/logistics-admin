import { Layout, Menu, ConfigProvider } from 'antd';
import 'antd/dist/antd.css';
import locale from 'antd/es/locale/zh_CN';
import React from 'react';
import { history } from 'umi';
import styles from './index.less';

const { Header, Content, Footer } = Layout;

export default (props) => {
  const l = [
    {
      key: '1',
      path: '/list',
      name: '列表',
    },
    {
      key: '2',
      path: '/entering',
      name: '录入',
    },
    {
      key: '3',
      path: '/advert',
      name: '广告',
    } /* 
  {
    key: '4',
    path: '/setting',
    name: '设置'
  } */,
  ];

  const onCollapse = (collapsed) => {
    console.log(collapsed);
  };

  return (
    <ConfigProvider locale={locale}>
      <Layout className={`layout ${styles.noPrint}`}>
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={l
              .filter((a) => a.path === props.location.pathname)
              .map((b) => b.key)}
          >
            {l.map((i) => (
              <Menu.Item
                key={i.key}
                onClick={() => {
                  history.push(i.path);
                }}
              >
                {i.name}
              </Menu.Item>
            ))}
          </Menu>
        </Header>

        <Layout>
          {/*   <Layout.Sider collapsed={false} onCollapse={onCollapse}>

        </Layout.Sider> */}
          <Layout>
            <Content style={{ padding: '0 50px' }}>
              <div className="site-layout-content">{props.children}</div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              <a href="https://www.ihook.center">物流管理后台 ©2020</a>
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

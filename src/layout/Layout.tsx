import { Layout, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import Sidebar from './Sidebar/Sidebar';
import { getSidebarCollapsed, setSidebarCollapsed } from '@/service/storage';

const { Content } = Layout;

const AppLayout: React.FC = () => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(getSidebarCollapsed() || false);
  }, []);

  const handleCollapse = (value: boolean) => {
    console.log(value);
    setCollapsed(value);
    setSidebarCollapsed(value);
  };

  return (
    <Layout>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} handleCollapse={handleCollapse} />
      <Layout>
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} handleCollapse={handleCollapse} />

        <Content style={{ margin: '0 16px' }}>
          {/* <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb> */}
          <div
            style={{
              padding: 24,
              minHeight: 360,
              borderRadius: borderRadiusLG,
              overflow: 'auto',
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default AppLayout;

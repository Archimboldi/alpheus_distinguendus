import './App.css';
import 'antd/dist/antd.css';
import React from 'react';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Shebei from './Pages/Shebei';

const { Header, Sider, Content } = Layout;
class App extends React.Component {
  state = {
    collapsed: false,
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  render() {
    return (
      <Layout>
        <Router>
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1" icon={<UserOutlined />}>
                <Link to="/" style={{color:"#7a7a7a"}}>
                  项目
                </Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                <Link to="/shebei" style={{color:"#7a7a7a"}}>
                  设备
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
        
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }}>
              {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: this.toggle,
              })}
            </Header>
            <Content
              className="site-layout-background"
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 700,
              }}
            >
            <Switch id="div2">
              {/* <Route exact path="/">
                <ApolloProvider>
                  <Xiangmu />
                </ApolloProvider>
              </Route> */}
              <Route path="/shebei" key="2">
                <Shebei />
              </Route>
            </Switch>
            
        
            </Content>
          </Layout>
        </Router>
      </Layout>
    )
  }
}

export default App;

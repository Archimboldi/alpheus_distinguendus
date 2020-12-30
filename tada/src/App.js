import './App.css';
import 'antd/dist/antd.css';
import React from 'react';
import { Layout, Menu, Image, Button } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  AuditOutlined,
  ContactsFilled,
  BoxPlotFilled,
  TeamOutlined,
  FileSearchOutlined,
  UserOutlined,
  AppstoreAddOutlined
} from '@ant-design/icons';
import { HashRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import Shebei from './Pages/Shebei';
import Xiangmu from './Pages/Xiangmu';
import Yuangong from './Pages/Yuangong';
import Haocai from './Pages/Haocai';
import Kehu from './Pages/Kehu';
import Rizhi from './Pages/Rizhi';
import User from './Pages/User';
import Login from './Login';
import MyRoute from './Pages/MyRoute';

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
            <div style={{marginLeft:"40px",marginTop:"19px"}}>
              <Image preview={false} src="logo.png" width="100px" />
            </div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{marginTop:10}}>
              <Menu.Item key="1" icon={<AuditOutlined />}>
                <Link to="/xiangmu" style={{color:"#7a7a7a"}}>
                  项目
                </Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<BoxPlotFilled />}>
                <Link to="/shebei" style={{color:"#7a7a7a"}}>
                  设备
                </Link>
              </Menu.Item>
              <Menu.Item key="4" icon={<TeamOutlined />}>
                <Link to="/yuangong" style={{color:"#7a7a7a"}}>
                  员工
                </Link>
              </Menu.Item>
              <Menu.Item key="5" icon={<AppstoreAddOutlined />}>
                <Link to="/haocai" style={{color:"#7a7a7a"}}>
                  耗材
                </Link>
              </Menu.Item>
              <Menu.Item key="3" icon={<ContactsFilled />}>
                <Link to="/kehu" style={{color:"#7a7a7a"}}>
                  客户
                </Link>
              </Menu.Item>
              <Menu.Item key="6" icon={<FileSearchOutlined />}>
                <Link to="/rizhi" style={{color:"#7a7a7a"}}>
                  日志
                </Link>
              </Menu.Item>
              <Menu.Item key="7" icon={<UserOutlined />}>
                <Link to="/user" style={{color:"#7a7a7a"}}>
                  用户
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
              <Button onClick={()=>{sessionStorage.removeItem('token');
                window.location.href = "/login";}} style={{float:'right',margin:'17px'}}>退出</Button>
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
              <Route path='/login' component={Login}></Route>
              <MyRoute path="/" component={Xiangmu} exact></MyRoute>
              <MyRoute path="/xiangmu">
                <Xiangmu />
              </MyRoute>
              <MyRoute path="/shebei" key="2">
                <Shebei />
              </MyRoute>
              <MyRoute path="/kehu" key="3">
                <Kehu />
              </MyRoute>
              <MyRoute path="/yuangong" key="4">
                <Yuangong />
              </MyRoute>
              <MyRoute path="/haocai" key="5">
                <Haocai />
              </MyRoute>
              <MyRoute path="/rizhi" key="6">
                <Rizhi />
              </MyRoute>
              <MyRoute path="/user" key="7">
                <User />
              </MyRoute>
              <Redirect to="/login"></Redirect>
            </Switch>
            
        
            </Content>
          </Layout>
        </Router>
      </Layout>
    )
  }
}

export default App;

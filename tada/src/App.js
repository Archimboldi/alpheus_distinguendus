import './App.css';
import 'antd/dist/antd.css';
import React from 'react';
import { Layout, Menu, Image, Button } from 'antd';
import { gql, useQuery } from '@apollo/client';
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
const { SubMenu } = Menu;
const FIND_XIANGMU = gql`
  query FindXiang($xmmc:String!){
    xiangmus(xmmc: $xmmc) {
      id,xmmc,xmbh
    }
  }
`;
const FIND_SBLX = gql`
  query FindSblx{
    sblxs{
      sblx
    }
  }
`;
const { Header, Sider, Content } = Layout;
class Side extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      xms: props.xmdata.xiangmus,
      sblxs: props.lxdata.sblxs,
      username: props.username
    };

  }
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
              <SubMenu key="2" icon={<BoxPlotFilled />} title="设备">
                <Menu.Item key="-1">
                  <Link to={'/shebei/-1'} style={{color:"#7a7a7a"}}>
                    全部
                  </Link>
                </Menu.Item>
                <Menu.Item key="00">
                  <Link to={'/shebei/0'} style={{color:"#7a7a7a"}}>
                    库房
                  </Link>
                </Menu.Item>
                {this.state.sblxs.map(lx=>(
                  <Menu.Item key={'s'+lx.sblx}>
                      <Link to={'/shebei/'+lx.sblx} style={{color:"#7a7a7a"}}>
                        {lx.sblx}
                      </Link>
                  </Menu.Item>
                ))}
              </SubMenu>
              <SubMenu key="3" icon={<TeamOutlined />} title="员工">
                <Menu.Item key="-2">
                  <Link to={'/yuangong/-1'} style={{color:"#7a7a7a"}}>
                    全部
                  </Link>
                </Menu.Item>
                {this.state.xms.map(xm=>(
                  <Menu.Item key={xm.xmbh}>
                      <Link to={'/yuangong/'+xm.id} style={{color:"#7a7a7a"}}>
                        {xm.xmmc}
                      </Link>
                  </Menu.Item>
                ))} 
              </SubMenu>
              <SubMenu key="4" icon={<AppstoreAddOutlined />} title="耗材">
                <Menu.Item key="000">
                  <Link to={'/haocai/0'} style={{color:"#7a7a7a"}}>
                    库房
                  </Link>
                </Menu.Item>
                {this.state.xms.map(xm=>(
                  <Menu.Item key={'h'+xm.xmbh}>
                      <Link to={'/haocai/'+xm.id} style={{color:"#7a7a7a"}}>
                        {xm.xmmc}
                      </Link>
                  </Menu.Item>
                ))}
              </SubMenu>
              <Menu.Item key="5" icon={<ContactsFilled />}>
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
              <Button onClick={()=>{sessionStorage.removeItem('token');localStorage.removeItem('username');
                window.location.href = "/#/login";}} style={{float:'right',margin:'17px'}}>{this.state.username} 退出</Button>
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
              <MyRoute path="/xiangmu" key="1" component={Xiangmu} />
              <MyRoute path="/shebei/:id" key="2" component={Shebei} />
              <MyRoute path="/yuangong/:id" key="3" component={Yuangong} />
              <MyRoute path="/haocai/:id" key="4" component={Haocai} />
              <MyRoute path="/kehu" key="5" component={Kehu} />
              <MyRoute path="/rizhi" key="6" component={Rizhi} />
              <MyRoute path="/user" key="7" component={User} />
              <Redirect to="/login"></Redirect>
            </Switch>
            </Content>
          </Layout>
        </Router>
      </Layout>
    )
  }
}

function App(){
  const username = localStorage.getItem('username');
  const { data:xmdata, loading, error } = useQuery(FIND_XIANGMU,{
    variables:{"xmmc": ""}
  });
  const { data:lxdata, loading:lxl, error:lxe } = useQuery(FIND_SBLX);
  if (loading||lxl) return <p>Loading...</p>;
  if (error||lxe) return <p>Error :(</p>;
  return(
    <Side xmdata={xmdata} username={username} lxdata={lxdata}/>
  )
}

export default App;

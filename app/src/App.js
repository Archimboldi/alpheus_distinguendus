import './App.css';
import 'rsuite/dist/styles/rsuite-default.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Sidenav, Nav, Icon, Sidebar } from 'rsuite';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import React from 'react';
import Shebei from './shebei';
import Xiangmu from './main/xiangmu';
import Kehu from './main/kehu';
import Yuangong from './main/yuangong';
import Haocai from './main/haocai';
import Rizhi from './main/rizhi';
import User from './main/user';

const client = new ApolloClient({
  uri: 'http://127.0.0.1:8000/graphql',
  cache: new InMemoryCache()
});

class Demo extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: true,
      activeKey: '1'
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
  handleToggle() {
    this.setState({
      expanded: !this.state.expanded
    });
  }
  handleSelect(eventKey) {
    this.setState({
      activeKey: eventKey
    });
  }
  render() {
    const { expanded } = this.state;

    return (
      <div>
        <Router>
        <Sidebar
            id="div1"
          style={{ display: 'flex', flexDirection: 'column' }}
          width={expanded ? 120 : 100}
          collapsible
        >
          <Sidenav
            expanded={expanded}
            defaultOpenKeys={['3', '4']}
            activeKey={this.state.activeKey}
            onSelect={this.handleSelect}

        
            appearance="subtle"
          >
            <Sidenav.Body>
              <Nav>
                <Nav.Item eventKey="1" icon={<Icon icon="play2" />}>
                  <Link to="/" style={{color:"#7a7a7a"}}>
                    项目
                  </Link>
                </Nav.Item>
                <Nav.Item eventKey="2" icon={<Icon icon="rocket" />}>
                  <Link to="/shebei" style={{color:"#7a7a7a"}}>
                    设备
                  </Link>
                </Nav.Item>
                <Nav.Item eventKey="3" icon={<Icon icon="address-book" />}>
                  <Link to="/kehu" style={{color:"#7a7a7a"}}>
                    客户
                  </Link>
                </Nav.Item>
                <Nav.Item eventKey="4" icon={<Icon icon="id-mapping" />}>
                  <Link to="/yuangong" style={{color:"#7a7a7a"}}>
                    员工
                  </Link>
                </Nav.Item>
                <Nav.Item eventKey="5" icon={<Icon icon="list" />}>
                  <Link to="/haocai" style={{color:"#7a7a7a"}}>
                    耗材
                  </Link>
                </Nav.Item>
                <Nav.Item eventKey="6" icon={<Icon icon="pencil-square" />}>
                  <Link to="/rizhi" style={{color:"#7a7a7a"}}>
                    日志
                  </Link>
                </Nav.Item>
                <Nav.Item eventKey="7" icon={<Icon icon="sliders" />}>
                  <Link to="/user" style={{color:"#7a7a7a"}}>
                    用户
                  </Link>
                </Nav.Item>
              </Nav>
            </Sidenav.Body>
          </Sidenav>
          {/* <Nav pullRight>
            <Nav.Item onClick={this.handleToggle} style={{float:"right"}}>
              <Icon icon={expanded ? 'angle-left' : 'angle-right'} />
            </Nav.Item>
          </Nav> */}
        </Sidebar>
          <Switch id="div2">
            <Route exact path="/">
              <ApolloProvider client={client}>
                <Xiangmu />
              </ApolloProvider>
            </Route>
            <Route path="/shebei">
              <ApolloProvider client={client}>
                <Shebei />
              </ApolloProvider>
            </Route>
            <Route path="/kehu">
              <ApolloProvider client={client}>
                <Kehu />
              </ApolloProvider>
            </Route>
            <Route path="/yuangong">
              <ApolloProvider client={client}>
                <Yuangong />
              </ApolloProvider>
            </Route>
            <Route path="/haocai">
              <ApolloProvider client={client}>
                <Haocai />
              </ApolloProvider>
            </Route>
            <Route path="/rizhi">
              <ApolloProvider client={client}>
                <Rizhi />
              </ApolloProvider>
            </Route>
            <Route path="/user">
              <ApolloProvider client={client}>
                <User />
              </ApolloProvider>
            </Route>
        </Switch>
        
        </Router>
      </div>
    );
  }
}

function App() {
  return (
    <Demo />
  );
}

export default App;
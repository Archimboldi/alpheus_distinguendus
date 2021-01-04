import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {Alert} from 'antd';

export default class MyRoute extends React.Component {
    render() {
        let token = sessionStorage.getItem('token');
        return(
            <div>
                {   
                    token ? (token==="0" && (this.props.path === "/kehu" || this.props.path === "/rizhi" || this.props.path === "/user") ? <Alert message="权限不足！" type="warning" />
                        :<Route {...this.props}></Route>):
                    <Redirect to="/login"></Redirect>
                }
            </div>
        )
    }
}
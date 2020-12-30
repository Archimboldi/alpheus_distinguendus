import React from 'react';
import {Redirect, Route} from 'react-router-dom';
export default class MyRoute extends React.Component {
    render() {
        let token = sessionStorage.getItem('token');
        return(
            <div>
                {   
                    token ? <Route {...this.props}></Route>:
                    <Redirect to="/login"></Redirect>
                }
            </div>
        )
    }
}
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { gql } from '@apollo/client';
import client from './index.js';

const LOGIN = gql`
  mutation Login($usrn:String!,$upsd:String!){
    user(usrn:$usrn,upsd:$upsd){
      id,usrn,power
    }
  }
`;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: {
    offset: 5,
    span: 16,
  },
};
export default function Login() {
  const onFinish = values => {
    client.mutate({
      mutation: LOGIN,
      variables: {"usrn": values.username,"upsd": values.password}
    }).then((res)=>{
      var user = res.data.user;
      if (user.id > -1){
        localStorage.setItem('username', user.usrn);
        sessionStorage.setItem('token', user.power);
        window.location.href="/";
      }else{
        message.error("用户名或密码错误！");
      }
    })
   
   
  };
  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
      labelCol={{span: 5}}
      wrapperCol={{span: 8}}
      onFinish={onFinish}
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: '请输入用户名!' }]}
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

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

import React from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { gql, useMutation } from '@apollo/client';

const LOGIN = gql`
  mutation Login($usrn:String!,$upsd:String!){
    user(usrn:$usrn,upsd:$upsd){
      id,usrn,upsd,power
    }
  }
`;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};

const Login = () => {
  const [mutate, {data}] = useMutation(LOGIN);
  const onFinish = values => {
    mutate({
      variables: {"usrn": values.username,"upsd": values.password}
    });

    console.log(data)

    // if (lda.id > -1){
    //   sessionStorage.setItem('token', lda.power);
    //   window.location.href="/";
    // }else{
    //   Alert("用户名或密码错误！");
    // }
   
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

      <Form.Item>
        <Button type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
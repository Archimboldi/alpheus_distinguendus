import React, {useState} from 'react';
import { Table, Button, Form, Modal, Input, Select } from 'antd';
import { gql, useQuery, useMutation, NetworkStatus } from '@apollo/client';
const { Search } = Input;
const { Option } = Select;

const FIND_USER = gql`
  query FindUser($usrn:String!){
    users(usrn:$usrn){
      id,usrn,upsd,power
    }
  }
`;
const ADD_USER = gql`
  mutation CreateUser($usrn:String!,$upsd:String!,$power:String!){
    createUser(usrn:$usrn,upsd:$upsd,power:$power){
        id,usrn,upsd,power
      }
  }
`;
const UPDATE_USER = gql`
  mutation UpdateUser($id:Int!,$usrn:String!,$upsd:String!,$power:String!){
    updateUser(id:$id,usrn:$usrn,upsd:$upsd,power:$power){
        id,usrn,upsd,power
      }
  }
`;

const AddForm = React.forwardRef((props, ref) => (
    <Form
      name="basic"
      initialValues={{ usrn: props.row.usrn,upsd: props.row.upsd,power:props.row.power }}
      preserve={false}
      ref = {ref}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item
        label="用户名"
        name="usrn"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="密码"
        name="upsd"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="权限"
        name="power"
        rules={[{ required: true }]}
      >
        <Select onChange={(_,value)=>{ref.current.setFieldsValue({
            power: value.key
            })}}>
            <Option key='0' value='0'>普通用户</Option>
            <Option key='1' value='1'>管理员</Option>
        </Select>
      </Form.Item>
    </Form>
));

function AllTable() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rowdata, setRowdata] = useState({id:0});
  const ref = React.createRef();
  const [addUser] = useMutation(ADD_USER, {
    update(cache, { data: { createUser } }) {
      cache.modify({
        fields: {
          users(existingUsers = []) {
            const newUserRef = cache.writeFragment({
              data: createUser,
              fragment: gql`
                fragment NewUser on User {
                  id
                  usrn
                  upsd
                  power
                }
              `
            });
            return [...existingUsers, newUserRef];
          }
        }
      });
    }
  });
  const [updateUser] = useMutation(UPDATE_USER);
  const showModal = () => {
    setRowdata({id:0,usrn:'',upsd:'',power:'0'});
    setIsModalVisible(true);
  };
  const editModal = (value) => {
    setRowdata(value);
    setIsModalVisible(true);
  }

  const handleOk = () => {
    var val = ref.current.getFieldValue();
    if (rowdata.id === 0){
      addUser({variables: {usrn:val.usrn,upsd:val.upsd,power:val.power}})
    }else {
      updateUser({variables: {id:rowdata.id,usrn:val.usrn,upsd:val.upsd,power:val.power}})
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  //搜索按钮
  const onSearch = (val) => {
    SetKeyword(val);
    refetch();
  }
  const [keyword, SetKeyword] = useState("");
  const {loading, error, data, refetch, networkStatus} = useQuery(FIND_USER,{
    variables:{"usrn": keyword}
  });
  const columns = [
    {
      title: '用户名',
      dataIndex: 'usrn',
    },
    {
      title: '密码',
      dataIndex: 'upsd',
    },
    {
      title: '权限',
      dataIndex: 'power',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_text, record) =>
        data.users.length >= 1 ? (
          <div>
            <Button type="link" onClick={()=>{editModal(record)}}>修改</Button>
          </div>
        ) : null,
    },
  ];
  if (networkStatus === NetworkStatus.refetch) return 'Refetching!';
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <div>
      <Button
        type="primary"
        style={{
          marginBottom: 16,
        }}
        onClick={showModal}
      >
        新增
      </Button>
      <Search
        placeholder="请输入用户名"
        allowClear
        onSearch={onSearch}
        style={{ width: 270, margin: '0 10px', float:'right' }}
      />
      <Modal title="用户信息" visible={isModalVisible} onOk={handleOk}
       onCancel={handleCancel} destroyOnClose>
        <AddForm row={rowdata} ref={ref}/>
      </Modal>
      <Table
        dataSource={data.users}
        columns={columns}
        rowKey={row=>row.id}
      />
    </div>
  );
}

function User() {
  return(
    <div>
      <AllTable />
    </div>
  )
}

export default User;
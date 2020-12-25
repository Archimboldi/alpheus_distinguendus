import React, {useState} from 'react';
import { Table, Button, Form, Modal, Input } from 'antd';
import { gql, useQuery, useMutation, NetworkStatus } from '@apollo/client';
const { Search } = Input;

const FIND_KEHU = gql`
  query FindKehu($khxm:String!){
    kehus(khxm:$khxm){
      id,khbh,khxm,ssxm,khxb,khgx,khbz,khlx
    }
  }
`
const ADD_KEHU = gql`
  mutation CreateKehu($khbh:String!,$khxm:String!,$ssxm:String!,$khxb:String!,$khgx:String!,$khbz:String!,$khlx:String!){
    createKehu(khbh:$khbh,khxm:$khxm,ssxm:$ssxm,khxb:$khxb,khgx:$khgx,khbz:$khbz,khlx:$khlx){
        id,khbh,khxm,ssxm,khxb,khgx,khbz,khlx
      }
  }
`;
const UPDATE_KEHU = gql`
  mutation UpdateKehu($id:Int!,$khbh:String!,$khxm:String!,$ssxm:String!,$khxb:String!,$khgx:String!,$khbz:String!,$khlx:String!){
    updateKehu(id:$id,khbh:$khbh,khxm:$khxm,ssxm:$ssxm,khxb:$khxb,khgx:$khgx,khbz:$khbz,khlx:$khlx){
        id,khbh,khxm,ssxm,khxb,khgx,khbz,khlx
      }
  }
`;
const AddForm = React.forwardRef((props, ref) => (
    <Form
      name="basic"
      initialValues={{ khbh: props.row.khbh, khxm: props.row.khxm, ssxm: props.row.ssxm,
        khxb: props.row.khxb, khgx: props.row.khgx, khbz: props.row.khbz, khlx: props.row.khlx }}
      preserve={false}
      ref = {ref}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item
        label="客户编号"
        name="khbh"
        rules={[{ required: true, message: 'Please input zcbh!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="客户姓名"
        name="khxm"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="所属项目"
        name="ssxm"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="客户性别"
        name="khxb"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="客户关系"
        name="khgx"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="客户备注"
        name="khbz"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="联系方式"
        name="khlx"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

    </Form>
));

function AllTable() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rowdata, setRowdata] = useState({id:0});
  const ref = React.createRef();
  const [addKehu] = useMutation(ADD_KEHU, {
    update(cache, { data: { createKehu } }) {
      cache.modify({
        fields: {
          kehus(existingKehus = []) {
            const newKehuRef = cache.writeFragment({
              data: createKehu,
              fragment: gql`
                fragment NewKehu on Kehu {
                  id
                  khbh
                  khxm
                  ssxm
                  khxb
                  khgx
                  khbz
                  khlx
                }
              `
            });
            return [...existingKehus, newKehuRef];
          }
        }
      });
    }
  });
  const [updateKehu] = useMutation(UPDATE_KEHU);
  const showModal = () => {
    setRowdata({id:0,khbh:'',khxm:'',ssxm:'',khxb:'',khgx:'',khbz:'',khlx:''});
    setIsModalVisible(true);
  };
  const editModal = (value) => {
    setRowdata(value);
    setIsModalVisible(true);
  }
  const handleOk = () => {
    var val = ref.current.getFieldValue();
    if (rowdata.id === 0){
      addKehu({variables: {khbh: val.khbh, khxm: val.khxm, ssxm: val.ssxm,
        khxb: val.khxb, khgx: val.khgx, khbz: val.khbz, khlx: val.khlx}})
    }else {
      updateKehu({variables: {id:rowdata.id,khbh: val.khbh, khxm: val.khxm, ssxm: val.ssxm,
        khxb: val.khxb, khgx: val.khgx, khbz: val.khbz, khlx: val.khlx}})
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
  const {loading, error, data, refetch, networkStatus} = useQuery(FIND_KEHU,{
    variables:{"khxm": keyword}
  });
  const columns = [
    {
      title: '客户编号',
      dataIndex: 'khbh',
      width: '14%',
    },
    {
      title: '客户姓名',
      dataIndex: 'khxm',
    },
    {
      title: '所属项目',
      dataIndex: 'ssxm',
    },
    {
      title: '客户性别',
      dataIndex: 'khxb',
    },
    {
      title: '客户关系',
      dataIndex: 'khgx',
    },
    {
      title: '客户备注',
      dataIndex: 'khbz',
    },
    {
      title: '联系方式',
      dataIndex: 'khlx',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_text, record) =>
        data.kehus.length >= 1 ? (
          <div>
            <Button type="link" onClick={()=>{editModal(record)}}>变更</Button>
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
        placeholder="请输入客户姓名"
        allowClear
        onSearch={onSearch}
        style={{ width: 270, margin: '0 10px', float:'right' }}
      />
      <Modal title="客户信息" visible={isModalVisible} onOk={handleOk}
       onCancel={handleCancel} destroyOnClose>
        <AddForm row={rowdata} ref={ref}/>
      </Modal>
      <Table
        dataSource={data.kehus}
        columns={columns}
        rowKey={row=>row.id}
      />
    </div>
  );
}

function Kehu() {
  return(
    <div>
      <AllTable />
    </div>
  )
}

export default Kehu;
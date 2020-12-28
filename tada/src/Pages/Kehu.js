import React, {useState} from 'react';
import { Table, Button, Form, Modal, Input, Select } from 'antd';
import { gql, useQuery, useMutation, NetworkStatus } from '@apollo/client';
const { Search } = Input;
const { Option } = Select;

const FIND_KEHU = gql`
  query FindKehu($khxm:String!){
    kehus(khxm:$khxm){
      id,khbh,khxm,ssxm,xmmc,khxb,khgx,khbz,khlx
    }
  }
`
const ADD_KEHU = gql`
  mutation CreateKehu($khbh:String!,$khxm:String!,$ssxm:Int!,$xmmc:String!,$khxb:String!,$khgx:String!,$khbz:String!,$khlx:String!){
    createKehu(khbh:$khbh,khxm:$khxm,ssxm:$ssxm,xmmc:$xmmc,khxb:$khxb,khgx:$khgx,khbz:$khbz,khlx:$khlx){
        id,khbh,khxm,ssxm,xmmc,khxb,khgx,khbz,khlx
      }
  }
`;
const UPDATE_KEHU = gql`
  mutation UpdateKehu($id:Int!,$khbh:String!,$khxm:String!,$ssxm:Int!,$xmmc:String!,$khxb:String!,$khgx:String!,$khbz:String!,$khlx:String!){
    updateKehu(id:$id,khbh:$khbh,khxm:$khxm,ssxm:$ssxm,xmmc:$xmmc,khxb:$khxb,khgx:$khgx,khbz:$khbz,khlx:$khlx){
        id,khbh,khxm,ssxm,xmmc,khxb,khgx,khbz,khlx
      }
  }
`;
const FIND_XIANGMU = gql`
  query FindXiang($xmmc:String!){
    xiangmus(xmmc: $xmmc) {
        id,xmmc
    }
  }
`;
const AddForm = React.forwardRef((props, ref) => (
    <Form
      name="basic"
      initialValues={{ khbh: props.row.khbh, khxm: props.row.khxm, ssxm: props.row.ssxm,xmmc:props.row.xmmc,
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
        name="xmmc"
        rules={[{ required: true }]}
      >
        <Select onChange={(_,value)=>{ref.current.setFieldsValue({
          ssxm: value.key
        })}}>
          {props.xmdata.xiangmus.map(xm => (
            <Option key={xm.id} value={xm.xmmc}>{xm.xmmc}</Option>
          ))}
        </Select>
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
  const { data:xmdata, refetch:xmfetch } = useQuery(FIND_XIANGMU,{
    variables:{"xmmc": ""}
  });
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
                  xmmc
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
    xmfetch();
    setRowdata({id:0,khbh:'',khxm:'',ssxm:'',khxb:'',khgx:'',khbz:'',khlx:'',xmmc:''});
    setIsModalVisible(true);
  };
  const editModal = (value) => {
    xmfetch();
    setRowdata(value);
    setIsModalVisible(true);
  }
  const handleOk = () => {
    var val = ref.current.getFieldValue();
    if (rowdata.id === 0){
      addKehu({variables: {khbh: val.khbh, khxm: val.khxm, ssxm: parseInt(val.ssxm), xmmc: val.xmmc,
        khxb: val.khxb, khgx: val.khgx, khbz: val.khbz, khlx: val.khlx}})
    }else {
      updateKehu({variables: {id:rowdata.id,khbh: val.khbh, khxm: val.khxm, ssxm: parseInt(val.ssxm), xmmc: val.xmmc,
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
      dataIndex: 'xmmc',
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
        <AddForm row={rowdata} ref={ref} xmdata={xmdata}/>
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
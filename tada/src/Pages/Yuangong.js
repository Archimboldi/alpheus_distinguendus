import React, {useState} from 'react';
import { Table, Button, Form, Modal, Input } from 'antd';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_YUANGONGS = gql`
  query{
    yuangongs{
      id,ygxm,ssbm,szxm,ygjn,rzsj,rgzl,ygzl,ljgzl,ygbz,sfzh
    }
  }
`;
const ADD_YUANGONG = gql`
  mutation CreateYuangong($ygxm:String!,$ssbm:String!,$szxm:String!,$ygjn:String!,$rzsj:String!,
    $rgzl:String!,$ygzl:String!,$ljgzl:String!,$ygbz:String!,$sfzh:String!){
    createYuangong(ygxm:$ygxm,ssbm:$ssbm,szxm:$szxm,ygjn:$ygjn,rzsj:$rzsj,rgzl:$rgzl,
      ygzl:$ygzl,ljgzl:$ljgzl,ygbz:$ygbz,sfzh:$sfzh){
        id,ygxm,ssbm,szxm,ygjn,rzsj,rgzl,ygzl,ljgzl,ygbz,sfzh
      }
  }
`;
const UPDATE_YUANGONG = gql`
  mutation UpdateYuangong($id:Int!,$ygxm:String!,$ssbm:String!,$szxm:String!,$ygjn:String!,$rzsj:String!,
    $rgzl:String!,$ygzl:String!,$ljgzl:String!,$ygbz:String!,$sfzh:String!){
    updateYuangong(id:$id,ygxm:$ygxm,ssbm:$ssbm,szxm:$szxm,ygjn:$ygjn,rzsj:$rzsj,rgzl:$rgzl,
      ygzl:$ygzl,ljgzl:$ljgzl,ygbz:$ygbz,sfzh:$sfzh){
        id,ygxm,ssbm,szxm,ygjn,rzsj,rgzl,ygzl,ljgzl,ygbz,sfzh
      }
  }
`;
const AddForm = React.forwardRef((props, ref) => (
    <Form
      name="basic"
      initialValues={{ ygxm:props.row.ygxm,ssbm:props.row.ssbm,szxm:props.row.szxm,ygjn:props.row.ygjn,
        rzsj:props.row.rzsj,rgzl:props.row.rgzl,ygzl:props.row.ygzl,ljgzl:props.row.ljgzl,ygbz:props.row.ygbz,sfzh:props.row.sfzh }}
      preserve={false}
      ref = {ref}
    >
      <Form.Item
        label="员工姓名"
        name="ygxm"
        rules={[{ required: true, message: 'Please input zcbh!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="所属部门"
        name="ssbm"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="所在项目"
        name="szxm"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="员工技能"
        name="ygjn"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="入职时间"
        name="rzsj"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="日工作量"
        name="rgzl"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="月工作量"
        name="ygzl"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="累计工作量"
        name="ljgzl"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="员工备注"
        name="ygbz"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="身份证号"
        name="sfzh"
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
  const [addYuangong] = useMutation(ADD_YUANGONG, {
    update(cache, { data: { createYuangong } }) {
      cache.modify({
        fields: {
          yuangongs(existingYuangongs = []) {
            const newYuangongRef = cache.writeFragment({
              data: createYuangong,
              fragment: gql`
                fragment NewYuangong on Yuangong {
                  id
                  ygxm
                  ssbm
                  szxm
                  ygjn
                  rzsj
                  rgzl
                  ygzl
                  ljgzl
                  ygbz
                  sfzh
                }
              `
            });
            return [...existingYuangongs, newYuangongRef];
          }
        }
      });
    }
  });
  const [updateYuangong] = useMutation(UPDATE_YUANGONG);
  const showModal = () => {
    setRowdata({id:0,ygxm:'',ssbm:'',szxm:'',ygjn:'',rzsj:'',rgzl:'',ygzl:'',ljgzl:'',ygbz:'',sfzh:''});
    setIsModalVisible(true);
  };
  const editModal = (value) => {
    setRowdata(value);
    setIsModalVisible(true);
  }
  const handleOk = () => {
    var val = ref.current.getFieldValue();
    if (rowdata.id === 0){
      addYuangong({variables: {ygxm:val.ygxm,ssbm:val.ssbm,szxm:val.szxm,ygjn:val.ygjn,rzsj:val.rzsj,
        rgzl:val.rgzl,ygzl:val.ygzl,ljgzl:val.ljgzl,ygbz:val.ygbz,sfzh:val.sfzh}})
    }else {
      updateYuangong({variables: {id:rowdata.id,ygxm:val.ygxm,ssbm:val.ssbm,szxm:val.szxm,ygjn:val.ygjn,rzsj:val.rzsj,
        rgzl:val.rgzl,ygzl:val.ygzl,ljgzl:val.ljgzl,ygbz:val.ygbz,sfzh:val.sfzh}})
    }

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const { loading: queryLoading, error: queryError, data } = useQuery(GET_YUANGONGS);
  const columns = [
    {
      title: '员工姓名',
      dataIndex: 'ygxm',
      width: '14%',
    },
    {
      title: '所属部门',
      dataIndex: 'ssbm',
    },
    {
      title: '所在项目',
      dataIndex: 'szxm',
    },
    {
      title: '员工技能',
      dataIndex: 'ygjn',
    },
    {
      title: '入职时间',
      dataIndex: 'rzsj',
    },
    {
      title: '日工作量',
      dataIndex: 'rgzl',
    },
    {
      title: '月工作量',
      dataIndex: 'ygzl',
    },
    {
      title: '累计工作量',
      dataIndex: 'ljgzl',
    },
    {
      title: '员工备注',
      dataIndex: 'ygbz',
    },
    {
      title: '身份证号',
      dataIndex: 'sfzh',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_text, record) =>
        data.yuangongs.length >= 1 ? (
          <div>
            <Button type="link" onClick={()=>{editModal(record)}}>调拨</Button>
          </div>
        ) : null,
    },
  ];
  if (queryLoading) return <p>Loading...</p>;
  if (queryError) return <p>Error :(</p>;
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
      <Modal title="新增员工" visible={isModalVisible} onOk={handleOk}
       onCancel={handleCancel} destroyOnClose>
        <AddForm row={rowdata} ref={ref}/>
      </Modal>
      <Table
        dataSource={data.yuangongs}
        columns={columns}
        rowKey={row=>row.id}
      />
    </div>
  );
}

function Yuangong() {
  return(
    <div>
      <AllTable />
    </div>
  )
}

export default Yuangong;
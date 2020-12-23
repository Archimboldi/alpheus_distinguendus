import React, {useState} from 'react';
import { Table, Button, Form, Modal, Input } from 'antd';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_SHEBEIS = gql`
  query{
    shebeis{
      id,zcbh,szbm,szxm,sblx,sbpp,sbxh,smcs,sbbz,xlh
    }
  }
`
const ADD_SHEBEI = gql`
  mutation CreateShebei($zcbh:String!,$szbm:String!,$szxm:String!,$sblx:String!,
    $sbpp:String!,$sbxh:String!,$xlh:String!,$smcs:String!,$sbbz:String!){
    createShebei(zcbh:$zcbh,szbm:$szbm,szxm:$szxm,sblx:$sblx,sbpp:$sbpp,
      sbxh:$sbxh,xlh:$xlh,smcs:$smcs,sbbz:$sbbz){
        id,zcbh,szbm,szxm,sblx,sbpp,sbxh,smcs,sbbz,xlh
      }
  }
`;
const UPDATE_SHEBEI = gql`
  mutation UpdateShebei($id:Int!,$zcbh:String!,$szbm:String!,$szxm:String!,$sblx:String!,
    $sbpp:String!,$sbxh:String!,$xlh:String!,$smcs:String!,$sbbz:String!){
    updateShebei(id:$id,zcbh:$zcbh,szbm:$szbm,szxm:$szxm,sblx:$sblx,sbpp:$sbpp,
      sbxh:$sbxh,xlh:$xlh,smcs:$smcs,sbbz:$sbbz){
        id,zcbh,szbm,szxm,sblx,sbpp,sbxh,smcs,sbbz,xlh
      }
  }
`;
const AddForm = React.forwardRef((props, ref) => (
    <Form
      name="basic"
      initialValues={{ zcbh: props.row.zcbh, szbm: props.row.szbm, szxm: props.row.szxm,
        sblx: props.row.sblx, sbpp: props.row.sbpp, sbxh: props.row.sbxh,
        xlh: props.row.xlh, smcs: props.row.smcs, sbbz: props.row.sbbz }}
      preserve={false}
      ref = {ref}
    >
      <Form.Item
        label="资产编号"
        name="zcbh"
        rules={[{ required: true, message: 'Please input zcbh!' }]}
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
        label="所在部门"
        name="szbm"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="设备类型"
        name="sblx"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="设备品牌"
        name="sbpp"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="设备型号"
        name="sbxh"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="序列号"
        name="xlh"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="扫描次数"
        name="smcs"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="设备备注"
        name="sbbz"
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
  const [addShebei] = useMutation(ADD_SHEBEI, {
    update(cache, { data: { createShebei } }) {
      cache.modify({
        fields: {
          shebeis(existingShebeis = []) {
            const newShebeiRef = cache.writeFragment({
              data: createShebei,
              fragment: gql`
                fragment NewShebei on Shebei {
                  id
                  zcbh
                  szxm
                  szbm
                  sblx
                  sbpp
                  sbxh
                  xlh
                  smcs
                  sbbz
                  xlh
                }
              `
            });
            return [...existingShebeis, newShebeiRef];
          }
        }
      });
    }
  });
  const [updateShebei] = useMutation(UPDATE_SHEBEI);
  const showModal = () => {
    setRowdata({id:0,zcbh:'',szbm:'',szxm:'',sblx:'',sbpp:'',sbxh:'',xlh:'',smcs:'',sbbz:''});
    setIsModalVisible(true);
  };
  const editModal = (value) => {
    setRowdata(value);
    setIsModalVisible(true);
  }
  const handleOk = () => {
    var val = ref.current.getFieldValue();
    if (rowdata.id === 0){
      addShebei({variables: {zcbh:val.zcbh,szbm:val.szbm,szxm:val.szxm,sblx:val.sblx,
        sbpp:val.sbpp,sbxh:val.sbxh,xlh:val.xlh,smcs:val.smcs,sbbz:val.sbbz}})
    }else {
      updateShebei({variables: {id:rowdata.id,zcbh:val.zcbh,szbm:val.szbm,szxm:val.szxm,sblx:val.sblx,
        sbpp:val.sbpp,sbxh:val.sbxh,xlh:val.xlh,smcs:val.smcs,sbbz:val.sbbz}})
    }

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const { loading: queryLoading, error: queryError, data } = useQuery(GET_SHEBEIS);
  const columns = [
    {
      title: '资产编号',
      dataIndex: 'zcbh',
      width: '14%',
    },
    {
      title: '所在项目',
      dataIndex: 'szxm',
    },
    {
      title: '所在部门',
      dataIndex: 'szbm',
    },
    {
      title: '设备类型',
      dataIndex: 'sblx',
    },
    {
      title: '设备品牌',
      dataIndex: 'sbpp',
    },
    {
      title: '设备型号',
      dataIndex: 'sbxh',
    },
    {
      title: '扫描次数',
      dataIndex: 'smcs',
    },
    {
      title: '设备备注',
      dataIndex: 'sbbz',
    },
    {
      title: '序列号',
      dataIndex: 'xlh',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_text, record) =>
        data.shebeis.length >= 1 ? (
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
      <Modal title="新增设备" visible={isModalVisible} onOk={handleOk}
       onCancel={handleCancel} destroyOnClose>
        <AddForm row={rowdata} ref={ref}/>
      </Modal>
      <Table
        dataSource={data.shebeis}
        columns={columns}
        rowKey={row=>row.id}
      />
    </div>
  );
}

function Shebei() {
  return(
    <div>
      <AllTable />
    </div>
  )
}

export default Shebei;
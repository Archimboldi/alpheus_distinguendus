import React, {useState} from 'react';
import { Table, Button, Form, Modal, Input } from 'antd';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_XIANGMUS = gql`
  query{
    xiangmus {
        id,xmbh,xmmc,xmfzr,xmlx,gclzl,gcllr,gclsm,gclcl,xmdd,xmbz,xmhth
    }
  }
`
const ADD_XIANGMU = gql`
  mutation CreateXiangmu($xmbh:String!,$xmmc:String!,$xmfzr:String!,$xmlx:String!,
    $gclzl:String!,$gcllr:String!,$gclsm:String!,$gclcl:String!,$xmdd:String!,$xmbz:String!,$xmhth:String!){
    createXiangmu(xmbh:$xmbh,xmmc:$xmmc,xmfzr:$xmfzr,xmlx:$xmlx,gclzl:$gclzl,gcllr:$gcllr,
     gclsm:$gclsm,gclcl:$gclcl,xmdd:$xmdd,xmbz:$xmbz,xmhth:$xmhth){
        id,xmbh,xmmc,xmfzr,xmlx,gclzl,gcllr,gclsm,gclcl,xmdd,xmbz,xmhth
      }
  }
`;
const UPDATE_XIANGMU = gql`
  mutation UpdateXiangmu($id:Int!,$xmbh:String!,$xmmc:String!,$xmfzr:String!,$xmlx:String!,$gclzl:String!,$gcllr:String!,
    $gclsm:String!,$gclcl:String!,$xmdd:String!,$xmbz:String!,$xmhth:String!){
    updateXiangmu(id:$id,xmbh:$xmbh,xmmc:$xmmc,xmfzr:$xmfzr,xmlx:$xmlx,gclzl:$gclzl,gcllr:$gcllr,
        gclsm:$gclsm,gclcl:$gclcl,xmdd:$xmdd,xmbz:$xmbz,xmhth:$xmhth){
        id,xmbh,xmmc,xmfzr,xmlx,gclzl,gcllr,gclsm,gclcl,xmdd,xmbz,xmhth
      }
  }
`;
const AddForm = React.forwardRef((props, ref) => (
    <Form
      name="basic"
      initialValues={{ xmbh: props.row.xmbh, xmmc: props.row.xmmc, xmfzr: props.row.xmfzr,
        xmlx: props.row.xmlx, gclzl: props.row.gclzl, gcllr: props.row.gcllr,
        gclsm: props.row.gclsm, gclcl: props.row.gclcl, xmdd: props.row.xmdd,xmbz: props.row.xmbz,xmhth: props.row.xmhth }}
      preserve={false}
      ref = {ref}
    >
      <Form.Item
        label="项目编号"
        name="xmbh"
        rules={[{ required: true, message: 'Please input xmbh!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="项目名称"
        name="xmmc"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="项目负责人"
        name="xmfzr"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="项目类型"
        name="xmlx"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="整理工程量"
        name="gclzl"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="录入工程量"
        name="gcllr"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="扫描工程量"
        name="gclsm"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="处理工程量"
        name="gclcl"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="项目地点"
        name="xmdd"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="项目备注"
        name="xmbz"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="项目合同号"
        name="xmhth"
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
  const [addXiangmu] = useMutation(ADD_XIANGMU, {
    update(cache, { data: { createXiangmu } }) {
      cache.modify({
        fields: {
          xiangmus(existingXiangmus = []) {
            const newXiangmuRef = cache.writeFragment({
              data: createXiangmu,
              fragment: gql`
                fragment NewXiangmu on Xiangmu {
                    id
                    xmbh
                    xmmc
                    xmfzr
                    xmlx
                    gclzl
                    gcllr
                    gclsm
                    gclcl
                    xmdd
                    xmbz
                    xmhth
                }
              `
            });
            return [...existingXiangmus, newXiangmuRef];
          }
        }
      });
    }
  });
  const [updateXiangmu] = useMutation(UPDATE_XIANGMU);
  const showModal = () => {
    setRowdata({id:0,xmbh:'',xmmc:'',xmfzr:'',xmlx:'',gclzl:'',gcllr:'',gclsm:'',gclcl:'',xmdd:'',xmbz:'',xmhth:''});
    setIsModalVisible(true);
  };
  const editModal = (value) => {
    setRowdata(value);
    setIsModalVisible(true);
  }
  const handleOk = () => {
    var val = ref.current.getFieldValue();
    if (rowdata.id === 0){
      addXiangmu({variables: {xmbh:val.xmbh,xmmc:val.xmmc,xmfzr:val.xmfzr,xmlx:val.xmlx,gclzl:val.gclcl,
        gcllr:val.gcllr,gclsm:val.gclsm,gclcl:val.gclcl,xmdd:val.xmdd,xmbz:val.xmdd,xmhth:val.xmhth}})
    }else {
      updateXiangmu({variables: {id:rowdata.id,xmbh:val.xmbh,xmmc:val.xmmc,xmfzr:val.xmfzr,xmlx:val.xmlx,gclzl:val.gclcl,
        gcllr:val.gcllr,gclsm:val.gclsm,gclcl:val.gclcl,xmdd:val.xmdd,xmbz:val.xmdd,xmhth:val.xmhth}})
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const { loading: queryLoading, error: queryError, data } = useQuery(GET_XIANGMUS);
  const columns = [
    {
      title: '项目编号',
      dataIndex: 'xmbh',
      width: '14%',
    },
    {
      title: '项目名称',
      dataIndex: 'xmmc',
    },
    {
      title: '项目负责人',
      dataIndex: 'xmfzr',
    },
    {
      title: '项目类型',
      dataIndex: 'xmlx',
    },
    {
      title: '整理工程量',
      dataIndex: 'gclzl',
    },
    {
      title: '录入工程量',
      dataIndex: 'gcllr',
    },
    {
      title: '扫描工程量',
      dataIndex: 'gclsm',
    },
    {
      title: '处理工程量',
      dataIndex: 'gclcl',
    },
    {
      title: '项目地点',
      dataIndex: 'xmdd',
    },
    {
        title: '项目备注',
        dataIndex: 'xmbz',
    },
    {
        title: '项目合同号',
        dataIndex: 'xmhth',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_text, record) =>
        data.xiangmus.length >= 1 ? (
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
      <Modal title="新增项目" visible={isModalVisible} onOk={handleOk}
       onCancel={handleCancel} destroyOnClose>
        <AddForm row={rowdata} ref={ref}/>
      </Modal>
      <Table
        dataSource={data.xiangmus}
        columns={columns}
        rowKey={row=>row.id}
      />
    </div>
  );
}

function Xiangmu() {
  return(
    <div>
      <AllTable />
    </div>
  )
}

export default Xiangmu;
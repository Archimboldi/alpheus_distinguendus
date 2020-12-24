import React, {useState} from 'react';
import { Table, Button, Form, Modal, Input, Drawer } from 'antd';
import { gql, useQuery, useMutation, NetworkStatus } from '@apollo/client';
const { Search } = Input;

const FIND_XIANGMU = gql`
  query FindXiang($xmmc:String!){
    xiangmus(xmmc: $xmmc) {
        id,xmbh,xmmc,xmfzr,xmlx,gclzl,gcllr,gclsm,gclcl,xmdd,xmbz,xmhth
    }
  }
`;
const PEIBEI = gql`
  query PeiBei($id:Int!) {
    shebei(id:$id) {
      zcbh
    },
    yuangong(id:$id) {
      ygxm
    },
    kehu(id:$id) {
      khbh
    },
  }
`;
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
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 14 }}
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
  //搜索
  const [keyword, SetKeyword] = useState("");
  const {loading, error, data, refetch, networkStatus} = useQuery(FIND_XIANGMU,{
    variables:{"xmmc": keyword}
  });
  //录入界面
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rowdata, setRowdata] = useState({id:0});
  const ref = React.createRef();
  const [visible, setVisible] = useState(false);
  //抽屉
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  //搜索按钮
  const onSearch = (val) => {
    SetKeyword(val);
    refetch();
  }
  //添加
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
  const showModal = () => {
    setRowdata({id:0,xmbh:'',xmmc:'',xmfzr:'',xmlx:'',gclzl:'',gcllr:'',gclsm:'',gclcl:'',xmdd:'',xmbz:'',xmhth:''});
    setIsModalVisible(true);
  };
  //编辑
  const [updateXiangmu] = useMutation(UPDATE_XIANGMU);
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

    const columns = [
      {
        title: '项目编号',
        dataIndex: 'xmbh',
        width: '7%',
      },
      {
        title: '项目名称',
        dataIndex: 'xmmc',
        width: '7%',
      },
      {
        title: '项目负责人',
        dataIndex: 'xmfzr',
        width: '7%',
      },
      {
        title: '项目类型',
        dataIndex: 'xmlx',
        width: '7%',
      },
      {
        title: '整理工程量',
        dataIndex: 'gclzl',
        width: '7%',
      },
      {
        title: '录入工程量',
        dataIndex: 'gcllr',
        width: '7%',
      },
      {
        title: '扫描工程量',
        dataIndex: 'gclsm',
        width: '7%',
      },
      {
        title: '处理工程量',
        dataIndex: 'gclcl',
        width: '7%',
      },
      {
        title: '项目地点',
        dataIndex: 'xmdd',
        width: '7%',
      },
      {
          title: '项目合同号',
          dataIndex: 'xmhth',
          width: '7%',
      },
      {
        title: '项目备注',
        dataIndex: 'xmbz',
        width: '7%',
      },
      {
        title: '配备',
        width: '3%',
        dataIndex: 'peibei',
        render: (_text, record) =>
          data.xiangmus.length >= 1 ? (
            <div>
              <Button type="link" onClick={()=>{showDrawer(record)}}>查看</Button>
            </div>
          ) : null,
      },
      {
        title: '操作',
        width: '3%',
        dataIndex: 'operation',
        render: (_text, record) =>
          data.xiangmus.length >= 1 ? (
            <div>
              <Button type="link" onClick={()=>{editModal(record)}}>更新</Button>
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
        onClick={showModal}>
        新增
      </Button>
      <Search
        placeholder="请输入项目名称"
        allowClear
        onSearch={onSearch}
        style={{ width: 270, margin: '0 10px', float:'right' }}
      />
      <Modal title="项目情况" visible={isModalVisible} onOk={handleOk}
       onCancel={handleCancel} destroyOnClose>
        <AddForm row={rowdata} ref={ref}/>
      </Modal>
      <Table
        dataSource={data.xiangmus}
        columns={columns}
        rowKey={row=>row.id}
      />
      <Drawer
        title="配备"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={340}
      >
   
      </Drawer>
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
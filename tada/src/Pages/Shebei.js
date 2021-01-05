import React, {useState} from 'react';
import { Table, Button, Form, Modal, Input, Select } from 'antd';
import { gql, useQuery, useMutation, NetworkStatus } from '@apollo/client';
const { Search } = Input;
const { Option } = Select;

const FIND_SHEBEI = gql`
  query FindShebei($sbxh:String!,$xmid:Int!){
    shebeis(sbxh:$sbxh,xmid:$xmid){
      id,zcbh,szbm,szxm,sblx,sbpp,sbxh,smcs,sbbz,xlh,xmmc
    }
  }
`;
const ADD_SHEBEI = gql`
  mutation CreateShebei($zcbh:String!,$szbm:String!,$szxm:Int!,$xmmc:String!,$sblx:String!,
    $sbpp:String!,$sbxh:String!,$xlh:String!,$smcs:String!,$sbbz:String!){
    createShebei(zcbh:$zcbh,szbm:$szbm,szxm:$szxm,xmmc:$xmmc,sblx:$sblx,sbpp:$sbpp,
      sbxh:$sbxh,xlh:$xlh,smcs:$smcs,sbbz:$sbbz){
        id,zcbh,szbm,szxm,xmmc,sblx,sbpp,sbxh,smcs,sbbz,xlh
      }
  }
`;
const UPDATE_SHEBEI = gql`
  mutation UpdateShebei($id:Int!,$zcbh:String!,$szbm:String!,$szxm:Int!,$xmmc:String!,$sblx:String!,
    $sbpp:String!,$sbxh:String!,$xlh:String!,$smcs:String!,$sbbz:String!){
    updateShebei(id:$id,zcbh:$zcbh,szbm:$szbm,szxm:$szxm,xmmc:$xmmc,sblx:$sblx,sbpp:$sbpp,
      sbxh:$sbxh,xlh:$xlh,smcs:$smcs,sbbz:$sbbz){
        id,zcbh,szbm,szxm,xmmc,sblx,sbpp,sbxh,smcs,sbbz,xlh
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
      initialValues={{ zcbh: props.row.zcbh, szbm: props.row.szbm, szxm: props.row.szxm,xmmc: props.row.xmmc,
        sblx: props.row.sblx, sbpp: props.row.sbpp, sbxh: props.row.sbxh,
        xlh: props.row.xlh, smcs: props.row.smcs, sbbz: props.row.sbbz }}
      preserve={false}
      ref = {ref}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item
        label="资产编号"
        name="zcbh"
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
        label="所在项目"
        name="xmmc"
        rules={[{ required: true }]}
      >
      <Select onChange={(_,value)=>{ref.current.setFieldsValue({
          szxm: value.key
        })}}>
          {props.xmdata.map(xm => (
            <Option key={xm.id} value={xm.xmmc}>{xm.xmmc}</Option>
          ))}
      </Select>
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

const AllTable = React.forwardRef((props, fref)=> {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rowdata, setRowdata] = useState({id:0});
  const ref = React.createRef();
  const { data:xmdata, refetch:xmfetch } = useQuery(FIND_XIANGMU,{
    variables:{"xmmc": ""}
  });
 
  var xms = [{id:0,xmmc:"库房"}];
  xms.push(...xmdata.xiangmus);
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
                  xmmc
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
    xmfetch();
   
    setRowdata({id:0,zcbh:'',szbm:'',szxm:0,xmmc:'',sblx:'',sbpp:'',sbxh:'',xlh:'',smcs:'',sbbz:''});
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
      addShebei({variables: {zcbh:val.zcbh,szbm:val.szbm,szxm:parseInt(val.szxm),xmmc:val.xmmc,sblx:val.sblx,
        sbpp:val.sbpp,sbxh:val.sbxh,xlh:val.xlh,smcs:val.smcs,sbbz:val.sbbz}})
    }else {
      updateShebei({variables: {id:rowdata.id,zcbh:val.zcbh,szbm:val.szbm,szxm:parseInt(val.szxm),xmmc:val.xmmc,sblx:val.sblx,
        sbpp:val.sbpp,sbxh:val.sbxh,xlh:val.xlh,smcs:val.smcs,sbbz:val.sbbz}})
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
  const {loading, error, data, refetch, networkStatus} = useQuery(FIND_SHEBEI,{
    variables:{"sbxh": keyword, "xmid": props.xmid}
  }, { fetchPolicy: 'network-only' });
  
  const columns = [
    {
      title: '资产编号',
      dataIndex: 'zcbh',
      width: '14%',
    },
    {
      title: '序列号',
      dataIndex: 'xlh',
    },
    {
      title: '所在项目',
      dataIndex: 'xmmc',
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
        placeholder="请输入设备型号"
        allowClear
        onSearch={onSearch}
        ref={fref}
        style={{ width: 270, margin: '0 10px', float:'right' }}
      />
      <Modal title="设备详情" visible={isModalVisible} onOk={handleOk}
       onCancel={handleCancel} destroyOnClose>
        <AddForm row={rowdata} ref={ref} xmdata={xms}/>
      </Modal>
      <Table
        dataSource={data.shebeis}
        columns={columns}
        rowKey={row=>row.id}
      />
    </div>
  );
});

class Shebei extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      if (this.textInput.current!==null){
        this.textInput.current.props.onPressEnter()
      }
    }
  }

  render(){
    return(
      <div>
        <AllTable xmid={parseInt(this.props.match.params.id)} ref={this.textInput} />
      </div>
    )
  }
}

export default Shebei;
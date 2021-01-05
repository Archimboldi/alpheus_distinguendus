import React, {useState} from 'react';
import { Table, Button, Form, Modal, Input, Select } from 'antd';
import { gql, useQuery, useMutation, NetworkStatus } from '@apollo/client';
const { Search } = Input;
const { Option } = Select;

const FIND_YUANGONG = gql`
  query FindYuangong($ygxm:String!, $xmid:Int!){
    yuangongs(ygxm:$ygxm,xmid:$xmid){
      id,ygxm,ssbm,szxm,xmmc,ygjn,rzsj,rgzl,ygzl,ljgzl,ygbz,sfzh
    }
  }
`;
const ADD_YUANGONG = gql`
  mutation CreateYuangong($ygxm:String!,$ssbm:String!,$szxm:Int!,$xmmc:String!,$ygjn:String!,$rzsj:String!,
    $rgzl:String!,$ygzl:String!,$ljgzl:String!,$ygbz:String!,$sfzh:String!){
    createYuangong(ygxm:$ygxm,ssbm:$ssbm,szxm:$szxm,xmmc:$xmmc,ygjn:$ygjn,rzsj:$rzsj,rgzl:$rgzl,
      ygzl:$ygzl,ljgzl:$ljgzl,ygbz:$ygbz,sfzh:$sfzh){
        id,ygxm,ssbm,szxm,ygjn,rzsj,rgzl,ygzl,ljgzl,ygbz,sfzh,xmmc
      }
  }
`;
const UPDATE_YUANGONG = gql`
  mutation UpdateYuangong($id:Int!,$ygxm:String!,$ssbm:String!,$szxm:Int!,$xmmc:String!,$ygjn:String!,$rzsj:String!,
    $rgzl:String!,$ygzl:String!,$ljgzl:String!,$ygbz:String!,$sfzh:String!){
    updateYuangong(id:$id,ygxm:$ygxm,ssbm:$ssbm,szxm:$szxm,xmmc:$xmmc,ygjn:$ygjn,rzsj:$rzsj,rgzl:$rgzl,
      ygzl:$ygzl,ljgzl:$ljgzl,ygbz:$ygbz,sfzh:$sfzh){
        id,ygxm,ssbm,szxm,ygjn,rzsj,rgzl,ygzl,ljgzl,ygbz,sfzh,xmmc
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
      initialValues={{ ygxm:props.row.ygxm,ssbm:props.row.ssbm,szxm:props.row.szxm,xmmc:props.row.xmmc,ygjn:props.row.ygjn,
        rzsj:props.row.rzsj,rgzl:props.row.rgzl,ygzl:props.row.ygzl,ljgzl:props.row.ljgzl,ygbz:props.row.ygbz,sfzh:props.row.sfzh }}
      preserve={false}
      ref = {ref}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 14 }}
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
        name="xmmc"
        rules={[{ required: true }]}
      >
        <Select onChange={(_,value)=>{ref.current.setFieldsValue({
          szxm: value.key
        })}}>
          {props.xmdata.xiangmus.map(xm => (
            <Option key={xm.id} value={xm.xmmc}>{xm.xmmc}</Option>
          ))}
        </Select>
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
        label="今日整理量"
        name="ljgzl"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="今日录入量"
        name="rgzl"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="今日扫描量"
        name="ygzl"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="今日处理量"
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

const AllTable = React.forwardRef((props, fref) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rowdata, setRowdata] = useState({id:0});
  const ref = React.createRef();
  const { data:xmdata, refetch:xmfetch } = useQuery(FIND_XIANGMU,{
    variables:{"xmmc": ""}
  });
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
                  xmmc
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
    xmfetch();
    setRowdata({id:0,ygxm:'',ssbm:'',szxm:0,ygjn:'',rzsj:'',rgzl:'',ygzl:'',ljgzl:'',ygbz:'',sfzh:'',xmmc:''});
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
      addYuangong({variables: {ygxm:val.ygxm,ssbm:val.ssbm,szxm:parseInt(val.szxm),xmmc: val.xmmc,ygjn:val.ygjn,rzsj:val.rzsj,
        rgzl:val.rgzl,ygzl:val.ygzl,ljgzl:val.ljgzl,ygbz:val.ygbz,sfzh:val.sfzh}})
    }else {
      updateYuangong({variables: {id:rowdata.id,ygxm:val.ygxm,ssbm:val.ssbm,szxm:parseInt(val.szxm),xmmc: val.xmmc,ygjn:val.ygjn,rzsj:val.rzsj,
        rgzl:val.rgzl,ygzl:val.ygzl,ljgzl:val.ljgzl,ygbz:val.ygbz,sfzh:val.sfzh}})
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
  const {loading, error, data, refetch, networkStatus} = useQuery(FIND_YUANGONG,{
    variables:{"ygxm": keyword, "xmid": props.xmid}
  });
  const columns = [
    {
      title: '员工姓名',
      dataIndex: 'ygxm',
    },
    {
      title: '所属部门',
      dataIndex: 'ssbm',
    },
    {
      title: '所在项目',
      dataIndex: 'xmmc',
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
      title: '今日整理量',
      dataIndex: 'rgzl',
    },
    {
      title: '今日录入量',
      dataIndex: 'ygzl',
    },
    {
      title: '今日扫描量',
      dataIndex: 'ljgzl',
    },
    {
      title: '今日处理量',
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
            <Button type="link" onClick={()=>{editModal(record)}}>分配</Button>
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
      &nbsp;&nbsp;&nbsp;
      <Button
        type="primary"
        style={{
          marginBottom: 16,
        }}
        onClick={showModal}
      >
        提交工作量
      </Button>
      <Search
        placeholder="请输入员工姓名"
        allowClear
        onSearch={onSearch}
        ref={fref}
        style={{ width: 270, margin: '0 10px', float:'right' }}
      />
      <Modal title="员工信息" visible={isModalVisible} onOk={handleOk}
       onCancel={handleCancel} destroyOnClose>
        <AddForm row={rowdata} ref={ref} xmdata={xmdata}/>
      </Modal>
      <Table
        dataSource={data.yuangongs}
        columns={columns}
        rowKey={row=>row.id}
      />
    </div>
  );
});

class Yuangong extends React.Component {
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

export default Yuangong;
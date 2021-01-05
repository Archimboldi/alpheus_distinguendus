import React, {useState} from 'react';
import { Table, Button, Form, Modal, Input } from 'antd';
import { gql, useQuery, useMutation, NetworkStatus } from '@apollo/client';
const { Search } = Input;

const FIND_HAOCAI = gql`
  query FindHaocai($hcmc:String!){
    haocais(hcmc:$hcmc){
      id,hcmc,gg,sl,dw,lj,hcbz,hcdj
    }
  }
`;
const ADD_HAOCAI = gql`
  mutation CreateHaocai($hcmc:String!,$gg:String!,$sl:String!,$dw:String!,$lj:String!,$hcbz:String!,$hcdj:String!){
    createHaocai(hcmc:$hcmc,gg:$gg,sl:$sl,dw:$dw,lj:$lj,hcbz:$hcbz,hcdj:$hcdj){
        id,hcmc,gg,sl,dw,lj,hcbz,hcdj
      }
  }
`;
const UPDATE_HAOCAI = gql`
  mutation UpdateHaocai($id:Int!,$hcmc:String!,$gg:String!,$sl:String!,$dw:String!,$lj:String!,$hcbz:String!,$hcdj:String!){
    updateHaocai(id:$id,hcmc:$hcmc,gg:$gg,sl:$sl,dw:$dw,lj:$lj,hcbz:$hcbz,hcdj:$hcdj){
        id,hcmc,gg,sl,dw,lj,hcbz,hcdj
      }
  }
`;
const AddForm = React.forwardRef((props, ref) => (
    <Form
      name="basic"
      initialValues={{ hcmc: props.row.hcmc,gg: props.row.gg,sl: props.row.sl,dw: props.row.dw,lj: props.row.lj,hcbz: props.row.hcbz,hcdj: props.row.hcdj }}
      preserve={false}
      ref = {ref}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item
        label="耗材名称"
        name="hcmc"
        rules={[{ required: true, message: 'Please input hcmc!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="规格"
        name="gg"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="数量"
        name="sl"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="单位"
        name="dw"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="链接"
        name="lj"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="备注"
        name="hcbz"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="单价"
        name="hcdj"
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
  const [addHaocai] = useMutation(ADD_HAOCAI, {
    update(cache, { data: { createHaocai } }) {
      cache.modify({
        fields: {
          haocais(existingHaocais = []) {
            const newHaocaiRef = cache.writeFragment({
              data: createHaocai,
              fragment: gql`
                fragment NewHaocai on Haocai {
                  id
                  hcmc
                  gg
                  sl
                  dw
                  lj
                  hcbz
                  hcdj
                }
              `
            });
            return [...existingHaocais, newHaocaiRef];
          }
        }
      });
    }
  });
  const [updateHaocai] = useMutation(UPDATE_HAOCAI);
  const showModal = () => {
    setRowdata({id:0,hcmc:'',gg:'',sl:'',dw:'',lj:'',hcbz:'',hcdj:''});
    setIsModalVisible(true);
  };
  const editModal = (value) => {
    setRowdata(value);
    setIsModalVisible(true);
  }
  const handleOk = () => {
    var val = ref.current.getFieldValue();
    if (rowdata.id === 0){
      addHaocai({variables: {hcmc:val.hcmc,gg:val.gg,sl:val.sl,dw:val.dw,lj:val.lj,hcbz:val.hcbz,hcdj:val.hcdj}})
    }else {
      updateHaocai({variables: {id:rowdata.id,hcmc:val.hcmc,gg:val.gg,sl:val.sl,dw:val.dw,lj:val.lj,hcbz:val.hcbz,hcdj:val.hcdj}})
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
  const {loading, error, data, refetch, networkStatus} = useQuery(FIND_HAOCAI,{
    variables:{"hcmc": keyword}
  });
  const columns = [
    {
      title: '耗材名称',
      dataIndex: 'hcmc',
      width: '14%',
    },
    {
      title: '规格',
      dataIndex: 'gg',
    },
    {
      title: '库存',
      dataIndex: 'sl',
    },
    {
      title: '链接',
      dataIndex: 'lj',
    },
    {
      title: '耗材备注',
      dataIndex: 'hcbz',
    },
    {
      title: '耗材单价',
      dataIndex: 'hcdj',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_text, record) =>
        data.haocais.length >= 1 ? (
          <div>
            <Button type="link" onClick={()=>{editModal(record)}}>采购</Button>
            <Button type="link" onClick={()=>{editModal(record)}}>领用</Button>
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
        placeholder="请输入耗材名称"
        allowClear
        onSearch={onSearch}
        ref={fref}
        style={{ width: 270, margin: '0 10px', float:'right' }}
      />
      <Modal title="耗材详情" visible={isModalVisible} onOk={handleOk}
       onCancel={handleCancel} destroyOnClose>
        <AddForm row={rowdata} ref={ref}/>
      </Modal>
      <Table
        dataSource={data.haocais}
        columns={columns}
        rowKey={row=>row.id}
      />
    </div>
  );
});

class Haocai extends React.Component {
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

export default Haocai;
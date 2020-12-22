import React, { Input,useContext, useState, useEffect, useRef } from 'react';
import { Table, Button, Popconfirm, Form, Modal } from 'antd';
import { gql, useQuery } from '@apollo/client';

const shebeiQuery = gql`
query{
  shebeis{
    zcbh,szbm,szxm,sblx,sbpp,sbxh,smcs,sbbz,xlh
  }
}
`
const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '资产编号',
        dataIndex: 'zcbh',
        width: '14%',
        editable: true,
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
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <div>
              <Button type="link" onClick={() => this.handleEdit(record)}>Edit</Button>              
              <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.zcbh)}>
                <Button type="link">Delete</Button>
              </Popconfirm>
            </div>
          ) : null,
      },
    ];
    this.state = {
      dataSource: props.dataSource,
      count: 2,
    };
  }
  
  handleEdit = (record) => {
    console.log(record)
  }
  handleDelete = (zcbh) => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.zcbh !== zcbh),
    });
  };
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };
  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
  };
  //
  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    this.setState({
      visible: false
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  
  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Button
          onClick={this.showModal}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          Add a row
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          rowKey={row=>(row.zcbh)}
        />
        <Modal
          title="Title"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>{this.state.modalText}</p>
        </Modal>
      </div>
    );
  }
}

function Shebei() {
  const { loading, error, data } = useQuery(shebeiQuery);
  if (loading) return <p>loading...</p>;
  if (error) return <p>error</p>;
  return(
    <EditableTable dataSource={data.shebeis} />
  )
}

export default Shebei;
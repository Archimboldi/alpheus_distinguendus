import React from 'react';
import { Table, Button, Popconfirm, Form, Modal, Input, Select } from 'antd';
import { gql, useQuery } from '@apollo/client';
const { Option } = Select;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const shebeiQuery = gql`
query{
  shebeis{
    id,zcbh,szbm,szxm,sblx,sbpp,sbxh,smcs,sbbz,xlh
  }
}
`

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
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <div>
              <Button type="link" onClick={() => this.handleEdit(record)}>调拨</Button>              
              <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.zcbh)}>
                <Button type="link">报废</Button>
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
          <Mform />
        </Modal>
      </div>
    );
  }
}
const Mform = () => {
  const [form] = Form.useForm();

  const onGenderChange = (value) => {
    switch (value) {
      case 'male':
        form.setFieldsValue({
          note: 'Hi, man!',
        });
        return;

      case 'female':
        form.setFieldsValue({
          note: 'Hi, lady!',
        });
        return;

      case 'other':
        form.setFieldsValue({
          note: 'Hi there!',
        });
        return;
    }
  };

  const onFinish = (values) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({
      note: 'Hello world!',
      gender: 'male',
    });
  };

  return (
    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item
        name="note"
        label="Note"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="gender"
        label="Gender"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder="Select a option and change input text above"
          onChange={onGenderChange}
          allowClear
        >
          <Option value="male">male</Option>
          <Option value="female">female</Option>
          <Option value="other">other</Option>
        </Select>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
      >
        {({ getFieldValue }) => {
          return getFieldValue('gender') === 'other' ? (
            <Form.Item
              name="customizeGender"
              label="Customize Gender"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          ) : null;
        }}
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button htmlType="button" onClick={onReset}>
          Reset
        </Button>
        <Button type="link" htmlType="button" onClick={onFill}>
          Fill form
        </Button>
      </Form.Item>
    </Form>
  );
};

function Shebei() {
  const { loading, error, data } = useQuery(shebeiQuery);
  if (loading) return <p>loading...</p>;
  if (error) return <p>error</p>;
  return(
    <EditableTable dataSource={data.shebeis} />
  )
}

export default Shebei;
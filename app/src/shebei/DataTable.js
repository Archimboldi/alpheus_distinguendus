import './styles.css';
import React from 'react';
import {
  Input,
  InputGroup,
  Table,
  Panel,
  Icon,
  ButtonToolbar,
  Button,
  DOMHelper,
  Notification
} from 'rsuite';
import { useQuery, gql } from '@apollo/client';
import DrawerView from './DrawerView';

const { Column, HeaderCell, Cell } = Table;
const { getHeight } = DOMHelper;
const QUERY_SHEBEIS = gql`
  query {shebeis {
    zcbh,
    szbm,
    szxm,
    sblx,
    sbpp,
    sbxh,
    smcs,
    sbbz,
    xlh
  }}
`;

class DataList extends React.Component {
  constructor(props) {
    super();
    this.state = {
      show: false,
      data: {}
    };
    this.listdata = props.data;
    this.handleEdit = this.handleEdit.bind(this);
  }
  handleShowDrawer = () => {
    this.setState({
      show: true
    });
  };
  handleCloseDrawer = () => {
    this.setState({
      show: false
    });
  };
  handleEdit(rowData) {
    this.setState({
      show: false,
      data: rowData
    })
  }
  handleSearch = () => {
    this.listdata = [];
  }
  render() {
    return (
      <div>
        <Panel header={<h3>设备情况</h3>}>
          <div className="table-toolbar clearfix">
            <ButtonToolbar className="inner-left">
              <Button appearance="primary" placement="left" onClick={this.handleShowDrawer}>
                新增
              </Button>
            </ButtonToolbar>

            <div className="inner-right">
              <InputGroup inside>
                <Input placeholder="检索" />
                <InputGroup.Addon onClick={this.handleSearch}>
                  <Icon icon="search" />
                </InputGroup.Addon>
              </InputGroup>
            </div>
          </div>

          <Table
            height={getHeight(window) - 190}
            data={this.listdata}
            onRowClick={data => {
              console.log(data);
            }}
          >
            <Column width={120} align="center" fixed  resizable>
                <HeaderCell>资产编号</HeaderCell>
                <Cell dataKey="zcbh" />    
            </Column>
            <Column width={100} fixed  resizable>
                <HeaderCell>所在部门</HeaderCell>
                <Cell dataKey="szbm" />    
            </Column>
            <Column width={100}  resizable>
                <HeaderCell>所在项目</HeaderCell>
                <Cell dataKey="szxm" />    
            </Column>
            <Column width={100}  resizable>
                <HeaderCell>设备类型</HeaderCell>
                <Cell dataKey="sblx" />    
            </Column>
            <Column width={100}  resizable>
                <HeaderCell>设备品牌</HeaderCell>
                <Cell dataKey="sbpp" />    
            </Column>
            <Column width={100}  resizable>
                <HeaderCell>设备型号</HeaderCell>
                <Cell dataKey="sbxh" />    
            </Column>
            <Column width={100}  resizable>
                <HeaderCell>序列号</HeaderCell>
                <Cell dataKey="xlh" />    
            </Column>
            <Column width={100}  resizable>
                <HeaderCell>扫描次数</HeaderCell>
                <Cell dataKey="smcs" />
            </Column>
            <Column width={100}  resizable>
                <HeaderCell>备注</HeaderCell>
                <Cell dataKey="sbbz" />    
            </Column>
            <Column width={140} fixed="right">
              <HeaderCell>操作</HeaderCell>
              <Cell>
                {rowData => {
                  function handleAction() {
                    alert(`id:${rowData.zcbh}`);
                   
                  }
               
                  return (
                    <span>
                      <a onClick={this.handleShowDrawer}> 变更 </a> | <a onClick={handleAction}> 调拨 </a> | <a onClick={handleAction}> 报废 </a>
                    </span>
                  );
                }}
              </Cell>
            </Column>
          </Table>
        </Panel>
        <DrawerView show={this.state.show} onClose={this.handleCloseDrawer} />
      </div>
    );
  }
}

function Shebei() {
  const { loading, error, data } = useQuery(QUERY_SHEBEIS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return(
  <div><DataList data={data.shebeis} /></div>
  )

}

export default Shebei;
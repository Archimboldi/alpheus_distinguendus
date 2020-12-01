import { useQuery, gql } from '@apollo/client';
import React from 'react';
import { Table } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

const EXCHANGE_RATES = gql`
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

class PaginationTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayLength: 10,
      loading: false,
      page: 1
    };
    this.Data = props.data;
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeLength = this.handleChangeLength.bind(this);
  }
  handleChangePage(dataKey) {
    this.setState({
      page: dataKey
    });
  }
  handleChangeLength(dataKey) {
    this.setState({
      page: 1,
      displayLength: dataKey
    });
  }
  getData() {
    const { displayLength, page } = this.state;

    return this.Data.filter((v, i) => {
      const start = displayLength * (page - 1);
      const end = start + displayLength;
      return i >= start && i < end;
    });
  }
  render() {
    const data = this.getData();
    const { loading, displayLength, page } = this.state;

      return (
        <div style={{display:"inline-block", width:"90%"}}>
          <Table height={420} data={data} loading={loading} onRowClick={data => {
          console.log(data);
        }} affixHeader>
          <Column width={100} align="center" fixed  resizable>
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
            <Column width={120} fixed="right">
              <HeaderCell>操作</HeaderCell>
              <Cell>
                {rowData => {
                  function handleAction() {
                    alert(`id:${rowData.zcbh}`);
                  }
                  return (
                    <span>
                      <a onClick={handleAction}> 调拨 </a> | <a onClick={handleAction}> 归还 </a>
                    </span>
                  );
                }}
              </Cell>
            </Column>
          </Table>
          <Table.Pagination
            lengthMenu={[
              {
                value: 10,
                label: 10
              },
              {
                value: 20,
                label: 20
              },
              {
                value: 50,
                label: 50
              },
              {
                value: 100,
                label: 100
              }
            ]}
            activePage={page}
            displayLength={displayLength}
            total={this.Data.length}
            onChangePage={this.handleChangePage}
            onChangeLength={this.handleChangeLength}
          />
        </div>
      );
    }
  }
function Shebei() {
    const { loading, error, data } = useQuery(EXCHANGE_RATES);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return(
    <div><PaginationTable data={data.shebeis} /></div>
    )

}

export default Shebei;
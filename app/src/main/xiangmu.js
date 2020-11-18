import { useQuery, gql } from '@apollo/client';
import React from 'react';
import { Table } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

const EXCHANGE_RATES = gql`
  query {xiangmus {
    xmbh,
    xmmc,
    xmfzr,
    xmlx,
    gclzl,
    gcllr,
    gclsm,
    gclcl,
    xmdd,
    xmbz,
    xmhth
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
        <div style={{display:"inline-block", width:"900px"}}>
          <Table height={420} data={data} loading={loading} onRowClick={data => {
          console.log(data);
        }}>
          <Column width={100} align="center" fixed>
                <HeaderCell>项目编号</HeaderCell>
                <Cell dataKey="xmbh" />    
            </Column>
            <Column width={100} fixed>
                <HeaderCell>项目名称</HeaderCell>
                <Cell dataKey="xmmc" />    
            </Column>
            <Column width={100} >
                <HeaderCell>项目负责人</HeaderCell>
                <Cell dataKey="xmfzr" />    
            </Column>
            <Column width={100} >
                <HeaderCell>项目类型</HeaderCell>
                <Cell dataKey="xmlx" />    
            </Column>
            <Column width={100} >
                <HeaderCell>工程量（整理）</HeaderCell>
                <Cell dataKey="gclzl" />    
            </Column>
            <Column width={100} >
                <HeaderCell>工程量（录入）</HeaderCell>
                <Cell dataKey="gcllr" />    
            </Column>
            <Column width={100} >
                <HeaderCell>工程量（扫描）</HeaderCell>
                <Cell dataKey="gclsm" />    
            </Column>
            <Column width={100} >
                <HeaderCell>工程量（处理）</HeaderCell>
                <Cell dataKey="gclcl" />    
            </Column>
            <Column width={100} >
                <HeaderCell>项目地点</HeaderCell>
                <Cell dataKey="xmdd" />    
            </Column>
            <Column width={100} >
                <HeaderCell>项目备注</HeaderCell>
                <Cell dataKey="xmbz" />    
            </Column>
            <Column width={100} >
                <HeaderCell>合同号</HeaderCell>
                <Cell dataKey="xmhth" />    
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
                value: 30,
                label: 30
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
    <div><PaginationTable data={data.xiangmus} /></div>
    )

}

export default Shebei;
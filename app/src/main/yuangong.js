import { useQuery, gql } from '@apollo/client';
import React from 'react';
import { Table } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

const EXCHANGE_RATES = gql`
  query {yuangongs {
    ygxm,
    ssbm,
    szxm,
    ygjn,
    rzsj,
    rgzl,
    ygzl,
    ljgzl,
    ygbz,
    sfzh
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
                <HeaderCell>员工姓名</HeaderCell>
                <Cell dataKey="ygxm" />    
            </Column>
            <Column width={100} fixed>
                <HeaderCell>所属部门</HeaderCell>
                <Cell dataKey="ssbm" />    
            </Column>
            <Column width={100} >
                <HeaderCell>所在项目</HeaderCell>
                <Cell dataKey="szxm" />    
            </Column>
            <Column width={100} >
                <HeaderCell>员工技能</HeaderCell>
                <Cell dataKey="ygjn" />    
            </Column>
            <Column width={100} >
                <HeaderCell>入职时间</HeaderCell>
                <Cell dataKey="rzsj" />    
            </Column>
            <Column width={100} >
                <HeaderCell>日工作量</HeaderCell>
                <Cell dataKey="rgzl" />    
            </Column>
            <Column width={100} >
                <HeaderCell>月工作量</HeaderCell>
                <Cell dataKey="ygzl" />    
            </Column>
            <Column width={100} >
                <HeaderCell>累计工作量</HeaderCell>
                <Cell dataKey="ljgzl" />    
            </Column>
            <Column width={100} >
                <HeaderCell>员工备注</HeaderCell>
                <Cell dataKey="ygbz" />    
            </Column>
            <Column width={100} >
                <HeaderCell>身份证号</HeaderCell>
                <Cell dataKey="sfzh" />    
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
    <div><PaginationTable data={data.yuangongs} /></div>
    )

}

export default Shebei;
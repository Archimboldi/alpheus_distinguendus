import { useQuery, gql } from '@apollo/client';
import React from 'react';
import { Table } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

const EXCHANGE_RATES = gql`
  query {kehus {
    khbh,
    khxm,
    ssxm,
    khxb,
    khgx,
    khbz,
    khlx
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
        }}>
          <Column width={100} align="center" fixed>
                <HeaderCell>客户编号</HeaderCell>
                <Cell dataKey="khbh" />    
            </Column>
            <Column width={100} fixed>
                <HeaderCell>客户姓名</HeaderCell>
                <Cell dataKey="khxm" />    
            </Column>
            <Column width={100} >
                <HeaderCell>所属项目</HeaderCell>
                <Cell dataKey="ssxm" />    
            </Column>
            <Column width={100} >
                <HeaderCell>客户性别</HeaderCell>
                <Cell dataKey="khxb" />    
            </Column>
            <Column width={100} >
                <HeaderCell>客户关系</HeaderCell>
                <Cell dataKey="khgx" />    
            </Column>
            <Column width={100} >
                <HeaderCell>客户备注</HeaderCell>
                <Cell dataKey="khbz" />    
            </Column>
            <Column width={100} >
                <HeaderCell>联系方式</HeaderCell>
                <Cell dataKey="khlx" />    
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
    <div><PaginationTable data={data.kehus} /></div>
    )

}

export default Shebei;
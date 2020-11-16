import { useQuery, gql } from '@apollo/client';
import { Table } from 'rsuite';

const { Column, HeaderCell, Cell, Pagination } = Table;

const EXCHANGE_RATES = gql`
  query {shebeis {
    zcbh,
    szbm,
    szxm,
    sblx,
    sbpp,
    sbxh,
    xlh,
    smcs,
    sbbz
  }}
`;

const Shebei=()=> {
    const { loading, error, data } = useQuery(EXCHANGE_RATES);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
        console.log(data)
    return(
    <div>
        <Table
            height={1000}
            data={data.shebeis}
            onRowClick={data => {
                console.log(data);
            }}>
            <Column width={100} align="center" fixed>
                <HeaderCell>资产编号</HeaderCell>
                <Cell dataKey="zcbh" />    
            </Column>
            <Column width={100} fixed>
                <HeaderCell>所在部门</HeaderCell>
                <Cell dataKey="szbm" />    
            </Column>
            <Column width={100} >
                <HeaderCell>所在项目</HeaderCell>
                <Cell dataKey="szxm" />    
            </Column>
            <Column width={100} >
                <HeaderCell>设备类型</HeaderCell>
                <Cell dataKey="sblx" />    
            </Column>
            <Column width={100} >
                <HeaderCell>设备品牌</HeaderCell>
                <Cell dataKey="sbpp" />    
            </Column>
            <Column width={100} >
                <HeaderCell>设备型号</HeaderCell>
                <Cell dataKey="sbxh" />    
            </Column>
            <Column width={100} >
                <HeaderCell>序列号</HeaderCell>
                <Cell dataKey="xlh" />    
            </Column>
            <Column width={100} >
                <HeaderCell>扫描次数</HeaderCell>
                <Cell dataKey="smcs" />    
            </Column>
            <Column width={100} >
                <HeaderCell>备注</HeaderCell>
                <Cell dataKey="sbbz" />    
            </Column>
       </Table>
    </div>
    )
}

export default Shebei;
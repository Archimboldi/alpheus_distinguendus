import React, {useState} from 'react';
import { Table, Input } from 'antd';
import { gql, useQuery, NetworkStatus } from '@apollo/client';
const { Search } = Input;

const FIND_RIZHI = gql`
  query FindRizhi($cz:String!){
    rizhis(cz:$cz){
      id,cz,time,ip,mac
    }
  }
`;

function AllTable() {
  //搜索按钮
  const onSearch = (val) => {
    SetKeyword(val);
    refetch();
  }
  const [keyword, SetKeyword] = useState("");
  const {loading, error, data, refetch, networkStatus} = useQuery(FIND_RIZHI,{
    variables:{"cz": keyword}
  });
  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
    },
    {
      title: '操作',
      dataIndex: 'cz',
    },
    {
      title: 'ip地址',
      dataIndex: 'ip',
    },
    {
      title: 'mac地址',
      dataIndex: 'mac',
    }
  ];
  if (networkStatus === NetworkStatus.refetch) return 'Refetching!';
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <div>
        <Search
            placeholder="请输入操作内容"
            allowClear
            onSearch={onSearch}
            style={{ width: 270, margin: '0 10px', float:'right',marginBottom:'16px' }}
        />
      <Table
        dataSource={data.rizhis}
        columns={columns}
        rowKey={row=>row.id}
      />
    </div>
  );
}

function Rizhi() {
  return(
    <div>
      <AllTable />
    </div>
  )
}

export default Rizhi;
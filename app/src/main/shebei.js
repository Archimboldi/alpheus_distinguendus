
import fakeData from "./fakedata.json";
import { Table } from 'rsuite';
import { Input, InputGroup, Icon } from 'rsuite';
import { CheckPicker } from 'rsuite';
import { Button, ButtonToolbar } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;
const CustomInputGroupWidthButton = ({ placeholder, ...props }) => (
  <div>
    
    <InputGroup {...props} inside>
      <Input placeholder={placeholder} />
      <InputGroup.Button>
        <Icon icon="search" />
      </InputGroup.Button>
    </InputGroup>
  </div>
);
const Instance = (
  <ButtonToolbar>
    <Button color="blue" >
      <Icon icon="facebook-official"  /> Facebook
    </Button>
    <Button color="red" >
      <Icon icon="google-plus-circle"  /> Google Plus
    </Button>
    <Button color="cyan" >
      <Icon icon="twitter"  /> Twitter
    </Button>
    <Button color="blue" >
      <Icon icon="linkedin"  /> LinkedIn
    </Button>
    <Button color="green" >
      <Icon icon="wechat"  /> WeChat
    </Button>
    <Button color="yellow" >
      <Icon icon="weibo"  /> WeiBo
    </Button>

  </ButtonToolbar>
);
function SbTable() {
  return (
    <Table
        height={780}
        data={fakeData}
        onRowClick={data => {
          console.log(data);
        }}
      >
        <Column width={70} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column width={200} fixed>
          <HeaderCell>First Name</HeaderCell>
          <Cell dataKey="firstName" />
        </Column>

        <Column width={200}>
          <HeaderCell>Last Name</HeaderCell>
          <Cell dataKey="lastName" />
        </Column>

        <Column width={200}>
          <HeaderCell>City</HeaderCell>
          <Cell dataKey="city" />
        </Column>

        <Column width={200}>
          <HeaderCell>Street</HeaderCell>
          <Cell dataKey="street" />
        </Column>

        <Column width={300}>
          <HeaderCell>Company Name</HeaderCell>
          <Cell dataKey="companyName" />
        </Column>

        <Column width={300}>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column>
        <Column width={120} fixed="right">
          <HeaderCell>Action</HeaderCell>

          <Cell>
            {rowData => {
              function handleAction() {
                alert(`id:${rowData.id}`);
              }
              return (
                <span>
                  <a onClick={handleAction}> 归还 </a> | <a onClick={handleAction}> 调拨 </a>
                </span>
              );
            }}
          </Cell>
        </Column>
      </Table>
  )
}

function Shebei() {
  return (
    <div>
      <CheckPicker size="md"/>
      <CustomInputGroupWidthButton size="md" placeholder="输入关键字查询" />
      <Instance />
      <SbTable />
    </div>
  );
}

export default Shebei;
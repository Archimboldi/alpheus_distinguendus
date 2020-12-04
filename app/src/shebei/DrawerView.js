//@flow
import * as React from 'react';
import { Modal, Button, Form, FormGroup, ControlLabel, FormControl, Alert } from 'rsuite';
import { useMutation, gql } from '@apollo/client';
const CREATE_SHEBEI = gql`
  mutation CreateShebei($sb: Sb){
    createShebei(sb: $sb)
  }
`;

function Shebei(props) {
  const [createShebei] = useMutation(CREATE_SHEBEI);
  const { show, onClose, data } = props;
  let form;
  return(
      <div className="modal-container">
        <Modal show={show} onHide={onClose}>
          <Modal.Header>
            <Modal.Title>设备信息</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form fluid layout="horizontal"
            ref={ref => (form = ref)}
            data={data}
          >
            <FormGroup>
              <ControlLabel>资产编号</ControlLabel>
              <FormControl name="zcbh" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>所在部门</ControlLabel>
              <FormControl name="szbm" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>所在项目</ControlLabel>
              <FormControl name="szxm" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>设备类型</ControlLabel>
              <FormControl name="sblx" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>设备品牌</ControlLabel>
              <FormControl name="sbpp" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>设备型号</ControlLabel>
              <FormControl name="sbxh" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>序列号</ControlLabel>
              <FormControl name="xlh" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>扫描次数</ControlLabel>
              <FormControl name="smcs" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>备注</ControlLabel>
              <FormControl name="sbbz" />
            </FormGroup>
          </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={e =>{
            e.preventDefault();
            let nsb = form.state.formValue;
            if (createShebei({variables:{"sb":nsb}})){
              Alert.success('保存成功.');
              onClose();
            }else{
              Alert.error('保存失败.');
            }
          }} appearance="primary">
              确定
            </Button>
            <Button onClick={onClose} appearance="subtle">
              取消
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
  )
}

export default Shebei;

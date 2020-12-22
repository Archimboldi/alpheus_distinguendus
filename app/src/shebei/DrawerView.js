//@flow
import * as React from 'react';
import { Modal, Button, Form, FormGroup, ControlLabel, FormControl } from 'rsuite';

class Shebei extends React.Component {
  constructor(props){
    super(props);
    const {rowdata} = props.rowdata;
    this.state={
      formValue: {
        zcbh: '',
        szbm: '',
        szxm: '',
        sblx: '',
        sbpp: '',
        sbxh: '',
        xlh: '',
        smcs: '',
        sbbz: ''
      }
    }
    this.setState({
      formValue: rowdata
    })
  }
  componentDidUpdate(prevProps){
    if (this.props.rowdata !== prevProps.rowdata){
      this.setState({
        formValue: this.props.rowdata
      })
    }
  }
  render(){
    const { show, onClose, rowdata } = this.props;
    return(
      <div className="modal-container">
        <Modal show={show} onHide={onClose}>
          <Modal.Header>
            <Modal.Title>设备信息</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form fluid layout="horizontal"
            ref={ref =>(this.form = ref)}
            onChange={formValue =>{
              this.setState({formValue: formValue});
            }}
            formDefaultValue={rowdata}
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
            <Button onClick={onClose.bind(null,(JSON.stringify(rowdata)==="{}"?0:1),this.state.formValue)} appearance="primary">
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
 
}

export default Shebei;

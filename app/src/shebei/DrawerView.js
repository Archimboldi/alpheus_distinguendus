//@flow
import * as React from 'react';
import { Modal, Button } from 'rsuite';

class DrawerView extends React.Component {
  handleCreate() {
    console.log("Ok");
  }
  handleUpdate() {
    console.log("Update")
  }
  render() {
    const { show, onClose, data } = this.props;
    return (
      <div className="modal-container">
        <Modal show={show} onHide={onClose}>
          <Modal.Header>
            <Modal.Title>设备信息</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h2>hahaha</h2>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleCreate} appearance="primary">
              确定
            </Button>
            <Button onClick={onClose} appearance="subtle">
              取消
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default DrawerView;

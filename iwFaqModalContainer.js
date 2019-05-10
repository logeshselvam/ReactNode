import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Form, Input, Icon, Button, Checkbox , Modal , message as AntMessage, Select, Radio } from 'antd';
import { saveFaqDetails , updateFaqDetails } from './reduxFlow/iwActions';
//import '../../styles/form.css';

const FormItem = Form.Item;
const styles = {
    iconStyle:{
      color: 'rgba(0,0,0,.25)'
    },
    rememberBox:{
      color:'red'
    }
}

const { TextArea } = Input;

class IwFaqModalContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        loading: false,
        visible: false,
        modalType:'',
        updateModalData:''
    }
  }

//componentWillReceiveProps(props){
//const { childModalData } = props;
//this.setState({ visible : childModalData.openChildModal });

//}

  componentDidMount(){
    this.props.onRef(this);
  }

  componentWillUnmount(){
    this.props.onRef(undefined);
  }

  parentMethod = (row) => {
    const {form} = this.props;
    this.setState({ visible : row.openChildModal });
    console.log('row',row);
    form.setFieldsValue({
      creator:row.creator,
      leader:row.leader,
      module:row.module,
      phase:row.phase,
      keyword:row.keyword,
      path:row.path,
      answer:row.answer,
      question:row.question
    });
    this.setState({ modalType : 'update' });
    this.setState({ updateModalData : row });
  } 

  showModal = () => {
    const { form } = this.props;
    this.setState({ modalType : 'add' });
    form.resetFields();
    this.setState({
      visible: true,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.handleOk();
      }
    });
  }

  handleOk = async(e) => {
    const { dispatch , form , iwSaveFaqData } = this.props; 
    const {modalType , updateModalData} = this.state;
//  const param = modalType == 'add'? form.getFieldsValue() : updateModalData;
    let param = form.getFieldsValue();
    modalType == 'add'? param : param['findId'] = updateModalData.findId;
    let { answer , question } = param;
    answer = answer.trim();
    question = question.trim();
    if(!answer && !question){
      AntMessage.error(`Please fill all mandatory fields`);
      return;
    }
    this.setState({ InsertData : false });
    let keyCheck = '_id' in param
    modalType == 'update' ? await updateFaqDetails(dispatch , param) : await saveFaqDetails(dispatch , param) ;
    this.setState({ visible: false });
    this.props.changechild();
    AntMessage.success(`Thanks for Sharing your Valuable Information.`);
    form.resetFields();
  }

  handleCancel = (e) => {
    const { form } = this.props; 
    this.setState({ visible: false });
    form.resetFields();
  }


  render() {

    const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
    };

    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;
    const Option = Select.Option;

    return ( 
        <div>
        <Button onClick = {this.showModal} type="primary"   style={{ marginBottom: 10 }}> <Icon type="area-chart"/>Add Data</Button>
        <Modal
        title="FaQ"
          style={{ top: 20 }}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={null}
        >
        <Form onSubmit={this.handleSubmit}>
        <Form.Item  label="Creator">

        {getFieldDecorator('creator', {
          rules: [{
            required: true, message: 'Please input your Name!',
          }],
        })(
            <Input placeholder="Please input your Name" />
        )}
        </Form.Item>

        <Form.Item  label="Lab Leader">
        {getFieldDecorator('leader', {
          rules: [{
            required: true, message: 'Please input your LL-Name!',
          }],
        })(
            <Input placeholder="Please input your LL-Name" />
        )}
        </Form.Item>

        <Form.Item  label="Module">
        {getFieldDecorator('module', {
          rules: [{
            required: true, message: 'Please input your module!',
          }],
        })(
            <Input placeholder="Please input your module" />
        )}
        </Form.Item>

        <Form.Item  label="Phase">
        {getFieldDecorator('phase', {
          rules: [{
            required: true, message: 'Please input your Current Phase!',
          }],
        })(
            <Input placeholder="Ex: Ui/Ux ,Plugin or Bug-Fixing " />
        )}
        </Form.Item>

        <Form.Item  label="keyword">
        {getFieldDecorator('keyword', {
          rules: [{
            required: true, message: 'Please input a Keyword!',
          }],
        })(
            <Input placeholder="Used for searching" />
        )}
        </Form.Item>

        <Form.Item  label="Document Path">
        {getFieldDecorator('path', {
        })(
            <Input placeholder="Share folder path" />
        )}
        </Form.Item>

        <Form.Item  label="Question">
        {getFieldDecorator('question', {
          rules: [{
            required: true,
            message: 'Please post your Question!!',
          }],
        })(
            <TextArea rows={4} placeholder="Please post your Question" />
        )}
        </Form.Item>

        <Form.Item  label="Answers">
        {getFieldDecorator('answer', {
          rules: [{
            required: true,
            message: 'Please fill your Answer!!',
          }],
        })(
            <TextArea rows={4} placeholder="Solution" />
        )}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
        </Form>
        </Modal>
        </div>
    );
  }
}

const WrappedIwFaqModalContainer = Form.create()(IwFaqModalContainer);
export default withRouter(connect(null)(WrappedIwFaqModalContainer));
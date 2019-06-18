import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {Form, Input, Icon, Select, Checkbox, Button, Modal, Table , Tag , Divider} from 'antd';
import '../../../js/common/styles/form.css';

const formItemLayout = {
    /* labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },*/
  };
  const tailFormItemLayout = {
    /* wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },*/
  };
const { Option } = Select;

class ManagerRegisterContainer extends Component {
  
  constructor(props){
    super(props);
    this.state = {
        confirmDirty: false,
        autoCompleteResult: [],
        visible: false 
    }
  }
  
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    };

    handleConfirmBlur = e => {
      const value = e.target.value;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    };

    validateToNextPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    };

    showModal = () => {
      this.setState({
        visible: true,
      });
    };

    handleOk = e => {
      console.log(e);
      this.setState({
        visible: false,
      });
    };

    handleCancel = e => {
      console.log(e);
      this.setState({
        visible: false,
      });
    };
    
  render(){
    const { visible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const prefixSelector = getFieldDecorator('prefix', { initialValue: '91' })(
        <Select style={{ width: 70 }}><Option value="91">+91</Option></Select>);
    
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a href="javascript:;">{text}</a>,
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: tags => (
          <span>
            {tags.map(tag => {
              let color = tag.length > 5 ? 'geekblue' : 'green';
              if (tag === 'loser') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        ),
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <a href="javascript:;">Invite {record.name}</a>
            <Divider type="vertical" />
            <a href="javascript:;">Delete</a>
          </span>
        ),
      },
    ];

    const data = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      },
    ];
    
    return(
        <div>
        <span className="mainDiv">
        <Button onClick={()=>this.showModal()} type="primary" icon="user" style={{  float : 'right' , width:200 , marginTop :80 , marginRight : 30}} >
        Manager Details
        </Button>
        <p style={{ marginTop :80 ,  marginBottom : 50 , marginLeft : 220 , textAlign : 'center' }} ><font size="6"><b>Manager Registration</b></font></p>
        
        <Form {...formItemLayout} onSubmit={this.handleSubmit} className="signup-form">
        
        <Form.Item label="E-mail">
        {getFieldDecorator('email', {
          rules: [
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ],
        })(<Input />)}
        </Form.Item>
        
        <Form.Item label="Password" hasFeedback>
        {getFieldDecorator('password', {
          rules: [
            {
              required: true,
              message: 'Please input your password!',
            },
            {
              validator: this.validateToNextPassword,
            },
          ],
        })(<Input />)}
      </Form.Item>
   
      <Form.Item label="Confirm Password" hasFeedback>
      {getFieldDecorator('confirm', {
        rules: [
          {
            required: true,
            message: 'Please confirm your password!',
          },
          {
            validator: this.compareToFirstPassword,
          },
        ],
      })(<Input onBlur={this.handleConfirmBlur} />
      )}
      </Form.Item>
       
      
      <Form.Item label="Company name">
      {getFieldDecorator('company', {
        rules: [{ required: true, message: 'Please input your company name!' }],
      })(
          <Input style={{ width: '100%' }} />
      )}
    </Form.Item>
          
      
     <Form.Item {...tailFormItemLayout}>
     {getFieldDecorator('agreement', {
        valuePropName: 'checked',
      })(
     <Checkbox>
       I have read the <a href="">agreement</a>
     </Checkbox>,
     )}
     </Form.Item>
     
     <Form.Item {...tailFormItemLayout} style={{ textAlign : 'center' }}>
     <Button type="primary" htmlType="submit">
       Register
     </Button>
    </Form.Item>
   </Form>
   </span>
   <Modal
   title="Managers Details"
   width = {1500}
   visible={this.state.visible}
   onOk={this.handleOk}
   onCancel={this.handleCancel}
   >
   <Table columns={columns} dataSource={data} />
   </Modal>
   
   </div>
  )
  }

  }
  
  function mapStateToProps(state) {
    return {
    };
  }

  const WrappedManagerRegisterContainer = Form.create()(ManagerRegisterContainer);
  export default withRouter(connect(null)(WrappedManagerRegisterContainer));

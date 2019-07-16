import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button , Modal , Table , Tag , Row , Form , Input , Select , Statistic , Icon , Spin ,  message as AntMessage , } from 'antd';
import { getManagersDetails , getQuestionBankDetails , getSingleManagerDetail , getFilteredEmailId } from '../reduxFlow/actions';
import ManagerDrawerContainer from './managerDrawerContainer';

const Search = Input.Search;
const { Option , OptGroup } = Select;
const styles={
    select:{
      width: 400,
      border: '2px solid',
      borderColor: 'royalblue',
      borderRadius: 6,
      marginRight: 5,
      marginBottom: 5,
      marginTop:5
    },
    button:{
      backgroundColor:'green',
      marginTop: 10,
      marginRight: 10  
    }
}

class ManagerInformationContainer extends Component {

  constructor(props){
    super(props);
    this.state = {
        visible: false,
        updateVisible: false,
        singleManagerData : [],
        selectedList : [],
        modalView:'',
        allManagerArray : [],
        componentMailMap : {},
        componentCompanyMap : {},
        company : undefined,
        mailId: undefined,
        tableCount:'',
        loading:false
    }
  }

  componentDidMount(){
    this.screenLoad();
  }
  
  screenLoad = async() => {
    const { dispatch } = this.props
    this.setState({ loading: true });
    let param = {};
    await getManagersDetails(dispatch , param).catch(this.handleError);
    const { allManagerDetails } = this.props;
    let mailValueMap = {};
    let companyValueMap = {};
    { allManagerDetails.length>0 && allManagerDetails.forEach(data=> {
      mailValueMap[data.mailId] = this.changeCamelCase(data.company) ;
      companyValueMap[this.changeCamelCase(data.company)] = data.mailId;
    })};
    this.setState({ loading: false });
    this.setState({ componentMailMap: mailValueMap , componentCompanyMap: companyValueMap , tableCount : allManagerDetails.length });
  }
  
  changeCamelCase = (company) => {
    return company.substring(0, 1).toUpperCase() + company.substring(1).toLowerCase()
  }

  showModal = async( row ) => {
    const { dispatch } = this.props;  
    await getSingleManagerDetail( row.mailId,dispatch).catch(this.handleError);
    const { singleManagerInfo } = this.props;
    const { selectedList } = this.state;

    let singleManagerArray = [];
    let singleManagerObject = {};
    singleManagerInfo.forEach( (data) => {
      singleManagerArray.push({ 'questionBankName' : data });
    })
    let resultList = Array.from(new Set(selectedList.concat(singleManagerInfo)));
    this.setState({ visible: true ,  singleManagerData:singleManagerArray ,selectedList : resultList});
  };

  handleOk = e => {
    this.setState({ visible: false});
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  showUpdateModal = async( row ) => {
    console.log(row);
    const { dispatch , form } = this.props;  
    await getQuestionBankDetails(dispatch).catch(this.handleError);
    await getSingleManagerDetail( row.mailId,dispatch ).catch(this.handleError);
    const { allQuestionBankDetails , singleManagerInfo } = this.props;
    let responseArray = [];
    allQuestionBankDetails.forEach(questionMap => {
      responseArray.push( questionMap.questionBankName );
    });
    form.setFieldsValue({ mailId : row.mailId , company : row.company });
    this.setState({allManagerArray :responseArray , updateVisible: true});
  }

  handleUpdateCancel = e => {
    this.setState({updateVisible: false});
  };

  handleUpdateOk = e => {
    this.setState({ updateVisible: false});
  };

  handleUpdateChange = (e) => {
    console.log(e);
  }

  changechild(){
    this.screenLoad();
  }

  handleUpdateSubmit = () => {
    const { form , dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  onChange = async (value) =>{
    const { dispatch } = this.props;
    const { componentMailMap } = this.state;
    const { company } = this.state;
    this.setState({ loading: true });
    let param = {};
    param['mailId'] = value;
    param['company'] = company ;
    await getManagersDetails( dispatch , param).catch(this.handleError);
    const { allManagerDetails } = this.props;
    let companyValueMap = {};
    allManagerDetails.forEach(data=> {
      companyValueMap[this.changeCamelCase(data.company)] = data.mailId;
    });
    this.setState({ componentCompanyMap: companyValueMap , tableCount : allManagerDetails.length , mailId : value});
    this.setState({ loading: false });
  }

  onSearch = async (value) => {
    const { dispatch } = this.props;
    const { company } = this.state;
    let param = {};
    param['mailId'] = value;
    param['company'] = company ;
    getManagersDetails( dispatch , param);
    this.setState({ company: '' , companyDisable : false });
  }

  onCompanyChange = async (value) => {
    const { dispatch } = this.props;
    const { mailId } = this.state;
    this.setState({ loading: true });
    let param = {};
    param['mailId'] = mailId;
    param['company'] = value ;
    value != '' ?  await getManagersDetails( dispatch , param).catch(this.handleError) : '';
    const { allManagerDetails } = this.props;
    let mailValueMap = {};
    allManagerDetails.forEach(data=> {
      mailValueMap[data.mailId] = this.changeCamelCase(data.company);
    });
    this.setState({ loading: false });
    this.setState({ componentMailMap: mailValueMap , tableCount : allManagerDetails.length , company : value });
  }

  onCompanySearch = (value)=> {
    const { dispatch } = this.props;
    const { mailId } = this.state;
    let param = {};
    param['mailId'] = mailId;
    param['company'] = value;
    getManagersDetails( dispatch , param);
    this.setState({ mailId: undefined });
  }
  
  handleError = (err) => {
    AntMessage.error(`${err.message}`);
    this.setState({ loading: false });
  }

  render(){

    const {allManagerDetails , allQuestionBankDetails , singleManagerInfo} = this.props;
    const { singleManagerData , selectedList , updateVisible , allManagerArray , visible } = this.state; 
    const { componentMailMap , company , mailId , componentCompanyMap , tableCount , loading } = this.state;
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: 'Email-Id',
        dataIndex: 'mailId',
        key: 'mailId',
        render:(text , row) => {
          return <span ><Tag color="darkgreen">{text}</Tag></span>
          {false && <span><Button onClick={()=>this.showUpdateModal(row)} icon="edit" size= "small" shape="square" type="primary" ></Button></span> }
        }
      },
      {
        title: 'Company Name',
        dataIndex: 'company',
        key: 'company',
        render:(text , row) => {
          return <span><Tag color="grey">{text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase()}</Tag></span>
        }
      },
      {
        title: 'Question Bank Count',
        key: 'count',
        dataIndex: 'count',
        render:(text , row) => {
          return <span><Button onClick={()=>this.showModal(row)} icon="info-circle" size= "small" shape="square" type="primary" ></Button> 
          <span style={{ marginLeft : 10}} >
          <Tag color="grey">{text}</Tag></span></span>
        }
      }
      ];

    const questionBankColumns = [
      {
        title: 'Question Bank Name',
        dataIndex: 'questionBankName',
        key:'questionBankName'
      }
      ];


    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          this.setState( { selectedList : selectedRowKeys });
        },
        selectedRowKeys : selectedList,
        getCheckboxProps: record => ({
          disabled: record.questionBankName === record.questionBankName, // Column configuration not to be checked
        }),
    };

    const Selected = [];
    for (let i = 10; i < 36; i++) {
      Selected.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    return(
      <Spin spinning={loading} >
      <div>
        <Row>
        <ManagerDrawerContainer
          changechild = {this.changechild.bind(this)}
          onRef = {ref => (this.child = ref)} />
        <Select
            showSearch
            allowClear
            style={styles.select}
            placeholder="Select Your Email-Id"
            optionFilterProp="children"
            value = {mailId}
            onChange={this.onChange}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        >
          {Object.keys(componentMailMap).map(mail => <Option value={mail}>{mail}</Option> )}
        </Select>

          <Select
            showSearch
            allowClear
            style={styles.select}
            placeholder="Select Your Company Name"
            value = {company}
            optionFilterProp="children"
            onChange={this.onCompanyChange}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {Array.from(new Set (Object.keys(componentCompanyMap))).map(company => <Option value={company}>{company}</Option>)}
          </Select>
          <Statistic  style={{marginLeft:5}}
          prefix={tableCount == 0 ? <Icon theme="twoTone" twoToneColor="red" type="dislike" /> : <Icon theme="twoTone" twoToneColor="#52c41a" type="like" />}
          value={ tableCount + ' Records' }
          />
          </Row>
        <Table
          bordered columns={columns}
          dataSource={allManagerDetails? allManagerDetails:[]}
          />
        <Modal
          title="Question Bank Details"
          width = {500}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Table
            rowSelection={rowSelection}
            rowKey={record => record.questionBankName}
            columns={questionBankColumns}
            dataSource={singleManagerData? singleManagerData:[]} />
        </Modal>

        <Modal
          title="Update Information"
          style={{ top: 20 }}
          visible={updateVisible}
          onOk={this.handleUpdateOk}
          onCancel={this.handleUpdateCancel}
          footer={null}
        >
          <Form onSubmit={this.handleUpdateSubmit}>
            <Form.Item label="E-mail">
            {getFieldDecorator('mailId', {
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
            })(<Input disabled placeholder="Please input your Prm Ticket"/>)}
            </Form.Item>
    
            <Form.Item  label="Question bank Name">
            {getFieldDecorator('question', {
              rules: [{
                required: true, message: 'Please select your Question Banks!',
              }],
            })(
    
                <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select"
                defaultValue={['SAMPLE_QB']}
                onChange={this.handleUpdateChange}
                >
                <OptGroup label="Chosen">
                {allManagerArray.map(allData => 
                singleManagerInfo.indexOf(allData) != -1 ? <Option disabled value={allData}>{allData}</Option> : ''
                )}
                </OptGroup>
                <OptGroup label="Not-Chosen">
                {allManagerArray.map(allData => 
                singleManagerInfo.indexOf(allData) == -1 ? <Option value={allData}>{allData}</Option> : ''
                )}
                </OptGroup>
                </Select>
            )}
            </Form.Item>
    
    
            <Form.Item label="Company name">
              {getFieldDecorator('company', {
                rules: [{ required: true, message: 'Please input your company name!' }],
              })(
                  <Input placeholder="Please input your company name!" />
              )}
            </Form.Item>
    
            <Form.Item style={{ textAlign : 'center' }}>
            <Button style={styles.button}  htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      </Spin>
    );
  }
}

function mapStateToProps(state) {
  return {
    allManagerDetails: state.get('admin').toJS().getManagersDetails,
    allQuestionBankDetails: state.get('admin').toJS().getQuestionBankDetails,
    singleManagerInfo: state.get('admin').toJS().getSingleManagerDetail,
    filteredManagerIDs: state.get('admin').toJS().getFilteredEmailId,
  };
}

const WrappedManagerInformationContainer = Form.create()(ManagerInformationContainer);
export default withRouter(connect(mapStateToProps)(WrappedManagerInformationContainer));






--------------------------------------------------------------------------------------------------------------------------

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Drawer, Form, Button, Input, Select, Icon  , Checkbox , Spin ,  message as AntMessage } from 'antd';
import { getQuestionBankDetails , registerManager , updateQbModelView , handleQbSelectedList } from '../reduxFlow/actions';
import DrawerQuestionBankModal from '../components/drawerQuestionBankModal';

const { Option } = Select;
const styles={
    select:{
      width: 400,
      border: '2px solid',
      borderColor: 'royalblue',
      borderRadius: 6,
      marginRight: 5,
      marginBottom: 5,
      marginTop:5
    },
    button:{
      backgroundColor:'green',
      marginTop: 10,
      marginRight: 10  
    }
}


class ManagerDrawerContainer extends Component {
  
  constructor(props){
    super(props);
    this.state = {
        drawerVisible: false,
        selectedList : [],
        questionBankCount:'',
        disableCheckbox:true,
        disableRegister :true,
        loading:false
        
    }
  }
  
  componentDidMount(){ 
    this.props.onRef(this);
  }

  componentWillUnmount(){
    this.props.onRef(undefined);
  }
  
  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };

  onClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };
  
  handleSubmit = (e) => {
    this.setState({ loading: true });
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
    this.submitRegister().catch(this.handleError);
    this.setState({loading: false });
  };
  
  submitRegister = async () => {
    const { form , dispatch , selectedList } = this.props;
    let param = form.getFieldsValue();
    param.questionBankList = selectedList;
    await registerManager(param , dispatch);
    this.props.changechild();
    this.setState({ drawerVisible: false , question:undefined });
    AntMessage.success(`${param.mailId} has been successfully registered as Manager`);
    form.resetFields();
  }
  
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
  
  disableCheck = () => {
    const form = this.props.form;
    const { selectedList  } = this.props;
    let formValues = form.getFieldsValue();
    if (formValues.mailId && formValues.password && formValues.confirm && formValues.company && selectedList.length  > 0 ){
      this.setState({ disableCheckbox : false });
      formValues.agreement == true ?  this.setState({ disableRegister : false }) :  this.setState({ disableRegister : true });
    }else{
      this.setState({ disableCheckbox : true });
    }
  }
  
  disableRegister = () => {
    const form = this.props.form;
    const { disableCheckbox } = this.state;
    let formValues = form.getFieldsValue();
    if(disableCheckbox == false){
      let checkValues =   Object.values(form.getFieldsValue()) ;
      let checkArray = checkValues.map(data => data !=undefined ? data.toString().trim() : data);
      checkArray.indexOf(undefined) == '-1' && checkArray.indexOf('')  == '-1' ? 
          this.setState({ disableRegister : false }) : this.setState({ disableRegister : true });
    }
  }
  
  formChange = ()=> {
    this.disableCheck(); 
  }
  
  modalView = () => {
    const { dispatch } = this.props;  
     updateQbModelView( dispatch , true );
  }
  
  questionBankCount = () => {
    const { selectedList } = this.props;  
    this.disableCheck();
    selectedList.length > 0 ? this.setState({ question : `${selectedList.length} Question Bank's Selected` }) : this.setState({ question : undefined });
  }
  
  handleError = (err) => {
    AntMessage.error(`${err.message}`);
    this.setState({ loading: false });
  }

  
  render(){
    
    const { getFieldDecorator } = this.props.form;
    const { disableRegister , disableCheckbox , question , loading} = this.state;
    const { modalQbView , selectedList} = this.props;
    
    return(
      <Spin spinning={loading} >
      <div>
        <Button  style={{marginTop:10, marginBottom: 10 , float:'right'}} type="primary" onClick={this.showDrawer}>
          <Icon type="plus" /> New Manager
        </Button>
        <Drawer
        title="Create a new Manager"
        width={620}
        onClose={this.onClose}
        visible={this.state.drawerVisible}
        >
        <Form layout="vertical"  onSubmit={this.handleSubmit} onChange = {this.formChange}>
          <Form.Item label="E-mail">
          {getFieldDecorator('mailId', {
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
          })(<Input type="password" />)}
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
          })(<Input type="password" />
          )}
          </Form.Item>
         
          <Form.Item label="Company name">
          {getFieldDecorator('company', {
            rules: [{ required: true, message: 'Please input your company name!' }],
          })(<Input style={{ width: '100%' }} />
          )}
          </Form.Item>
      
          Question Bank name
          <div style = {{ marginBottom : 30 , marginTop:10 }}>
          <Input value = {question} disabled ='true' style={{ color : 'forestgreen' , width: '83%' , marginRight:10}}
          placeholder="Select the question bank"/>
          <Button onClick= {this.modalView} type="primary">
          Choose
          </Button>
          </div>
            
        
          <Form.Item  style={{ textAlign : 'center' }}>
          {getFieldDecorator('agreement', {
          valuePropName: 'checked',
          })(
          <Checkbox disabled = {disableCheckbox} onClick = { this.disableRegister}>
           I Confirm the above Information
          </Checkbox>,
          )}
          </Form.Item>
       
          <Form.Item  style={{ textAlign : 'center' }}>
          <Button  style={styles.button}  disabled = {disableRegister} type="primary" htmlType="submit">
           Register
          </Button>
          </Form.Item>
        </Form>
        </Drawer>
        <DrawerQuestionBankModal questionBankCount = {this.questionBankCount.bind(this)}
          onRef = {ref => (this.child = ref)} />
      </div>
      </Spin>
    )
  }
}

function mapStateToProps(state) {
  return {
    modalQbView: state.get('admin').get('updateQbModelView'),
    selectedList : state.get('admin').toJS().handleQbSelectedList,
  };
}

const WrappedManagerDrawerContainer = Form.create()(ManagerDrawerContainer);
export default withRouter(connect(mapStateToProps)(WrappedManagerDrawerContainer)); 

------------------------------------------------------------------------------------------------------


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button, Table, Modal, Checkbox ,  message as AntMessage} from 'antd';
import { getQuestionBankDetails , updateQbModelView , handleQbSelectedList} from '../reduxFlow/actions';

class drawerQuestionBankModal extends Component {
  
  constructor(props){
    super(props);
    this.state = {
        selectedList:[] 
    }
  }
  
  componentDidMount(){ 
    const { dispatch } = this.props;  
    this.props.onRef(this);
    getQuestionBankDetails(dispatch).catch(this.handleError);
  };
  
  componentWillUnmount(){
    this.props.onRef(undefined);
  }

  handleOk = async() => {
    const { selectedList } = this.state;
    const { dispatch } = this.props;  
    updateQbModelView( dispatch , false );
    await handleQbSelectedList( dispatch , selectedList );
    this.props.questionBankCount();
  };

  handleCancel = () => {
    const { dispatch } = this.props;  
    updateQbModelView( dispatch , false );
  }; 
  
  handleSelectedList = () => {
    const { dispatch } = this.props;  
    handleQbSelectedList( dispatch , false );
  }
  
  handleError = (err) => {
    AntMessage.error(`${err.message}`);
    this.setState({ loading: false });
  }

  
  render(){
    const { allQuestionBankDetails , modalQbView } = this.props;
    const { selectedList } = this.state ;
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          this.setState( { selectedList : selectedRowKeys });
        },
        selectedRowKeys : selectedList,
    };
    
    const questionDrawerColumns = [
      {
        title: 'Question Bank Name',
        dataIndex: 'questionBankName',
        key:'questionBankName'
      }
    ];
    
    return(
        <div>
        <Modal
        title="Question Bank Details"
        width = {500}
        visible={modalQbView}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        >
        <Table rowSelection={rowSelection} rowKey={record => record.questionBankName} columns={questionDrawerColumns} dataSource={allQuestionBankDetails} />
        </Modal>
        </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    allQuestionBankDetails : state.get('admin').toJS().getQuestionBankDetails,
    modalQbView : state.get('admin').get('updateQbModelView'),
  };
}

export default withRouter(connect(mapStateToProps)(drawerQuestionBankModal));

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Table, Button, Icon , Row , Col , Spin , Input} from 'antd';
import { getFaqDetails } from './reduxFlow/iwActions';
import  IwFaqModalContainer  from './iwFaqModalContainer';

const Search = Input.Search;

class IwFaqContainer extends Component{
  constructor(props){
    super(props);
    this.state = {
        loading: false,
        openChildModal:false,
        keywordFilterData:''
//        childModalData:''
    }
  }

  componentDidMount(){
    this.handleFaqDetails();
  }

  handleFaqDetails = async () => {
    const { dispatch } = this.props;
    this.setState({ loading: true });
    await getFaqDetails(dispatch);
    this.setState({ loading: false });
  }

  changeView = () => {
    const {viewType} = this.state;
    console.log('viewType',viewType);
    viewType == 'Table' ? this.setState({viewType : 'Chart'}) :  this.setState({viewType : 'Table'})
  }

  changechild = () => {
    this.handleFaqDetails();
  }
  
  openFaqModal = (row) => {
    row.openChildModal = true;
//    this.setState({  childModalData : row });
    this.child.parentMethod(row);
  }
  
  handleKeywordSearchFilter = (key ,keywordSearchValue) => {
    this.setState({ loading: true });
    const { iwFaqData } = this.props;
    const faqDataFilter = iwFaqData && iwFaqData.size>0? iwFaqData.toJS():[];
    
    let keywordFilterData = faqDataFilter.filter(record => record[key].toLowerCase().indexOf(keywordSearchValue.toLowerCase()) !== -1 );
    
    if(keywordSearchValue===""){
      keywordFilterData = faqDataFilter;
    }
    
    this.setState({ keywordFilterData, loading: false });
  }

  render(){
    const { iwFaqData , iwSaveFaqData }= this.props;
    const { childSave , childModalData , loading , keywordFilterData } = this.state;
    const faqData = keywordFilterData.length>0 ?  keywordFilterData : iwFaqData && iwFaqData.size>0? iwFaqData.toJS():[];
    const columns = [{
      title: 'Creator',
      dataIndex: 'creator',
      key: 'creator',
      render:(text , row) => {
       return <span><Button style = {{ marginLeft : 10}} onClick={()=>this.openFaqModal(row)} icon="edit" size= "small" shape="square" type="dashed" ></Button>{text}</span>
      }
    }, {
      title: 'Lab Leader',
      dataIndex: 'leader',
      key: 'leader',
    }, {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
    },{
      title: 'Phase',
      dataIndex: 'phase',
      key: 'phase',
    },{
      title: 'Keyword',
      dataIndex: 'keyword',
      key: 'keyword',
    },{
      title: 'Document Path',
      dataIndex: 'path',
      key: 'path',
    }];
    return(
        <Spin spinning={loading} >
        <div>
        <Search
        placeholder="Filter by Keyword"
        onSearch={value => this.handleKeywordSearchFilter('keyword', value)}
        style={{ width: 300, marginBottom: 10 }}
      />
        <IwFaqModalContainer changechild = {this.changechild.bind(this)}  onRef = {ref => (this.child = ref)}/>
        <Table 
        defaultSortOrder = 'ascend' 
        columns={columns} 
        expandedRowRender={(record) => 
        <div>
        <Row>
        <Col span={12}>
        <p style={{ margin: 0 }}><b>Question : </b> {record.question}</p><br/>
        </Col>
        <Col span={12}>
        <p style={{ margin: 0 }}><b>Answer : </b> {record.answer}</p><br/>
        </Col>
        </Row>
        </div>  
        }
        rowKey={row => row.findId}
        dataSource={faqData} />
        </div>
        </Spin>
         )
        }
  }

  function mapStateToProps(state) {
    return {
      iwFaqData: state.get('intraWeb').get('getFaqDetails'),
    };
  }

  export default withRouter(connect(mapStateToProps)(IwFaqContainer));


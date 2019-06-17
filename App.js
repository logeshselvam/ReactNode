import React, { Component } from 'react';
import  PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Input , Form , Button , Row , Col , Icon , Tooltip , Select } from 'antd';

const Search = Input.Search;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };


class CategoryInfoContainer extends Component {
  
  constructor(props){
    super(props);
    this.state = {
        loading: false,
        isNewType: false,
        isSubType:false,
        newCategoryValue:'',
        newSubCategoryValue:'',
        categoryList:[],
        categorySubList:[],
        category:'',
        subCategory:'',
        
    }
  }
  
  handleTypeChange = (value) => {
    this.setState({ category : value }, () => {
      this.props.form.setFieldsValue({ category: value });
    });
  }
  
  handleSubTypeChange = (value) => {
    this.setState({ subCategory : value }, () => {
      this.props.form.setFieldsValue({ subCategory: value });
    });
  }
  
  handleTypeClick = () => {
    const {  isNewType , newCategoryValue ,  categoryList} = this.state; 
    if(isNewType){
      const category = newCategoryValue.toUpperCase();
      categoryList.push(category);
      this.setState({ isNewType: false, category, categoryList  }, () => {
        this.props.form.setFieldsValue({ category });
      });
    } else {
      this.setState({ isNewType: true });
    }
  }
  
  handleSubTypeClick = () => {
    const {  isSubType , newSubCategoryValue ,  categorySubList} = this.state; 
    if(isSubType){
      const subCategory = newSubCategoryValue.toUpperCase();
      categorySubList.push(subCategory);
      this.setState({ isSubType: false, subCategory, categorySubList  }, () => {
        this.props.form.setFieldsValue({ subCategory });
      });
    } else {
      this.setState({ isSubType: true });
    }
  }
  
  handleNewTypeChange = (e) => {
    this.setState({ newCategoryValue: e.target.value });
  }
  
  handleSubTypeChange = (e) => {
    this.setState({ newSubCategoryValue: e.target.value });
  }
  
  render() {
    const { isNewType , isSubType , category , subCategory, categoryList , categorySubList} = this.state;
    const { getFieldDecorator } = this.props.form;
    
    
    return(
        <div>
        
        <Row justify="center">
        <Col span={12} offset={6}>
        <p style={{ marginBottom : 50 , marginTop : 50,  textAlign : 'center' }} ><font size="6"><b>Category Details</b></font></p>
        <Form {...formItemLayout}>
        
        {!isNewType &&  <Form.Item
          {...formItemLayout}
          label="Category Name"
        >
          {getFieldDecorator('category', {
            rules: [{
              required: true, message: 'Enter a unique Category Name!',
            }],
          })(<div>
          <Select
          style={{ width: '85%'}}
          placeholder="Select a category"
          showSearch value={category}
          optionFilterProp="children"
          onChange={this.handleTypeChange}
          filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          >
          {categoryList.map(category => <Option value={category}>{category}</Option> )}
          </Select>
          <Button icon={"plus"} type="primary" style={{ marginLeft: 3 }} onClick={this.handleTypeClick} />
          </div>
          )}
          </Form.Item>}
       
       {isNewType &&  <Form.Item
         {...formItemLayout}
         label="New Category Name"
       >
         {getFieldDecorator('newCategory', {
           rules: [{
             required: true, message: 'Enter a unique Category Name!',
           }],
         })(<div>
             <Input placeholder="Input a New Catgory" style={{ width: '85%' }} onChange={this.handleNewTypeChange} />
             <Button icon="check" type="primary" style={{ marginLeft: 3 }} onClick={this.handleTypeClick} />
             <Button icon="close" type="danger" style={{ marginLeft: 3 }} onClick={() => this.setState({ isNewType:false },() =>{ 
                 this.props.form.setFieldsValue({ category: category });
             })} />
           </div>
         )}
         </Form.Item>}
       
       {!isSubType && category != '' &&  <Form.Item
         {...formItemLayout}
         label="Sub-Category Name"
       >
         {getFieldDecorator('subCategory', {
           rules: [{
             required: true, message: 'Enter a unique Sub-Category Name!',
           }],
         })(<div>
         <Select
         style={{ width: '85%'}}
         placeholder="Select a Sub-Category"
         showSearch value={subCategory}
         optionFilterProp="children"
         onChange={this.handleSubTypeChange}
         filterOption={(input, option) =>
         option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
         }
         >
         {categorySubList.map(subCategory => <Option value={subCategory}>{subCategory}</Option> )}
         </Select>
         <Button icon={"plus"} type="primary" style={{ marginLeft: 3 }} onClick={this.handleSubTypeClick} />
         </div>
         )}
         </Form.Item>}
      
      {isSubType &&  <Form.Item
        {...formItemLayout}
        label="New Category Name"
      >
        {getFieldDecorator('newCategory', {
          rules: [{
            required: true, message: 'Enter a unique Category Name!',
          }],
        })(<div>
            <Input placeholder="Input a New Catgory" style={{ width: '85%' }} onChange={this.handleSubTypeChange} />
            <Button icon="check" type="primary" style={{ marginLeft: 3 }} onClick={this.handleSubTypeClick} />
            <Button icon="close" type="danger" style={{ marginLeft: 3 }} onClick={() => this.setState({ isSubType:false },() =>{ 
                this.props.form.setFieldsValue({ subCategory: subCategory });
            })} />
          </div>
        )}
        </Form.Item>}
      
        <Form.Item style={{textAlign:'center' , marginTop : 30}} >
        <Button type="primary" htmlType="submit">
          Save
        </Button>
        </Form.Item>
      
        </Form>
        </Col>
        </Row>
        </div>
    )
  }
}


function mapStateToProps(state) {
  return {
  };
}

const WrappedCategoryInfoContainer = Form.create()(CategoryInfoContainer);
export default withRouter(connect(null)(WrappedCategoryInfoContainer));


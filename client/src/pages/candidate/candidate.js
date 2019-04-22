import React,{Component} from 'react';
import {connect} from 'react-redux';
import {getUserList} from '../../redux/actions';
import UserList from '../../components/user-list/user-list';

class Candidate extends Component{
    componentDidMount () {
        // 获取获取userList
        this.props.getUserList('boss')
      }
      render () {
        return (
          <UserList userList={this.props.userList}/>
        )
      }
}

export default connect(
    state=>({userList:state.userList}),
    {getUserList}
)(Candidate)
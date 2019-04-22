import React,{Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import AvatarSelector from '../../components/avatar-selector/avatar-selector'
import {NavBar, InputItem, Button} from 'antd-mobile'
import {updateUser} from '../../redux/actions'

class CandidateInfo extends Component{

  // 更新头像
  setAvatar = (avatar) => {
    this.setState({
        avatar
    })
  }
  save = () => {
    this.props.updateUser(this.state)
  }

    render(){
        // 如果信息已经完善, 自动重定向到对应主界面
        const {avatar, type} = this.props.user
        if(avatar) { // 说明信息已经完善
          const path = type==='candidate' ? '/candidate' : '/boss'
          return <Redirect to={path}/>
        }
        return (
            <div>
                <NavBar>信息完善</NavBar>
                <AvatarSelector  setAvatar={this.setAvatar}/>
                <InputItem placeholder="请输入求职岗位">求职岗位： </InputItem>  
                <InputItem placeholder="请输入个人介绍">个人介绍： </InputItem>
                <Button type="primary"  onClick={this.save}>保存</Button>
            </div>
        )
    }
}
export default connect(
    state => ({user: state.user}),
    {updateUser}
)(CandidateInfo)
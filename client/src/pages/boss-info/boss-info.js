import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {NavBar, InputItem, TextareaItem, Button} from 'antd-mobile'
import AvatarSelector from '../../components/avatar-selector/avatar-selector'

import {updateUser} from '../../redux/actions'

class BossInfo extends Component {

  state = {
    avatar: '',
    post: '',
    info: '',
    company: '',
    salary: '',
  }

  // 更新头像
  setAvatar = (avatar) => {
    this.setState({
        avatar
    })
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  save = () => {
    this.props.updateUser(this.state)
  }

  render () {
    // 如果信息已经完善, 自动重定向到对应主界面
    const {avatar, type} = this.props.user
    if(avatar) { // 说明信息已经完善
      const path = type==='candidate' ? '/candidate' : '/boss'
      return <Redirect to={path}/>
    }

    return (
      <div>
        <NavBar>信息完善</NavBar>
        <AvatarSelector setAvatar={this.setAvatar}/>
        <InputItem placeholder='请输入招聘职位' onChange={val => {this.handleChange('post', val)}}>招聘职位:</InputItem>
        <InputItem placeholder='请输入公司名称' onChange={val => {this.handleChange('company', val)}}>公司名称:</InputItem>
        <InputItem placeholder='请输入职位薪资' onChange={val => {this.handleChange('salary', val)}}>职位薪资:</InputItem>
        <TextareaItem title="职位要求:"
                      placeholder='请输入个人介绍'
                      rows={3} onChange={val => {this.handleChange('info', val)}}/>
        <Button type='primary' onClick={this.save}>保&nbsp;&nbsp;&nbsp;存</Button>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {updateUser}
)(BossInfo)
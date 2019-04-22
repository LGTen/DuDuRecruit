import React,{Component} from 'react';
import {Switch, Route,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Cookies from 'js-cookie';
import {NavBar} from 'antd-mobile';
import {getRedirectTo} from '../../utils/utils';
import {getUser} from '../../redux/actions';

import BossInfo from '../boss-info/boss-info';
import CandidateInfo from '../candidate-info/candidate-info';
import Boss from "../boss/boss";
import Candidate from '../candidate/candidate';
import Message from '../message/message';
import User from '../user/user';
import NotFound from '../../components/not-found/not-found';
import NavFooter from '../../components/nav-footer/nav-footer';
import Chat from '../chat/chat';

class Main extends Component{
    navList = [ // 包含所有导航组件的相关信息数据
        {
          path: '/boss', // 路由路径
          component: Boss,
          title: '求职列表',
          icon: 'candidate',
          text: '大神',
        },
        {
          path: '/candidate', // 路由路径
          component: Candidate,
          title: '职位列表',
          icon: 'boss',
          text: '职位',
        },
        {
          path: '/message', // 路由路径
          component: Message,
          title: '消息列表',
          icon: 'message',
          text: '消息',
        },
        {
          path: '/user', // 路由路径
          component: User,
          title: '用户中心',
          icon: 'user',
          text: '个人',
        }
      ]
    componentDidMount () {
        //登陆过(cookie中有userid), 但没有有登陆(redux管理的user中没有_id) 发请求获取对应的user
        const userid = Cookies.get('userid');
        const {_id} = this.props.user;
        if(userid && !_id) {
          // 发送异步请求, 获取user
          this.props.getUser()
        }
      }
    
    render(){
        // 读取cookie中的userid
        const userid = Cookies.get('userid')
        // 如果没有, 自动重定向到登陆界面
        if(!userid) {
        return <Redirect to='/login'/>
        }
        // 如果有,读取redux中的user状态
        const {user,unReadCount} = this.props
        // 如果user有没有_id, 返回null(不做任何显示)
        if(!user._id) {
            return null
        } else {
            // 如果有_id, 显示对应的界面
            // 如果请求根路径, 根据user的type和avatar来计算出一个重定向的路由路径, 并自动重定向
            let path = this.props.location.pathname
            if(path==='/') {
                // 得到一个重定向的路由路径
                path = getRedirectTo(user.type, user.avatar)
                return <Redirect to= {path}/>
            }
        }

        const {navList}=this;
        const path = this.props.location.pathname // 请求的路径
        const currentNav = navList.find(nav=>nav.path===path) // 得到当前的nav, 可能没有
        if(currentNav) {
          // 决定哪个路由需要隐藏
          if(user.type==='boss') {
            // 隐藏数组的第2个
            navList[1].hide = true
          } else {
            // 隐藏数组的第1个
            navList[0].hide = true
          }
        }
    
        return (
            <div>
                {currentNav?<NavBar className='sticky-header'>{currentNav.title}</NavBar>:null}
                <Switch>
                    {
                        navList.map(nav=><Route path={nav.path} component={nav.component}/>)
                    }
                    <Route path="/bossInfo" component={BossInfo}></Route>
                    <Route path="/candidateInfo" component={CandidateInfo}></Route>
                    <Route path="/chat/:id" component={Chat}></Route>
                    <Route component={NotFound}></Route>
                </Switch>
                {currentNav?<NavFooter navList={navList} unReadCount={unReadCount}/>:null}
            </div>
        )
    }
}
export default connect(
    state=>({user:state.user,unReadCount:state.chat.unReadCount}),
    {getUser}
)(Main)
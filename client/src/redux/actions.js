import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER,
    RESET_USER,
    RECEIVE_USER_LIST,
    RECEIVE_MSG_LIST,
    RECEIVE_MSG,
    MSG_READ
  } from './action-types';
import { 
  reqRegister, 
  reqLogin,
  reqUpdateUser,
  reqUser,
  reqUserList,
  reqChatMsgList,
  reqReadMsg
 } from '../api';
 import io from 'socket.io-client';

 // 授权成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})
// 错误提示信息的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg})
// 接收用户的同步action
const receiveUser = (user) => ({type: RECEIVE_USER, data:user})
// 重置用户的同步action，退出登录重置
export const resetUser = (msg) => ({type: RESET_USER, data: msg})
// 接收用户列表的同步action
const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList})
// 接收消息列表的同步action
const receiveMsgList = ({users, chatMsgs, userid}) => ({type: RECEIVE_MSG_LIST, data:{users, chatMsgs, userid}})
// 接收一个消息的同步action
const receiveMsg = (chatMsg, userid) => ({type: RECEIVE_MSG, data: {chatMsg, userid}})
// 读取了某个聊天消息的同步action
const msgRead = ({count, from, to}) => ({type: MSG_READ, data: {count, from, to}})

export function register({username,password,checkPassword,type}){
  if(!username||!password||!type){
    return errorMsg("用户名密码必须输入");
  }
  if(password!=checkPassword){
    return errorMsg("两次输入密码不同");
  }
  return async dispatch=>{
    const response=await reqRegister({username,password,type})
    const result=response.data;
    if(result.code==0){
      //获取信息列表
      getMsgList(dispatch, result.data._id);
      dispatch(authSuccess(result.data));
    }else{
      dispatch(errorMsg(result.msg));
    }
  }
}

export function login({username,password}){
  if(!username||!password){
    return errorMsg("用户密码必须输入");
  }
  return async dispatch=>{
    const response=await reqLogin({username,password});
    const result=response.data;
    if(result.code==0){
      getMsgList(dispatch, result.data._id);
      dispatch(authSuccess(result.data));
    }
    else{
      dispatch(errorMsg(result.msg));
    }
  }
}
//更新用户异步action
export const updateUser=(user)=>{
  return async dispatch=>{
    const response=await reqUpdateUser(user);
    const result=response.data;
    if(result.code==0){
      dispatch(receiveUser(result.data));
    }else{
      dispatch(resetUser(result.data));
    }
  }
}

//获取用户异步action
export const getUser=()=>{
  return async dispatch=>{
    const response=await reqUser();
    const result=response.data;
    if(result.code==0){
      getMsgList(dispatch, result.data._id);
      dispatch(receiveUser(result.data));
    }else{
      dispatch(resetUser(result.msg));
    }
  }
}

//获取用户列表的异步action
export const getUserList=(type)=>{
  return async dispatch=>{
    const response=await reqUserList(type);
    const result=response.data;
    if(result.code==0){
      dispatch(receiveUserList(result.data));
    }
  }
}
//单例对象
function initIO(dispatch, userid) {
  // 创建对象之前: 判断对象是否已经存在, 只有不存在才去创建
  if(!io.socket) {
    io.socket = io('ws://localhost:3000');
    //告诉服务器，已经上线，可以私聊
    // io.socket.emit('online',userid);
    // 绑定监听, 接收服务器发送的消息
    io.socket.on('receiveMsg', function (chatMsg) {
      console.log('客户端接收服务器发送的消息', chatMsg)
      // 只有当chatMsg是与当前用户相关的消息, 才去分发同步action保存消息
      if(userid===chatMsg.from || userid===chatMsg.to) {
        dispatch(receiveMsg(chatMsg, userid));
      }
    })
  }
}

// 发送消息的异步action
export const sendMsg = ({from, to, content}) => {
  return dispatch => {
    console.log('客户端向服务器发送消息', {from, to, content})
    // 发消息
    io.socket.emit('sendMsg', {from, to, content})
  }
}

// 异步获取消息列表数据
async function getMsgList(dispatch, userid) {
  //初始化，可能收到新的信息
  initIO(dispatch, userid);
  const response = await reqChatMsgList();
  const result = response.data;
  if(result.code===0) {
    const {users, chatMsgs} = result.data;
    // 分发同步action
    dispatch(receiveMsgList({users, chatMsgs, userid}));
  }
}

// 读取消息的异步action
export const readMsg = (from, to) => {
  return async dispatch => {
    const response = await reqReadMsg(from);
    const result = response.data;
    if(result.code===0) {
      const count = result.data;
      dispatch(msgRead({count, from, to}));
    }
  }
}

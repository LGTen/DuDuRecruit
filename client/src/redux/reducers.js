import { combineReducers } from "redux";
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG,
  RECEIVE_MSG_LIST,
  MSG_READ
} from "./action-types";
import { getRedirectTo } from "../utils/utils";

const initUser = {
  username: "",
  type: "",
  msg: "",
  redirectTo: ""
};
function user(state = initUser, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      const redirectTo = getRedirectTo(action.data.type, action.data.avatar);
      return { ...action.data, redirectTo };
    case ERROR_MSG:
      return { ...state, msg: action.data };
    case RECEIVE_USER:
      return action.data;
    case RESET_USER:
      //重置之后返回登录界面
      return { ...initUser, msg: action.data };
    default:
      return state;
  }
}

const initUserList = [];
function userList(state = initUserList, action) {
  switch (action.type) {
    case RECEIVE_USER_LIST:
      return action.data;
    default:
      return state;
  }
}

const initChat={
    users:{}, //所有用户信息
    chatMsgs:[],//当前用户所有相关msg
    unReadCount:0
}
function chat(state=initChat,action){
    switch(action.type){
        case RECEIVE_MSG_LIST: 
          const{users,chatMsgs,userid}=action.data;
          return {
            users,
            chatMsgs,
            unReadCount:chatMsgs.reduce((preTotal,msg)=>preTotal+(!msg.read&&msg.to==userid),0)
          }
        case RECEIVE_MSG:
          const {chatMsg}=action.data;
          return {
            users:state.users,
            chatMsgs:[...state.chatMsgs,chatMsg],
            unReadCount:state.unReadCount+(!chatMsg.read&&chatMsg.to==action.data.userid)
          }

        case MSG_READ:
          const {from, to, count} = action.data;
          return {
            users: state.users,
            chatMsgs: state.chatMsgs.map(msg => {
              if(msg.from===from && msg.to===to && !msg.read) { // 需要更新
                return {...msg, read: true};
              } else {
                return msg;
              }
            }),
            unReadCount: state.unReadCount-count
          }
        default:
            return state;
    }
}
export default combineReducers({
  user,
  userList,
  chat
});

import ajax from './ajax'

// 注册接口
export const reqRegister = (user) => ajax('/register', user, 'POST');
// 登陆接口
export const reqLogin = ({username, password}) => ajax('/login',{username, password}, 'POST');
//更新用户接口
export const reqUpdateUser=(user)=>ajax('/update',user,'POST');
//获取用户信息
export const reqUser=()=>ajax('/user');
//获取用户列表
export const reqUserList=(type)=>ajax("/userlist",{type});
//获取当前用户的聊天列表
export const reqChatMsgList=()=>ajax('/msglist');
//修改指定信息为已读
export const reqReadMsg=(from)=>ajax('/readmsg',{from},"POST");
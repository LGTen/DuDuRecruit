import React,{Component} from 'react';
import {Redirect} from 'react-router-dom';
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Radio,
    Button
} from 'antd-mobile';
import {connect} from 'react-redux';
import Logo from '../../components/logo/logo';
import {register} from "../../redux/actions";
 
class Register extends Component{
    state={
        username:"",
        password:"",
        checkPassword:"",
        type:"candidate"
    }
    handleChange=(name,value)=>{
        this.setState({
            [name]:value
        })
    }
    toLogin=()=>{
        this.props.history.replace('/login')
    }

    register=()=>{
        this.props.register(this.state)
    }
    render(){
        const {type}=this.state;
        //redux 赋值
        const {redirectTo,msg}=this.props;
        if(redirectTo){
            return <Redirect to={redirectTo}/>
        }
        return (
            <div>
                <NavBar>嘟&nbsp;嘟&nbsp;直&nbsp;聘</NavBar>
                <Logo/>
                <WingBlank>
                <List>
                    {msg?<p className="error-msg">{msg} </p>:null}
                    <WhiteSpace/>
                    <InputItem placeholder='请输入用户名' onChange={val => {this.handleChange('username', val)}}>用户名:</InputItem>
                    <WhiteSpace/>
                    <InputItem placeholder='请输入密码' type="password" onChange={val => {this.handleChange('password', val)}}>密码:</InputItem>
                    <WhiteSpace/>
                    <InputItem placeholder='请输入确认密码' type="password" onChange={val => {this.handleChange('checkPassword', val)}}>确认密码:</InputItem>
                    <WhiteSpace/>
                    <List.Item>
                        <span>用户类型：</span>
                        <Radio checked={this.state.type==='candidate'} onClick={()=>{this.handleChange("type","candidate")}}>
                            求职者
                        </Radio>
                        <Radio checked={this.state.type==='boss'} onClick={()=>{this.handleChange("type","boss")}}>
                            招聘者
                        </Radio>
                    </List.Item>
                    <WhiteSpace/>
                    <Button type='primary' onClick={this.register}>注&nbsp;&nbsp;&nbsp;册</Button>
                    <WhiteSpace/>
                    <Button onClick={this.toLogin}>已经有账号</Button>
                </List>
                </WingBlank>
            </div>
        )
    }
}
export default connect(
    state=>state.user,
    {register}
)(Register)
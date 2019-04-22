import React,{Component} from 'react';
import{List,Grid} from 'antd-mobile';
import PropTypes from 'prop-types';

export default class AvatarSelector extends Component{
    static propTypes={
        setAvatar:PropTypes.func.isRequired
    }
    constructor(props){
        super(props);
        this.handleClick=this.handleClick.bind(this)
        this.avatarList=[];
        for(let i=0;i<20;i++){
            this.avatarList.push({
                text:i,
                icon:require(`../../assets/images/${i+1}.png`)
            })
        }
        this.state = {
            icon: null //图片对象, 默认没有值
        }
    }
    
    handleClick = ({text, icon}) => {
        // 更新当前组件状态
        this.setState({icon})
        // 调用函数更新父组件状态
        this.props.setAvatar(text)
    }
    render(){
        const {icon} = this.state
        const listHeader = !icon ? '请选择头像' : (
        <div>
            已选择头像:<img src={icon}/>
        </div>
        )
        return (
           <List renderHeader={()=>listHeader}>
            <Grid 
                data={this.avatarList} 
                columnNum="5"
                onClick={this.handleClick}
            ></Grid>
           </List> 
        )
    }
}

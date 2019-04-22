import React,{Component} from 'react';
import logo from './logo.png';
import style from './logo.less';

export default class Logo extends Component{
    render(){
        return (
            <div className={style.container}>
                <img src={logo} alt="logo" className={style.logo}/>
            </div>
        )
    }
}
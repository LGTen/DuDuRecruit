import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './redux/store';
import 'antd-mobile/dist/antd-mobile.css'
import Register from './pages/register/register'
import Login from './pages/login/login'
import Main from './pages/main/main'
import './assets/css/index.less'


ReactDOM.render((
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login}></Route>
        <Route path="/register" component={Register}></Route>
        <Route component={Main}></Route>
      </Switch>
    </HashRouter>
  </Provider>
) , document.getElementById('root'))
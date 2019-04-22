import React from 'react';
import { shallow,mount } from 'enzyme';
import Login from '../../src/pages/login/login';

import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import store from '../../src/redux/store';
import thunk from 'redux-thunk';
import reducers from '../../src/redux/reducers';

import axios from 'axios';


export default function setupStore(initialState) {
  return createStore(reducers, {...initialState}, applyMiddleware(thunk));
}
describe('check login', () => {
  it('should show a message when error happens', () => {
    let wrapper = mount(<Provider store={store}><Login /></Provider>);
    wrapper.find('.am-button.am-button-primary').simulate('click');
    expect(wrapper.find('div.error-msg').exists()).toBe(true);
  });

})
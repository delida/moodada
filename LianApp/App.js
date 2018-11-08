/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
 import './global';
import React, { Component } from 'react';
import {TeaNavigator, Theme} from 'teaset';
import Splash from "./src/Components/Splash";


Theme.set({fitIPhoneX: true,backButtonTitle: '返回',navColor:'#00A29A'});


export default class App extends Component {
  render() {
    return (
      <TeaNavigator rootView={<Splash />} />
   );
  }
}
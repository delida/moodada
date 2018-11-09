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
import i18n from "./i18n/i18n";



Theme.set({fitIPhoneX: true,backButtonTitle: i18n.t('ACTION.back'),navColor:'#00A29A'});


export default class App extends Component {
  render() {
    return (
      <TeaNavigator rootView={<Splash />} />
   );
  }
}
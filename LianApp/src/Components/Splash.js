'use strict';

import React from 'react';
import {
  Dimensions,
  Image,
  InteractionManager,
  View,
  Text,
} from 'react-native';

import MainMenu from './MenuMain';


var {height, width} = Dimensions.get('window');
import { NavigationPage, Input, ListRow, Label, Button, Toast } from 'teaset';
export default class Splash extends NavigationPage {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
   
     this.timer=setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
          this.navigator.push({view:<MainMenu />})

      });
    }, 2500);
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
 
  render() {
    return (
      <View style={{flex:1}}>
      <Image
        style={{flex:1,width:width,height:height}}
        source={require('../styles/image/splash.jpg')}
        />
      </View>
    );
  }
}

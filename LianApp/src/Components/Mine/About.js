

'use strict';

import React, {Component} from 'react';
import {StyleSheet,View, ScrollView,Image,Text} from 'react-native';

import {Theme, TeaNavigator, NavigationPage, BasePage, ListRow, TabView, Label} from 'teaset';
export default class About extends NavigationPage {

    static defaultProps = {
      ...NavigationPage.defaultProps,
      title: '关于链问',
      showBackButton: true,
    };
  
    constructor(props)
    {
        super(props);
        this.state={
            account:'ASDWEERRFDFDFGDFDFGFD',
            moac:1000,
            coin:1000
        }
    }

        

    renderPage() {
      return (
        <ScrollView style={{flex: 1}}>
        <View style={styles.viewUser}>
          <View style={styles.viewUserTop}>
            <Image style={styles.imgUserTitle} source={require('../../styles/menu/wen.png')}/>
          </View>
          <Text style={styles.txtName}>LIANWEN</Text>
          <Text style={styles.txtGF}>版本号：1.0.0</Text>
        </View>
         {/*  <View style={{height: 40}} />
    
          <ListRow title='检查更新'  onPress={() => alert('Press!')} /> */}
        </ScrollView>
      );
    }
  
  }

  
let styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF'
    },
    viewTop: {
      height: 60,
      backgroundColor: '#F0F0F0',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#B7B7B7',
      flexDirection: 'row'
    },
    txtTitle: {
      flex: 1,
      marginLeft: 10
    },
    iconSetting: {
      marginRight: 10
    },
    viewUser: {
      height: 250,
      backgroundColor: '#F0F0F0'
    },
    viewUserTop: {
      height: 100,
      alignItems: 'center',
      justifyContent: 'center'
    },
    imgUserTitle: {
      height: 80,
      width: 80,
      borderRadius: 40
    },
    txtName: {
      alignSelf: 'center'
    },
    txtGF: {
      alignSelf: 'center',
      marginTop: 8
    },
    viewEdit: {
      width: 150,
      marginTop: 20,
      height: 30,
      flexDirection: 'row',
      alignSelf: 'center',
      backgroundColor: '#E6E6E6',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10
    },
    txtEdit: {
      marginLeft: 5,
      alignSelf: 'center',
      color: '#7997C7'
    },
    iconEdit: {
      color: '#7997C7',
      marginTop: 5
    },
    viewLove: {
      height: 150,
      borderBottomWidth: 10,
      borderBottomColor: '#F0F0F0',
      backgroundColor: '#ffffff'
    },
    viewLoveTop: {
      height: 40,
      flexDirection: 'row',
      alignItems: 'center'
    },
    txtCommon: {
      marginLeft: 15,
      flex: 1
    },
    iconCommon: {
      marginRight: 10
    },
    imgLove: {
      height: 90,
      width: 90,
      margin: 10,
      marginTop: 0
    },
    viewCommon: {
      height: 50,
      borderBottomWidth: 10,
      borderBottomColor: '#F0F0F0',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ffffff'
    }
  })
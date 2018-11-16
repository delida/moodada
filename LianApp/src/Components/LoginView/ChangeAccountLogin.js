

'use strict';

import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Keyboard,
  ImageBackground,
  Image
} from 'react-native';



import { NavigationPage, Input, ListRow, Label, Button, Toast } from 'teaset';
const BG_IMAGE = require('../../styles/image/bg_screen1.jpg');

const masaike = require('../../styles/image/masaike.jpg');

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;

const PWRightWid = 100;
import KeyStoreLogin from './KeyStoreLogin';
import RegisterLogin from './RegisterLogin';

import LoginLogic from '../../logic/LoginLogic';
import PwdInput from 'react-native-pwd-input';
import Lmain from '../Lmain';
import MenuMain from '../MenuMain';

import LoadingView from '../CommonComp/LoadingView';

import Madoka from '../../UI/Madoka';


export default class ChangeAccountLogin extends NavigationPage {

  static defaultProps = {
    ...NavigationPage.defaultProps,
    title: '切换账号',
    showBackButton: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      userName: this.props.userName,
      userPW: "",
      keyStore: '',
      height: 30,
      keyboardHeight: 0,
      showLoading:false,
      BoardList:this.props.BoardList
    };

  }

  cauculateHeight(e) {
    const height = e.nativeEvent.contentSize.height > 30
      ? e.nativeEvent.contentSize.height + 5
      : this.state.height;

    this.setState({ height });
  }



  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

  /*   LoginLogic.getCurrentUser().then((res)=>{
       if(res!=null &&  typeof (res) != "undefined")
       {
             this.setState({
              userName:res.userAddr
             });
       }
    }) */
  
   

  }

  _keyboardDidShow(e) {
    this.setState({
      keyboardHeight: e.endCoordinates.height
    })

  }

  _keyboardDidHide(e) {
    this.setState({
      keyboardHeight: 0
    })
  }

  _login(e){
   
    if(this.state.userName==''||this.state.userPW=='')
    {
     
      Toast.fail('用户名或密码输入有误');
      return;
    }
    LoginLogic.getUserByUserAddr(this.state.userName).then((res)=>{
     
      if(res==null||typeof(res)=='undefined')
      {
      
         Toast.fail('未获取到keyStore值，请切换keyStore登录');
      }
      else
      {

        this.setState({showLoading:true});
        var isdoing = false;
         this.timer = setInterval(()=>{
          if(!isdoing){
            isdoing = true;
            LoginLogic.registerLogin(this.state.userName, this.state.userPW, res.keystore).then((result)=>{
              if (result == 1) {
                this.setState({showLoading:false});
                LoginLogic.setNonce(this.state.BoardList.subChainAddress,this.state.userName,this.state.BoardList.rpcIp);
                 this.navigator.push({view:<MenuMain onlogin={true} BoardList={this.state.BoardList}/>});
              }
              else if (result == 0) {
                this.setState({showLoading:false});
                Toast.fail('登录失败');
              }
              else {
                this.setState({showLoading:false});
                Toast.fail('密码错误');
              }
  
              //停止掉
              clearInterval(this.timer);
              this.timer = undefined;
  
             })
          }
         },1000);


      
      }
    })

  }


  renderPage() {

    
      
    

    return (
      <View style={styles.container}
      contentContainerStyle={styles.content}>
       <View style={styles.bgImage}>
          <ImageBackground
            source={masaike}
            style={styles.bgImage}
          >
            <View style={{ height: 5 }} />

            <View style={styles.card2}>
              <ListRow detail={
                <View style={styles.contentImput}>
                  <Image source={require('../../styles/menu/wen.png')} style={{ width: 80, height: 80 }} />
                </View>
              }
                style={styles.contentListRow}
              />
              <ListRow detail={
                <View style={[styles.contentImput,{borderColor: '#00A29A', borderWidth: 1,borderRadius: 3,marginLeft:20,marginRight:20,height:50}]} >
                  <Image source={require('../../styles/png/user.png')} style={{ width: 20, height: 20 }} />
                  <TextInput
                    style={{ marginLeft: 5, marginRight: 5, height: 45, flex: 1 }}
                    onChangeText={(text) => {
                      this.setState({ userName: text })
                    }}
                    placeholder='请输入用户名'
                    value={this.state.userName}
                  />
                </View>
              }
                style={styles.contentListRow}
                bottomSeparator='none'
              />
               <ListRow detail={
                <View style={[styles.contentImput,{borderColor: '#00A29A', borderWidth: 1,borderRadius: 3,marginLeft:20,marginRight:20,height:50}]} >
                  <Image source={require('../../styles/png/pwd.png')} style={{ width: 20, height: 20 }} />
                  <TextInput
                    style={{ marginLeft: 5, marginRight: 5, height: 45, flex: 1 }}
                    onChangeText={(text) => {
                      this.setState({ userPW: text })
                    }}
                    secureTextEntry={true}
                    multiline={true}
                    placeholder='请输入密码'
                    value={this.state.userPW}
                  />
                </View>
              }
                style={styles.contentListRow}
                bottomSeparator='none'
              />
                <ListRow detail={
                <View style={styles.contentImput}>
                       <Button title='登    陆' type='primary' style={{ margin: 2, width: 180, height: 50,backgroundColor:'#16424F',borderColor:'#16424F' }} size='lg' onPress={(e) => this._login(e)} />
                </View>
                } style={{ backgroundColor: 'rgba(178,178,178,0.0)' }} />

            </View>
          
          </ImageBackground>
        </View>
      {/*   <ListRow detail={<Button title='登            陆' type='primary' style={{ margin: 2, width: width - 20 ,height:50}} size='lg' onPress={(e) => this._login(e)} />} style={{backgroundColor:'rgba(178,178,178,0.1)'}} /> */}
        <View style={{ height: 5 }} />
        <ListRow title='切换keyStore登陆' onPress={() => this.navigator.push({ view: <KeyStoreLogin BoardList={this.state.BoardList}/> })} style={{backgroundColor:'rgba(178,178,178,0.1)'}} titleStyle={{color:'white'}} />
        <ListRow title='注册' onPress={() => this.navigator.push({ view: <RegisterLogin BoardList={this.state.BoardList}/> })} style={{backgroundColor:'rgba(178,178,178,0.1)'}} titleStyle={{color:'white'}}/>

        <LoadingView showLoading={ this.state.showLoading } loadingViewClick={()=>{this.setState({showLoading:false})}}/>
      
      </View>
    );
  }
}


//样式定义
const styles = StyleSheet.create({
  inputContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    margin: 1
  },
  /*  input: {
     paddingVertical: 0,
     padding: 3,
     fontSize: 16,
     maxHeight: 50
   }, */
  item: {
    paddingBottom: 6,
    marginBottom: 6,
    flex: 1
  },
  container: {
    flex: 1,
    /* paddingTop: 24,*/
    backgroundColor: '#2D3945',
  },
  content: {
    // not cool but good enough to make all inputs visible when keyboard is active
    paddingBottom: 300,
  },
  card1: {
    paddingVertical: 16,
  },
  card2: {
    padding: 16,
  },
  input: {
    marginTop: 4,
  },
  title: {
    paddingBottom: 16,
    textAlign: 'center',
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  bgImage: {
    top: 0,
    left: 0,
    width: width,
    height: 350,
    /*  justifyContent: 'center',
     alignItems: 'center' */
  },

  contentImput: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentListRow: {
    backgroundColor: 'rgba(178,178,178,0.1)',
    borderWidth:0
  }

})
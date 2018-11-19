

'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Clipboard,
  ImageBackground,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native';



import { NavigationPage, Input, ListRow, Label, Button,Toast, Theme, Checkbox } from 'teaset';
const BG_IMAGE = require('../../styles/image/bg_screen1.jpg');
const masaike = require('../../styles/image/masaike.jpg');

const { width, height } = Dimensions.get('window');

import LoginLogic from '../../logic/LoginLogic';
import Lmain from '../Lmain';
import LoadingView from '../CommonComp/LoadingView';
import Chengming from './CheckShengMing';
import Madoka from '../../UI/Madoka';
import i18n from '../../../i18n/i18n';

export default class RegisterLogin extends NavigationPage {

  static defaultProps = {
    ...NavigationPage.defaultProps,
    title: i18n.t('ACTION.sign_up'),
    showBackButton: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      userName: "123",
      userPW: '',
      userRPW: '',
      keyStore: '3455',
      height: 30,
      keyboardHeight: 0,
      reVisiable: false,
      showLoading:false,
	  checkedEmpty: false,
      BoardList:this.props.BoardList
    };

  }

  cauculateHeight(e) {
    const height = e.nativeEvent.contentSize.height > 30
      ? e.nativeEvent.contentSize.height + 5
      : this.state.height;

    this.setState({ height });
  }

  _register(e) {

   if(this.state.userPW==''|| this.state.userRPW=='')
   {
       Toast.fail(i18n.t('FAIL.empty_password'));
   }
   else
   {
    var check = LoginLogic.checkPwd(this.state.userPW, this.state.userRPW);
    if (check) {
      var pwdlength = LoginLogic.pwdlength(this.state.userPW, 1);
      if (pwdlength) {
        this.setState({showLoading:true});
        var isdoing = false;
        this.timer = setInterval(()=>{
          if(!isdoing){
            isdoing = true;
            LoginLogic.registerUser(this.state.userPW).then((user)=>{
              this.setState({showLoading:false});
              if (user != null) {
              
                this.setState({
                  userName: user.userAddr,
                  keyStore: JSON.stringify(user.keystore),
                  reVisiable: true
                });
                Toast.success(i18n.t('SUCCESS.register_success'));
              }
                //停止掉
                clearInterval(this.timer);
                this.timer = undefined;
             })
          }
        },1000);


      
      }
      else {
        Toast.fail(i18n.t('FAIL.length_password'));
      }
    }
    else {
      Toast.fail(i18n.t('FAIL.unmatch_password'));
    }
   }
  
  }

  _login(e) {
    this.setState({showLoading:true});
    var isdoing = false;
    this.timer = setInterval(()=>{
      if(!isdoing){
        isdoing = true;
        var testkeyStore = JSON.parse(this.state.keyStore)
        LoginLogic.registerLogin(this.state.userName, this.state.userPW, testkeyStore).then((result)=>{
          if (result == 1) {
            this.setState({showLoading:false});
            LoginLogic.setNonce(this.state.BoardList.subChainAddress,this.state.userName,this.state.BoardList.rpcIp);
            this.navigator.push({view:<Lmain onlogin={true} BoardList={this.state.BoardList}/>});
         }
         else if (result == 0) {
          this.setState({showLoading:false});
           Toast.fail(i18n.t('FAIL.login_fail'));
         }
         else {
          this.setState({showLoading:false});
           Toast.fail(i18n.t('FAIL.incorrect_password'));
         }
          //停止掉
          clearInterval(this.timer);
          this.timer = undefined;
        });
      }
    },1000)
  }

  //复制数据到剪切板
  _importData(e) {
    var jsonData = {
      userAddr: this.state.userName,
      keystore: JSON.parse(this.state.keyStore)
    }
    Clipboard.setString(this.state.keyStore);
    Toast.success(i18n.t('SUCCESS.userInfo_clip'));
  }

  renderPage() {

    let vAccountShow = this.state.reVisiable ? (<View style={{ flex: 1 }}>
      <ListRow title={i18n.t('LoginView.registerLogin.account_addr')} detail={
        this.state.userName
      }
        titlePlace='top'
        style={{backgroundColor:'rgba(178,178,178,0.1)'}} titleStyle={{color:'white'}}
        detailStyle={{color:'white'}}
      />
      <ListRow title="keyStore" detail={
        this.state.keyStore
      }
        titlePlace='top'
        style={{backgroundColor:'rgba(178,178,178,0.1)'}} titleStyle={{color:'white'}}
        detailStyle={{color:'white'}}
      />
       <ListRow detail={
                <View style={styles.contentImput}>
                       <Button title={i18n.t('LoginView.registerLogin.keyStore_backup')} type='primary' style={{ margin: 2, width: 180, height: 50,backgroundColor:'#16424F',borderColor:'#16424F' }} size='lg' onPress={() => this._importData()} />
                </View>
                } style={{ backgroundColor: 'rgba(178,178,178,0.1)' }} />
                   <ListRow detail={
                <View style={styles.contentImput}>
                       <Button title={i18n.t('ACTION.login')} type='primary' style={{ margin: 2, width: 180, height: 50,backgroundColor:'#16424F',borderColor:'#16424F' }} size='lg' onPress={(e) => this._login(e)} />
                </View>
                } style={{ backgroundColor: 'rgba(178,178,178,0.1)' }} />

    {/*   <ListRow detail={<Button title='备份keyStore' type='primary' style={{ margin: 2, width: width - 20 ,height:50}} size='lg' onPress={(e) => this._importData()} />} style={{backgroundColor:'rgba(178,178,178,0.1)'}}/> */}
    {/*   <ListRow detail={<Button title='登            陆' type='primary' style={{ margin: 2, width: width - 20 ,height:50}} size='lg' onPress={(e) => this._login(e)} />} style={{backgroundColor:'rgba(178,178,178,0.1)'}}/> */}
      <View style={{height:30}} />
    </View>) : null;
    return (
      <ScrollView  style={[styles.container,{ paddingBottom:150 }]} >
       
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
                  <Image source={require('../../styles/png/pwd.png')} style={{ width: 20, height: 20 }} />
                  <TextInput
                    style={{ marginLeft: 5, marginRight: 5, height: 45, flex: 1 }}
                    onChangeText={(text) => {
                      this.setState({ userPW: text })
                    }}
                    placeholder={i18n.t('PLACEHOLDER.input_new_password')}
                    secureTextEntry={true}
                    value={this.state.userPW}
                    keyboardType='numeric'
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
                      this.setState({ userRPW: text })
                    }}
                    secureTextEntry={true}
                    multiline={true}
                    placeholder={i18n.t('PLACEHOLDER.repeat_new_password')}
                    value={this.state.userRPW}
                    keyboardType='numeric'
                  />
                </View>
              }
                style={styles.contentListRow}
				bottomSeparator='none'
              />
			  <ListRow title='' detail={
                <View style={{ flexDirection: "row", marginRight: 19 }}>
                  <Checkbox
                    checkedIcon={<Image style={{width: 15, height: 15, tintColor: '#00A29A'}} source={require('../../styles/mine/checked.png')} />}
                    uncheckedIcon={<Image style={{width: 15, height: 15, tintColor: '#2c2c2c'}} source={require('../../styles/mine/unchecked.png')} />}
                    checked={this.state.checkedEmpty}
                    onChange={value => this.setState({ checkedEmpty: value })}
                  />
                  <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => this.navigator.push({ view: <Chengming /> })}>
                    <Text style={{ color: '#00A29A' }}>{i18n.t('LoginView.registerLogin.agreement')}</Text>
                  </TouchableOpacity>
                </View>

              } bottomSeparator='none'
                style={{ backgroundColor: 'rgba(178,178,178,0.0)' }}
              />
                <ListRow detail={
                <View style={styles.contentImput}>
                       <Button title={i18n.t('ACTION.sign_up')} type='primary' disabled={!this.state.checkedEmpty} style={{ margin: 2, width: 180, height: 50,backgroundColor:'#16424F',borderColor:'#16424F' }} size='lg' onPress={(e) => this._register(e)} />
                </View>
                } style={{ backgroundColor: 'rgba(178,178,178,0.0)' }} 
				bottomSeparator='none'
				/>

            </View>
          
          </ImageBackground>
        </View>


       {/*  <View style={[styles.card2, { backgroundColor: '#a9ceca' }]}>
          <Text style={styles.title}>LianWen</Text>
          <Fumi
            label={'新密码'}
            labelStyle={{ color: 'white' }}
            inputStyle={{ color: '#f95a25' }}
            iconClass={FontAwesomeIcon}
            iconName={'university'}
            iconColor={'#f95a25'}
            iconSize={15}
            secureTextEntry={true}
            onChangeText={(txt) => { this.setState({ userPW: txt })}} 
          />
          <Fumi
            style={styles.input}
            label={'重复密码'}
            labelStyle={{ color: 'white' }}
            inputStyle={{ color: '#f95a25' }}
            iconClass={FontAwesomeIcon}
            iconName={'university'}
            iconColor={'#f95a25'}
            iconSize={15}
            secureTextEntry={true}
            onChangeText={(txt) => { this.setState({ userRPW: txt })}}
          />
        </View> */}
   
      {/*   <ListRow detail={<Button title='注            册' type='primary' style={{ margin: 2, width: width - 20 ,height:50}} size='lg' onPress={(e) => this._register(e)} />}  style={{backgroundColor:'rgba(178,178,178,0.1)'}}/> */}
        <View style={{ height: 5 }} />
        <ListRow detail={i18n.t('REMINDER.after_register')} titlePlace='top' style={{backgroundColor:'rgba(178,178,178,0.1)'}} detailStyle={{color:'white'}} />

        {vAccountShow}
        <LoadingView showLoading={ this.state.showLoading } loadingViewClick={()=>{this.setState({showLoading:false})}}/>
     
      </ScrollView>
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
    height: 380,
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
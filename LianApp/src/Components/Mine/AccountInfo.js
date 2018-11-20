

'use strict';

import React, { Component } from 'react';
import { View, ScrollView, Clipboard, TextInput, Dimensions, Alert,Text,TouchableWithoutFeedback } from 'react-native';

import { Toast, TeaNavigator, NavigationPage, BasePage, ListRow, Button, Label } from 'teaset';

import CoinLogic from '../../logic/CoinLogic';
import LoginLogic from '../../logic/LoginLogic';
import LoadingView from '../CommonComp/LoadingView';
var { height, width } = Dimensions.get('window');
import { kong } from '../../CommonMethod';
import i18n from '../../../i18n/i18n';
const dismissKeyboard = require('dismissKeyboard')
export default class AccountInfo extends NavigationPage {

  static defaultProps = {
    ...NavigationPage.defaultProps,
    title: i18n.t('Profile.accountInfo.accountInfo'),
    showBackButton: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      moac: NaN,
      coin: NaN,
      BoardList: this.props.BoardList,
      showLoading: false,
      rechargemoac: '',
      rechargecoin: ''
    }
  }

      
  renderNavigationTitle() {
    var you = "→"+this.state.BoardList.boardName;
    return  `${this.props.title}${you}`
    }

  _getBalance() {
    CoinLogic.getBalance(this.props.userAddr, this.state.BoardList.marketableTokenAddr, 'moac', '', this.state.BoardList.subChainAddress, this.state.BoardList.rpcIp).then((result) => {
      if (!kong(result)) {
        //console.log('获取币值结果',result);
        this.setState({
          account: this.props.userAddr,
          moac: result.moacBalance,
          coin: result.erc20Balance,
         
        })
      }
    })
  }

  componentWillMount() {
    this._getBalance();
  }

  _resumekeyStore() {

    LoginLogic.getUserByUserAddr(this.props.userAddr).then((user) => {
      //console.log('账户信息界面获取用户信息',user);
      var jsonData = {
        userAddr: user.userAddr,
        keystore: user.keystore
      }
      Clipboard.setString(JSON.stringify(user.keystore));
      Toast.success(i18n.t('SUCCESS.userInfo_clip'));
    })
  }

  _resumeAccountInfo(){
    Clipboard.setString(this.props.userAddr);
    Toast.success(i18n.t('SUCCESS.accountAddr_clip'));
  }

  _clearAll() {
    LoginLogic.clearPromise();
  }

  _buyMintToken(num) {
    /*  var begin=new Date(); */
    this.setState({ showLoading: true });
    LoginLogic.getCurrentUser().then((user) => {
      //console.log('充值user', user);
      let userAddr = user.userAddr;
      if (user != null && typeof (user) != "undefined" && user.online) {
        LoginLogic.getUserByUserAddr(userAddr).then((userInfo) => {
          //console.log('充值usserInfo', userInfo);
          CoinLogic.buyMintToken(this.props.userAddr, num, this.state.BoardList.marketableTokenAddr, userInfo.userPwd, userInfo.keystore, this.state.BoardList.subChainAddress, this.state.BoardList.exchangeRate).then((res) => {
            if (res == 1) {
              //this._getBalance();
              /*   var end=new Date();
                var time=end-begin; */
              // console.log("充值操作总消耗时间为="+time);
              var timeindex = 0;
              this.timer = setInterval(() => {
                timeindex++;
                if (timeindex >= 3) {
                  this.setState({ showLoading: false });
                  Toast.success(i18n.t('SUCCESS.recharge_request_sent'));
                  this._getBalance();
                  //停止掉
                  clearInterval(this.timer);
                  this.timer = undefined;
                }
              }, 1000)



            }
            else {
              this.setState({ showLoading: false });
              Toast.fail(i18n.t('FAIL.recharge_fail'));
            }
          })
        })
      }
      else {
        this.setState({ showLoading: false });
        Toast.fail(i18n.t('FAIL.not_logged_in'));
      }
    })


  }

  _show(e) {

    let num = Number.parseFloat(this.state.rechargemoac);
    if (isNaN(num) || num <= 0) {
      this.setState({ showLoading: false });
      Toast.fail(i18n.t('FAIL.input_amount_exception'));
      return;
    }
    if (num > this.state.moac) {
      this.setState({ showLoading: false });
      Toast.fail(i18n.t('FAIL.insufficient_moac_balance'));
      return;
    }

    Alert.alert(i18n.t('ALERT.recharge_confirm'), '', [
      { text: i18n.t('ACTION.confirm'), onPress: () => this._buyMintToken(num) },
      { text: i18n.t('ACTION.cancel'), onPress: () => Toast.success(i18n.t('SUCCESS.cancel_success')) }
    ])

  }

  _sellMintToken(num) {
    /*  var begin=new Date(); */
    this.setState({ showLoading: true });
   
    LoginLogic.getCurrentUser().then((user) => {
      // console.log('提币user', user);
      let userAddr = user.userAddr;
      if (user != null && typeof (user) != "undefined" && user.online) {
        LoginLogic.getUserByUserAddr(userAddr).then((userInfo) => {
          // console.log('提币usserInfo', userInfo);
          CoinLogic.sellMintToken(this.props.userAddr, num, this.state.BoardList.marketableTokenAddr, userInfo.userPwd, userInfo.keystore, this.state.BoardList.subChainAddress, this.state.BoardList.rpcIp, this.state.BoardList.exchangeRate).then((res) => {
            // console.log('提币返回',res);
            if (res == 1) {
              // this._getBalance();
              /*   var end=new Date();
                var time=end-begin; */
              //console.log("提币的总消耗时间为="+time);

              var timeindex = 0;
              this.timer = setInterval(() => {
                timeindex++;
                if (timeindex >= 3) {
                  this.setState({ showLoading: false });
                  Toast.success(i18n.t('SUCCESS.withdraw_request_sent'));
                  this._getBalance();
                  //停止掉
                  clearInterval(this.timer);
                  this.timer = undefined;
                }
              }, 1000)


            }
            else {
              this.setState({ showLoading: false });
              Toast.fail(i18n.t('withdraw_fail'));
            }
          })
        })
      }
      else {
        this.setState({ showLoading: false });
        Toast.fail(i18n.t('FAIL.not_logged_in'));
      }
    })


  }
  _showsell(e) {

    let num = Number.parseFloat(this.state.rechargecoin);
    if (isNaN(num) || num <= 0) {
      this.setState({ showLoading: false });
      Toast.fail(i18n.t('FAIL.input_amount_exception'));
      return;
    }
    if (num > this.state.coin) {
      this.setState({ showLoading: false });
      Toast.fail(i18n.t('FAIL.insufficient_coin_balance'));
      return;
    }


    Alert.alert(i18n.t('ALERT.withdraw_confirm'), '', [
      { text: i18n.t('ACTION.confirm'), onPress: () => this._sellMintToken(num) },
      { text: i18n.t('ACTION.cancel'), onPress: () => Toast.success(i18n.t('SUCCESS.cancel_success')) }
    ])

  }

  renderPage() {

    

    return (
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ScrollView style={{ flex: 1,backgroundColor: '#F5FCFF' }}>
        <View style={{ height: 10 }} />
        <ListRow title={i18n.t('accountAddr')} icon={require('../../styles/mine/accountinfo.png')} detail={this.state.account} titlePlace='top' detailStyle={{fontSize:12}} />
        <View style={{ height: 10 }} />
        <ListRow title={i18n.t('moac_balance')} detail={<Label text={this.state.moac} type='title' />} 
          accessory='none' 
          onPress={dismissKeyboard}
        />
        <ListRow title={i18n.t('coin_balance')} detail={<Label text={this.state.coin} type='title' />} 
          accessory='none' 
          onPress={dismissKeyboard}
        />
        <ListRow title={i18n.t('Profile.accountInfo.exchange_rate')} detail={<Label text={this.state.BoardList.exchangeRate.toString()} type='title' />} 
          accessory='none' 
          onPress={dismissKeyboard}
        />
        <View style={{ height: 10 }} />

        <ListRow title={i18n.t('amount')} detail={


          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TextInput
              style={{ marginLeft: 5, marginRight: 5, height: 35, flex: 7, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={(text) => {
                this.setState({ rechargemoac: text })
              }}
              placeholder={i18n.t('PLACEHOLDER.input_moac_exchange')}
              value={this.state.rechargemoac}
              keyboardType='numeric'
            />
            <Button title={`${i18n.t('ACTION.recharge')}`} type='primary' style={{ flex: 3,backgroundColor:'#00A29A',borderColor:'#00A29A' }} onPress={(e) => this._show(e)} />
          </View>
        } />
        {/*  <ListRow  detail={<Button title='充值' type='primary' style={{padding:6,width:width-20}} onPress={(e)=>this._show(e)} />} /> */}
        <View style={{ height: 10 }} />
        <ListRow title={i18n.t('amount')} detail={

          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TextInput
              style={{ marginLeft: 5, marginRight: 5, height: 35, flex: 7, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={(text) => {
                this.setState({ rechargecoin: text })
              }}
              placeholder={i18n.t('PLACEHOLDER.input_coin_exchange')}
              value={this.state.rechargecoin}
              keyboardType='numeric'
            />
            <Button title={i18n.t('ACTION.withdraw')} type='primary' style={{ flex: 3,backgroundColor:'#00A29A',borderColor:'#00A29A' }} onPress={(e) => this._showsell(e)} />
          </View>
        } />
        <View style={{ height: 10 }} />
        <ListRow title={i18n.t('Profile.accountInfo.export_keyStore')} onPress={() => this._resumekeyStore()} />
        <ListRow title={i18n.t('Profile.accountInfo.export_accountAddr')} onPress={() => this._resumeAccountInfo()} />

           <View style={{ height: 5 }} />
          <ListRow detail={
            <View>
              <Label text={i18n.t('REMINDER.reminder')} type='title'  />
              <Text>{i18n.t('REMINDER.reminder_text1')} </Text>
            </View>

          } titlePlace='top'  detailMultiLine={true}  />
       
        <LoadingView showLoading={this.state.showLoading} loadingViewClick={() => { this.setState({ showLoading: false }) }} />
     
      </ScrollView>
      </TouchableWithoutFeedback>
    );
  }

}


'use strict';

import React, {Component} from 'react';
import {View, ScrollView,TextInput,Dimensions,Alert} from 'react-native';

import {NavigationPage, Toast, ListRow, Label,Theme,Button} from 'teaset';
var {height, width} = Dimensions.get('window');

import CoinLogic from '../../logic/CoinLogic';
import LoginLogic from '../../logic/LoginLogic';
import { kong } from '../../CommonMethod';
import LoadingView from '../CommonComp/LoadingView';
import i18n from '../../../i18n/i18n';

export default class ObtainMoac extends NavigationPage {

    static defaultProps = {
      ...NavigationPage.defaultProps,
      title: i18n.t('ACTION.withdraw') + 'moac(coin->coin)',
      showBackButton: true,
    };
  
    constructor(props)
    {
        super(props);
        this.state={
            account:'ASDWEERRFDFDFGDFDFGFD',
            moac:0,
            coin:0,
            rechargemoac:'0',
            showLoading:false,
            BoardList:this.props.BoardList
        }
    }

    _getBalance(){

      LoginLogic.getCurrentUser().then((user)=>{
       // console.log('提币user', user);
        let userAddr = user.userAddr;
        if (user != null && typeof (user) != "undefined" && user.online){
          LoginLogic.getUserByUserAddr(userAddr).then((userInfo)=>{
            //console.log('提币usserInfo', userInfo);
            CoinLogic.getBalance(this.props.userAddr,this.state.BoardList.marketableTokenAddr,'moac','',this.state.BoardList.subChainAddress,this.state.BoardList.rpcIp).then((result)=>{
              if(!kong(result))
              {
                this.setState({
                  account:this.props.userAddr,
                  moac:result.moacBalance,
                  coin:result.erc20Balance,
                  rechargemoac:'0'
                })
              }
            })
          })
        }
        else
        {
          Toast.fail(i18n.t('FAIL.not_logged_in'));
        }
      })


     
    }

    componentWillMount(){
      this._getBalance();
  }
_sellMintToken(){
  var begin=new Date();
  this.setState({showLoading:true});
    let num = Number.parseFloat(this.state.rechargemoac);
    if(isNaN(num)||num<=0)
    {
      this.setState({showLoading:false});
      Toast.fail(i18n.t('FAIL.input_amount_exception'));
      return;
    }
    if(num>this.state.coin)
    {
      this.setState({showLoading:false});
      Toast.fail(i18n.t('FAIL.insufficient_coin_balance'));
      return;
    }

    LoginLogic.getCurrentUser().then((user)=>{
     // console.log('提币user', user);
      let userAddr = user.userAddr;
      if (user != null && typeof (user) != "undefined" && user.online){
        LoginLogic.getUserByUserAddr(userAddr).then((userInfo)=>{
         // console.log('提币usserInfo', userInfo);
          CoinLogic.sellMintToken(this.props.userAddr,num,this.state.BoardList.marketableTokenAddr,userInfo.userPwd,userInfo.keystore,this.state.BoardList.subChainAddress,this.state.BoardList.rpcIp).then((res)=>{
           // console.log('提币返回',res);
            if(res==1)
            {
             // this._getBalance();
              var end=new Date();
              var time=end-begin;
              //console.log("提币的总消耗时间为="+time);
              this.setState({showLoading:false});
              Toast.success(i18n.t('SUCCESS.withdraw_request_sent'));
            }
            else{
              this.setState({showLoading:false});
              Toast.fail(i18n.t('FAIL.withdraw_fail'));
            }
          })
        })
      }
      else
      {
        this.setState({showLoading:false});
        Toast.fail(i18n.t('FAIL.not_logged_in'));
      }
    })

   
}

    _show(e) {
        Alert.alert(i18n.t('ALERT.withdraw_confirm'), '', [
            { text: i18n.t('ACTION.confirm'), onPress: () => this._sellMintToken() },
            { text: i18n.t('ACTION.cancel'), onPress: () =>  Toast.success(i18n.t('SUCCESS.cancel_success'))}
        ])

    }
  


    renderPage() {

      if(this.state.showLoading){
        return(  <LoadingView showLoading={ this.state.showLoading } loadingViewClick={()=>{this.setState({showLoading:false})}}/>);
      }

      return (
        <ScrollView style={{flex: 1,backgroundColor: '#F5FCFF'}}>
          <View style={{height: 20}} />
          <ListRow title={i18n.t('accountAddr')} detail={<Label text={this.state.account} type='title' />} />
          <View style={{height: 20}} />
          <ListRow title={i18n.t('moac_balance')} detail={<Label text={this.state.moac} type='title' />} />
          <ListRow title={i18n.t('coin_balance')} detail={<Label text={this.state.coin} type='title' />} />
          <ListRow title={`coin${i18n.t('ACTION.exchange')}moac`} detail={<Label text='1:1' type='title' />} />
          <View style={{height: 20}} />
          <ListRow title={i18n.t('amount')} detail={
            <TextInput
            style={{height: 35, width:200,borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => {
              this.setState({rechargemoac: text})
            }}
            placeholder={i18n.t('PLACEHOLDER.input_coin_exchange')}
            value={this.state.rechargemoac}
            //为了方便测试时输入字母，属性（keyboardType）不设置，实际使用时加上
             keyboardType='numeric'
          />
          }/>
          <ListRow  detail={<Button title={i18n.t('withdraw')} type='primary' style={{padding:6,width:width-20}} onPress={(e)=>this._show(e)} />} />
        
        </ScrollView>
      );
    }

    //充值
    renderRearge(){
          
    }
  
  }


'use strict';

import React, {Component} from 'react';
import {View, ScrollView,TextInput,Dimensions,Alert} from 'react-native';

import {NavigationPage, Toast, ListRow, Label,Theme,Button} from 'teaset';
var {height, width} = Dimensions.get('window');

import CoinLogic from '../../logic/CoinLogic';
import LoginLogic from '../../logic/LoginLogic';
import { kong } from '../../CommonMethod';
import LoadingView from '../CommonComp/LoadingView';

export default class ObtainMoac extends NavigationPage {

    static defaultProps = {
      ...NavigationPage.defaultProps,
      title: '提币moac(coin->coin)',
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
          Toast.fail('请登录');
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
      Toast.fail('输入的数值有误');
      return;
    }
    if(num>this.state.coin)
    {
      this.setState({showLoading:false});
      Toast.fail('输入的coin值不能大于拥有的数量');
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
              Toast.success('提币成功');
            }
            else{
              this.setState({showLoading:false});
              Toast.fail('提币失败，请重新尝试');
            }
          })
        })
      }
      else
      {
        this.setState({showLoading:false});
        Toast.fail('请先登录');
      }
    })

   
}

    _show(e) {
        Alert.alert('确定提币吗?', '', [
            { text: '确定', onPress: () => this._sellMintToken() },
            { text: '取消', onPress: () =>  Toast.success('取消成功')}
        ])

    }
  


    renderPage() {

      if(this.state.showLoading){
        return(  <LoadingView showLoading={ this.state.showLoading } loadingViewClick={()=>{this.setState({showLoading:false})}}/>);
      }

      return (
        <ScrollView style={{flex: 1,backgroundColor: '#F5FCFF'}}>
          <View style={{height: 20}} />
          <ListRow title='账号地址' detail={<Label text={this.state.account} type='title' />} />
          <View style={{height: 20}} />
          <ListRow title='moac余额' detail={<Label text={this.state.moac} type='title' />} />
          <ListRow title='coin余额' detail={<Label text={this.state.coin} type='title' />} />
          <ListRow title='coin兑换moac' detail={<Label text='1:1' type='title' />} />
          <View style={{height: 20}} />
          <ListRow title='数值' detail={
            <TextInput
            style={{height: 35, width:200,borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => {
              this.setState({rechargemoac: text})
            }}
            placeholder='请输入参与兑换的coin币值'
            value={this.state.rechargemoac}
            //为了方便测试时输入字母，属性（keyboardType）不设置，实际使用时加上
             keyboardType='numeric'
          />
          }/>
          <ListRow  detail={<Button title='提币' type='primary' style={{padding:6,width:width-20}} onPress={(e)=>this._show(e)} />} />
        
        </ScrollView>
      );
    }

    //充值
    renderRearge(){
          
    }
  
  }
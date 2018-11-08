

'use strict';

import React, {Component} from 'react';
import {View, ScrollView,Image} from 'react-native';

import {Toast, TeaNavigator, NavigationPage, BasePage, ListRow, TabView, Label} from 'teaset';

import CoinLogic from '../../logic/CoinLogic';
import MainLogic from '../../logic/MainLogic';
import { kong } from '../../CommonMethod';


export default class MainChain extends NavigationPage {

    static defaultProps = {
      ...NavigationPage.defaultProps,
      title: '主链信息',
      showBackButton: true,
    };
  
    constructor(props)
    {
        super(props);
        this.state={
            account:'',
            moac:0,
            coin:0,
            BoardList:this.props.BoardList,
            boackinfo:''
        }

        this.timer =null;
    }

        
  renderNavigationTitle() {
    var you = "→"+this.state.BoardList.boardName;
    return  `${this.props.title}${you}`
    }


    _getBalance(){
      CoinLogic.getBalance(this.props.userAddr,this.state.BoardList.marketableTokenAddr,'moac','',this.state.BoardList.subChainAddress,this.state.BoardList.rpcIp).then((result)=>{
        if(!kong(result))
        {
          this.setState({
            account:this.props.userAddr,
            moac:result.moacBalance,
            coin:result.erc20Balance
          })
        }
      })
    }

    componentWillMount(){
      this._getBalance();
      this.timer = setInterval(()=>{
        MainLogic.getBlockInfo(this.state.BoardList.subChainAddress,this.state.BoardList.rpcIp).then(data=>{
          //console.log('区块信息高度',data);
          var binfo = data.blockNumber+'/'+data.subBlockNumber+'/'+data.flushNumber;
          this.setState({
            boackinfo:binfo
          })
        })
      },10000);

  }

componentWillUnmount() {
 this.timer && clearInterval(this.timer);
 
}


    renderPage() {
      return (
        <ScrollView style={{flex: 1,backgroundColor: '#F5FCFF'}}>
          <View style={{height: 20}} />
          <ListRow title='账号地址' icon={require('../../styles/mine/accountinfo.png')} detail={this.state.account} titlePlace='top' detailStyle={{fontSize:12}} />
          <View style={{height: 20}} />
          <ListRow title='moac余额' detail={<Label text={this.state.moac} type='title' />} />
          <ListRow title='coin余额' detail={<Label text={this.state.coin} type='title' />} />
          <ListRow title='主链高度/子链高度/刷新计时' detail={<Label text={this.state.boackinfo} type='title'  />}  />
        </ScrollView>
      );
    }
  
  }
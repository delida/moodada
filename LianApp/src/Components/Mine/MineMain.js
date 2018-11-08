

'use strict';

import React, {Component} from 'react';
import {View, ScrollView,Clipboard} from 'react-native';

import {Toast, ActionSheet, NavigationPage, Theme, ListRow, TabView, Label, Badge} from 'teaset';
import AccountInfo from './AccountInfo';
import ChangeAccount from './ChangeAccount';
import Recharge from './Recharge';
import ObtainMoac from './ObtainMoac';
import About from './About';
import MainChan from './MainChain';
import ThransferAccounts from './TransferAccounts';
import LocalLogin from '../LoginView/LocalLogin';
import AccountHistory from './AccountHistory';

import List from '../CommonComp/List';
import LoginLogic from '../../logic/LoginLogic';


export default class MyLianWenList extends NavigationPage {

    static defaultProps = {
      ...NavigationPage.defaultProps,
      title: '个人中心',
      showBackButton: false,
    };

    constructor(props)
    {
      super(props);
      this.state = {
        isload:false,
        logintitle:'登陆',
        userAddr:'',
        BoardList:this.props.BoardList,
        loginstate:false
      } 
       
    }

        
  renderNavigationTitle() {
    var you = "→"+this.state.BoardList.boardName;
    return  `${this.props.title}${you}`
    }

    componentWillMount(){
      this._loginstate();
    }
    

    /**
     *登陆状态查看
     *
     * @memberof MyLianWenList
     */
    _loginstate(){

      LoginLogic.getCurrentUser().then((user)=>{
        console.log('我的user',user);
        if(user!=null &&  typeof (user) != "undefined")
        {
              let result = user.online;
              this.setState({
                isload:result,
                logintitle:(result?'退出登陆':'登陆'),
                userAddr:user.userAddr,
                loginstate:result
               });
        }
     })
    }
    
    /**
     *账户信息的相关信息
     *
     * @param {*} e
     * @memberof MyLianWenList
     */
     _getAccountInfo(e){ 
      if(this.state.isload)
      {
        this.navigator.push({view: <AccountInfo userAddr={this.state.userAddr} BoardList={this.state.BoardList}/>})
      }
      else{
        this.navigator.push({view: <LocalLogin BoardList={this.state.BoardList} />})
      }
    }

    _show(modal) {
      let items = [
        {title: '退出登陆', onPress: () => this._exitLogin()},
        {title: '切换账号',onPress:()=>{this._changeAccount()}},
      ];
      let cancelItem = {title: '取消'};
      ActionSheet.show(items, cancelItem, {modal});
    }



    /**
     *退出登陆
     *
     * @memberof MyLianWenList
     */
    _exitLogin(){
      LoginLogic.exitLogin(this.state.userAddr).then((re)=>{
        this.setState({
          isload:false,
          logintitle:'登陆'
         });
      });
    
    }

    /**
     *登陆状态的变化
     *
     * @param {*} e
     * @memberof MyLianWenList
     */
    _login(e){
      if(this.state.isload)
      {
        this._show(true);
      }
      else
      {
        this.navigator.push({view: <LocalLogin BoardList={this.state.BoardList} />})
      }
    }

    /**
     *切换账户
     *
     * @memberof MyLianWenList
     */
    _changeAccount(){
      if(this.state.isload)
      {
       this.navigator.push({view: <ChangeAccount  userAddr={this.state.userAddr} BoardList={this.state.BoardList}/>})
      }
      else
      {
        this.navigator.push({view: <LocalLogin BoardList={this.state.BoardList}/>})
      }
    }

    /**
     *充值
     *
     * @memberof MyLianWenList
     */
    _chongzhi(){
      if(this.state.isload)
      {
        this.navigator.push({view: <Recharge userAddr={this.state.userAddr} BoardList={this.state.BoardList}/>})
      }
      else
      {
        this.navigator.push({view: <LocalLogin BoardList={this.state.BoardList}/>})
      }
    }

     /**
     *转账
     *
     * @memberof MyLianWenList
     */
    _zhuanzhang(){
      if(this.state.isload)
      {
        this.navigator.push({view: <ThransferAccounts userAddr={this.state.userAddr} BoardList={this.state.BoardList}/>})
      }
      else
      {
        this.navigator.push({view: <LocalLogin BoardList={this.state.BoardList}/>})
      }
    }

    //充值提币历史记录
    _chongtihistory(){
      if(this.state.isload)
      {
        this.navigator.push({view: <AccountHistory userAddr={this.state.userAddr} BoardList={this.state.BoardList}/>})
      }
      else
      {
        this.navigator.push({view: <LocalLogin BoardList={this.state.BoardList}/>})
      }
    }

    /**
     *提币
     *
     * @memberof MyLianWenList
     */
    _tibi(){
      if(this.state.isload)
      {
        this.navigator.push({view: <ObtainMoac userAddr={this.state.userAddr} BoardList={this.state.BoardList} />})
      }
      else
      {
        this.navigator.push({view: <LocalLogin BoardList={this.state.BoardList}/>})
      }
    }

    /**
     *主链信息
     *
     * @memberof MyLianWenList
     */
    _mainchaininfo(){
      if(this.state.isload)
      {
        this.navigator.push({view: <MainChan userAddr={this.state.userAddr} BoardList={this.state.BoardList} />})
      }
      else
      {
        this.navigator.push({view: <LocalLogin BoardList={this.state.BoardList}/>})
      }
    }

    _getallusertest(){
      LoginLogic.getAllUsers();
    }
  
_test(){
  var keystore_youTest2 = {
    address: "e7e52b94e9a82351302260ec39a300e9f00aee4c",
    crypto: {
      cipher: "aes-128-ctr",
      ciphertext: "9c2b12947f87ce68ed55d736269da18ffef02ab67a9b1fa34e7f3c94f50e506c",
      cipherparams: {
        iv: "30a81a4ec0d4686387a6a090594d7cf1"
      },
      kdf: "scrypt",
      kdfparams: {
        dklen: 32,
        n: 262144,
        p: 1,
        r: 8,
        salt: "c48bcd62ed9ca45458845f4d7f817ffac6e50271593959da98db0fe8611c948f"
      },
      mac: "4a3efa1e7e90d84ecc1c473480f93956f23dc720af98e202ea80c66c87af88a8"
    },
    id: "5ca278c9-a460-4410-9773-d90413366d23",
    version: 3
  }
var addr = "0xe7e52b94e9a82351302260ec39a300e9f00aee4c";

var jsonData = {
  userAddr:addr,
  keystore: keystore_youTest2
}
Clipboard.setString(JSON.stringify(jsonData));
Toast.success('已复制到剪切板，请将剪切板中的内容粘贴到您要备份的位置');

}

    renderPage() {
      if(!this.state.loginstate)
      {
      return (
        <ScrollView style={{flex: 1,backgroundColor: '#F5FCFF'}}>
          <View style={{height: 2}} />
          <ListRow title='账号信息'  onPress={(e) => this._getAccountInfo(e)} />
          <View style={{height: 2}} />
          <ListRow title='登录'  onPress={() => this._login() } />
         {/*  <ListRow title='切换账户' icon={require('../../styles/icons/changeaccount.png')} onPress={() =>this._changeAccount()} /> */}
       
          {/*  <ListRow title='提币' icon={require('../../styles/icons/quxian.png')} onPress={() => this._tibi() } /> */}
          <View style={{height: 2}} />
          <ListRow title='区块链信息'  onPress={() => this._mainchaininfo() } />
          <View style={{height: 2}} />
          <ListRow title='关于链问' detail='版本号 0.1.0' topSeparator='full' onPress={() =>this.navigator.push({view: <About />})} />
         
        </ScrollView>
      );
      }
      else
      {
        return(
        <ScrollView style={{flex: 1,backgroundColor: '#F5FCFF'}}>
        <View style={{height: 2}} />
        <ListRow title='账号信息' onPress={(e) => this._getAccountInfo(e)} />
        <View style={{height: 2}} />
        <ListRow title='切换账户'  onPress={() =>this._changeAccount()} />
        <View style={{height: 2}} />
        <ListRow title='充值提币记录'  onPress={() => this._chongtihistory() }  />
        <View style={{height: 2}} />
        <ListRow title='转账'  onPress={() => this._zhuanzhang() }  />
        <View style={{height: 2}} />
        <ListRow title='区块链信息'  onPress={() => this._mainchaininfo() } />
        <View style={{height: 2}} />
        <ListRow title='关于链问'  detail='版本号 0.1.0'  onPress={() =>this.navigator.push({view: <About />})} />
      </ScrollView>
        );
      }
    }
  
  }
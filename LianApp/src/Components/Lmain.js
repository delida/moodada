// TabViewExample.js

'use strict';

import React, {Component} from 'react';
import { Platform,View,Image} from 'react-native';

import {Theme, TeaNavigator, NavigationPage, BasePage, ListRow, TabView, Label, PullPicker} from 'teaset';
import LianWenHome from './LianWenHome/LianWenHome';
import AddNewQuestion from './LianWenHome/AddNewQuestion';
import MyLianWenList from './LianWenHome/MyLianWenList';
import LocalLogin from './LoginView/LocalLogin';
import MineMain from './Mine/MineMain';
import LoginLogic from '../logic/LoginLogic';
import MainLogic from '../logic/MainLogic';

export default class Lmain extends BasePage {

  static defaultProps = {
    ...BasePage.defaultProps,
    title:'',
    showBackButton: true,
  };

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      type: 'projector',
      custom: false,
      BoardList:this.props.BoardList,
      num:0,
      boackinfo:'',
      selecttab:'链问'
    });
    this.auto = true;
    if(typeof(this.props.onlogin)!='undefined'&&this.props.onlogin)//已登录
    {
      this.auto=false;
    }

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

  _autoLogin(){
    LoginLogic.getCurrentUser().then((user)=>{
      if(user!=null &&  typeof (user) != "undefined")
      {
        if(user.userAddr!='undefined'&&user.userAddr!=''&&user.userAddr!=null){
          if(user.online&&this.auto)
          {
            LoginLogic.autoLogin(user).then((res)=>{
    
            })
          }
        }
           
      }
   })
  }

  componentWillMount(){
    if(!global.setNonce||typeof(global.setNonce)=='undefined')
    {
    //this._autoLogin();
    LoginLogic.getCurrentUser().then((user)=>{

      var useradd='';
      if(user!=null &&  typeof (user) != "undefined"){
        useradd = user.userAddr;
      }

      LoginLogic.setNonce(this.state.BoardList.subChainAddress,useradd,this.state.BoardList.rpcIp).then(data=>{
        if(data==1){
          //console.log('SetNonce成功');
          global.setNonce = true;
        }
      });
    })
  }
   
}


_addNewTopic(){
  LoginLogic.getCurrentUser().then((user)=>{
    if(user!=null &&  typeof (user) != "undefined")
    {
      if(user.userAddr!='undefined'&&user.userAddr!=''&&user.userAddr!=null){

         if(user.online)
          {
            this.navigator.push({view: <AddNewQuestion  userAddr={user.userAddr} BoardList={this.state.BoardList}/>})
          }
          else
          {
            this.navigator.push({view: <LocalLogin  BoardList={this.state.BoardList}/>})
          }
      }
          
    }
    else
    {
    this.navigator.push({view: <LocalLogin BoardList={this.state.BoardList}/>})
    }
 })
}

  renderCustomButton() {
  
    return (
      <TabView.Sheet
        type='button'
        title='提问'
        icon={require('../styles/tab/edit.png')}
        activeIcon={require('../styles/tab/edit_active.png')}
        //iconContainerStyle={{justifyContent: 'flex-end'}}
        onPress={() => this._addNewTopic()} 
        />
    );
  }

  renderPage() {
    let {type, custom} = this.state;
    let customBarStyle = Platform.OS == 'android'  ? null : {
      borderTopWidth: 0,
      shadowColor: '#ccc',
      shadowOffset: {height: -1},
      shadowOpacity: 0.4,
      shadowRadius: 0.5,
    };
    return (
      <View style={{flex:1, backgroundColor: '#F5FCFF'}}>

    
      <TabView style={{flex: 1}} barStyle={customBarStyle} type={type}>
      {this.renderItemSheet('链问',require('../styles/tab/home.png'),require('../styles/tab/home_active.png'),  <LianWenHome BoardList={this.state.BoardList}/>)}
      {this.renderCustomButton()}
     {/*  {this.renderItemSheet('提问',require('../styles/icons/edit.png'),require('../styles/icons/edit_active.png'),  <AddNewQuestion />)} */}
      {this.renderItemSheet('提问录',require('../styles/tab/store.png'),require('../styles/tab/store_active.png'),  <MyLianWenList BoardList={this.state.BoardList}/>)}
      {this.renderItemSheet('我的',require('../styles/tab/me.png'),require('../styles/tab/me_active.png'),  <MineMain BoardList={this.state.BoardList}/>)}
      </TabView>
      <ListRow title='主链高度/子链高度/刷新计时' detail={<Label text={this.state.boackinfo} type='title' style={{color:'white'}} />} style={{backgroundColor:'#00A29A'}} titleStyle={{color:'white'}} />
      </View>
    );
  }

  
  renderItemSheet(title,icon,activeIcon,controller)
  {
    let imgcon = (<Image source={icon} style={{width:20,height:20}} />);
let imgactive = (<Image source={activeIcon} style={{width:20,height:20}} />);

let titletemp = this.state.selecttab==title?(<Label text={title} type='title' style={{color:'#00A29A',fontSize:10}} />):(<Label text={title} type='title' style={{fontSize:10,color:'#8a8a8a'}}/>)
      return(
        <TabView.Sheet
        title={titletemp}
        icon={imgcon}
        activeIcon={imgactive}
        onPress={()=>{this.setState({selecttab:title})}}
      >
       {controller}
      </TabView.Sheet>
      );
  }

}

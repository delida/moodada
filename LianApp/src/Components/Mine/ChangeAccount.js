

'use strict';

import React, {Component} from 'react';
import {View, ScrollView,Image} from 'react-native';

import {NavigationPage, ListRow, Badge,Toast} from 'teaset';

import LocalLogin from '../LoginView/LocalLogin';
import ChangeAccountLogin from '../LoginView/ChangeAccountLogin';
import LoginLogic from '../../logic/LoginLogic';
import LoadingView from '../CommonComp/LoadingView';
import MenuMain from '../MenuMain';

import { kong } from '../../CommonMethod';
import i18n from '../../../i18n/i18n';
export default class ChangeAccount extends NavigationPage {

    static defaultProps = {
      ...NavigationPage.defaultProps,
      title: i18n.t('Profile.changeAccount.switch_account'),
      showBackButton: true,
    };
  
    constructor(props)
    {
        super(props);
        this.state={
            account:'ASDWEERRFDFDFGDFDFGFD',
            accounts:[
            ],
            BoardList:this.props.BoardList,
            showLoading: false,
        }
    }

        
  renderNavigationTitle() {
    var you = "→"+this.state.BoardList.boardName;
    return  `${this.props.title}${you}`
    }

    _getAllUsers(){
        LoginLogic.getAllUsers().then((data)=>{
           // console.log('切换账户界面获取全部数据',data);
            if(data!=null&&data.length>0&&typeof(data)!='undefined')
            {
                 /*  var users = [];
                  for(let i in data)
                  {
                      let item  = data[i];
                       var u = {
                        account:item.userAddr
                      } 
                      users.push(u);
                  } */
                  this.setState({
                      account:this.props.userAddr,
                      accounts:data
                })
            }
        })
    }

    componentWillMount(){
        this._getAllUsers();
    }

    renderPage() {
      return (
        <ScrollView style={{flex: 1,backgroundColor: '#F5FCFF'}}>
          <View style={{height: 40}} />
          {this._renderAccountInfo()}
          <View style={{height: 20}} />
          <ListRow title={i18n.t('Profile.changeAccount.new_account_login')}  onPress={() => this.navigator.push({view: <LocalLogin BoardList={this.state.BoardList}/>})} />
          <LoadingView showLoading={this.state.showLoading} loadingViewClick={() => { this.setState({ showLoading: false }) }} />
        </ScrollView>
      );
    }

    
  _login(i){
   
    //console.log('accounts',this.state.accounts);
    var user = this.state.accounts[i];
    //console.log('user',user);
    if(user==null ||user.userAddr==''||typeof(user)=='undefined'||typeof(user.userAddr)=='undefined'||user.userAddr=='undefined')
    {
      Toast.fail(i18n.t('FAIL. no_available_export_keyStore'));
      return;
    }

    this.setState({showLoading:true});
    var isdoing = false;
    this.timer = setInterval(()=>{
      if(!isdoing){
        isdoing = true;
        LoginLogic.registerLogin(user.userAddr, user.userPwd, user.keystore).then((result)=>{
          if (result == 1) {
            LoginLogic.setNonce(this.state.BoardList.subChainAddress,user.userAddr,this.state.BoardList.rpcIp);
            this.setState({ showLoading: false });
            this.navigator.push({ view: <MenuMain onlogin={true} BoardList={this.state.BoardList} /> });
             //this.navigator.push({view:<Lmain onlogin={true} BoardList={this.state.BoardList}/>});
          }
          else if (result == 0) {
            this.setState({ showLoading: false });
            Toast.fail(i18n.t('FAIL.login_fail'));
          }
          else {
            this.setState({ showLoading: false });
            Toast.fail(i18n.t('FAIL.incorrect_password'));
          }

            //停止掉
            clearInterval(this.timer);
            this.timer = undefined;
         })
      }
    },1000);


   

   /*  LoginLogic.getUserByUserAddr(username).then((res)=>{
     
      if(res==null||typeof(res)=='undefined')
      {
         Toast.fail('未获取到keyStore值，请切换keyStore登录');
      }
      else
      {
       
      }
    }) */

  }

  
    _renderAccountInfo() {
        let lists = [];
       if(this.state.accounts)
       {
              for(let i in this.state.accounts)
              {
                  let item  = this.state.accounts[i];
                  if(item.userAddr === this.state.account)
                  {
                      lists.push( <ListRow key={i} title={item.userAddr}
                        icon={require('../../styles/mine/me.png')} detail={
                        <View style={{flexDirection: 'row'}}>
                          <Badge count='online' />
                        </View>
                      } topSeparator='full'  titlePlace='top'/>)
                  }
                  else
                  {
                      lists.push( <ListRow key={i} title={item.userAddr} icon={require('../../styles/mine/me.png')}   onPress={() => this.navigator.push({view: <ChangeAccountLogin BoardList={this.state.BoardList} userName={item.userAddr} />})} />);
                  }
              }
       }
        
        return lists;
    }

  }
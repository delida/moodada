

'use strict';

import React, {Component} from 'react';
import {View, ScrollView,Clipboard,TextInput,Dimensions,Alert,Text} from 'react-native';

import {Toast, TeaNavigator, NavigationPage, BasePage, ListRow, Button, Label} from 'teaset';

import CoinLogic from '../../logic/CoinLogic';
import LoginLogic from '../../logic/LoginLogic';
import LoadingView from '../CommonComp/LoadingView';
var {height, width} = Dimensions.get('window');
import { kong } from '../../CommonMethod';
import MainLogic from '../../logic/MainLogic';
import i18n from '../../../i18n/i18n';

export default class TransferAccounts extends NavigationPage {

    static defaultProps = {
      ...NavigationPage.defaultProps,
      title: i18n.t('Profile.transferAccounts.user_transfer'),
      showBackButton: true,
    };
  
    constructor(props)
    {
        super(props);
        this.state={
            account:'',
            moac:0,
            coin:0,
            BoardList : this.props.BoardList,
            showLoading:false,
            rechargemoac:'0',
            rechargecoin:'0'
        }
    }

    _getBalance(){
      CoinLogic.getBalance(this.props.userAddr,this.state.BoardList.marketableTokenAddr,'moac','',this.state.BoardList.subChainAddress,this.state.BoardList.rpcIp).then((result)=>{
        if(!kong(result))
        {
          console.log('获取币值结果',result);
          this.setState({
            account:this.props.userAddr,
            moac:result.moacBalance,
            coin:result.erc20Balance,
            rechargeAccount:''
          })
        }
      })
    }

        
  renderNavigationTitle() {
    var you = "→"+this.state.BoardList.boardName;
    return  `${this.props.title}${you}`
    }

    componentWillMount(){
      this._getBalance();
  }
  
 

  _clearAll(){
    LoginLogic.clearPromise();
  }

  _transferMoac(num){
   /*  var begin=new Date(); */
    this.setState({showLoading:true});
     

      LoginLogic.getCurrentUser().then((user)=>{
        //console.log('moac转账user', user);
        let userAddr = user.userAddr;
        if (user != null && typeof (user) != "undefined" && user.online){
          LoginLogic.getUserByUserAddr(userAddr).then((userInfo)=>{
            //console.log('moac转账usserInfo', userInfo);
            MainLogic.transferMoac(userAddr,this.state.rechargeAccount,num,userInfo.userPwd,userInfo.keystore).then((res)=>{
              if(res==1)
              {
               var timeindex = 0;
               this.timer = setInterval(()=>{
                timeindex++;
                if(timeindex>=3){
                  this.setState({showLoading:false});
                Toast.success(i18n.t('SUCCESS.transfer_request_sent'));
                this._getBalance();
                  //停止掉
             clearInterval(this.timer);
             this.timer = undefined;
                }
              },1000)


               
              }
              else{
                this.setState({showLoading:false});
                Toast.fail(i18n.t('FAIL.transfer_fail'));
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
        let num = Number.parseFloat(this.state.rechargemoac);
        if(isNaN(num)||num<=0)
        {
         
          Toast.fail(i18n.t('FAIL.input_amount_exception'));
          return;
        }
        if(num>this.state.moac)
        {
         
          Toast.fail(i18n.t('FAIL.insufficient_moac_balance'));
          return;
        }
    
        if(kong(this.state.rechargeAccount)){
         
          Toast.fail(i18n.t('FAIL.empty_dist'));
          return;
        }
          Alert.alert(i18n.t('ALERT.transfer_confirm'), '', [
              { text: i18n.t('ACTION.confirm'), onPress: () => this._transferMoac(num) },
              { text: i18n.t('ACTION.cancel'), onPress: () =>  Toast.success(i18n.t('SUCCESS.cancel_success'))}
          ])
  
      }

      _transferCoin(num){
       /*  var begin=new Date(); */
        this.setState({showLoading:true});
         
          LoginLogic.getCurrentUser().then((user)=>{
           // console.log('转账user', user);
            let userAddr = user.userAddr;
            if (user != null && typeof (user) != "undefined" && user.online){
              LoginLogic.getUserByUserAddr(userAddr).then((userInfo)=>{
               // console.log('转账usserInfo', userInfo);
               MainLogic.transferCoin(this.props.userAddr,this.state.rechargeAccount,num,this.state.BoardList.subChainAddress,userInfo.userPwd,userInfo.keystore,this.state.BoardList.rpcIp).then((res)=>{
                 // console.log('转账返回',res);
                  if(res==1)
                  {
                              var timeindex = 0;
                    this.timer = setInterval(()=>{
                      timeindex++;
                      if(timeindex>=3){
                        this.setState({showLoading:false});
                        Toast.success(i18n.t('SUCCESS.transfer_request_sent'));
                        this._getBalance();
                        //停止掉
                   clearInterval(this.timer);
                   this.timer = undefined;
                      }
                    },1000)

                   
                  }
                  else{
                    this.setState({showLoading:false});
                    Toast.fail(i18n.t('FAIL.transfer_fail'));
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
      _showsell(e) {

        let num = Number.parseFloat(this.state.rechargecoin);
        if(isNaN(num)||num<=0)
        {
         
          Toast.fail(i18n.t('FAIL.input_amount_exception'));
          return;
        }
        if(num>this.state.coin)
        {
         
          Toast.fail(i18n.t('FAIL.insufficient_coin_balance'));
          return;
        }
        if(kong(this.state.rechargeAccount)){
       
          Toast.fail(i18n.t('FAIL.empty_dist'));
          return;
        }

        Alert.alert(i18n.t('ALERT.transfer_confirm'), '', [
            { text: i18n.t('ACTION.confirm'), onPress: () => this._transferCoin(num) },
            { text: i18n.t('ACTION.cancel'), onPress: () =>  Toast.success(i18n.t('SUCCESS.cancel_success'))}
        ])

    }

    renderPage() {

     
         
       
      return (
        <ScrollView style={{flex: 1,backgroundColor: '#F5FCFF'}}>
          <View style={{height: 5}} />
          <ListRow title={i18n.t('accountAddr')} icon={require('../../styles/mine/accountinfo.png')} detail={this.state.account} titlePlace='top' detailStyle={{fontSize:12}} />
          <View style={{height: 5}} />
          <ListRow title={i18n.t('moac_balance')} detail={<Label text={this.state.moac} type='title' />} />
          <ListRow title={i18n.t('coin_balance')}detail={<Label text={this.state.coin} type='title' />} />
          <ListRow title={i18n.t('PROFILE.transferAccounts.dist_address')} detail={
            <TextInput
            style={{marginLeft:5,marginRight:5,height: 35, flex:1,borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => {
              this.setState({rechargeAccount: text})
            }}
            placeholder={i18n.t('PLACEHOLDER.input_dist_address')}
            value={this.state.rechargeAccount}
             keyboardType='numeric'
          />
          }/>
          <ListRow title={i18n.t('PROFILE.transferAccounts.transfer_amount')} detail={

<View style={{flex:1,flexDirection:'row'}}>
<TextInput
            style={{marginLeft:5,marginRight:5,height: 35, flex:7,borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => {
              this.setState({rechargemoac: text})
            }}
            placeholder={i18n.t('PLACEHOLDER.input_moac_exchange')}
            value={this.state.rechargemoac}
             keyboardType='numeric'
          />
          <Button title={'moac' + i18n.t('ACTION.transfer')}type='primary'  style={{flex:3,backgroundColor:'#00A29A',borderColor:'#00A29A'}} onPress={(e)=>this._show(e)} />
</View>

           
          }/>
          
          <View style={{height: 5}} />
          <ListRow title={i18n.t('PROFILE.transferAccounts.transfer_amount')} detail={
              <View style={{flex:1,flexDirection:'row'}}>
              <TextInput
            style={{marginLeft:5,marginRight:5,height: 35, flex:7,borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => {
              this.setState({rechargecoin: text})
            }}
            placeholder={i18n.t('PLACEHOLDER.input_coin_transfer')}
            value={this.state.rechargecoin}
             keyboardType='numeric'
          />
          <Button title= {'coin'+i18n.t('ACTION.transfer')} type='primary' style={{flex:3,backgroundColor:'#00A29A',borderColor:'#00A29A'}} onPress={(e)=>this._showsell(e)} />
              </View>
            
          }/>
        {/*   <ListRow  detail={<Button title='coin转账' type='primary' style={{padding:6,width:width-20}} onPress={(e)=>this._showsell(e)} />} /> */}

          <View style={{ height: 5 }} />
          <ListRow detail={
            <View>
              <Label text={i18n.t('REMINDER.reminder')}  type='title'  />
              <Text>{i18n.t('REMINDER.reminder_text1')}</Text>
            </View>

          } titlePlace='top'  detailMultiLine={true}  />
          
          <View style={{height: 5}} />
          <LoadingView showLoading={ this.state.showLoading } loadingViewClick={()=>{this.setState({showLoading:false})}}/>
        </ScrollView>
      );
    }
  
  }
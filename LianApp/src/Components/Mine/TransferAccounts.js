

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

export default class TransferAccounts extends NavigationPage {

    static defaultProps = {
      ...NavigationPage.defaultProps,
      title: '账户转账',
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
                Toast.success('转账请求已发送,大约几分钟后到账，请注意查看');
                this._getBalance();
                  //停止掉
             clearInterval(this.timer);
             this.timer = undefined;
                }
              },1000)


               
              }
              else{
                this.setState({showLoading:false});
                Toast.fail('转账失败，请重新尝试');
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
        let num = Number.parseFloat(this.state.rechargemoac);
        if(isNaN(num)||num<=0)
        {
         
          Toast.fail('输入的数值有误');
          return;
        }
        if(num>this.state.moac)
        {
         
          Toast.fail('输入的moac值不能大于拥有的数量');
          return;
        }
    
        if(kong(this.state.rechargeAccount)){
         
          Toast.fail('转入地址不能为空');
          return;
        }
          Alert.alert('确定要转账吗?', '', [
              { text: '确定', onPress: () => this._transferMoac(num) },
              { text: '取消', onPress: () =>  Toast.success('取消成功')}
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
                        Toast.success('转账请求已发送,大约几分钟后到账，请注意查看');
                        this._getBalance();
                        //停止掉
                   clearInterval(this.timer);
                   this.timer = undefined;
                      }
                    },1000)

                   
                  }
                  else{
                    this.setState({showLoading:false});
                    Toast.fail('转账失败，请重新尝试');
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
      _showsell(e) {

        let num = Number.parseFloat(this.state.rechargecoin);
        if(isNaN(num)||num<=0)
        {
         
          Toast.fail('输入的数值有误');
          return;
        }
        if(num>this.state.coin)
        {
         
          Toast.fail('输入的coin值不能大于拥有的数量');
          return;
        }
        if(kong(this.state.rechargeAccount)){
       
          Toast.fail('转入地址不能为空');
          return;
        }

        Alert.alert('确定要转账吗?', '', [
            { text: '确定', onPress: () => this._transferCoin(num) },
            { text: '取消', onPress: () =>  Toast.success('取消成功')}
        ])

    }

    renderPage() {

     
         
       
      return (
        <ScrollView style={{flex: 1,backgroundColor: '#F5FCFF'}}>
          <View style={{height: 5}} />
          <ListRow title='账号地址' icon={require('../../styles/mine/accountinfo.png')} detail={this.state.account} titlePlace='top' detailStyle={{fontSize:12}} />
          <View style={{height: 5}} />
          <ListRow title='moac余额' detail={<Label text={this.state.moac} type='title' />} />
          <ListRow title='coin余额' detail={<Label text={this.state.coin} type='title' />} />
          <ListRow title='目标地址' detail={
            <TextInput
            style={{marginLeft:5,marginRight:5,height: 35, flex:1,borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => {
              this.setState({rechargeAccount: text})
            }}
            placeholder='请输入要转入的账户地址'
            value={this.state.rechargeAccount}
             keyboardType='numeric'
          />
          }/>
          <ListRow title='转账数值' detail={

<View style={{flex:1,flexDirection:'row'}}>
<TextInput
            style={{marginLeft:5,marginRight:5,height: 35, flex:7,borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => {
              this.setState({rechargemoac: text})
            }}
            placeholder='请输入参与兑换的moac币值'
            value={this.state.rechargemoac}
             keyboardType='numeric'
          />
          <Button title='moac转账' type='primary'  style={{flex:3,backgroundColor:'#00A29A',borderColor:'#00A29A'}} onPress={(e)=>this._show(e)} />
</View>

           
          }/>
          
          <View style={{height: 5}} />
          <ListRow title='转账数值' detail={
              <View style={{flex:1,flexDirection:'row'}}>
              <TextInput
            style={{marginLeft:5,marginRight:5,height: 35, flex:7,borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => {
              this.setState({rechargecoin: text})
            }}
            placeholder='请输入转账的coin币值'
            value={this.state.rechargecoin}
             keyboardType='numeric'
          />
          <Button title='coin转账' type='primary' style={{flex:3,backgroundColor:'#00A29A',borderColor:'#00A29A'}} onPress={(e)=>this._showsell(e)} />
              </View>
            
          }/>
        {/*   <ListRow  detail={<Button title='coin转账' type='primary' style={{padding:6,width:width-20}} onPress={(e)=>this._showsell(e)} />} /> */}

          <View style={{ height: 5 }} />
          <ListRow detail={
            <View>
              <Label text='友情提示:' type='title'  />
              <Text>每个子链应用板块中的coin不能在其他版块中使用，需要使用主链中的MOAC进行兑换</Text> 
            </View>

          } titlePlace='top'  detailMultiLine={true}  />
          
          <View style={{height: 5}} />
          <LoadingView showLoading={ this.state.showLoading } loadingViewClick={()=>{this.setState({showLoading:false})}}/>
        </ScrollView>
      );
    }
  
  }
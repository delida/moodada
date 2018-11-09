

'use strict';

import React, {Component} from 'react';
import {KeyboardAvoidingView ,TouchableOpacity,View, TextInput,ScrollView,StyleSheet,Dimensions} from 'react-native';

import {NavigationPage, Input, ListRow, Label,Toast,Button} from 'teaset';
var {height, width} = Dimensions.get('window');
import LoginLogic from '../../logic/LoginLogic';
import CoinLogic from '../../logic/CoinLogic';

import LoadingView from '../CommonComp/LoadingView';
import MainLogic from '../../logic/MainLogic';
import i18n from '../../../i18n/i18n';

export default class AddNewQuestion extends NavigationPage {

    static defaultProps = {
      ...NavigationPage.defaultProps,
      title: i18n.t('Lmain.question'),
      showBackButton: true,
    };
  
    constructor(props)
    {
        super(props);
        this.state = {
          height: 30,
          text: '',
          award:'',
          duration:'',
          userAddr:this.props.userAddr,
          showLoading:false,
          coin:0,
          BoardList:this.props.BoardList,
          userInfo:null,
          boackinfo:'',
          pertime:10,
          maxtime:10000,
          peiinfo:i18n.t('INFO.ten_multiples')
        };

        
        this.timer =null;
    }

    
    componentDidMount(){
      this.timer = setInterval(()=>{
        MainLogic.getBlockInfo(this.state.BoardList.subChainAddress,this.state.BoardList.rpcIp).then(data=>{
          //console.log('区块信息高度',data);
          var binfo = data.blockNumber+'/'+data.subBlockNumber+'/'+data.flushNumber;
          this.setState({
            boackinfo:binfo
          })
        })
      },10000);

      this.setState({showLoading:true})
      MainLogic.getMaxTimeAndPerTime(this.state.BoardList.subChainAddress,this.state.BoardList.deployLwSolAdmin).then(data=>{
		console.log('*********perTime***********',data.perTime,'*********maxTime***********',data.maxTime);  
        this.setState({
          showLoading:false,
        pertime:data.perTime,
        maxtime:data.maxTime,
        peiinfo:i18n.t('LianWenHome.addNewQuestion.please_input')+data.perTime+i18n.t('LianWenHome.addNewQuestion.multiples')
        })

      })

    }
       
  renderNavigationTitle() {
    var you = "→"+this.state.BoardList.boardName;
    return  `${this.props.title}${you}`
    }



    cauculateHeight (e) {
      const height = e.nativeEvent.contentSize.height > 30
        ? e.nativeEvent.contentSize.height+5
        : this.state.height;
        
      this.setState ({height});
    }

    _downloadLayout(e){
      this.setState({
          downloadY:e.nativeEvent.layout.y,
      });
  }

  _downLoadFocus(){
    let scroller = this.refs.scroller;
    iOS&& setTimeout(()=>{
        let y = this.state.downloadY - 1/3*Dev_height;//Dev_height为屏幕的高度
        scroller&&scroller.scrollTo({x:0, y:y, animated:true});
    },50);
}


componentWillMount(){
  this._getcoin()
  /* this.timer = setInterval(()=>{
    MainLogic.getBlockInfo(this.state.BoardList.subChainAddress,this.state.BoardList.rpcIp).then(data=>{
      //console.log('区块信息高度',data);
      var binfo = data.blockNumber+'/'+data.subBlockNumber+'/'+data.flushNumber;
      this.setState({
        boackinfo:binfo
      })
    })
  },10000);
 */
}

componentWillUnmount() {
this.timer && clearInterval(this.timer);

}

_getcoin(){
  this.setState({showLoading:true});
  LoginLogic.getCurrentUser().then((user)=>{
    let userAddr = user.userAddr;
    if (user != null && typeof (user) != "undefined" && user.online){
      LoginLogic.getUserByUserAddr(userAddr).then((userInfo)=>{
        CoinLogic.getMicroChainBalance(this.state.userAddr,userInfo.userPwd,userInfo.keystore,this.state.BoardList.subChainAddress,this.state.BoardList.rpcIp)
        .then((coinresult)=>{
          this.setState({showLoading:false,coin:coinresult,userInfo:userInfo});
        })
      })
    }
  })
}

_addNewTopic(e){
  var begin=new Date();
    let award = Number.parseFloat(this.state.award);
    if(isNaN(award)||award<=0)
    {
     
      Toast.fail(i18n.t('FAIL.wrong_award_amount'));
      return;
    }
    let duration = Number.parseInt(this.state.duration)
    if(isNaN(duration)||duration<=0){
     
      Toast.fail(i18n.t('FAIL.wrong_duration_input'));
      return;
    }

    if(duration>this.state.maxtime){
      Toast.fail(i18n.t('FAIL.maximum_duration')+this.state.maxtime);
      return;
    }

    var  yu = duration%this.state.pertime;
    if(yu!=0)
    {
   
      Toast.fail(i18n.t('LianWenHome.addNewQuestion.expect_duration')+this.state.pertime+i18n.t('LianWenHome.addNewQuestion.integer'));
      return;
    }
    
    if(this.state.text==''||this.state.text.length>200||this.state.text.length<=0)
    {
      
      Toast.fail(i18n.t('FAIL.wrong_input_question'));
      return;
    }
    this.setState({showLoading:true});

    if(this.state.coin<award)
    {
      this.setState({showLoading:false});
      Toast.fail(i18n.t('LianWenHome.addNewQuestion.not_enough_coin'));
     return;
    }
    else
    {
       MainLogic.createTopic(this.state.award,this.state.text,this.state.duration,this.state.userAddr,this.state.userInfo.userPwd,this.state.userInfo.keystore,this.state.BoardList.subChainAddress,this.state.BoardList.rpcIp).then((res)=>{
       // console.log('创建问题返回结果',res);  
        if(res.isSuccess==1)
          {
            var end=new Date();
     var time=end-begin;
    // console.log("总创建问题消耗时间为="+time);
           // console.log('加载结束');
            Toast.success(i18n.t('SUCCESS.question_success'));
            this.setState({showLoading:false});
            this.navigator.pop();
          }
      }) 
    }






   /*  LoginLogic.getCurrentUser().then((user)=>{
     // console.log('创建问题user', user);
      let userAddr = user.userAddr;
      if (user != null && typeof (user) != "undefined" && user.online){
        LoginLogic.getUserByUserAddr(userAddr).then((userInfo)=>{
         // console.log('创建问题usserInfo', userInfo);
          //判断余额
          CoinLogic.getMicroChainBalance(this.state.userAddr,userInfo.userPwd,userInfo.keystore,this.state.BoardList.subChainAddress,this.state.BoardList.rpcIp)
          .then((coinresult)=>{
            if(coinresult<award)
            {
              this.setState({showLoading:false});
              Toast.success('coin币不足');
             return;
            }
            else
            {
               MainLogic.createTopic(this.state.award,this.state.text,this.state.duration,this.state.userAddr,userInfo.userPwd,userInfo.keystore,this.state.BoardList.subChainAddress,this.state.BoardList.rpcIp).then((res)=>{
               // console.log('创建问题返回结果',res);  
                if(res.isSuccess==1)
                  {
                    var end=new Date();
             var time=end-begin;
            // console.log("总创建问题消耗时间为="+time);
                   // console.log('加载结束');
                    Toast.success('提问成功,请等待20秒后刷新列表查看');
                    this.setState({showLoading:false});
                    this.navigator.pop();
                  }
              }) 
            }
          })
        })
      }
      else{
        this.setState({showLoading:false});
        Toast.fail('请先登录');
      }
    })

 */

  

}

    renderPage() {

      
   
      

      return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
          <View style={{height: 2}} />
        
          <ListRow  detail={
          <View style={styles.item}>
          <TouchableOpacity activeOpacity={1} style={styles.inputContainer} onPress={() => this.TextInput.focus()}>

              <TextInput
                  placeholder={i18n.t('PLACEHOLDER.input_question')}
                  placeholderTextColor={'#bbbbbb'}
                  underlineColorAndroid={'transparent'}
                  multiline
                  ref={textInput => this.TextInput = textInput}
                  onContentSizeChange={e => this.cauculateHeight(e)}
                  style={[styles.input, { height: this.state.height }]}
                  maxLength={140}
                  onChangeText={(text) => this.setState({text})}
              />
          </TouchableOpacity>
      </View>
        }/>
          <View style={{height: 2}} />
          <ListRow title={i18n.t('LianWenHome.addNewQuestion.award')} detail={
            <TextInput
            style={{height: 35, width:200,borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => {
              this.setState({award: text})
            }}
            placeholder={i18n.t('PLACEHOLDER.input_coin_award')}
            value={this.state.award}
            //为了方便测试时输入字母，属性（keyboardType）不设置，实际使用时加上
             keyboardType='numeric'
          />
          }/>
           <View style={{height: 2}} />
          <ListRow title={i18n.t('LianWenHome.addNewQuestion.duration_time')} detail={
            <TextInput
            style={{height: 35, width:200,borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => {
              this.setState({duration: text})
            }}
            placeholder={this.state.peiinfo}
            value={this.state.duration}
            //为了方便测试时输入字母，属性（keyboardType）不设置，实际使用时加上
             keyboardType='numeric'
          />
         
          }/>
           <ListRow title={i18n.t('coin_balance')} detail={<Label text={this.state.coin} type='title' />} />
          <ListRow  detail={<Button title={i18n.t('ACTION.submit')} type='primary' style={{margin:2,width:width-20,backgroundColor:'#00A29A',borderColor:'#00A29A'}} onPress={(e)=>this._addNewTopic(e)} />} />
          <View style={{ height: 5 }} />
          <ListRow detail={
            <View>
              <Label text={i18n.t('REMINDER.reminder')}  type='title'  />
              <Label text={i18n.t('REMINDER.reminder_text2')} type='title'  />
              <Label text={i18n.t('REMINDER.reminder_text3')} type='title'  />
            </View>

          } titlePlace='top'   />
        
          <ListRow title={i18n.t('block_Info')} detail={<Label text={this.state.boackinfo} type='title'  />}  />
          <LoadingView showLoading={ this.state.showLoading } loadingViewClick={()=>{this.setState({showLoading:false})}}/>
          </KeyboardAvoidingView>
      );
    }

    //充值
    renderRearge(){
          
    }
  
  }

  //样式定义
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#F5FCFF'
  },
  inputContainer: {
    height: 180,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    margin:1
  },
  input: {
    paddingVertical: 0, 
    padding: 3, 
    fontSize: 16,
    maxHeight: 200
  },
  item:{
    paddingBottom: 6,
    marginBottom: 6,
    flex: 1
  },
})
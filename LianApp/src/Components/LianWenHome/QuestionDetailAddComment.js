

'use strict';

import React, {Component} from 'react';
import {KeyboardAvoidingView ,TouchableOpacity,TextInput,View,StyleSheet,Dimensions,TouchableWithoutFeedback} from 'react-native';

import {NavigationPage, Toast, ListRow, Label,Theme,Button} from 'teaset';
var {height, width} = Dimensions.get('window');
import MainLogic from '../../logic/MainLogic';
import LoginLogic from '../../logic/LoginLogic';
import LoadingView from '../CommonComp/LoadingView';
import i18n from '../../../i18n/i18n';
const dismissKeyboard = require('dismissKeyboard')
export default class QuestionDetailAddComment extends NavigationPage {

    static defaultProps = {
      ...NavigationPage.defaultProps,
      title: i18n.t('LianWenHome.questionDetailAddComment.answer'),
      showBackButton: true,
    };
  
    constructor(props)
    {
        super(props);
        this.state = {
          height: 30,
          text: '',
          userAddr:this.props.userdata.userAddr,
          topicHash:this.props.userdata.topicHash,
          showLoading:false,
          BoardList:this.props.BoardList
        };
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

_saveComment(e){
  var begin=new Date();
    if(this.state.text==''||this.state.text.length>200||this.state.text.length<=0){
        Toast.fail(i18n.t('FAIL.input_content_exception'));
        return;
    }
    this.setState({showLoading:true});

    LoginLogic.getCurrentUser().then((user)=>{
     // console.log('回答问题user', user);
      let userAddr = user.userAddr;
      if (user != null && typeof (user) != "undefined" && user.online){
        LoginLogic.getUserByUserAddr(userAddr).then((userInfo)=>{
         // console.log('回答问题usserInfo', userInfo);
          MainLogic.createSubTopic(this.state.topicHash,this.state.text,this.state.userAddr,userInfo.userPwd,userInfo.keystore,this.state.BoardList.subChainAddress,this.state.BoardList.rpcIp).then((resData)=>{
            //console.log('回答问题收到应答',resData);
            if(resData.isSuccess==1)
            {
              var end=new Date();
             var time=end-begin;
            // console.log("评论总消耗时间为="+time);
              this.setState({showLoading:false});
                Toast.success(i18n.t('SUCCESS.comment_success'));
                this.navigator.pop();
            }
            else if(resData.isSuccess==0)
            {
              this.setState({showLoading:false});
                Toast.fail(i18n.t('FAIL.answer_fail'));
            }
            else
            {
              this.setState({showLoading:false});
                Toast.fail(i18n.t('FAIL.expired_answer'));
            }
        })
        })
      }
    })


   
}

    renderPage() {

     
     
     
        return (
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
        >
            <View style={{height: 20}} />
            <ListRow  detail={<Label text={i18n.t('LianWenHome.questionDetailAddComment.typed')+this.state.text.length+i18n.t('LianWenHome.questionDetailAddComment.words')}   type='title' />} 
             accessory='none' 
             onPress={dismissKeyboard}
            />
            <ListRow  detail={
            <View style={styles.item}>
            <TouchableOpacity activeOpacity={1} style={styles.inputContainer} onPress={() => this.TextInput.focus()}>
  
                <TextInput
                    placeholder={i18n.t('PLACEHOLDER.input_answer')}
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
            <View style={{height: 20}} />
           
            <ListRow  detail={<Button title={i18n.t('ACTION.submit')} type='primary' style={{margin:2,width:width-20,backgroundColor:'#00A29A',borderColor:'#00A29A'}} onPress={(e)=>this._saveComment(e)} />} />
  
            <View style={{ height: 60 }} />
            <LoadingView showLoading={ this.state.showLoading } loadingViewClick={()=>{this.setState({showLoading:false})}}/>
            </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        );
      

     
    }

    //充值
    renderRearge(){
          
    }
  
  }

  //样式定义
const styles = StyleSheet.create({
  container:{
    flex:1
  },
  inputContainer: {
    height: 300,
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
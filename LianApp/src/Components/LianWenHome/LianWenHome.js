
'use strict';

import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ListView,
  Image,
  Platform,
  ScrollView
} from 'react-native';


import { Theme, TeaNavigator, NavigationPage, BasePage, ListRow, Toast, Label, PullPicker } from 'teaset';
import QuestionDetail from './QuestionDetail';

import i18n from '../../../i18n/i18n';
import MainLogic from '../../logic/MainLogic';
import LoginLogic from '../../logic/LoginLogic';
import LianWenRule from './LianWenRule';

var { width, height } = Dimensions.get('window')

import RefreshListView, { RefreshState } from 'react-native-refresh-list-view'

const img_arr = {
  png1: require('../../styles/menu/wen1.png'),
  png2: require('../../styles/menu/wen2.png'),
  png3: require('../../styles/menu/wen3.png'),
  png4: require('../../styles/menu/wen4.png'),
}


// 缓存列表中所有数据
let cachedResults = {
  nextPage: 1, // 下一页
  items: [], // listview 数据
  total: 0 // 总数
};

export default class LianWenHome extends NavigationPage {


  static defaultProps = {
    ...NavigationPage.defaultProps,
    title: i18n.t('snapQA'),
    showBackButton: true,
  };

  constructor(props) {
    super(props);
    /*  this.defaultProps.title =  '链问('+this.props.BoardList.boardName+')'; */
    this.state = {
      dataList: [],
      refreshState: RefreshState.Idle,
      BoardList: this.props.BoardList,
      userAddr: '',
      user:{},
      isOwner: 0,
      autoCheckFlag: 0,   
      autoCheckDuration: 1,   // 结算的时间间隔
      checktime: undefined
    }

  }




  renderNavigationTitle() {
    var you = "→" + this.state.BoardList.boardName;
    return `${this.props.title}${you}`
  }

  componentDidMount() {
    this.onHeaderRefresh()
  }


  onHeaderRefresh = () => {
    this.setState({ refreshState: RefreshState.HeaderRefreshing })
    LoginLogic.getCurrentUser().then(user => {
     
      var useraddr = '';
      if (user != null && typeof (user) != "undefined" && user.online) {
        useraddr = user.userAddr;
      }
     
      MainLogic.getTopicList(0, 0, this.state.BoardList.subChainAddress, this.state.BoardList.rpcIp, this.state.BoardList.deployLwSolAdmin, useraddr).then((datas) => {
        let dataList = datas.topicArr;
        //console.log('获取到结果',datas);
        this.setState({
          dataList: dataList,
          userAddr: useraddr,
          user:user,
           isOwner: datas.isOwner, 
          /* isOwner: 1, */
          refreshState: dataList.length < 1 || typeof (dataList) == "undefined" ? RefreshState.EmptyData : RefreshState.Idle,
        })
        this._renderJieSuan();
      })
    })
  }

  onFooterRefresh = () => {
    this.setState({ refreshState: RefreshState.FooterRefreshing })
    MainLogic.getTopicList(0, 0, this.state.BoardList.subChainAddress, this.state.BoardList.rpcIp).then((datas) => {
      let dataList = [...this.state.dataList, ...datas];
      this.setState({
        dataList: dataList,
        refreshState: dataList.length < 1 ? RefreshState.EmptyData : RefreshState.Idle,
      })
    })
  }

  keyExtractor = (item, index) => {
    return index.toString();
  }

  _renderHuiFu(hash){
    LoginLogic.getUserByUserAddr(this.state.userAddr).then(res=>{
    
      if (res == null || typeof (res) == 'undefined') {

        Toast.fail(i18n.t('FAIL.no_available_export_keyStore'));
      }
      else{
        MainLogic.updateContentStatus(res.userAddr,res.userPwd,res.keystore,this.state.BoardList.subChainAddress, this.state.BoardList.rpcIp,hash,0,1).then(data=>{
          if(data==1)
          {
            Toast.success(i18n.t('SUCCESS.recover_success'));
            this.onHeaderRefresh();
          }
          else
          {
            Toast.fail(i18n.t('FAIL.recover_request_fail'));
          }
        })
      }
    })
  }

  _renderPingBi(hash){
    LoginLogic.getUserByUserAddr(this.state.userAddr).then(res=>{
      if (res == null || typeof (res) == 'undefined') {

        Toast.fail(i18n.t('FAIL.no_available_export_keyStore'));
      }
      else{
        MainLogic.updateContentStatus(res.userAddr,res.userPwd,res.keystore,this.state.BoardList.subChainAddress, this.state.BoardList.rpcIp,hash,1,1).then(data=>{
          if(data==1)
          {
            Toast.success(i18n.t('SUCCESS.block_success'));
            this.onHeaderRefresh();
          }
          else
          {
            Toast.fail(i18n.t('FAIL.block_request_fail'));
          }
        })
      }
    })

  }

  _rulePress(type){
      this.setState({showLoading:true});
      MainLogic.getBoardRule(type).then(data=>{
        this.setState({showLoading:false});
        this.navigator.push({view: <LianWenRule  ruleContent={data}/>});
      })
  }


  renderPage() {
    return (
      <View style={styles.container}>
        <ListRow title='' icon={require('../../styles/menu/wen.png')} titleStyle={{ color: '#00A29A', fontSize: 18 }}  
			detail={
				 <View style={styles.listViewStyle}>   
          
					 {/* <TouchableOpacity style={{marginLeft:10}}  onPress={()=>this.navigator.push({view:<LianWenRule /> })}> */}
					 <TouchableOpacity style={{marginLeft:10}}  onPress={this._rulePress.bind(this, this.state.BoardList.picPath)}>
						<Text style={{color:'#00A29A'}}>{this.state.BoardList.boardName} {i18n.t('DECLARATION.ruleinfo')}</Text>
					</TouchableOpacity>
				</View>}
		/>
        <RefreshListView
          data={this.state.dataList}
          keyExtractor={this.keyExtractor}
          renderItem={this._renderRow.bind(this)}
          refreshState={this.state.refreshState}
          onHeaderRefresh={this.onHeaderRefresh}
          //onFooterRefresh={this.onFooterRefresh}

          // 可选
              footerRefreshingText ={i18n.t('INFO.footerRefreshingText')}
              footerFailureText ={i18n.t('INFO.footerFailureText')}
              footerNoMoreDataText ={i18n.t('INFO.footerNoMoreDataText')}
              footerEmptyDataText ={i18n.t('INFO.footerEmptyDataText')}
        />
      </View>
    );


  }
  /*   
      //生成随机ID：GUID
  genId(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      }).toUpperCase();
   } */

  _getInervalMinute(startDate, endDate) {
    var ms = endDate.getTime() - startDate.getTime();
    if (ms < 0) return 0;
    return Math.floor(ms / 1000 / 60);
  }

  // 每次手动刷新都会autoCheck
  // _renderJieSuan(callback) {
  //   console.log('开始结算');
  //         LoginLogic.getCurrentUser().then((user) => {
  //           //  console.log('结算user', user);

  //           if (user != null && typeof (user) != "undefined" && user.online) {
  //             let userAddr = user.userAddr;
  //             LoginLogic.getUserByUserAddr(userAddr).then((userInfo) => {
  //               // console.log('结算usserInfo', userInfo);

  //               MainLogic.autoCheck(userAddr, userInfo.userPwd, userInfo.keystore, this.state.BoardList.subChainAddress, this.state.BoardList.rpcIp)
  //                 .then((resdata) => {
  //                   //console.log('结算返回',resdata);
  //                   if (resdata == 1) {
  //                     global.checktime = new Date();
  //                     // console.log('结算成功');

  //                   }

  //                   //停止掉
  //                   clearInterval(this.timer);
  //                   this.timer = undefined;

  //                 })
  //             })
  //           }
  //           else {
  //             this.setState({ showLoading: false });
  //             Toast.fail(i18n.t('FAIL.not_logged_in'));
  //           }
  //         })

  // }



  // 自动执行autoCheck，只开启一个定时任务，每到时间点自动执行autoCheck
  // _renderJieSuan(callback) {
  //   if (this.state.autoCheckFlag == 0) {
  //     this.state.autoCheckFlag++;
  //   } else {
  //     return;
  //   }
  //   //var  flag = 0;
    
  //   //var isdoing = false;
  //   this.timer = setInterval(() => {
  //     // console.log(flag++);
  //     // if (!isdoing) {
  //     //   isdoing = true;


  //       var canCheck = false;
  //       if (typeof (global.checktime) == 'undefined') {
  //         canCheck = true;
  //       }
  //       else {
  //         var now = new Date();
  //         var timeInterval = this._getInervalMinute(global.checktime, now);
  //         if (timeInterval >= this.state.autoCheckDuration) {   // 设置时间间隔
  //           canCheck = true;
  //         }
  //       }


  //       if (canCheck) {
  //         console.log('开始结算');
  //         LoginLogic.getCurrentUser().then((user) => {

  //           if (user != null && typeof (user) != "undefined" && user.online) {
  //             let userAddr = user.userAddr;
  //             LoginLogic.getUserByUserAddr(userAddr).then((userInfo) => {

  //               MainLogic.autoCheck(userAddr, userInfo.userPwd, userInfo.keystore, this.state.BoardList.subChainAddress, this.state.BoardList.rpcIp)
  //                 .then((resdata) => {
  //                   if (resdata == 1) {
  //                     global.checktime = new Date();

  //                   }

  //                   //停止掉
  //                   // clearInterval(this.timer);
  //                   // this.timer = undefined;

  //                 })
  //             })
  //           }
  //           else {
  //             this.setState({ showLoading: false });
  //             Toast.fail(i18n.t('FAIL.not_logged_in'));
  //           }
  //         })


  //       }
  //    // }
  //   }, 1000);

  // }

  // 用户手动刷新触发autoCheck，只开启一个定时任务，设置间隔时间（避免频繁执行autoCheck交易）
  // 例如设置时间间隔为1分钟，每次超过1分钟后，什么时候用户刷新页面什么时候就触发autoCheck
  _renderJieSuan(callback) {
    if (this.state.checktime != undefined) {
      console.log(this._getInervalMinute(this.state.checktime, new Date()));
    }
    
    // 第一次进来执行autoCheck, 之后每次手动刷新校验时间，大于autoCheckDuration就进行autoCheck
    if (this.state.checktime == undefined || this._getInervalMinute(this.state.checktime, new Date()) >= this.state.autoCheckDuration){  
      // if (this.state.autoCheckFlag == 0) {
      //   this.state.autoCheckFlag++;
      // }
      console.log('开始结算');
      LoginLogic.getCurrentUser().then((user) => {

        if (user != null && typeof (user) != "undefined" && user.online) {
          let userAddr = user.userAddr;
          LoginLogic.getUserByUserAddr(userAddr).then((userInfo) => {

            MainLogic.autoCheck(userAddr, userInfo.userPwd, userInfo.keystore, this.state.BoardList.subChainAddress, this.state.BoardList.rpcIp)
              .then((resdata) => {
                if (resdata == 1) {
                  this.state.checktime = new Date();
                }

              })
          })
        }
        else {
          this.setState({ showLoading: false });
          Toast.fail(i18n.t('FAIL.not_logged_in'));
        }
      })
    }


    // if (this.state.autoCheckFlag == 0) {
    //   this.state.autoCheckFlag++;
    // } else {
    //   return;
    // }
    // var  flag = 0;
    
    // var isdoing = false;
    // this.timer = setInterval(() => {
    //   console.log(flag++);
    //   if (!isdoing) {
    //     isdoing = true;


    //     var canCheck = false;
    //     if (typeof (global.checktime) == 'undefined') {
    //       console.log("undefined=========");
    //       canCheck = true;
    //     }
    //     else {
    //       var now = new Date();
    //       var timeInterval = this._getInervalMinute(global.checktime, now);
    //       console.log("timeInterval=========" + timeInterval);
    //       if (timeInterval >= 1) {
    //         canCheck = true;
    //       }
    //     }


    //     if (canCheck) {
    //       console.log('开始结算');
    //       LoginLogic.getCurrentUser().then((user) => {

    //         if (user != null && typeof (user) != "undefined" && user.online) {
    //           let userAddr = user.userAddr;
    //           LoginLogic.getUserByUserAddr(userAddr).then((userInfo) => {

    //             MainLogic.autoCheck(userAddr, userInfo.userPwd, userInfo.keystore, this.state.BoardList.subChainAddress, this.state.BoardList.rpcIp)
    //               .then((resdata) => {
    //                 if (resdata == 1) {
    //                   global.checktime = new Date();
    //                 }

    //                 //停止掉定时任务
    //                 clearInterval(this.timer);
    //                 this.timer = undefined;

    //               })
    //           })
    //         }
    //         else {
    //           this.setState({ showLoading: false });
    //           Toast.fail(i18n.t('FAIL.not_logged_in'));
    //         }
    //       })


    //     }
    //   }
    // }, 1000);

  }

  // 列表 Item
  _renderRow(row) {
    let rowData = row.item;
    var slength = rowData.topicHash.length;
    var num = Math.floor(Math.random() * 4 + 1);
    var img = img_arr['png' + num.toString()];
    /* var resultStr = rowData.topicHash.substr(0,4)+'..............'+rowData.topicHash.substr(slength-4,4); */
    var resultStr = rowData.topicHash;

    var allcount = this.state.dataList.length;
    if (this.state.isOwner == 1) {
      if (allcount > 0 && row.index == allcount - 1) {
        return (
          <View>
            <ListRow
              title={
                <View style={styles.rightTopViewStyle}>
                  {/*  <Image source={require('../../styles/png/topicadress.png')} style={{ width: 20, height: 20 }} /> */}
                  <Text selectable={true} style={{ marginRight: 5, fontSize: 9, color: '#999899', height: 15 }}  >{resultStr}</Text>
                  {/*  <Text>{rowData.topRightInfo}</Text> */}
                </View>
              }
              detail={

                <View style={styles.listViewStyle}>
                  <View style={{ marginRight: 2 }}>
                    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.navigator.push({ view: <QuestionDetail data={rowData} user={this.state.user} BoardList={this.state.BoardList} /> })}>
                      <View >
                        <Image source={img} style={{ margin: 7, width: 60, height: 60 }} />
                      </View>

                      {/*右边*/}
                      <View style={[styles.rightViewStyle]}>
                        <Text style={{ color: 'gray', lineHeight: 20, marginRight: 70 }} numberOfLines={2}  >{rowData.desc}</Text>
                        <View style={styles.rightBottomViewStyle}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../styles/png/time.png')} style={{ width: 20, height: 20 }} />
                            <Text style={{ color: 'red' }}>{rowData.duration}</Text>
                          </View>
                          {/*  <Text style={{color:'red'}}>时间:{rowData.duration}</Text> */}
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 100 }}>
                            <Image source={require('../../styles/png/coin.png')} style={{ width: 15, height: 15 }} />
                            <Text style={{ color: 'red', marginLeft: 3 }}>{rowData.award}coin</Text>
                          </View>

                        </View>
                      </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: 80 }} />
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 1, }}>
                        {/*  <Image source={require('../../styles/mine/me.png')} style={{ width: 12, height: 12 }} /> */}
                        <Text selectable={true} style={{ fontSize: 10, color: '#999899', height: 15 }} >{rowData.owner}</Text>
                        {/*  <Text>{rowData.topRightInfo}</Text> */}
                      </View>
                    </View>

                  </View>


                </View>
              }


              swipeActions={
                [
                <ListRow.SwipeActionButton title={i18n.t('ACTION.recover')}  onPress={() => this._renderHuiFu(resultStr)} />,
                <ListRow.SwipeActionButton title={i18n.t('ACTION.block')} type='danger' onPress={() => this._renderPingBi(resultStr)}/>,
              ]}

              titlePlace='top'

            />
            <View style={{ width: width, height: 10 }}>
              <View style={{ width: width, height: 1, backgroundColor: 'rgba(180,176,173,1.0)' }}></View>
              <View style={{ width: width, height: 1, backgroundColor: 'rgba(180,176,173,0.9)' }}></View>
              <View style={{ width: width, height: 1, backgroundColor: 'rgba(180,176,173,0.8)' }}></View>
              <View style={{ width: width, height: 1, backgroundColor: 'rgba(180,176,173,0.7)' }}></View>
              <View style={{ width: width, height: 1, backgroundColor: 'rgba(180,176,173,0.6)' }}></View>
              <View style={{ width: width, height: 1, backgroundColor: 'rgba(180,176,173,0.5)' }}></View>
              <View style={{ width: width, height: 1, backgroundColor: 'rgba(180,176,173,0.4)' }}></View>
              <View style={{ width: width, height: 1, backgroundColor: 'rgba(180,176,173,0.3)' }}></View>
              <View style={{ width: width, height: 1, backgroundColor: 'rgba(180,176,173,0.2)' }}></View>
              <View style={{ width: width, height: 1, backgroundColor: 'rgba(180,176,173,0.1)' }}></View>
            </View>


          </View>
        );
      }

      //let id = this.genId();
      return (

        <ListRow
          title={
            <View style={styles.rightTopViewStyle}>
              {/*  <Image source={require('../../styles/png/topicadress.png')} style={{ width: 20, height: 20 }} /> */}
              <Text selectable={true} style={{ marginRight: 5, fontSize: 9, color: '#999899', height: 15 }}  >{resultStr}</Text>
              {/*  <Text>{rowData.topRightInfo}</Text> */}
            </View>
          }
          detail={

            <View style={styles.listViewStyle}>
              <View style={{ marginRight: 2 }}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.navigator.push({ view: <QuestionDetail data={rowData} user={this.state.user} BoardList={this.state.BoardList} /> })}>
                  <View >
                    <Image source={img} style={{ margin: 7, width: 60, height: 60 }} />
                  </View>

                  {/*右边*/}
                  <View style={[styles.rightViewStyle]}>
                    <Text style={{ color: 'gray', lineHeight: 20, marginRight: 70 }} numberOfLines={2}  >{rowData.desc}</Text>
                    <View style={styles.rightBottomViewStyle}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../../styles/png/time.png')} style={{ width: 20, height: 20 }} />
                        <Text style={{ color: 'red' }}>{rowData.duration}</Text>
                      </View>
                      {/*  <Text style={{color:'red'}}>时间:{rowData.duration}</Text> */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 100 }}>
                        <Image source={require('../../styles/png/coin.png')} style={{ width: 15, height: 15 }} />
                        <Text style={{ color: 'red', marginLeft: 3 }}>{rowData.award}coin</Text>
                      </View>

                    </View>
                  </View>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: 80 }} />
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 1, }}>
                    {/*  <Image source={require('../../styles/mine/me.png')} style={{ width: 12, height: 12 }} /> */}
                    <Text selectable={true} style={{ fontSize: 10, color: '#999899', height: 15 }} >{rowData.owner}</Text>
                    {/*  <Text>{rowData.topRightInfo}</Text> */}
                  </View>
                </View>

              </View>


            </View>
          }
          swipeActions={
            [
            <ListRow.SwipeActionButton title={i18n.t('ACTION.recover')}  onPress={() => this._renderHuiFu(resultStr)} />,
            <ListRow.SwipeActionButton title={i18n.t('ACTION.block')} type='danger' onPress={() => this._renderPingBi(resultStr)}/>,
          ]}
          titlePlace='top'
        />


      );
    }
    else {
      if (allcount > 0 && row.index == allcount - 1) {
        return (
          <View>
            <ListRow
              title={
                <View style={styles.rightTopViewStyle}>
                  {/*  <Image source={require('../../styles/png/topicadress.png')} style={{ width: 20, height: 20 }} /> */}
                  <Text selectable={true} style={{ marginRight: 5, fontSize: 9, color: '#999899', height: 15 }}  >{resultStr}</Text>
                  {/*  <Text>{rowData.topRightInfo}</Text> */}
                </View>
              }
              detail={

                <View style={styles.listViewStyle}>
                  <View style={{ marginRight: 2 }}>
                    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.navigator.push({ view: <QuestionDetail data={rowData} user={this.state.user} BoardList={this.state.BoardList} /> })}>
                      <View >
                        <Image source={img} style={{ margin: 7, width: 60, height: 60 }} />
                      </View>

                      {/*右边*/}
                      <View style={[styles.rightViewStyle]}>
                        <Text style={{ color: 'gray', lineHeight: 20, marginRight: 70 }} numberOfLines={2}  >{rowData.desc}</Text>
                        <View style={styles.rightBottomViewStyle}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../styles/png/time.png')} style={{ width: 20, height: 20 }} />
                            <Text style={{ color: 'red' }}>{rowData.duration}</Text>
                          </View>
                          {/*  <Text style={{color:'red'}}>时间:{rowData.duration}</Text> */}
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 100 }}>
                            <Image source={require('../../styles/png/coin.png')} style={{ width: 15, height: 15 }} />
                            <Text style={{ color: 'red', marginLeft: 3 }}>{rowData.award}coin</Text>
                          </View>

                        </View>
                      </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: 80 }} />
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 1, }}>
                        {/*  <Image source={require('../../styles/mine/me.png')} style={{ width: 12, height: 12 }} /> */}
                        <Text selectable={true} style={{ fontSize: 10, color: '#999899', height: 15 }} >{rowData.owner}</Text>
                        {/*  <Text>{rowData.topRightInfo}</Text> */}
                      </View>
                    </View>
                  </View>
                </View>
              }
              titlePlace='top'

            />
          
        <View style={{width:width,height:10}}>
        <View style={{width:width,height:1,backgroundColor:'rgba(180,176,173,1.0)'}}></View>
        <View style={{width:width,height:1,backgroundColor:'rgba(180,176,173,0.9)'}}></View>
        <View style={{width:width,height:1,backgroundColor:'rgba(180,176,173,0.8)'}}></View>
        <View style={{width:width,height:1,backgroundColor:'rgba(180,176,173,0.7)'}}></View>
        <View style={{width:width,height:1,backgroundColor:'rgba(180,176,173,0.6)'}}></View>
        <View style={{width:width,height:1,backgroundColor:'rgba(180,176,173,0.5)'}}></View>
        <View style={{width:width,height:1,backgroundColor:'rgba(180,176,173,0.4)'}}></View>
        <View style={{width:width,height:1,backgroundColor:'rgba(180,176,173,0.3)'}}></View>
        <View style={{width:width,height:1,backgroundColor:'rgba(180,176,173,0.2)'}}></View>
        <View style={{width:width,height:1,backgroundColor:'rgba(180,176,173,0.1)'}}></View>
        </View> 

        </View>
        );
      }

      //let id = this.genId();
      return (

        <ListRow
          title={
            <View style={styles.rightTopViewStyle}>
              {/*  <Image source={require('../../styles/png/topicadress.png')} style={{ width: 20, height: 20 }} /> */}
              <Text selectable={true} style={{ marginRight: 5, fontSize: 9, color: '#999899', height: 15 }}  >{resultStr}</Text>
              {/*  <Text>{rowData.topRightInfo}</Text> */}
            </View>
          }
          detail={

            <View style={styles.listViewStyle}>
              <View style={{ marginRight: 2 }}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.navigator.push({ view: <QuestionDetail data={rowData} user={this.state.user} BoardList={this.state.BoardList} /> })}>
                  <View >
                    <Image source={img} style={{ margin: 7, width: 60, height: 60 }} />
                  </View>

                  {/*右边*/}
                  <View style={[styles.rightViewStyle]}>
                    <Text style={{ color: 'gray', lineHeight: 20, marginRight: 70 }} numberOfLines={2}  >{rowData.desc}</Text>
                    <View style={styles.rightBottomViewStyle}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../../styles/png/time.png')} style={{ width: 20, height: 20 }} />
                        <Text style={{ color: 'red' }}>{rowData.duration}</Text>
                      </View>
                      {/*  <Text style={{color:'red'}}>时间:{rowData.duration}</Text> */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 100 }}>
                        <Image source={require('../../styles/png/coin.png')} style={{ width: 15, height: 15 }} />
                        <Text style={{ color: 'red', marginLeft: 3 }}>{rowData.award}coin</Text>
                      </View>

                    </View>
                  </View>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: 80 }} />
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 1, }}>
                    {/*  <Image source={require('../../styles/mine/me.png')} style={{ width: 12, height: 12 }} /> */}
                    <Text selectable={true} style={{ fontSize: 10, color: '#999899', height: 15 }} >{rowData.owner}</Text>
                    {/*  <Text>{rowData.topRightInfo}</Text> */}
                  </View>
                </View>

              </View>


            </View>
          }
          titlePlace='top'
        />


      );
    }
  }
}


// 样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  // 头部样式
  header: {
    paddingTop: 2,
    paddingBottom: 12,
    //backgroundColor: '#ee735c',
  },
  // 头部title样式
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600'
  },
  // 菊花图
  loadingMore: {
    marginVertical: 20
  },
  // 文案样式
  loadingText: {
    color: '#777',
    textAlign: 'center'
  },
  listViewStyle: {
    backgroundColor: 'white',
    flexDirection: 'column',
    /* // 全体边框宽度
    borderWidth: 1,
    // 全体边框颜色
    borderColor: '#40BDFF',
    // 全体边框圆角
    borderRadius: 3, */
    //borderRightWidth: 5,
    /*    borderTopWidth: 1,
       borderTopColor: '#E6E6E6',
       borderBottomColor: '#E6E6E6',
       borderBottomWidth: 1, */
    //marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    //paddingBottom: 15,

  },

  imageViewStyle: {
    width: 120,
    height: 90
  },

  rightViewStyle: {
    marginRight: 2,
    marginLeft: 2,
    //width:220,
    justifyContent: 'center'
  },


  rightTopViewStyle: {
    flexDirection: 'row',
    marginBottom: 7,
    /*  borderBottomColor:'#E6E6E6',
     borderBottomWidth:1 */

    //justifyContent: 'space-between',
    //backgroundColor: '#40BDFF'
    //backgroundColor:'#397BB8'
  },

  rightBottomViewStyle: {
    flexDirection: 'row',
    marginTop: 7,

  }
});
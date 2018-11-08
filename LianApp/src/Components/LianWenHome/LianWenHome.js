
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


import MainLogic from '../../logic/MainLogic';
import LoginLogic from '../../logic/LoginLogic';

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
    title: '链问',
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
      isOwner: 0
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

        Toast.fail('未获取到keyStore值，请切换keyStore登录');
      }
      else{
        MainLogic.updateContentStatus(res.userAddr,res.userPwd,res.keystore,this.state.BoardList.subChainAddress, this.state.BoardList.rpcIp,hash,0,1).then(data=>{
          if(data==1)
          {
            Toast.success('恢复成功');
            this.onHeaderRefresh();
          }
          else
          {
            Toast.fail('请求恢复失败');
          }
        })
      }
    })
  }

  _renderPingBi(hash){
    LoginLogic.getUserByUserAddr(this.state.userAddr).then(res=>{
      if (res == null || typeof (res) == 'undefined') {

        Toast.fail('未获取到keyStore值，请切换keyStore登录');
      }
      else{
        MainLogic.updateContentStatus(res.userAddr,res.userPwd,res.keystore,this.state.BoardList.subChainAddress, this.state.BoardList.rpcIp,hash,1,1).then(data=>{
          if(data==1)
          {
            Toast.success('屏蔽成功');
            this.onHeaderRefresh();
          }
          else
          {
            Toast.fail('请求屏蔽失败');
          }
        })
      }
    })

  }

  renderPage() {
    return (
      <View style={styles.container}>
        <ListRow title='' icon={require('../../styles/menu/wen.png')} titleStyle={{ color: '#00A29A', fontSize: 18 }} />
        <RefreshListView
          data={this.state.dataList}
          keyExtractor={this.keyExtractor}
          renderItem={this._renderRow.bind(this)}
          refreshState={this.state.refreshState}
          onHeaderRefresh={this.onHeaderRefresh}
          //onFooterRefresh={this.onFooterRefresh}

          // 可选
          footerRefreshingText='玩命加载中 >.<'
          footerFailureText='我擦嘞，居然失败了 =.=!'
          footerNoMoreDataText='-我是有底线的-'
          footerEmptyDataText='-好像什么东西都没有-'
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


  _renderJieSuan(callback) {

    var isdoing = false;
    this.timer = setInterval(() => {
      if (!isdoing) {
        isdoing = true;


        var canCheck = false;
        if (typeof (global.checktime) == 'undefined') {
          canCheck = true;

        }
        else {
          var now = new Date();
          var timeInterval = this._getInervalMinute(global.checktime, now);
          if (timeInterval > 5) {
            canCheck = true;
          }
        }


        if (canCheck) {
          console.log('开始结算');
          LoginLogic.getCurrentUser().then((user) => {
            //  console.log('结算user', user);

            if (user != null && typeof (user) != "undefined" && user.online) {
              let userAddr = user.userAddr;
              LoginLogic.getUserByUserAddr(userAddr).then((userInfo) => {
                // console.log('结算usserInfo', userInfo);

                MainLogic.autoCheck(userAddr, userInfo.userPwd, userInfo.keystore, this.state.BoardList.subChainAddress, this.state.BoardList.rpcIp)
                  .then((resdata) => {
                    //console.log('结算返回',resdata);
                    if (resdata == 1) {
                      global.checktime = new Date();
                      // console.log('结算成功');

                    }

                    //停止掉
                    clearInterval(this.timer);
                    this.timer = undefined;

                  })
              })
            }
            else {
              this.setState({ showLoading: false });
              Toast.fail('请先登录');
            }
          })


        }
      }
    }, 1000);




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
                <ListRow.SwipeActionButton title='恢复'  onPress={() => this._renderHuiFu(resultStr)} />,
                <ListRow.SwipeActionButton title='屏蔽' type='danger' onPress={() => this._renderPingBi(resultStr)}/>,          
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
            <ListRow.SwipeActionButton title='恢复'  onPress={() => this._renderHuiFu(resultStr)} />,
            <ListRow.SwipeActionButton title='屏蔽' type='danger' onPress={() => this._renderPingBi(resultStr)}/>,          
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
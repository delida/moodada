
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
import LianWenGroup from './LianWenGroup';
import Scroller from '../CommonComp/Scroller';
import LianWenSettlement from './LianWenSettlement';
//import LianWenSettlement from './LianWenSettlement';

import LianWenHomeTopView from './LianWenHomeTopView';
var { width, height } = Dimensions.get('window')
import LoginLogic from '../../logic/LoginLogic';
import LocalLogin from '../LoginView/LocalLogin';
import MainLogic from '../../logic/MainLogic';

import RefreshListView, { RefreshState } from 'react-native-refresh-list-view'


// 缓存列表中所有数据
let cachedResults = {
  nextPage: 1, // 下一页
  items: [], // listview 数据
  total: 0 // 总数
};

const img_arr = {
  png1: require('../../styles/menu/wen1.png'),
  png2: require('../../styles/menu/wen2.png'),
  png3: require('../../styles/menu/wen3.png'),
  png4: require('../../styles/menu/wen4.png'),
}

export default class MyLianWenList extends NavigationPage {

  static defaultProps = {
    ...NavigationPage.defaultProps,
    title: '提问录',
    showBackButton: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      dataList: [],
      refreshState: RefreshState.Idle,
      isload: false,
      userAddr: '',
      BoardList: this.props.BoardList
    }

  }

      
  renderNavigationTitle() {
    var you = "→"+this.state.BoardList.boardName;
    return  `${this.props.title}${you}`
    }

  _loginstate() {

    LoginLogic.getCurrentUser().then((user) => {
      //console.log('user',user);
      if (user != null && typeof (user) != "undefined") {
        let result = user.online;
        this.setState({
          isload: result,
          logintitle: (result ? '退出登陆' : '登陆'),
          userAddr: user.userAddr,
        });
        if (!result) {
          this.navigator.push({ view: <LocalLogin /> })
        }
        else {
          this._getMyQuestionList(1);
        }
      }
    })
  }
  keyExtractor = (item, index) => {
    return index.toString();
  }

  renderPage() {
    return (
      <View style={styles.container}>
        {/*顶部标题栏*/}
        {/*   <View style={styles.header}>
             <ListRow />
            </View> */}
        {/*列表数据*/}
        <RefreshListView
          data={this.state.dataList}
          keyExtractor={this.keyExtractor}
          renderItem={this._renderRow.bind(this)}
          refreshState={this.state.refreshState}
          onHeaderRefresh={this.onHeaderRefresh}
          // onFooterRefresh={this.onFooterRefresh}

          // 可选
          footerRefreshingText='玩命加载中 >.<'
          footerFailureText='我擦嘞，居然失败了 =.=!'
          footerNoMoreDataText='-我是有底线的-'
          footerEmptyDataText='-好像什么东西都没有-'
        />
      </View>
    );
  }

  componentWillMount() {
    this.onHeaderRefresh()
  }


  onHeaderRefresh = () => {
    this.setState({ refreshState: RefreshState.HeaderRefreshing })
    this._getMyQuestionList();
  }

  onFooterRefresh = () => {
    this.setState({ refreshState: RefreshState.FooterRefreshing })
    this._getMyQuestionList();
  }



  _getMyQuestionList(page) {

    LoginLogic.getCurrentUser().then((user) => {
      //console.log('我的链问列表user', user);
     
      if (user != null && typeof (user) != "undefined" && user.online) {
        let userAddr = user.userAddr;
        LoginLogic.getUserByUserAddr(userAddr).then((userInfo) => {
          // console.log('我的链问列表usserInfo', userInfo);
          MainLogic.getMyQuestion(userAddr, this.state.BoardList.subChainAddress, userInfo.userPwd, userInfo.keystore, this.state.BoardList.rpcIp, this.state.BoardList.deployLwSolAdmin).then((datas) => {
            //  console.log('我的链问列表返回值',datas);
            let dataList = datas;
            this.setState({
              dataList: dataList,
              refreshState: dataList.length < 1 ? RefreshState.EmptyData : RefreshState.Idle,
            })
          })
        })
      }
      else {
        this.setState({ showLoading: false });
        Toast.fail('请先登录');
      }
    })



  }


   // 列表 Item
   _renderRow(row) {
    let rowData = row.item;
    var slength = rowData.topicHash.length;
    var num = Math.floor(Math.random() * 4 + 1);
    var img = img_arr['png' + num.toString()];
    /* var resultStr = rowData.topicHash.substr(0,4)+'..............'+rowData.topicHash.substr(slength-4,4); */
    var resultStr = rowData.topicHash;
    //let id = this.genId();

    var allcount = this.state.dataList.length;
    if(allcount>0&&row.index==allcount-1){
      return(
        <View style={{borderWidth:0}}>
            <ListRow 
      title={
        <View style={styles.rightTopViewStyle}>
        {/*  <Image source={require('../../styles/png/topicadress.png')} style={{ width: 20, height: 20 }} /> */}
        <Text selectable={true} style={{ marginRight: 5, fontSize: 9,color: '#999899', height: 15 }}  >{resultStr}</Text>
        {/*  <Text>{rowData.topRightInfo}</Text> */}
      </View>
      }
      detail={

        <View style={styles.listViewStyle}>

      
        <View style={{ marginRight: 2 }}>
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.navigator.push({ view: <LianWenSettlement data={rowData} BoardList={this.state.BoardList} /> })}>
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
                  <Text style={{ color: 'red',marginLeft:3 }}>{rowData.award} coin</Text>
                </View>

              </View>
            </View>
          </TouchableOpacity>
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

    return (

      <ListRow 
      title={
        <View style={styles.rightTopViewStyle}>
        {/*  <Image source={require('../../styles/png/topicadress.png')} style={{ width: 20, height: 20 }} /> */}
        <Text selectable={true} style={{ marginRight: 5, fontSize: 9,color: '#999899', height: 15 }}  >{resultStr}</Text>
        {/*  <Text>{rowData.topRightInfo}</Text> */}
      </View>
      }
      detail={

        <View style={styles.listViewStyle}>

      
        <View style={{ marginRight: 2 }}>
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.navigator.push({ view: <LianWenSettlement data={rowData} BoardList={this.state.BoardList} /> })}>
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
                  <Text style={{ color: 'red',marginLeft:3 }}>{rowData.award} coin</Text>
                </View>

              </View>
            </View>
          </TouchableOpacity>
        </View>


      </View>
      }
      titlePlace='top'
      />

    
    );
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
   /*  borderTopWidth: 1,
    borderTopColor: '#E6E6E6',
    borderBottomColor: '#E6E6E6',
    borderBottomWidth: 1, */
   /*  marginTop: 5, */
    marginLeft: 5,
    marginRight: 5,
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
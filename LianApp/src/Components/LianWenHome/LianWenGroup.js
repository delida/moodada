
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


import {Theme, NavigationButton, NavigationPage, BasePage, ListRow, TabView, Label, PullPicker} from 'teaset';
import LianWenGroup from './LianWenGroup';
import Scroller from '../CommonComp/Scroller';
import QuestionDetail from './QuestionDetail';
import i18n from '../../../i18n/i18n';

import LianWenHomeTopView from './LianWenHomeTopView';
var {width, height}=Dimensions.get('window')

import MainLogic from '../../logic/MainLogic';

// 缓存列表中所有数据
let cachedResults = {
    nextPage: 1, // 下一页
    items: [], // listview 数据
    total: 0 // 总数
  };
  
export default class MyLianWenList extends NavigationPage {

    static defaultProps = {
      ...NavigationPage.defaultProps,
      title: i18n.t('LianWenHome.lianWenGroup.module_group'),
      showBackButton: true,
    };
  
    constructor(props)
    {
        super(props);
        let ds = new ListView.DataSource({
            // 比较两条数据是否是一样的,来判断数据是否发生改变
            rowHasChanged: (r1, r2) => r1 !== r2
          });
          this.state = {
            dataSource: ds.cloneWithRows([]),
            isLoadingTail: false, // loading?
            isRefreshing: false // refresh?
          }
        
    }

    renderPage() {
        return (
            <View style={styles.container}>
            {/*顶部标题栏*/}
            <View style={styles.header}>
             <ListRow title={this.props.topic}/>
            </View>
            {/*列表数据*/}
            <Scroller
              // 数据源
              dataSource={this.state.dataSource}
              // 渲染item(子组件)
              renderRow={this._renderRow.bind(this)}
              // 是否可以刷新
              isRefreshing={this.state.isRefreshing}
              // 是否可以加载更多
              isLoadingTail={this.state.isLoadingTail}
              // 请求数据
              fetchData={this._getTopicList.bind(this)}
              // 缓存列表数据
              cachedResults={cachedResults}
            />
          </View>
        );
    }
  
  // 生命周期-组件挂载完毕 请求数据
  componentDidMount() {
    this._getTopicList(1);
  }
 
  // 请求数据
  _getTopicList(page){
    let that = this;
    if (page !== 0) { // 加载更多操作
      this.setState({
        isLoadingTail: true
      });
    } else { // 刷新操作
      this.setState({
        isRefreshing: true
      });
      // 初始哈 nextPage
      cachedResults.nextPage = 1;
    }
    MainLogic.getTopicListByModule(page,0,this.props.topic).then((datas)=>{
      let items = cachedResults.items.slice();
      if (page !== 0) { // 加载更多操作
        // 数组拼接
        items = items.concat(datas);
        cachedResults.nextPage += 1;
      } else { // 刷新操作
        // 数据不变
        items = datas;
      }
      cachedResults.items = items; // 视频列表数据
      setTimeout(function () {
         if (page !== 0) { // 加载更多操作
           that.setState({
             isLoadingTail: false,
             dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
           });
         } else { // 刷次操作
           that.setState({
             isRefreshing: false,
             dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
           });
         }
       }, 1000);
    })
  }
 
  // 列表 Item
  _renderRow(row) {
    let rowData = row;
    return(

        <ListRow  detail={
            <View style={styles.listViewStyle}>
            {/*右边*/}
            <View style={[styles.rightViewStyle,{width:width-30}]}>
               <View style={styles.rightTopViewStyle}>
                 <Text>{rowData.topicHash}</Text>
                {/*  <Text>{rowData.topRightInfo}</Text> */}
               </View>
                <Text style={{color:'gray'}}>{rowData.desc}</Text>
                <View  style={styles.rightBottomViewStyle}>
                    <Text style={{color:'red'}}>时间:{rowData.duration}</Text>
                    <Text>悬赏:{rowData.award}coin</Text>
                </View>
            </View>
        </View>
        }
        titlePlace='top'
        onPress={() =>this.navigator.push({view: <QuestionDetail  data={rowData}/>})}
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
  listViewStyle:{
    backgroundColor:'white',
    padding:10,
  

    flexDirection:'row'
 },

 imageViewStyle:{
     width:120,
     height:90
 },

 rightViewStyle:{
     paddingRight:35,
     marginLeft:2,
     //width:220,
     justifyContent:'center'
 },

 rightTopViewStyle:{
     flexDirection:'row',
     marginBottom:7,
     justifyContent:'space-between'
 },

 rightBottomViewStyle:{
     flexDirection:'row',
     marginTop:7,
     justifyContent:'space-between'
 }
});
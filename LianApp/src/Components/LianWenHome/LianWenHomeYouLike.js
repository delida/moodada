/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ListView,
    Dimensions,
    TouchableOpacity
} from 'react-native';
const {width, height} = Dimensions.get('window');
// 导入外部的组件
import BottomCommonCell from './BottomCommonCell';
import i18n from '../../../i18n/i18n';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import QuestionDetail from './QuestionDetail';
import {Theme, TeaNavigator, NavigationPage, BasePage, ListRow, TabView, Label, PullPicker} from 'teaset';

// 导入外部的json数据
var youLikeData = require('../../LocalData/LianWenList.json');

export default class LianWenHomeYouLike extends NavigationPage{

    static defaultProps = {
        ...NavigationPage.defaultProps
      };

    constructor(props)
    {
        super(props);
        this.state = {
            dataList: [],
            refreshState: RefreshState.Idle,
          }
    }

    componentDidMount() {
        this.onHeaderRefresh()
      }
    
      onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing })
    
        // 模拟网络请求
        setTimeout(() => {
          // 模拟网络加载失败的情况
          if (Math.random() < 0.3) {
            this.setState({ refreshState: RefreshState.Failure })
            return
          }
    
          //获取测试数据
          let dataList = this.getTestList(true)
    
          this.setState({
            dataList: dataList,
            refreshState: dataList.length < 1 ? RefreshState.EmptyData : RefreshState.Idle,
          })
        }, 2000)
      }
    
      onFooterRefresh = () => {
        this.setState({ refreshState: RefreshState.FooterRefreshing })
    
        // 模拟网络请求
        setTimeout(() => {
          // 模拟网络加载失败的情况
          if (Math.random() < 0.2) {
            this.setState({ refreshState: RefreshState.Failure })
            return
          }
    
          //获取测试数据
          let dataList = this.getTestList(false)
    
          this.setState({
            dataList: dataList,
            refreshState: dataList.length > 50 ? RefreshState.NoMoreData : RefreshState.Idle,
          })
        }, 2000)
      }
    
      // 获取测试数据
      getTestList(isReload) {
       /*  let newList = youLikeData.map((data) => {
          return data;
        }) */
        let newList = youLikeData;
        return isReload ? (Math.random() < 0.2 ? [] : newList) : [...this.state.dataList, ...newList]
      }
    
      keyExtractor = (ite,index) => {
        return index.toString()
      }
    
      renderCell = (item) => {
        let rowData = item.item;
        return(
            <TouchableOpacity onPress={() =>this.navigator.push({view: <QuestionDetail  data={rowData}/>})}>
               <View style={styles.listViewStyle}>
                   {/*右边*/}
                   <View style={[styles.rightViewStyle,{width:width-35}]}>
                      <View style={styles.rightTopViewStyle}>
                        <Text>{rowData.topicHash}</Text>
                       {/*  <Text>{rowData.topRightInfo}</Text> */}
                      </View>
                       <Text style={{color:'gray'}}>{rowData.desc}</Text>
                       <View  style={styles.rightBottomViewStyle}>
                           <Text style={{color:'red'}}>{i18n.t('LianWenHome.lianWenHomeYouLike.award')}:{rowData.duration}</Text>
                           <Text>{i18n.t('LianWenHome.lianWenHomeYouLike.award')}:{rowData.award}coin</Text>
                       </View>
                   </View>
               </View>
            </TouchableOpacity>
        );
      }


     render() {
         return (
             <View style={styles.container}>
                 <BottomCommonCell
                     leftIcon='../../styles/icons/cnxh.png'
                     leftTitle={i18n.t('LianWenHome.lianWenHomeYouLike.latest_question')}
                 />
                 {/*列表*/}
                 <RefreshListView
                     data={this.state.dataList}
                     keyExtractor={this.keyExtractor}
                     renderItem={this.renderCell}
                     refreshState={this.state.refreshState}
                     onHeaderRefresh={this.onHeaderRefresh}
                     onFooterRefresh={this.onFooterRefresh}

                     // 可选
              footerRefreshingText ={i18n.t('INFO.footerRefreshingText')}
              footerFailureText ={i18n.t('INFO.footerFailureText')}
              footerNoMoreDataText ={i18n.t('INFO.footerNoMoreDataText')}
              footerEmptyDataText ={i18n.t('INFO.footerEmptyDataText')}
                 />
             </View>
         );
     }
 
   
}




const styles = StyleSheet.create({
    container: {
        marginTop:10
    },

    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },

    listViewStyle:{
       backgroundColor:'white',
       padding:10,
       borderBottomColor:'#e8e8e8',
       borderBottomWidth:0.5,

       flexDirection:'row'
    },

    imageViewStyle:{
        width:120,
        height:90
    },

    rightViewStyle:{
        marginLeft:8,
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



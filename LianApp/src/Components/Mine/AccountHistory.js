
'use strict';

import React, {Component} from 'react';
import {View, ScrollView,Platform,StyleSheet} from 'react-native';
import {Toast, TeaNavigator, NavigationPage, Badge, ListRow, TabView, Label} from 'teaset';
import { kong } from '../../CommonMethod';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view'
import CoinLogic from '../../logic/CoinLogic';

const chongzhi = require('../../styles/png/chongzhi256.png');
const tibi = require('../../styles/png/tibi256.png');


export default class AccountHistory extends NavigationPage{
    
    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: '提币充值记录',
        showBackButton: true,
      };

      
    constructor(props)
    {
        super(props);
        this.state={
            account:'',
            dataList: [],
            refreshState: RefreshState.Idle,
            BoardList:this.props.BoardList
        }
    }

        
  renderNavigationTitle() {
    var you = "→"+this.state.BoardList.boardName;
    return  `${this.props.title}${you}`
    }

    componentDidMount() {
        this.onHeaderRefresh()
      }

      sortBy(field1,field2) {
        return function(a,b) {
            if(a.field1 == b.field1) return a.field2 - b.field2;
            return a.field1 - b.field1;
        }
    }

      onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing })
        //var begin = new Date().getTime();
        CoinLogic.myHistoryList(0, 0, this.props.userAddr,this.state.BoardList.subChainAddress, this.state.BoardList.rpcIp).then((datas) => {
          let dataList = datas;
         // console.log('获取到结果',datas);

          let group = [];
          if(!kong(dataList))
          {
          if(!kong(dataList.enterList)&&dataList.enterList.length>0){
              let itemType = 1;
              for(var m = 0;m<dataList.enterList.length;m++){
                  var eitem = dataList.enterList[m];
                  eitem.itemType = itemType;
                  group.push(eitem);
              }
          }
          if(!kong(dataList.redeemList)&&dataList.redeemList.length>0){
            let itemType = 2;
            for(var m = 0;m<dataList.redeemList.length;m++){
                var eitem = dataList.redeemList[m];
                eitem.itemType = itemType;
                group.push(eitem);
            }
          }
          }
          
          if(!kong(group)&&group.length>0){
            group.sort((a,b)=>{return b.timeStr.localeCompare(a.timeStr)});
          }
          //var end = new Date().getTime();
         // var time = end - begin;
         // console.log("充值提币历史总消耗时间为=" + time);
           this.setState({
            dataList: group,
            refreshState: group.length < 1 || typeof (group) == "undefined" ? RefreshState.EmptyData : RefreshState.Idle,
          }) 
         
        })
      }

      keyExtractor = (item, index) => {
        return index.toString();
      }

       // 列表 Item
  _renderRow(row) {
    let rowData = row.item;
    let state = rowData.status == 1?(<Badge style={{backgroundColor: '#20D6A9'}} type='square' count='已完成' />):(<Badge style={{backgroundColor: '#5bc0de'}} type='square' count='进行中' />);
    let itemName = rowData.itemType == 1?'充值coin':'提币coin';
    let image = rowData.itemType == 1?chongzhi:tibi;
    let amount = rowData.itemType == 1?('+'+rowData.amount):('-'+rowData.amount);
    return (
        <ListRow title={<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}><Label text={itemName} type='title' style={{alignSelf:'flex-start'}} /><Label text={amount} type='title' style={{color:'red',alignSelf:'flex-end'}} /></View>} icon={image} detail={<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}><Label text={rowData.timeStr} type='title' />{state}</View>} topSeparator='full' titlePlace='top' titleStyle={{ color:'red',alignSelf:'flex-end'}} detailStyle={{alignSelf:'flex-end'}} />
    );
  }

      renderPage() {
        return (
          <View style={styles.container}>
           <ListRow title='账号地址' icon={require('../../styles/mine/accountinfo.png')} detail={this.props.userAddr} titlePlace='top' detailStyle={{fontSize:12}} />
            <View style={{height:5}}></View>
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
}


// 样式
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
      marginTop: Platform.OS == 'ios' ? 20 : 0,
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
      padding: 10,
  
  
      flexDirection: 'row'
    },
  
    imageViewStyle: {
      width: 120,
      height: 90
    },
  
    rightViewStyle: {
      paddingRight: 35,
      marginLeft: 2,
      //width:220,
      justifyContent: 'center'
    },
  
    rightTopViewStyle: {
      flexDirection: 'row',
      marginBottom: 7,
      justifyContent: 'space-between'
    },
  
    rightBottomViewStyle: {
      flexDirection: 'row',
      marginTop: 7,
      justifyContent: 'space-between'
    }
  });
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native';
const { width, height } = Dimensions.get('window');

import { NavigationPage, Theme, ListRow, Label, Toast } from 'teaset';


import MainLogic from '../../logic/MainLogic';
import LoginLogic from '../../logic/LoginLogic';

 /* import RefreshListView, { RefreshState } from 'react-native-refresh-list-view'  */
import RefreshListView, { RefreshState } from '../CommonComp/RefreshListView' 

import QuestionDetailItemForMy from './QuestionDetailItemForMy';
import QuestionDetailAddComment from './QuestionDetailAddComment';

// 缓存列表中所有数据
let cachedResults = {
    nextPage: 1, // 下一页
    items: [], // listview 数据
    total: 0 // 总数
};

const img_arr = {
    png1: require('../../styles/menu/a1.png'),
    png2: require('../../styles/menu/a2.png'),
    png3: require('../../styles/menu/a3.png'),
    png4: require('../../styles/menu/a4.png'),
  }

export default class LianWenSettlement extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: '提问评论列表',
        showBackButton: true,
    };

    constructor(props) {
        super(props);
        //console.log('回答列表页this.props.BoardList',this.props.BoardList);
        this.state = {
            localCommentList: [],
            dataList: [],
            refreshState: RefreshState.Idle,
            BoardList: this.props.BoardList
        }
    }
    keyExtractor = (item, index) => {
        return index.toString();
    }


    renderNavigationTitle() {
        var you = "→" + this.state.BoardList.boardName;
        return `${this.props.title}${you}`
    }

    renderPage() {
        var slength = this.props.data.topicHash.length;
        /*   var resultStr = this.props.data.topicHash.substr(0, 4) + '..............' + this.props.data.topicHash.substr(slength - 4, 4); */
        var resultStr = this.props.data.topicHash;
        return (
            <View style={styles.container}>
                <ListRow title='' icon={require('../../styles/menu/wen.png')} titleStyle={{ color: '#00A29A', fontSize: 18 }} />

              <ListRow 
              title = {
                <View style={styles.rightTopViewStyle}>
                {/*  <Image source={require('../../styles/png/topicadress.png')} style={{ width: 20, height: 20 }} /> */}
                <Text selectable={true} style={{ marginRight: 5, fontSize: 9,color: '#999899', height: 15 }}  >{resultStr}</Text>
                {/*  <Text>{rowData.topRightInfo}</Text> */}
              </View>
              }
              detail={
                <View style={styles.listViewStyle}>

       
                <View style={{ marginRight: 2 }}>
                  <View style={{ flexDirection: 'row' }} >
                    <View >
                      <Image source={require('../../styles/menu/wen2.png')} style={{ margin: 7, width: 60, height: 60 }} />
                    </View>
        
                    {/*右边*/}
                    <View style={[styles.rightViewStyle]}>
                                  <ScrollView style={{ height: 150, marginRight: 70 }}>
                                      <Text style={{ color: 'gray', lineHeight: 20, marginRight: 70 }} >{this.props.data.desc}</Text>
                                  </ScrollView>
                    {/*   <Text style={{ color: 'gray', lineHeight: 20, marginRight: 70 }} >{this.props.data.desc}</Text> */}
                      <View style={styles.rightBottomViewStyle}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image source={require('../../styles/png/time.png')} style={{ width: 20, height: 20 }} />
                          <Text style={{ color: 'red' }}>{this.props.data.duration}</Text>
                        </View>
                        {/*  <Text style={{color:'red'}}>时间:{rowData.duration}</Text> */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 100 }}>
                          <Image source={require('../../styles/png/coin.png')} style={{ width: 15, height: 15 }} />
                          <Text style={{ color: 'red',marginLeft:3 }}>{this.props.data.award} coin</Text>
                        </View>
        
                      </View>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: 80 }} />
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 1, }}>
                      {/*  <Image source={require('../../styles/mine/me.png')} style={{ width: 12, height: 12 }} /> */}
                      <Text selectable={true} style={{ fontSize: 10,color: '#999899',height:15 }} >{this.props.data.owner}</Text>
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
             
                <ListRow title='评论列表' icon={require('../../styles/png/tanhao.png')} titleStyle={{ color: '#00A29A' }} />

               {/*  <ScrollView 
                style={{borderColor:'red',borderWidth:2}}
                contentContainerStyle={{paddingBottom:200}}
              
                > */}

 {/*列表数据*/}
 <RefreshListView
                    data={this.state.dataList}
                    keyExtractor={this.keyExtractor}
                    renderItem={this._renderRow.bind(this)}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this.onHeaderRefresh}
                   //s onFooterRefresh={this.onFooterRefresh}

                    // 可选
                    footerRefreshingText='玩命加载中 >.<'
                    footerFailureText='我擦嘞，居然失败了 =.=!'
                    footerNoMoreDataText='-我是有底线的-'
                    footerEmptyDataText='-好像什么东西都没有-'
                />
                

             {/*    </ScrollView> */}
               
            </View>
            
        );
    }


    componentWillMount() {
        this.onHeaderRefresh()
    }



    onHeaderRefresh = () => {
        console.log('执行刷新');
        this.setState({ refreshState: RefreshState.HeaderRefreshing })
      
        //this._loadCommentList();
        this._getCommentListByServer(1);
    }

    onFooterRefresh = () => {
        this.setState({ refreshState: RefreshState.FooterRefreshing })
        //this._loadCommentList();
        this._getCommentListByServer(1);
    }



    _loadCommentList() {
        MainLogic.getThumbupList(this.props.data.topicHash).then((datalist) => {

            this.setState({ localCommentList: datalist.subTopicList });
            this._getCommentListByServer(1);

        })
    }

    _getCommentListByServer() {
        MainLogic.getSubTopicList(this.props.data.topicHash, 0, 0, this.state.BoardList.subChainAddress, this.state.BoardList.rpcIp, 2,this.state.BoardList.deployLwSolAdmin).then((datas) => {
            //console.log('链问回答列表返回值',datas);
            if (datas.isEnable == 1) {
                let dataList = datas.subTopicList;
                this.setState({
                    dataList: dataList,
                    refreshState: dataList.length < 1 ? RefreshState.EmptyData : RefreshState.Idle,
                })
            }
            else {
                let dataList = datas.subTopicList;
                this.setState({
                    dataList: dataList,
                    refreshState: dataList.length < 1 ? RefreshState.EmptyData : RefreshState.Idle,
                })
                Toast.fail('问题已超时');

            }



        })

    }

    _addNewComment() {
        LoginLogic.getCurrentUser().then((user) => {
            if (user != null && typeof (user) != "undefined" && user.online) {
                this.navigator.push({
                    view: <QuestionDetailAddComment userdata={{ userAddr: user.userAddr, topicHash: this.props.data.topicHash }} BoardList={this.state.BoardList}
                    />
                });
            }
            else {
                this.navigator.push({ view: <LocalLogin BoardList={this.state.BoardList} /> });
            }
        })
    }

    _renderRow = (item) => {
       
        let rowData = item.item;
        let desc = rowData.desc;
        let voteCount = rowData.voteCount
        let favoritedStyle = {}
        let favorite = false;
        /*  if(this.state.localCommentList!=null&&this.state.localCommentList.length>0){
             var index = this.state.localCommentList.indexOf(rowData.owner);
             if(index>-1)
             {
                 favorite = true;
             }
         } */

        if (favorite) {
            favoritedStyle = { color: 'red' }
        }

        var slength = rowData.subTopicHash.length;
        /*  var resultStr = rowData.subTopicHash.substr(0, 4) + '..............' + rowData.subTopicHash.substr(slength - 4, 4); */
        var resultStr = rowData.subTopicHash;

        var num = Math.floor(Math.random() * 4 + 1);
    var img = img_arr['png' + num.toString()];
     
     var allcount = this.state.dataList.length;
    if(allcount>0&&item.index==allcount-1)
    {
        return (

            <View >
                  <ListRow title={
                <View style={styles.rightTopViewStyle}>
              
                <Text selectable={true} style={{ marginRight: 5, fontSize: 9,color: '#999899', height: 15 }}  >{resultStr}</Text>
            
              </View>
            }  detail={
                <View style={{flex:1,flexDirection:'row'}}>
                      <View style={{margin: 4,}}>
                      <Image source={img} style={{  width: 60, height: 60 }} />
                      </View>
                    
                     <View style={{marginRight:2}}>
                     <QuestionDetailItemForMy data={{ desc: desc, favoritedStyle: favoritedStyle, voteCount: voteCount, topicHash: this.props.data.topicHash, subTopicHash: resultStr, owner: rowData.owner, reward: rowData.reward }} BoardList={this.state.BoardList}  />
                     </View>
                    
                </View>
            } 
            titlePlace='top'
            topSeparator='none'
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
         

             <ListRow title={
                <View style={styles.rightTopViewStyle}>
               
                <Text selectable={true} style={{ marginRight: 5, fontSize: 9,color: '#999899', height: 15 }}  >{resultStr}</Text>
              
              </View>
            }  detail={
                <View style={{flex:1,flexDirection:'row'}} >
                      <View style={{margin: 4,}}>
                      <Image source={img} style={{  width: 60, height: 60 }} />
                      </View>
                     <View style={{marginRight:2}}>
                     <QuestionDetailItemForMy data={{ desc: desc, favoritedStyle: favoritedStyle, voteCount: voteCount, topicHash: this.props.data.topicHash, subTopicHash: resultStr, owner: rowData.owner, reward: rowData.reward }} BoardList={this.state.BoardList}  />
                     </View>
                    
                </View>
            } 
        
            titlePlace='top'
            topSeparator='none'
            /> 
        );
    }
}




// 样式
const styles = StyleSheet.create({
    container: {
     
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
      marginLeft: 10,
      marginRight: 10,
      paddingBottom: 15,
  
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
    },
  
    rightBottomViewStyle: {
      flexDirection: 'row',
      marginTop: 7,
  
    }
  });
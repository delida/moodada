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
} from 'react-native';
const { width, height } = Dimensions.get('window');
import i18n from '../../../i18n/i18n';
import { NavigationPage, Theme, ListRow, Label, Toast } from 'teaset';


import MainLogic from '../../logic/MainLogic';
import LoginLogic from '../../logic/LoginLogic';

/* import RefreshListView, { RefreshState } from 'react-native-refresh-list-view' */
import RefreshListView, { RefreshState } from '../CommonComp/RefreshListView'

import QuestionDetailItem from './QuestionDetailItem';
import QuestionDetailAddComment from './QuestionDetailAddComment';
import {kong} from '../../CommonMethod';


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

export default class QuestionDetail extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: i18n.t('LianWenHome.lianWenSettlement.comment_list_for_questions'),
        showBackButton: true,
    };

    constructor(props) {
        super(props);
        //console.log('回答列表页this.props.BoardList',this.props.BoardList);
        this.state = {
            localCommentList: [],
            dataList: [],
            refreshState: RefreshState.Idle,
            BoardList: this.props.BoardList,
            user:this.props.user,
            isOwner: 0
        }
    }
    keyExtractor = (item, index) => {
        return index.toString();
    }


    renderNavigationTitle() {
        var you = "→" + this.state.BoardList.boardName;
        return `${this.props.title}${you}`
    }

    _renderHuiFu(hash){
        LoginLogic.getUserByUserAddr(this.state.user.userAddr).then(res=>{
        
          if (res == null || typeof (res) == 'undefined') {
    
            Toast.fail(i18n.t('FAIL.no_available_export_keyStore'));
          }
          else{
            MainLogic.updateContentStatus(res.userAddr,res.userPwd,res.keystore,this.state.BoardList.subChainAddress, this.state.BoardList.rpcIp,hash,0,2).then(data=>{
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
        LoginLogic.getUserByUserAddr(this.state.user.userAddr).then(res=>{
          if (res == null || typeof (res) == 'undefined') {
    
            Toast.fail(i18n.t('FAIL.no_available_export_keyStore'));
          }
          else{
            MainLogic.updateContentStatus(res.userAddr,res.userPwd,res.keystore,this.state.BoardList.subChainAddress, this.state.BoardList.rpcIp,hash,1,2).then(data=>{
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
    


    renderPage() {
        var slength = this.props.data.topicHash.length;
        /*   var resultStr = this.props.data.topicHash.substr(0, 4) + '..............' + this.props.data.topicHash.substr(slength - 4, 4); */
        var resultStr = this.props.data.topicHash;
        return (
            <View style={styles.container}>
                <View >
                    <ListRow title='' icon={require('../../styles/menu/wen.png')} titleStyle={{ color: '#00A29A', fontSize: 18 }} />
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
                                    <View style={{ flexDirection: 'row' }} >
                                   
                                        <View style={{ margin: 4, }}>
                                            <Image source={require('../../styles/menu/wen2.png')} style={{ width: 60, height: 60 }} />
                                        </View>

                                        {/*右边*/}
                                        <View style={[styles.rightViewStyle]}>
                                            <Text style={{ color: 'gray', lineHeight: 20, marginRight: 70 }} >{this.props.data.desc}</Text>
                                            <View style={styles.rightBottomViewStyle}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image source={require('../../styles/png/time.png')} style={{ width: 20, height: 20 }} />
                                                    <Text style={{ color: 'red' ,marginLeft:3}}>{this.props.data.duration}</Text>
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
                                            <Text selectable={true} style={{ fontSize: 10, color: '#999899' }} >{this.props.data.owner}</Text>
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
                    <ListRow title={i18n.t('LianWenHome.questionDetail.new_comment')} icon={require('../../styles/png/tanhao.png')} titleStyle={{ color: '#00A29A' }} onPress={() => this._addNewComment()} />
                </View>

                {/*列表数据*/}
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

    componentDidMount() {
        this.onHeaderRefresh()
    }

    /*   componentWillMount() {
          this.onHeaderRefresh()
      }
   */


    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing })
        //this._loadCommentList();
        this._getCommentListByServer();
    }

    onFooterRefresh = () => {
        this.setState({ refreshState: RefreshState.FooterRefreshing })
        //this._loadCommentList();
        this._getCommentListByServer();
    }



    _loadCommentList() {
        MainLogic.getThumbupList(this.props.data.topicHash).then((datalist) => {

            this.setState({ localCommentList: datalist.subTopicList });
            this._getCommentListByServer(1);

        })
    }

    _chongfudianzan = () => {
        Toast.fail(i18n.t('FAIL.repeated_thumbUp'));
    }

    _getCommentListByServer() {
        var useraddr='';
        if (!kong(this.state.user)) {
            useraddr = this.state.user.userAddr;
          }
        MainLogic.getSubTopicList(this.props.data.topicHash, 0, 0, this.state.BoardList.subChainAddress, this.state.BoardList.rpcIp, 1,this.state.BoardList.deployLwSolAdmin,useraddr).then((datas) => {
            //console.log('链问回答列表返回值',datas);
            if (datas.isEnable == 1) {
                let dataList = datas.subTopicList;
                this.setState({
                    dataList: dataList,
                    isOwner:datas.isOwner, 
                   /*  isOwner:1, */
                    refreshState: dataList.length < 1 ? RefreshState.EmptyData : RefreshState.Idle,
                })
            }
            else {
                let dataList = datas.subTopicList;
                this.setState({
                    dataList: dataList,
                    isOwner:datas.isOwner, 
                   /*  isOwner:1, */
                    refreshState: dataList.length < 1 ? RefreshState.EmptyData : RefreshState.Idle,
                })
                Toast.fail(i18n.t('FAIL.expired_question'));

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

        //if (rowData.Status = 101) {
        let subTopicBackColor = "";
        if (rowData.status == 101) {
            subTopicBackColor = "#EAEAEA";
        }

        var slength = rowData.subTopicHash.length;
        /*  var resultStr = rowData.subTopicHash.substr(0, 4) + '..............' + rowData.subTopicHash.substr(slength - 4, 4);
  */
        var resultStr = rowData.subTopicHash;
        var num = Math.floor(Math.random() * 4 + 1);
        var img = img_arr['png' + num.toString()];

        var allcount = this.state.dataList.length;


        if (this.state.isOwner == 1){  // 版主
            
            if(allcount>0&&item.index==allcount-1)
            {
                return(
                    <View>
                          <ListRow title={
                    <View style={styles.rightTopViewStyle}>
                    <Text selectable={true} style={{ marginRight: 5, fontSize: 9,color: '#999899', height: 15 }}  >{resultStr}</Text>
                  </View>
                } detail={
                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: subTopicBackColor }}>
                        <View style={{ margin: 4, }}>
                            <Image source={img} style={{ width: 60, height: 60 }} />
                        </View>
    
                        <View style={{ marginRight: 20}}>
                            <QuestionDetailItem data={{ titleAddr: resultStr, desc: desc, favoritedStyle: favoritedStyle, voteCount: voteCount, subtopicStatus: rowData.status,topicHash: this.props.data.topicHash, subTopicHash: resultStr, owner: rowData.owner }} BoardList={this.state.BoardList}
                                chongfudianzan={() =>
                                    this._chongfudianzan()} />
                        </View>
    
                    </View>
                }
                swipeActions={
                    [
                    <ListRow.SwipeActionButton title={i18n.t('ACTION.recover')}  onPress={() => this._renderHuiFu(resultStr)} />,
                    <ListRow.SwipeActionButton title={i18n.t('ACTION.block')} type='danger' onPress={() => this._renderPingBi(resultStr)}/>,
                  ]}
    
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
                    {/*  <Image source={require('../../styles/png/topicadress.png')} style={{ width: 20, height: 20 }} /> */}
                    <Text selectable={true} style={{ marginRight: 5, fontSize: 9,color: '#999899', height: 15 }}  >{resultStr}</Text>
                    {/*  <Text>{rowData.topRightInfo}</Text> */}
                  </View>
                } detail={
                    <View style={{ flex: 1, flexDirection: 'row' ,backgroundColor: subTopicBackColor}}>
                        <View style={{ margin: 4, }}>
                            <Image source={img} style={{ width: 60, height: 60 }} />
                        </View>
    
                        <View style={{ marginRight: 2 }}>
                            <QuestionDetailItem data={{ titleAddr: resultStr, desc: desc, favoritedStyle: favoritedStyle, voteCount: voteCount, subtopicStatus: rowData.status,topicHash: this.props.data.topicHash, subTopicHash: resultStr, owner: rowData.owner }} BoardList={this.state.BoardList}
                                chongfudianzan={() =>
                                    this._chongfudianzan()} />
                        </View>
    
                    </View>
                }
                swipeActions={
                    [
                    <ListRow.SwipeActionButton title={i18n.t('ACTION.recover')}  onPress={() => this._renderHuiFu(resultStr)} />,
                    <ListRow.SwipeActionButton title={i18n.t('ACTION.block')} type='danger' onPress={() => this._renderPingBi(resultStr)}/>,
                  ]}
    
                    titlePlace='top'
                    topSeparator='none'
                />
    
    
    
            
            );
        }
        else{
            // 普通用户
            if(allcount>0&&item.index==allcount-1)
            {
                return(
                    <View>
                          <ListRow title={
                    <View style={styles.rightTopViewStyle}>
                    <Text selectable={true} style={{ marginRight: 5, fontSize: 9,color: '#999899', height: 15 }}  >{resultStr}</Text>
                  </View>
                } detail={
                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: subTopicBackColor  }}>
                        <View style={{ margin: 4, }}>
                            <Image source={img} style={{ width: 60, height: 60 }} />
                        </View>
    
                        <View style={{ marginRight: 2}}>
                            <QuestionDetailItem data={{ titleAddr: resultStr, desc: desc, favoritedStyle: favoritedStyle, voteCount: voteCount, subtopicStatus: rowData.status, topicHash: this.props.data.topicHash, subTopicHash: resultStr, owner: rowData.owner }} BoardList={this.state.BoardList}
                                chongfudianzan={() =>
                                    this._chongfudianzan()} />
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
                    {/*  <Image source={require('../../styles/png/topicadress.png')} style={{ width: 20, height: 20 }} /> */}
                    <Text selectable={true} style={{ marginRight: 5, fontSize: 9,color: '#999899', height: 15 }}  >{resultStr}</Text>
                    {/*  <Text>{rowData.topRightInfo}</Text> */}
                  </View>
                } detail={
                    <View style={{ flex: 1, flexDirection: 'row' , backgroundColor: subTopicBackColor }}>
                        <View style={{ margin: 4, }}>
                            <Image source={img} style={{ width: 60, height: 60 }} />
                        </View>
    
                        <View style={{ marginRight: 2 }}>
                            <QuestionDetailItem data={{ titleAddr: resultStr, desc: desc, favoritedStyle: favoritedStyle, voteCount: voteCount, subtopicStatus: rowData.status, topicHash: this.props.data.topicHash, subTopicHash: resultStr, owner: rowData.owner }} BoardList={this.state.BoardList}
                                chongfudianzan={() =>
                                    this._chongfudianzan()} />
                        </View>
    
                    </View>
                }
                    titlePlace='top'
                    topSeparator='none'
                />
    
    
    
                /*  <ListRow
                     title={resultStr}
                     detail={
                        
                     }
                     titlePlace='top'
                 /> */
    
            );
        }

       
    }
}


// 样式
const styles = StyleSheet.create({
    container: {
      
        backgroundColor: '#F5FCFF'

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
        //borderTopWidth: 1,
        //borderTopColor: '#E6E6E6',
        // borderBottomColor: '#E6E6E6',
        //borderBottomWidth: 1,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
       // paddingBottom: 15,

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
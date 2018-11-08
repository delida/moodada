
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
const { width, height } = Dimensions.get('window');

import { NavigationPage, Toast, ListRow, Label, Button } from 'teaset';




import MainLogic from '../../logic/MainLogic';
import LocalLogin from '../LoginView/LocalLogin';
import LoginLogic from '../../logic/LoginLogic';



export default class QuestionDetailItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            desc: this.props.data.desc,
            favoritedStyle: this.props.data.favoritedStyle,
            voteCount: this.props.data.voteCount,
            topicHash: this.props.data.topicHash,
            subTopicHash: this.props.data.subTopicHash,
            commentHash: this.props.data.owner,
            showLoading: false,
            BoardList: this.props.BoardList,
            isdianzan: false
        }
    }

    _chongfudianzan() {
        this.props.chongfudianzan();
    }

    _clickthumbup = () => {
        if (!this.state.isdianzan) {
            this.setState({ showLoading: true });
            var isdoing = false;
            if (!this.timer) {
                this.setState({
                    voteCount: this.state.voteCount + 1,
                    isdianzan: true,
                    favoritedStyle: { color: 'red' }
                })

                this.timer = setInterval(() => {
                    if (!isdoing) {
                        isdoing = true;
                        LoginLogic.getCurrentUser().then((user) => {

                            let userAddr = user.userAddr;
                            if (user != null && typeof (user) != "undefined" && user.online) {
                                LoginLogic.getUserByUserAddr(userAddr).then((userInfo) => {

                                    MainLogic.approveSubTopic(userAddr, this.state.subTopicHash, userInfo.userPwd, userInfo.keystore, this.state.BoardList.subChainAddress, this.state.BoardList.rpcIp).then((resdata) => {
                                        this.setState({ showLoading: false });
                                        //console.log('点赞应答',resdata);
                                        if (resdata.isSuccess == 1) {
                                            //console.log('点赞执行成功');
                                            /*   this.setState({
                                                  voteCount: this.state.voteCount + 1,
                                                  favoritedStyle: { color: 'red' }
                                              }) */

                                            //保存到本地
                                            /*  MainLogic.saveThumbsupList(this.state.topicHash, this.state.subTopicHash).then((saveres) => {    
                                             }) */


                                        }
                                        else {
                                            this.setState({
                                                voteCount: this.state.voteCount - 1,
                                                favoritedStyle: { color: 'red' }
                                            })
                                        }

                                        //停止掉
                                        clearInterval(this.timer);
                                        this.timer = undefined;

                                    })

                                    //校准是否已经评论
                                    /*  MainLogic.checkThumbsup(this.state.topicHash, this.state.subTopicHash).then((ischeck) => {
                                         console.log('点赞ischeck', ischeck);
                                        
                                     }) */
                                })
                            }
                            else {
                                this.navigator.push({ view: <LocalLogin BoardList={this.state.BoardList} /> });
                            }
                        })
                    }
                }, 1000);
            }
            else {
                //this._chongfudianzan();
                // console.log('正在执行点赞 ');
            }
        }
        else {
            this.props.chongfudianzan();
        }






        /*   this.setState({
              voteCount: this.state.voteCount + 1,
              favoritedStyle: { color: 'red' }
          }) */

    }

    render() {
        let favoritedStyle = this.state.favoritedStyle;



        let imgurl = this.state.isdianzan ? require('../../styles/png/dainzanactive.png') : require('../../styles/png/dianzan.png')
        
        if(this.state.voteCount>0){
            imgurl = require('../../styles/png/dainzanactive.png');
        }
        
        return (
            <View style={styles.listViewStyle}>
                <View style={[styles.rightViewStyle, { width: width - 35 }]}>
                    <Text style={{ color: 'gray' }}>{this.state.desc}</Text>
                    <TouchableHighlight onPress={() => this._clickthumbup()} style={styles.footerLink} underlayColor='#f2f2f2'>
                        <View style={styles.rightBottomViewStyle}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={imgurl} style={{ width: 15, height: 15 }} />
                                <Text style={{ color: 'red' ,marginLeft:3}}>{this.state.voteCount}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 5, marginTop: 7, paddingBottom: 7 }}>
                   {/*  <Image source={require('../../styles/mine/me.png')} style={{ width: 12, height: 12 }} /> */}
                    <Text selectable={true} style={{ fontSize: 10 }} >{this.props.data.owner}</Text>
                </View>
            </View>
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
        /*   backgroundColor: 'white',
          flexDirection: 'column',
          // 全体边框宽度
          borderWidth: 1,
          // 全体边框颜色
          borderColor: '#40BDFF',
          // 全体边框圆角
          borderRadius: 3,
          marginBottom: 5,
          borderRightWidth: 5,
          marginTop: 5,
          marginLeft: 10,
          marginRight: 10,
          paddingBottom: 15 */
        flex: 1,
        marginTop: 5
    },


    imageViewStyle: {
        width: 120,
        height: 90
    },

    rightViewStyle: {
        paddingRight: 2,
        marginLeft: 2,
        //width:220,
        justifyContent: 'center'
    },

    rightTopViewStyle: {
        flexDirection: 'row',
        marginBottom: 7,
        borderBottomColor: '#E6E6E6',
        borderBottomWidth: 1,
        alignItems: 'center'
    },

    rightBottomViewStyle: {
        flexDirection: 'row',
        marginTop: 7,
        // justifyContent: 'space-between'
    },
    footerItemIcon: {
        marginRight: 10,
    },
    iconColor: {
        color: '#959292'
    }
});
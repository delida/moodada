
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
import i18n from '../../../i18n/i18n';


export default class QuestionDetailItemForMy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            desc: this.props.data.desc,
            favoritedStyle: this.props.data.favoritedStyle,
            voteCount: this.props.data.voteCount,
            topicHash: this.props.data.topicHash,
            reward: this.props.data.reward,
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


    render() {
        let favoritedStyle = this.state.favoritedStyle;

        var imgurl = null;
        if(this.state.voteCount>0){
            imgurl = require('../../styles/png/dainzanactive.png');
        }
        else
        {
            imgurl = require('../../styles/png/dianzan.png')
        }

        return (

            <View style={styles.listViewStyle}>
                <View style={[styles.rightViewStyle, { width: width - 35 }]}>
                    <Text style={{ color: 'gray' }}>{this.state.desc}</Text>

                    <View style={styles.rightBottomViewStyle}>
                        <View style={{  flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={imgurl} style={{ width: 15, height: 15 }} />
                            <Text style={{ color: 'red',marginLeft:3 }}>{this.state.voteCount}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:130}}>
                            <Image source={require('../../styles/png/coin.png')} style={{ width: 15, height: 15 }} />
                            <Text style={{ color: 'red',marginLeft:3 }}>{this.state.reward} coin</Text>
                        </View>

                    </View>
                    {/*   <View style={styles.rightBottomViewStyle}>
                            <Icon name='thumbs-o-up' size={20} style={[styles.footerItemIcon, styles.iconColor, favoritedStyle]} />
                            <Text style={{ color: 'red' }}>点赞数:{this.state.voteCount}</Text>
                            <Text style={{ color: 'red' }}>奖励:{this.state.reward}</Text>
                        </View> */}

                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 5, marginTop: 7, paddingBottom: 7 }}>
                 {/*    <Image source={require('../../styles/mine/me.png')} style={{ width: 12, height: 12 }} /> */}
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
        //flex:1,
       // marginTop:5
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
        //borderBottomColor: '#E6E6E6',
        //borderBottomWidth: 1,
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
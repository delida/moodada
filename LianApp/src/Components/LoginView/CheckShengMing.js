import React, { Component } from "react";
import {
    StyleSheet,
    Alert,
    View,
    Text,
    ScrollView,
    Dimensions,

} from "react-native";
const { width, height } = Dimensions.get('window');
import {shengming} from './shengming';

import { Theme, TeaNavigator, NavigationPage,Select, BasePage, ListRow, Toast, Label, PullPicker } from 'teaset';

export default class CheckShengMing extends NavigationPage{
    static defaultProps = {
        ...NavigationPage.defaultProps,
        scene: TeaNavigator.SceneConfigs.PushFromRight,
        title: '链问协议',
        showBackButton: true,
    };

    constructor(props) {
        super(props);  
      }

      renderPage(){
          return(
              <ScrollView>
              <ListRow detail={
                  <View>
                  <Text style={styles.content1}>{shengming.content1}</Text>
                 <Text style={styles.header}>{shengming.shiyongguize}</Text>
                 <Text style={styles.content1}>{shengming.shiyongguizecontent}</Text>
                 <Text style={styles.header}>{shengming.zhishichanquan}</Text>
                 <Text style={styles.content1}>{shengming.zhishichanquancontent1+shengming.zhishichanquancontent2}</Text>
                 <Text style={styles.header}>{shengming.gerenyinsi}</Text>
                 <Text style={styles.content1}>{shengming.gerenyinsicontent}</Text>
                 <Text style={styles.header}>{shengming.lianwenbi}</Text>
                 <Text style={styles.content1}>{shengming.lianwenbicontent1+shengming.lianwenbicontent2+shengming.lianwenbicontent3+shengming.lianwenbicontent4}</Text>
                 <Text style={styles.header}>{shengming.mianzeshengming}</Text>
                 <Text style={styles.content1}>{shengming.mianzeshengmingcontent1+shengming.mianzeshengmingcontent2+shengming.mianzeshengmingcontent3+shengming.mianzeshengmingcontent4}</Text>
                 <Text style={styles.header}>{shengming.xieyixiugai}</Text>
                 <Text style={styles.content1}>{shengming.xieyixiugaicontent1+shengming.xieyixiugaicontent2}</Text>
                 </View>
              } titlePlace='top' bottomSeparator='none' />
              </ScrollView>
          );
      }
}

const styles = StyleSheet.create({
    header:{
        fontSize:20
    },
    content:{
       
    }
})
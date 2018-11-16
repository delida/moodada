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
import i18n from '../../../i18n/i18n';

import { Theme, TeaNavigator, NavigationPage,Select, BasePage, ListRow, Toast, Label, PullPicker } from 'teaset';

export default class CheckShengMing extends NavigationPage{
    static defaultProps = {
        ...NavigationPage.defaultProps,
        scene: TeaNavigator.SceneConfigs.PushFromRight,
        title: i18n.t('DECLARATION.declare'),
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
                  <Text style={styles.content1}>{i18n.t('DECLARATION.content1')}</Text>
                 <Text style={styles.header}>{i18n.t('DECLARATION.shiyongguize')}</Text>
                 <Text style={styles.content1}>{i18n.t('DECLARATION.shiyongguizecontent')}</Text>
                 <Text style={styles.header}>{i18n.t('DECLARATION.zhishichanquan')}</Text>
                 <Text style={styles.content1}>{i18n.t('DECLARATION.zhishichanquancontent1')}+{i18n.t('DECLARATION.zhishichanquancontent2')}</Text>
                 <Text style={styles.header}>{i18n.t('DECLARATION.gerenyinsi')}</Text>
                 <Text style={styles.content1}>{i18n.t('DECLARATION.gerenyinsicontent')}</Text>
                 <Text style={styles.header}>{i18n.t('DECLARATION.lianwenbi')}</Text>
                 <Text style={styles.content1}>{i18n.t('DECLARATION.lianwenbicontent1')}+{i18n.t('DECLARATION.lianwenbicontent2')}+{i18n.t('DECLARATION.lianwenbicontent3')}+{i18n.t('DECLARATION.lianwenbicontent4')}</Text>
                 <Text style={styles.header}>{i18n.t('DECLARATION.mianzeDECLARATION)}</Text>
                 <Text style={styles.content1}>{i18n.t('DECLARATION.mianzeDECLARATIONcontent1')}+{i18n.t('DECLARATION.mianzeDECLARATIONcontent2')}+{i18n.t('DECLARATION.mianzeDECLARATIONcontent3')}+{i18n.t('DECLARATION.mianzeDECLARATIONcontent4')}</Text>
                 <Text style={styles.header}>{i18n.t('DECLARATION.xieyixiugai')}</Text>
                 <Text style={styles.content1}>{i18n.t('DECLARATION.xieyixiugaicontent1')}+{i18n.t('DECLARATION.xieyixiugaicontent2')}</Text>
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
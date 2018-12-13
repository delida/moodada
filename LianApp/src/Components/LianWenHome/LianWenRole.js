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

export default class LianWenRole extends NavigationPage{
    static defaultProps = {
        ...NavigationPage.defaultProps,
        scene: TeaNavigator.SceneConfigs.PushFromRight,
        title: i18n.t('DECLARATION.roleinfo'),
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
                  <Text style={styles.role}>{i18n.t('DECLARATION.roledetail')}</Text>
                 
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
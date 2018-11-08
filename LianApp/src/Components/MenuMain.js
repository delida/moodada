
'use strict';

import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    BackHandler, 
    ToastAndroid,
    ScrollView
} from 'react-native';


import {Theme, TeaNavigator, NavigationPage, BasePage, ListRow, Toast, Label, PullPicker} from 'teaset';


import LoadingView from '../Components/CommonComp/LoadingView';

const { width, height } = Dimensions.get('window');

import MainLogic from '../logic/MainLogic';
import LMain from './Lmain';
 Theme.set({rowIconWidth:40,rowIconHeight:40}); 
/* const img_arr ={
  png1:require('../styles/menu/1.png'),
  png2:require('../styles/menu/2.png'),
  png3:require('../styles/menu/3.png'),
  png4:require('../styles/menu/4.png'),
  png5:require('../styles/menu/5.png'),
  png6:require('../styles/menu/6.png'),
  png7:require('../styles/menu/7.png'),
  png8:require('../styles/menu/8.png'),
  png9:require('../styles/menu/9.png'),
  png10:require('../styles/menu/10.png'),
  png11:require('../styles/menu/11.png'),
  png12:require('../styles/menu/12.png'),
  png13:require('../styles/menu/13.png'),
  png14:require('../styles/menu/14.png'),
  png15:require('../styles/menu/15.png'),
  png16:require('../styles/menu/16.png'),
  png17:require('../styles/menu/17.png'),
  png18:require('../styles/menu/18.png'),
} */
export default class MyLianWenList extends NavigationPage {

    static defaultProps = {
      ...NavigationPage.defaultProps,
      scene: TeaNavigator.SceneConfigs.PushFromRight,
      title: 'MOODADA 链问',
      showBackButton: false,
    };
  
    constructor(props)
    {
          super(props);
          this.state = {
            menus: [],
            showLoading: false,// loading?
            loaddata:false
          }
        
    }

    componentWillMount(){
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
  }
  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }
  
  onBackAndroid = () => {
     if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        //最近2秒内按过back键，可以退出应用。
        BackHandler.exitApp();
        return;
    }
    this.lastBackPressed = Date.now();
    ToastAndroid.show('再按一次退出应用',ToastAndroid.SHORT); 
    //BackHandler.exitApp();
    return true;
  };

  _itemPress(item){
    this.setState({showLoading:true});
           MainLogic.commonSetRpcAndVnode(item.subChainAddress,item.rpcIp).then(data=>{
            this.setState({showLoading:false});
             if(data.isSuccess==0){
               Toast.fail('当前版块暂不可用，请稍后重试！');
             }
             else if(data.isSuccess==2){
              Toast.success('备用节点服务连接成功！');
              item.rpcIp = data.rpcIp;
              this.navigator.push({view: <LMain  BoardList={item}/>});
             }
             else if(data.isSuccess==3){
              Toast.success('备用远程服务连接成功！');
              item.rpcIp = data.rpcIp;
              this.navigator.push({view: <LMain  BoardList={item}/>});
             }
             else if(data.isSuccess==1){
              item.rpcIp = data.rpcIp;
              this.navigator.push({view: <LMain  BoardList={item}/>});
             }
             else{
              Toast.fail('获取链信息异常！');
             }
           })
  }


    _renderItemList(item,id){
    
        return ( 

          <TouchableOpacity key={id} style={{width:width-4,height:40,backgroundColor:Theme.rowColor,marginLeft:2,marginRight:2,paddingBottom:3,flexDirection:'row',justifyContent:'space-between',alignContent:'center',alignItems:'flex-end',borderBottomColor:Theme.rowSeparatorColor,borderBottomWidth:Theme.rowSeparatorLineWidth}}
          onPress={this._itemPress.bind(this,item)}  
          >
          <Text style={{marginLeft:10}}>{item.boardName}</Text>
          <Text style={{marginRight:10,color:'#D1D1D1'}}>></Text>
          </TouchableOpacity>


       /*    <ListRow  detail={ item.boardName}  onPress={() =>  this.navigator.push({view: <LMain  BoardList={item}/>})}   style={{marginBottom:0}}  /> */
        
      /*   <View style={{flex:1}} key={id}>
       
        </View> */
       
        );
    }

    _renderList(){
        var items = [];
        for(var i=0;i<this.state.menus.length;i++){
          var m = i;
          if(i>=18){
            m = i%18;
          }
          this.state.menus[i].key=i;
           items.push(this._renderItemList(this.state.menus[m],i));
        }
        return items;
    }


    renderPage() {

     
        
       
           var rows = this._renderList();
        return (
         
            <ScrollView style={{flex: 1}}>
            <Image source={{uri: 'http://explorer.moac.io/img/moodada_default.jpg'}} style={{width:width,height:200}}/>
            <View style={{height: 2}} />
            <ListRow  title='请选择您感兴趣的话题' icon={require('../styles/menu/wen.png')}  titleStyle={{color:'#00A29A',fontSize:18}} />
            {rows}
            <LoadingView showLoading={ this.state.showLoading } loadingViewClick={()=>{this.setState({showLoading:false})}}/>
          </ScrollView>
        
        );
       }
    
  
  // 生命周期-组件挂载完毕 请求数据
  componentDidMount() {
      this.setState({showLoading:true});
    MainLogic.loadMenuClassify().then((res=>{
      //console.log('分类界面返回值',res)
          this.setState({
            menus:res,
            showLoading:false,
            loaddata:true
          })
    }))
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
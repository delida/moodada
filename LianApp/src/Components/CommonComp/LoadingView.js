import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Modal,
    ActivityIndicator
} from 'react-native';
const { width, height } = Dimensions.get('window')
/* import loadingImage from '../../image/loading/loading.gif' */
export default class LoadingView extends Component{
    constructor(props) {
        super(props);
    }
    _close(){
       // console.log("onRequestClose ---- ")
    }
  
    render() {
        const { showLoading, opacity, backgroundColor } = this.props
        return (
            <Modal onRequestClose={() => this._close()} visible={showLoading} transparent>
                <View style={ [styles.loadingView, {opacity: opacity||0.3, backgroundColor: backgroundColor||'gray'}]}></View>
                 <View style={ styles.loadingImageView }>
                      <View style={ styles.loadingImage }>
                          {
                              this.props.loadingViewClick?
                               <TouchableOpacity onPress={ this.props.loadingViewClick }>
                                   {/*  <Image style={ styles.loadingImage } source={ loadingImage }/>  */ }
                                   <ActivityIndicator
                                   animating={true}
                                   color='red'
                                   style={{
                                       marginTop: 20,
                                       width: 150,
                                       height: 150,
                                   }}
                                   size="large" />
                              </TouchableOpacity>
                              :
                              <ActivityIndicator
                              animating={true}
                              color='red'
                              style={{
                                  marginTop: 20,
                                  width: 150,
                                  height: 150,
                              }}
                              size="large" />
                            }{/* <Image style={ styles.loadingImage } source={ loadingImage }/>  */}
                          
                     </View>
                 </View>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    loadingView: {
        flex: 1,
        height,
        width,
        position: 'absolute'
    },
    loadingImage: {
        width: 150,
        height: 100,
    },
    loadingImageView: {
        position: 'absolute',
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingStyle:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)'
    }
})

 
 


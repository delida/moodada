import {
    AsyncStorage
}from 'react-native';
import React, { Component } from 'react';

 export default class DeviceStorage extends Component {
    /**
     * 获取
     * @param key
     * @returns {Promise<T>|*|Promise.<TResult>}
     */

    static get(key) {
        return AsyncStorage.getItem(key).then((value) => {
            if(typeof(value)=='undefined')
            {
                return {};
            }
            const jsonValue = JSON.parse(value);
            return jsonValue;
        })
        .catch(
            (error)=>{
            });
    }


    /**
     * 保存
     * @param key
     * @param value
     * @returns {*}
     */
    static save(key, value) {
        return AsyncStorage.setItem(key, JSON.stringify(value));
    }


    /**
     * 更新
     * @param key
     * @param value
     * @returns {Promise<T>|Promise.<TResult>}
     */
    static update(key, value) {
        return DeviceStorage.get(key).then((item) => {
            value = typeof value === 'string' ? value : Object.assign({}, item, value);
            return AsyncStorage.setItem(key, JSON.stringify(value));
        });
    }


    /**
     * 更新
     * @param key
     * @returns {*}
     */
    static delete(key) {
        return AsyncStorage.removeItem(key);
    }

    /**
     *清除所有数据(慎用，此处仅在测试阶段使用)
     *
     * @static
     * @memberof DeviceStorage
     */
    static clearPromise(){
        AsyncStorage.clear().then(
         ()=>{
           //删除成功的操作
           console.log("--删除成功--");
         }
        ).catch(
          (error)=>{
            console.log("--删除失败--error:"+error.message);
          }
        );
      }
 
}

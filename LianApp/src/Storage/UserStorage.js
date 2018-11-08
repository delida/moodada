import React, { Component } from 'react';
import DeviceStorage from './DeviceStorage';
import { kongobj, kong } from '../CommonMethod';

var key = "user";//所有登陆过的账户
var currentUserKey = "currentUserKey";//当前用户
export default class UserStorage extends Component {

    static getAllUsers(){
        return new Promise((resolve,reject)=>{
            DeviceStorage.get(key).then((data)=>{
                resolve(data);
            })
        })
       
    }

    /**
     *保存账户,用户在keyStore登陆时，注册成功时使用
     *
     * @static
     * @param {*} value
     * @memberof UserStorage
     */
    static save(value) {
        var vals = [];
        return new Promise((resolve, reject) => {
            DeviceStorage.get(key).then((data) => {
                if (kongobj(data) || kong(data)) {
                    vals.push(value);
                }
                else {
                    vals = data;
                    var hasvalue = false;
                    //查询当前要存入的数据是否已经存在
                    for (let m in vals) {
                        if (vals[m].userAddr == value.userAddr) {
                            hasvalue = true;
                        }
                    }
                    if (!hasvalue) {
                        vals.push(value);
                    }

                }
               return  DeviceStorage.save(key, vals);
            })
            .then((res) => {
                resolve(true);
            });
        })
    }



    /**
     *根据用户账号获取本地是否有数据，存在数据则加载数据，用于账户切换和本地登陆时自动获取keyStore值
     *
     * @static
     * @param {*} userAddr
     * @memberof UserStorage
     */
    static getUser(userAddr) {
        return new Promise((resolve, reject) => {
            DeviceStorage.get(key).then((data) => {
                if (kongobj(data) || kong(data)) {
                    resolve(null);
                }
                else {
                    let vals = data;
                    var item = {};
                    //查询当前要存入的数据是否已经存在
                    for (let m in vals) {
                        if (vals[m].userAddr == userAddr) {
                            item = vals[m];
                        }
                    }
                    resolve(item);
                }
            })
        })
    }

    /**
     *
     *
     * @static
     * @param {*} userAddr
     * @returns
     * @memberof UserStorage
     */
    static loginCurrentUser(userAddr) {
        return new Promise((resolve, reject) => {
            let data = {
                userAddr: userAddr,
                online: true,
                clickonline:true
            }
            if (typeof (userAddr) != 'undefined,') {
                DeviceStorage.save(currentUserKey, data).then((err) => {
                    let result = err = null ? true : false;
                    resolve(result);
                })
            }
            else {
                resolve(false);
            }
        })


    }

    /**
     *退出登陆
     *
     * @static
     * @memberof UserStorage
     */
    static exitCurrentUser(userAddr) {

        return new Promise((resolve, reject) => {
            DeviceStorage.get(currentUserKey).then((data) => {
                if (data != null) {
                    let data = {
                        userAddr: userAddr,
                        online: false,
                        clickonline:false
                    }

                    DeviceStorage.save(currentUserKey, data).then((err) => {
                        resolve(true);
                    });
                }
            })
        })
    }

    /**
     *获取当前操作的账户
     *
     * @static
     * @memberof UserStorage
     */
    static getCurrentUser() {
        return new Promise((resolve, reject) => {
            DeviceStorage.get(currentUserKey).then((data) => {
                resolve(data);
            })
        })

    }

    /**
     *清除所有数据(慎用，此处仅在测试阶段使用)
     *
     * @static
     * @returns
     * @memberof UserStorage
     */
    static clearPromise(){
        return DeviceStorage.clearPromise();
    }
}
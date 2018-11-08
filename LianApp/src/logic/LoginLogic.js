import React, { Component } from 'react';
import { kongobj, kong,quchukongge } from '../CommonMethod';
import UserStorage from '../Storage/UserStorage';
import API from './api';
import { resolve, reject } from 'rsvp';

export default class LoginLogic extends Component{

   static getAllUsers(){
      return  UserStorage.getAllUsers();
    }

    /**
     *判断两次输入的密码是否相同
     *
     * @static
     * @param {*} newpwd
     * @param {*} repwd
     * @returns
     * @memberof LoginLogic
     */
    static checkPwd(newpwd,repwd)
    {
        if(newpwd==''||repwd==''||newpwd!=repwd)
        {
            return false;
        }
        return true;
    }

    /**
     *验证输入的密码长度不能少于指定的长度
     *
     * @static
     * @param {*} pwd
     * @param {*} length
     * @returns
     * @memberof LoginLogic
     */
    static pwdlength(pwd,length)
    {
        return pwd.length>=length;
    }

    /**
     *注册用户
     *
     * @static
     * @param {*} pwd
     * @returns
     * @memberof LoginLogic
     */
    static registerUser(pwd)
    {
        newpwd = quchukongge(pwd);
        //.log('执行到');
        return new Promise((resolve,reject)=>{
            API.registerUser(pwd).then((user)=>{
                user.userPwd = pwd;
                if(!kongobj(user)&&!kong(user))
                {
                    UserStorage.save(user).then((res)=>{
                        resolve(user);
                    })
                }
             })
        })
        
    }

    /**
     *注册界面
     *
     * @static
     * @param {*} userAddr
     * @param {*} userPwd
     * @param {*} keystore
     * @returns
     * @memberof LoginLogic
     */
    static registerLogin(userAddr,userPwd,keystore)
    {
        return new Promise((resolve,reject)=>{
            let user = {
                userAddr:userAddr,
                userPwd:userPwd,
                keystore:keystore
            }
            API.loginUser(userAddr,userPwd,JSON.stringify(keystore)).then((result)=>{
                if(result==1)
                {
                    UserStorage.loginCurrentUser(userAddr).then((res)=>{
                        resolve(1);
                    });
                }
                else{
                    resolve(result);
                }
            })
          
        })
       
    }
    
    /**
     *keyStore登陆 
     *
     * @static
     * @param {*} userAddr
     * @param {*} userPwd
     * @param {*} keystore
     * @returns
     * @memberof LoginLogic
     */
    static keyStoreLogin(userAddr,userPwd,keystore)
    {
        return new Promise((resolve,reject)=>{
             API.loginUser(userAddr,userPwd,keystore).then((result)=>{
                 if(result==1)
                {
                    let user = {
                        userAddr:userAddr,
                        userPwd:userPwd,
                        keystore:keystore
                    }
                    UserStorage.save(user).then((res)=>{
                       return UserStorage.loginCurrentUser(userAddr);
                    })
                    .then(((r)=>{
                        resolve(1);
                    })); 
                   
                }
                else{
                    resolve(result);
                } 
                resolve(result);
            });
           
           
        })
       
    }

    static setNonce(subChainAddr, userAddr, rpcIp){
        return API.setNonce(subChainAddr, userAddr, rpcIp);
    }


    /**
     *主界面自动登陆
     *
     * @static
     * @param {*} userAddr
     * @memberof LoginLogic
     */
    static autoLogin(userAddr)
    {
        return new Promise((resolve,reject)=>{
            UserStorage.getUser(userAddr).then((user)=>{
                if(user==null||typeof(user)=='undefined')
                {
                    resolve(0);
                }
                else
                {
                   return API.loginUser(user.userAddr, user.userPwd, JSON.stringify(user.keyStore)); 
                }
              })
              .then((result)=>{
                resolve(result);
              })
        });
      
      
    }

    /**
     *获取当前软件中的账户
     *
     * @static
     * @returns
     * @memberof LoginLogic
     */
    static getCurrentUser()
    {
        return new Promise((resolve,reject)=>{
            UserStorage.getCurrentUser().then((res)=>{
                resolve(res);
          });
        });
        
    }

    /**
     *根据账户获取用户值
     *
     * @static
     * @param {*} userAddr
     * @returns
     * @memberof LoginLogic
     */
    static getUserByUserAddr(userAddr){
        return UserStorage.getUser(userAddr);
    }

    /**
     *获取当前账户的登陆状态 
     *
     * @static
     * @memberof LoginLogic
     */
/*     static getUserLoginState(){
        return new Promise((resolve,reject)=>{
            UserStorage.getCurrentUser().then((user)=>{
                var online = user==null?false:user.online;
                resolve(online);
          });
        });
    } */

    /**
     *退出登陆
     *
     * @static
     * @memberof LoginLogic
     */
    static exitLogin(userAddr)
    {
      return  UserStorage.exitCurrentUser(userAddr);
    }


     /**
     *清除所有数据(慎用，此处仅在测试阶段使用)
     *
     * @static
     * @returns
     * @memberof LoginLogic
     */
    static clearPromise(){
        return UserStorage.clearPromise();
    }

}
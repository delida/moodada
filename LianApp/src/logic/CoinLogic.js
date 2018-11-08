import React, { Component } from 'react';
import { kongobj, kong,quchukongge } from '../CommonMethod';
import API from './api';
import { resolve, reject } from 'rsvp';

export default class CoinLogic extends Component{
   /**
    * 获取账户信息
    * @param {用户账户信息} userAddr 
    * @param {erc20合约地址(从版块管理接口中获取)} marketableTokenAddr 
    * @param {密码} pwd 
    * @param {*} keystore 
    * @param {*} subChainAddr 
    * @param {*} rpcIp 
    */
    static getBalance(userAddr,marketableTokenAddr, pwd, keystore, subChainAddr, rpcIp){
        return API.getBalance(userAddr,marketableTokenAddr, pwd, keystore, subChainAddr, rpcIp);
    }

    /**
     * 充值coin
     * @param {用户地址} userAddr 
     * @param {充值金额} value 
     * @param {*} marketableTokenAddr 
     * @param {*} pwd 
     * @param {*} keystore 
     */
     static buyMintToken(userAddr,value,marketableTokenAddr, pwd, keystore,subChainAddr,exchangeRate){
       return API.buyMintToken(userAddr,value,marketableTokenAddr, pwd, keystore,subChainAddr,exchangeRate);
   }

   /**
    *coin转moac
    *
    * @static
    * @param {*} userAddr
    * @param {*} value
    * @returns
    * @memberof CoinLogic
    */
   static sellMintToken(userAddr, value,marketableTokenAddr, pwd, keystore, subChainAddr, rpcIp,exchangeRate){
        return API.sellMintToken(userAddr,value,marketableTokenAddr, pwd, keystore, subChainAddr, rpcIp,exchangeRate);
    }

     /**
      * coin值
      */
     static getMicroChainBalance(userAddr, pwd, keystore, subChainAddr, rpcIp){
        return  API.getMicroChainBalance(userAddr, pwd, keystore, subChainAddr, rpcIp);
    }

      /**
    * 我的充值，提币记录
    * @param {当前页码，传0} pageNum 
    * @param {每页记录数，传0} pageSize 
    * @param {当前用户地址} userAddr 
    * @param {子链地址} subChainAddr 
    * @param {rpcIp} rpcIp 
    */
   static myHistoryList(pageNum, pageSize,userAddr, subChainAddr, rpcIp){
    return API.myHistoryList(pageNum, pageSize,userAddr, subChainAddr, rpcIp);
}
    
}
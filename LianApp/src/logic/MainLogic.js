import React, { Component } from 'react';
import { kongobj, kong,quchukongge } from '../CommonMethod';
import API from './api';

import CommentStorage from '../Storage/CommentStorage';


export default class MainLogic extends Component{
  
    /**
     *获取主界面的分类菜单
     *
     * @static
     * @returns
     * @memberof MainLogic
     */
    static loadMenuClassify(){
        return API.loadMenuClassify();
    }

    /**
     *链问问题列表（目前暂未支持分页，先固定传0 ，0）
     *
     * @static
     * @param {*} pageNum
     * @param {*} pageSize
     * @returns
     * @memberof MainLogic
     */
    static getTopicList(pageNum, pageSize, subChainAddr,rpcIp,deployLwSolAdmin,userAddr){
        return API.getTopicList(0,0,subChainAddr,rpcIp,deployLwSolAdmin,userAddr);
    }

    /**
     *根据模块名称获取问题列表
     *
     * @static
     * @param {*} pageNum
     * @param {*} pageSize
     * @param {*} moduleName
     * @memberof MainLogic
     */
    static getTopicListByModule(pageNum,pageSize,moduleName){
        //console.log('从根据模块名称获取问题列表获取数据');
          return API.getTopicListByModule(pageNum,pageSize,moduleName);
    }

   /**
    * 
    * @param {*} userAddr 
    * @param {*} subChainAddr 
    * @param {*} pwd 
    * @param {*} keystore 
    * @param {*} rpcIp 
    * @param {*} deployLwSolAdmin 
    */
    static getMyQuestion(userAddr, subChainAddr,pwd, keystore, rpcIp, deployLwSolAdmin){
       // console.log('从我的链问列表获取数据');
        return API.getMyQuestion(userAddr, subChainAddr,pwd, keystore, rpcIp, deployLwSolAdmin);
    }

    /**
     *获取所有的点赞列表
     *
     * @static
     * @param {*} topicHash
     * @memberof MainLogic
     */
    static getThumbupList(topicHash){
         return CommentStorage.getThumbupList(topicHash);
    }

    /**
     *检测是否已经点赞 
     *
     * @static
     * @param {*} topicHash
     * @param {*} commentHash
     * @memberof MainLogic
     */
    static checkThumbsup(topicHash,commentHash){
            return CommentStorage.checkThumbsup(topicHash,commentHash);
    }

    /**
     *点赞
     *
     * @static
     * @param {*} topicHash
     * @param {*} commentHash
     * @memberof MainLogic
     */
    static saveThumbsupList(topicHash,commentHash){
          return CommentStorage.saveThumbsupList(topicHash,commentHash);
    }

    /**
     *根据文章hash值获取评论列表
     *
     * @static
     * @param {*} topicHash
     * @param {*} pageNum
     * @param {*} pageSize
     * @memberof MainLogic
     */
    static getSubTopicList(topicHash, pageNum, pageSize,subChainAddr, rpcIp,type,deployLwSolAdmin,userAddr){
         return API.getSubTopicList(topicHash, 0, 0,subChainAddr, rpcIp,type,deployLwSolAdmin,userAddr);
    }

    /**
     *点赞
     *
     * @static
     * @param {*} userAddr
     * @param {*} subTopicHash
     * @memberof MainLogic
     */
    static approveSubTopic(userAddr,subTopicHash, pwd, keystore, subChainAddr, rpcIp){
         return API.approveSubTopic(userAddr,subTopicHash, pwd, keystore, subChainAddr, rpcIp);
    }

    /**
     *创建回答
     *
     * @static
     * @param {*} topicHash
     * @param {*} desc
     * @param {*} userAddr
     * @memberof MainLogic
     */
    static createSubTopic (topicHash, desc,userAddr, pwd, keystore, subChainAddr, rpcIp){
         return API.createSubTopic(topicHash,desc,userAddr, pwd, keystore, subChainAddr, rpcIp);
    }

    /**
     *创建链问问题
     *
     * @static
    * @param {悬赏金额} award
     * @param {问题内容} desc
     * @param {持续时间10的倍数} duration
     * @param {钱包地址} userAddr
     * @returns
     * @memberof MainLogic
     */
    static createTopic(award, desc, duration, userAddr,pwd, keystore, subChainAddr, rpcIp){
        return API.createTopic(award,desc,duration,userAddr,pwd, keystore, subChainAddr, rpcIp);
    }

    /**
     *问题结算
     *
     * @static
     * @param {*} userAddr
     * @param {*} subTopicHash
     * @memberof MainLogic
     */
    static autoCheck(userAddr,pwd, keystore, subChainAddr, rpcIp){
        return API.autoCheck(userAddr,pwd, keystore, subChainAddr, rpcIp);
    }

      /**
     * 检查是否可以结算
     */
    static CheckCanJIeSuan(){
        return CommentStorage.CheckCanJIeSuan();
    }

    /**
     * 保存结算
     */
    static saveJieSuan(){
        return CommentStorage.SaveJieSuanTime();
    }

      /**
   * 
   * @param {转账人地址} from 
   * @param {收款人地址} to 
   * @param {转账金额} amount 
   * @param {转账人密码} pwd 
   * @param {转账人keystore} keystore 
   */
  static transferMoac(from, to, amount, pwd, keystore){
    return API.transferMoac(from, to, amount, pwd, keystore);
}

/**
* 
* @param {转账人地址} from 
* @param {收款人地址} to 
* @param {转账金额} amount 
* @param {子链地址} subChainAddr 
* @param {转账人密码} pwd 
* @param {转账人keystore} keystore 
*/
static transferCoin(from, to, amount, subChainAddr, pwd, keystore, rpcIp){
return API.transferCoin(from, to, amount, subChainAddr, pwd, keystore, rpcIp);
}

/**
* 
* @param {当前版块子链地址} subChainAddr 
* @param {rpcIp} rpcIp 
*/
static getBlockInfo(subChainAddr, rpcIp){
return API.getBlockInfo(subChainAddr, rpcIp);
}


/**
      * 动态获取rpcIP
      * @param {*} subChainAddr 
      * @param {*} rpcIp 
      */
   static  commonSetRpcAndVnode(subChainAddr,rpcIp, type, deployLwSolAdmin){
        return API.commonSetRpcAndVnode(subChainAddr,rpcIp, type, deployLwSolAdmin);
    }

        /**
     * 屏蔽或恢复问题，回答
     * @param {当前用户钱包地址} userAddr 
     * @param {用户登录密码} pwd 
     * @param {本地keystore} keystore 
     * @param {子链地址（从版块管理接口获取）} subChainAddr 
     * @param {远程调用url（从版块管理接口获取）} rpcIp 
     * @param {传递topicHash或者subTopicHash} hash 
     * @param {屏蔽传递1，恢复传递0} status 
     * @param {操作问题传递1， 操作回答传递2} type 
     */
    static updateContentStatus(userAddr, pwd, keystore, subChainAddr, rpcIp, hash, status, type){
        return API.updateContentStatus(userAddr, pwd, keystore, subChainAddr, rpcIp, hash, status, type);
   }

    /**
     * 获取最大时间和时间最小单位
     * @param {子链地址（从版块管理接口获取）} subChainAddr 
     * @param {合约部署人，从版块信息中获取} deployLwSolAdmin 
     */
    static getMaxTimeAndPerTime(subChainAddr,deployLwSolAdmin){
        return API.getMaxTimeAndPerTime(subChainAddr,deployLwSolAdmin);
    }

    /**
     * 获取当前版块规则
     * @param {} callType 
     */
    static getBoardRule(callType){
        return API.getBoardRule(callType);
    }

}
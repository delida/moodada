import React, { Component } from 'react';
import { reject } from 'any-promise';

// 引入外部的json数据
var TopMenu = require('../LocalData/TopMenu.json');

var youLikeData = require('../LocalData/LianWenList.json');

var topicDetails = require('../LocalData/LianWenQuestionDetails.json');

import {registerUser} from '../../api/accountApi';
import {loginUser} from '../../api/accountApi';
import {chargeToken} from '../../api/accountApi';
import {redeemToken} from '../../api/accountApi';
import {getBalance} from '../../api/accountApi';
import {createTopic} from '../../api/bussApi';
import {autoCheck} from '../../api/bussApi';
import {createSubTopic} from '../../api/bussApi';
import {getMicroChainBalance} from '../../api/bussApi';
import {getTopicList} from '../../api/bussApi';
import {approveSubTopic} from '../../api/bussApi';
import {getSubTopicList} from '../../api/bussApi';
import {getBoardRule} from '../../api/bussApi';
import {buyToken} from '../../api/accountApi';
import {getBoardList} from '../../api/bussApi';
import {myTopicList} from '../../api/bussApi';
import {setNonce} from '../../api/bussApi';
import {getBlockInfo} from '../../api/bussApi';
import {transferCoin} from '../../api/accountApi';
import {transferMoac} from '../../api/accountApi';
import {myHistoryList} from '../../api/accountApi';
import {commonSetVnode} from '../../api/accountApi';
import {commonSetRpcAndVnode} from '../../api/accountApi';
import {updateContentStatus,getMaxTimeAndPerTime} from '../../api/bussApi';



var keystore_youTest = "{\"version\":3,\"id\":\"7ce8fb55-264b-4ba0-89cd-97840ca7bc4f\",\"address\":\"e7e52b94e9a82351302260ec39a300e9f00aee4c\",\"crypto\":{\"ciphertext\":\"6b8c6d2aa87cc3fff5cae9a984bf89f8b1b0307a6c796b65616371de7c1e558c\",\"cipherparams\":{\"iv\":\"f664b90fae01d8984072e65bd7e0b6e7\"},\"cipher\":\"aes-128-ctr\",\"kdf\":\"scrypt\",\"kdfparams\":{\"dklen\":32,\"salt\":\"d3804059e4d6b809f0a9e1b9a1562153d544f2586580374a9120f061695b6c33\",\"n\":8192,\"r\":8,\"p\":1},\"mac\":\"e426a88e8bf9e47b8ad2eee53d835d99b510c159972c4afd8dc43d8be481b39a\"}}";

var keystore_youTest2 = {
    version:3,
    id:'7ce8fb55-264b-4ba0-89cd-97840ca7bc4f',
    address:'e7e52b94e9a82351302260ec39a300e9f00aee4c',
    crypto:{
        ciphertext:'6b8c6d2aa87cc3fff5cae9a984bf89f8b1b0307a6c796b65616371de7c1e558c',
        cipherparams:{
            iv:'f664b90fae01d8984072e65bd7e0b6e7'
        },
        cipher:'aes-128-ctr',
        kdf:'scrypt',
        kdfparams:{
            dklen:32,
            salt:'d3804059e4d6b809f0a9e1b9a1562153d544f2586580374a9120f061695b6c33',
            n:8192,
            r:8,
            p:1
        },
        mac:'e426a88e8bf9e47b8ad2eee53d835d99b510c159972c4afd8dc43d8be481b39a'
    }
}

var addry = "0xb80b7e2b6639277f12d0b9b79f283c44f780f8c8";
var addr = "0xe7e52b94e9a82351302260ec39a300e9f00aee4c";

var Timer={
    data:{},
    start:function(key){
      Timer.data[key]=new Date();
    },
    stop:function(key){
      var time=Timer.data[key];
      if(time)
      Timer.data[key]=new Date()-time;
    },
    getTime:function(){
      return Timer.data[key];
    }
  };


/**
 *
 *链问API
 * @export
 * @class API
 * @extends {Component}
 */
export default class API extends Component{

    /**
     *注册用户
     *
     * @static
     * @param {*} pwd
     * @memberof API
     */
    static registerUser(pwd)
     {
         let data = {
            userAddr:'0x764C0e7a183F9c5245f2904f66EED1c672',
            keystore:{
                version:3,
                id:'b7467fcb-3c8b-41be-bccf-73d43a08c1b7',
                address:'540f18196da5a533fa36577a81de55f0a2f4e751'
            }
         }

         //console.log('执行注册用户');
         return new Promise((resolve,reject)=>{
             registerUser(pwd).then(user=>{
                resolve(user); 
             })
           // console.log('注册用户user',user); 
           

            
         });
        
     }

     /**
      *登陆账户
      *
      * @static
      * @param {*} userAddr
      * @param {*} pwd
      * @param {*} keystore
      * @memberof API
      */
     static loginUser(userAddr,pwd,keystore)
     {
         return new Promise((resolve,reject)=>{
            var testkeystore = JSON.stringify(keystore);
            console.log('登录addr',userAddr);
            console.log('pwd',pwd);
            console.log('keystorell',keystore);
            var begin=new Date().getTime();
             loginUser(userAddr,pwd,testkeystore).then(result=>{
                var end=new Date().getTime();
                var time=end-begin;
                console.log("执行API函数loginUser消耗时间为="+time);
                //return result;
                console.log('登录返回值',result);
                resolve(result);
             })
            
         });
     }

     /**
      * 登录后setNonce
      * @param {*} subChainAddr 
      * @param {*} userAddr 
      * @param {*} rpcIp 
      */
     static setNonce(subChainAddr, userAddr, rpcIp){

        return new Promise((resolve,reject)=>{
            console.log("子链配置信息为------")
            console.log('subChainAddr',subChainAddr);
            console.log('userAddr',userAddr);
            console.log('rpcIp',rpcIp);
            var begin=new Date();
             setNonce(subChainAddr, userAddr, rpcIp).then(data=>{
                var end=new Date();
                var time=end-begin;
                console.log("执行API函数setNonce消耗时间为="+time);
                resolve(data);
             });
          
         });

      /*   commonSetRpcAndVnode(subChainAddr,rpcIp).then(resData=>{
            console.log('获取动态rpcIP',resData);
          
        }) */

       
     }

     /**
      * 动态获取rpcIP
      * @param {*} subChainAddr 
      * @param {*} rpcIp 
      */
    static commonSetRpcAndVnode(subChainAddr,rpcIp, type, deployLwSolAdmin){
         return commonSetRpcAndVnode(subChainAddr,rpcIp, type, deployLwSolAdmin);
     }



    /**
     * 获取账户信息
     * @param {*} userAddr 
     * @param {*} marketableTokenAddr 
     * @param {*} pwd 
     * @param {*} keystore 
     * @param {*} subChainAddr 
     * @param {*} rpcIp 
     */
     static getBalance(userAddr,marketableTokenAddr, pwd, keystore, subChainAddr, rpcIp){
        return new Promise((resolve,reject)=>{
            var begin=new Date();
            var testkeystore = JSON.stringify(keystore);
              getBalance(userAddr,marketableTokenAddr).then((balance)=>{
                return balance;
              })
              .then((b)=>{
                getMicroChainBalance(userAddr, pwd, testkeystore, subChainAddr, rpcIp).then((coin)=>{
                    b.erc20Balance=coin
                  
                    resolve(b);
                    var end=new Date();
                    var time=end-begin;
                    console.log("执行API函数getBalance和getMicroChainBalance消耗时间为="+time);
                })
              })
        });
        
     }

     /**
      * coin值
      */
     static getMicroChainBalance(userAddr, pwd, keystore, subChainAddr, rpcIp){
        var testkeystore = JSON.stringify(keystore);

        return new Promise((resolve,reject)=>{
            var begin=new Date();
            getMicroChainBalance(userAddr, pwd, testkeystore, subChainAddr, rpcIp).then(data=>{
              var end=new Date();
              var time=end-begin;
              console.log("执行API函数getMicroChainBalance消耗时间为="+time);
              resolve(data);
           });
        });

      
     }

    /**
     * 充值coin
     * @param {*} userAddr 
     * @param {*} value 
     * @param {*} marketableTokenAddr 
     * @param {*} pwd 
     * @param {*} keystore 
     */
     static buyMintToken(userAddr,value,marketableTokenAddr, pwd, keystore,subChainAddr,exchangeRate){
        var testkeystore = JSON.stringify(keystore);
console.log('充值addr',userAddr);
console.log('充值value',value);
console.log('充值marketableTokenAddr',marketableTokenAddr);
console.log('充值pwd','moac');
console.log('充值keystore',keystore);
console.log('充值subChainAddr',subChainAddr);
console.log('充值exchangeRate',exchangeRate);
return new Promise((resolve,reject)=>{
    var begin=new Date();
    chargeToken(userAddr,value,marketableTokenAddr,pwd,testkeystore,subChainAddr,exchangeRate).then(data=>{
        var end=new Date();
        var time=end-begin;
        console.log("执行API函数chargeToken消耗时间为="+time);
        resolve(data);
    })
})

        
     }

    /**
     *提币
     *
     * @static
     * @param {*} userAddr
     * @param {*} value
     * @returns
     * @memberof API
     */
    static sellMintToken(userAddr, value,marketableTokenAddr, pwd, keystore, subChainAddr, rpcIp,exchangeRate){
      
        return new Promise((resolve,reject)=>{
            console.log('提币Addr',userAddr);
            console.log('提币value',value);
            console.log('提币marketableTokenAddr',marketableTokenAddr);
            console.log('提币pwd','moac');
            console.log('提币keystore',keystore_youTest);
            console.log('提币subChainAddr',subChainAddr);
            console.log('提币rpcIp',rpcIp);
            var testkeystore = JSON.stringify(keystore);
            var begin=new Date();
           redeemToken(userAddr,value,marketableTokenAddr, pwd, testkeystore,subChainAddr, rpcIp,exchangeRate).then(data=>{
              var end=new Date();
              var time=end-begin;
              console.log("执行API函数redeemToken消耗时间为="+time);
              resolve(data);
          });
            
        })

        
    }

    /**
     *获取模块分类
     *
     * @static
     * @memberof API
     */
    static loadMenuClassify()
    {
     /*    return new Promise((resolve,reject)=>{
            commonSetVnode().then(cdata=>{
                getBoardList().then(data=>{
                    resolve(data)
                })
            })
             
         })   */
        return getBoardList();
    /*     return new Promise((resove,reject)=>{
            resove(TopMenu);
        }); */
    }

   /**
    * 链问问题列表（目前暂未支持分页，先固定传0 ，0）
    * @param {当前页码，传0} pageNum 
    * @param {每页记录数，传0} pageSize 
    * @param {用户登录密码} pwd 
    * @param {本地keystore} keystore 
    * @param {子链地址（从版块管理接口获取）} subChainAddr 
    * @param {远程调用url（从版块管理接口获取）} rpcIp 
    */
   static getTopicList(pageNum, pageSize,subChainAddr,rpcIp,deployLwSolAdmin,userAddr){
       console.log('获取链问问题列表pageNum',pageNum);
       console.log('获取链问问题列表pageSize',pageSize);
       console.log('获取链问问题列表subChainAddr',subChainAddr);
       console.log('获取链问问题列表,rpcIp',rpcIp);
     return getTopicList(pageNum,pageSize,subChainAddr,rpcIp,deployLwSolAdmin,userAddr);
  
     
    }

    /**
     *根据模块名称获取问题列表
     *
     * @static
     * @param {*} pageNum
     * @param {*} pageSize
     * @param {*} moduleName
     * @returns
     * @memberof API
     */
    static getTopicListByModule(pageNum,pageSize,moduleName){
        return new Promise((resove,reject)=>{
            resove(youLikeData);
        });
    }

    /**
     * 我的链问列表 
     * @param {当前登录人address} userAddr 
     * @param {当前版块子链地址} subChainAddr 
     * @param {用户登录密码} pwd 
     * @param {本地keystore} keystore 
     * @param {远程调用url（从版块管理接口获取）} rpcIp 
     * @param {合约部署人（从版块管理接口获取）} deployLwSolAdmin 
     */
    static getMyQuestion(userAddr, subChainAddr,pwd, keystore, rpcIp, deployLwSolAdmin){
        var testkeystore = JSON.stringify(keystore);
        console.log('我的链问列表addr',userAddr);
        console.log('我的链问列表subChainAddr',subChainAddr);
        console.log('我的链问列表pwd',pwd);
        console.log('我的链问列表keystore',testkeystore);
        console.log('我的链问列表rpcIp',rpcIp);
        console.log('我的链问列表deployLwSolAdmin',deployLwSolAdmin);
        
      return  myTopicList(userAddr, subChainAddr,pwd, testkeystore, rpcIp, deployLwSolAdmin);
       /*  return new Promise((resove,reject)=>{
            resove(youLikeData);
        }); */
    }

    /**
     * 回答列表页
     * @param {问题hash} topicHash 
     * @param {当前页码,先固定传0} pageNum 
     * @param {每页记录数，先固定传0} pageSize 
     * @param {用户登录密码} pwd 
     * @param {本地keystore} keystore 
     * @param {子链地址（从版块管理接口获取）} subChainAddr 
     * @param {远程调用url（从版块管理接口获取）} rpcIp 
     */
    static getSubTopicList(topicHash, pageNum, pageSize,subChainAddr, rpcIp,type,deployLwSolAdmin,userAddr){
        console.log('回答列表页topicHash',topicHash);
        console.log('回答列表页pageNum',pageNum);
        console.log('回答列表页pageSize',pageSize);
        console.log('回答列表页subChainAddr',subChainAddr);
        console.log('回答列表页rpcIp',rpcIp);
        return getSubTopicList(topicHash,pageNum,pageSize,subChainAddr, rpcIp,type,deployLwSolAdmin,userAddr);
       
    }

   /**
    * 点赞
    * @param {当前登录人address} userAddr 
    * @param {回答hash} subTopicHash 
    * @param {用户登录密码} pwd 
    * @param {本地keystore} keystore 
    * @param {子链地址（从版块管理接口获取）} subChainAddr 
    * @param {远程调用url（从版块管理接口获取）} rpcIp 
    */
    static approveSubTopic(userAddr,subTopicHash,pwd, keystore, subChainAddr, rpcIp){
        var testkeystore = JSON.stringify(keystore);
        console.log('点赞addr',userAddr);
        console.log('点赞subTopicHash',subTopicHash);
        console.log('点赞pwd',pwd);
        console.log('点赞keystore',testkeystore);
        console.log('点赞subChainAddr',subChainAddr);
        console.log('点赞rpcIp',rpcIp);
        return new Promise((resove,reject)=>{
           var result = approveSubTopic(userAddr,subTopicHash,subChainAddr,pwd, testkeystore,  rpcIp);
           console.log('点赞返回',result);
           resove(result);
        });
         
        
    }

    /**
     *回答问题
     *
     * @static
     * @param {*} topicHash
     * @param {*} desc
     * @memberof API
     */
    static createSubTopic (topicHash, desc,userAddr, pwd, keystore, subChainAddr, rpcIp){
       let answer={
        subTopicHash:'232344543fdgdter3223423',
        isSuccess:1
       }
       var testkeystore = JSON.stringify(keystore);
console.log('回答问题topicHash',topicHash);
console.log('回答问题desc',desc);
console.log('回答问题addr',userAddr);
console.log('回答问题pwd',pwd);
console.log('回答问题keystore',testkeystore);
console.log('回答问题subChainAddr',subChainAddr);
console.log('回答问题rpcIp',rpcIp);

       
     return new Promise((resove,reject)=>{
        var begin=new Date();
        createSubTopic(topicHash,desc,userAddr, pwd, testkeystore, subChainAddr, rpcIp).then(data=>{
            var end=new Date();
            var time=end-begin;
            console.log("执行API函数createSubTopic消耗时间为="+time);
            resove(data);
        })
     })
    
    }

    /**
     * 创建链问问题
     * @param {悬赏金额} award 
     * @param {问题内容} desc 
     * @param {持续时间，10的倍数} duration 
     * @param {当前用户钱包地址} userAddr 
     * @param {用户登录密码} pwd 
     * @param {本地keystore} keystore 
     * @param {子链地址（从版块管理接口获取）} subChainAddr 
     * @param {远程调用url（从版块管理接口获取）} rpcIp 
     */
    static createTopic(award, desc, duration, userAddr, pwd, keystore, subChainAddr, rpcIp){
          let answer={
            topicHash:'2132ewqewqrsarewrewq',
            isSuccess:1
          }
          var testkeystore = JSON.stringify(keystore);
          console.log('award',award);
          console.log('desc',desc);
          console.log('duration',duration);
          console.log('addr',userAddr);
         
          var begin=new Date();
          return new Promise((resove,reject)=>{
            createTopic(award, desc, duration, userAddr, pwd, testkeystore, subChainAddr, rpcIp).then(data=>{
                var end=new Date();
                var time=end-begin;
                console.log("执行API函数createTopic消耗时间为="+time);
                resove(data);
            });
        });

       
    }

    /**
     * 问题结算
     * @param {当前登录人address} userAddr 
     * @param {用户登录密码} pwd 
     * @param {本地keystore} keystore 
     * @param {子链地址（从版块管理接口获取）} subChainAddr 
     * @param {远程调用url（从版块管理接口获取} rpcIp 
     */
    static autoCheck(userAddr,pwd, keystore, subChainAddr, rpcIp){
        console.log('结算addr',userAddr);
        console.log('结算pwd',pwd);
        console.log('结算keystore',keystore);
        console.log('结算subChainAddr',subChainAddr);
        console.log('结算rpcIp',rpcIp);
        var testkeystore = JSON.stringify(keystore);

        return new Promise((resove,reject)=>{
         autoCheck(userAddr,pwd, testkeystore, subChainAddr, rpcIp).then(res=>{
            resove(res);
         });
         
        })
         

       /*  let answer={
            isSuccess:1
        }
        return new Promise((resove,reject)=>{
            resove(answer);
        }) */
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
        var testkeystore = JSON.stringify(keystore);
            return transferMoac(from, to, amount, pwd, testkeystore);
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
        var testkeystore = JSON.stringify(keystore);
        return transferCoin(from, to, amount, subChainAddr, pwd, testkeystore, rpcIp);
    }

    /**
     * 
     * @param {当前版块子链地址} subChainAddr 
     * @param {rpcIp} rpcIp 
     */
    static getBlockInfo(subChainAddr, rpcIp){
        return getBlockInfo(subChainAddr, rpcIp);
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
        //var begin=new Date();
        return new Promise((resove,reject)=>{
            myHistoryList(pageNum, pageSize,userAddr, subChainAddr, rpcIp).then(data=>{
              //var end=new Date();
              //var time=end-begin;
              //console.log("执行API函数myHistoryList消耗时间为="+time);
              resove(data);
          });
      });
      
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
        var testkeystore = JSON.stringify(keystore);
         return updateContentStatus(userAddr, pwd, testkeystore, subChainAddr, rpcIp, hash, status, type);
    }

    /**
     * 获取最大时间和时间最小单位
     * @param {子链地址（从版块管理接口获取）} subChainAddr 
     * @param {合约部署人，从版块信息中获取} deployLwSolAdmin 
     */
    static getMaxTimeAndPerTime(subChainAddr,deployLwSolAdmin){
        return getMaxTimeAndPerTime(subChainAddr,deployLwSolAdmin);
    }

    /**
     * 获取当前版块规则
     * @param {} callType 
     */
    static getBoardRule(callType){
        return getBoardRule(callType);
    }

}
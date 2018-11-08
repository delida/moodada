import React, { Component } from 'react';
import DeviceStorage from './DeviceStorage';
import { kongobj, kong } from '../CommonMethod';
import { resolve } from 'any-promise';
import { reject } from 'rsvp';

export default class CommentStorage extends Component{
   
    /**
     *检测是否已经点赞，已经点赞返回true
     *
     * @static
     * @param {*} topicHash
     * @param {*} commentHash
     * @returns
     * @memberof CommentStorage
     */
    static checkThumbsup(topicHash,commentHash)
    {
        return new Promise((resolve,reject)=>{
            DeviceStorage.get(topicHash).then((data)=>{
                let vals=[];
                var result = false;
                if (!kongobj(data)&&!kong(data)) 
                {
                    vals=data;
                    let index = vals.indexOf(commentHash);
                    if (index > -1) {
                        result = true;
                      }
                }
             resolve(result);
            })
        })
    }

    /**
     **点赞
     *
     * @static
     * @param {*} topicHash
     * @param {*} commentHash
     * @returns
     * @memberof CommentStorage
     */
    static saveThumbsupList(topicHash,commentHash){
        return new Promise((resolve,reject)=>{
            DeviceStorage.get(topicHash).then((data)=>{
                let vals=[];
                if (kongobj(data) || kong(data)) 
                {
                    vals.push(commentHash);
                }
                else{
                    vals=data;
                    let index = vals.indexOf(commentHash);
                    if (index <= -1) {
                          vals.push(commentHash);
                      }
                }
                return  DeviceStorage.save(topicHash, vals);
            })
            .then((res)=>{
                resolve(true);
            })
        })
    }

    /**
     *取消点赞
     *
     * @static
     * @returns
     * @memberof CommentStorage
     */
    static cancleThumbupList(topicHash,commentHash)
    {
        return new Promise((resolve,reject)=>{
            DeviceStorage.get(topicHash).then((data)=>{
                let vals=[];
                if (!kongobj(data)&&!kong(data)) 
                {
                    vals=data;
                    let index = vals.indexOf(commentHash);
                    if (index > -1) {
                        vals.splice(index, 1);
                      }
                  return  DeviceStorage.save(topicHash, vals);
                }
              return true;
            })
            .then((res)=>{
                resolve(true);
            })
        })
    }

    /**
     *获取所有的点赞列表
     *
     * @static
     * @param {*} topicHash
     * @returns
     * @memberof CommentStorage
     */
    static getThumbupList(topicHash){
        return DeviceStorage.get(topicHash);
    }

    

}


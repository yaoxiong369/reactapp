import React,{Component} from 'react'

export default class JsonUtile extends React.Component {

    static jsonToString(data){
        return JSON.parse(data);
    }

    static mapToJson(map){
        return JSON.stringify(JsonUtile.strMapToObj(map))
    }

    static strMapToObj(strMap){
        let obj = Object.create(null);
        for(let[k,v] of strMap){
            obj[k] = v;
        }
        return obj;
    }
}
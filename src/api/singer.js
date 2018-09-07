import axios from 'axios'
import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getSinger() {
  const url = '/api/getSingerList'
  const data = {
    callback: 'getUCGI4291215753167992',
    g_tk: 5381,
    jsonpCallback: 'getUCGI4291215753167992',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: {
      'comm': {'ct': 24, 'cv': 10000},
      'singerList': {
        'module': 'Music.SingerListServer',
        'method': 'get_singer_list',
        'param': {'area': -100, 'sex': -100, 'genre': -100, 'index': -100, 'sin': 0, 'cur_page': 1}
      }
    }
  }
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
    // return res.data
  })
}

export function getSingerDetail(id) {
  const url = ' https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParams, {
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    source: 4001,
    singerid: id,
    order: 'listen',
    num: 100,
    begin: 0,
    _: 1536161012343
  })
  return jsonp(url, data, options)
}

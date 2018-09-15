// import jsonp from 'common/js/jsonp'
import {commonParams} from './config'
import axios from 'axios'

export function getLyric(mid) {
  const url = '/api/lyric'
  const data = Object.assign({}, commonParams, {
    // callback: 'MusicJsonCallback_lrc',
    // pcachetime: 1536924746692,
    songmid: mid,
    g_tk: 61718533,
    // jsonpCallback: 'MusicJsonCallback_lrc',
    // loginUin: 1362433603
    format: 'json',
    hostUin: 0,
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then(res => Promise.resolve(res.data))
}

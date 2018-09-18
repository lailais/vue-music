import {getLyric} from '../../api/lyric'
import {ERR_OK} from '../../api/config'
import {Base64} from 'js-base64'

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    if (this.lyric) { // 判断当前是否已存在lyric
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric) // 解析base64
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid, // 歌曲id
    mid: musicData.songmid, // 歌曲mid
    singer: filterSinger(musicData.singer), // 歌手..
    name: musicData.songname, // 歌曲名字
    album: musicData.albumname, // 专辑名字
    duration: musicData.interval, // 播放时长
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=5854437262&vkey=756E7DE99BEAFF17334AABC2155E51CAD3F004CB40539A69BDACB7DB03E09F7706797A1EF01B2E6D977A51AF13C6234E0AA0FF6569671C89&uin=0&fromtag=38`
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/') // 歌手数组转成字符串并以/隔开
}

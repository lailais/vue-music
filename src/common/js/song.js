import {getLyric} from '../../api/lyric'
// import {ERR_OK} from 'api/config'
// import {Base64} from 'js-base64'

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
    // if (this.lyric) {
    //   return Promise.resolve(this.lyric)
    // }
    //
    // return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        console.log(res)
      // }
        // if (res.retcode === ERR_OK) {
        //   this.lyric = Base64.decode(res.lyric)
        //   resolve(this.lyric)
        // } else {
        //   reject('no lyric')
        // }
      })
  //   })
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
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=5854437262&vkey=F06E5724447C78283AB6AB3BF3708BF3117B1C85D82396B4C5A9EEFD47ACB81B2EDEC7958F121A969D4278161D8EE0C80680D48A612DFBBF&uin=0&fromtag=38`
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

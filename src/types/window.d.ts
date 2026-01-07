/**
 * 扩展 Window 接口以支持 webkitAudioContext
 */
interface Window {
  webkitAudioContext?: typeof AudioContext
}


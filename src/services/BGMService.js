/**
 * BGM を管理するサービスクラス。
 * 
 * @class
 * @exports BGMService
 * @property {HTMLAudioElement} audio BGMオーディオ要素
 */
export default class BGMService {

  /**
   * BGMService インスタンスを生成します。
   *
   * @param {string} bgmUrl BGMのURL
   */
  constructor(bgmUrl) {
    this.audio = new Audio(bgmUrl);

    this.audio.preload = "auto";
    this.audio.loop = true;
    this.audio.volume = 0.4;
  }

  /**
   * BGMを再生します。
   *
   * @returns {void}
   */
  play() {
    this.audio.play().catch(() => {});
  }

  /**
   * BGMを停止します。
   *
   * @returns {void}
   */
  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  /**
   * BGMを一時停止します。
   *
   * @returns {void}
   */
  pause() {
    this.audio.pause();
  }

  /**
   * BGMを再開します。
   *
   * @returns {void}
   */
  resume() {
    this.audio.play().catch(() => {});
  }

  /**
   * 音量を変更します。
   *
   * @param {number} volume 0～1
   */
  setVolume(volume) {
    this.audio.volume = volume;
  }
}

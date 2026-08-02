/**
 * Audio を管理するサービスクラス(SE 用途)
 */
export default class AudioService {

  /**
   * AudioService インスタンスを生成します。
   *
   * @param {string} bounceSEUrl ボール反射音の音声ファイルURL
   */
  constructor(bounceSEUrl) {
    /**
     * SE の音声データです。
     *
     * @type {HTMLAudioElement}
     */
    this.bounceSE = new Audio(bounceSEUrl);
    this.bounceSE.preload = "auto";
  }

  /**
   * SE を再生します。
   *
   * @returns {void}
   */
  playBounce() {
    const sound = this.bounceSE.cloneNode();
    sound.volume = 0.5;
    sound.play().catch(() => {});
  }
}

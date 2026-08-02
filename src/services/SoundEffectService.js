/**
 * SoundEffect を管理するサービスクラス。
 */
export default class SoundEffectService {

  /**
   * SoundEffectService インスタンスを生成します。
   *
   * @param {string} soundEffectUrl 音声ファイルの URL
   */
  constructor(soundEffectUrl) {
    /**
     * SoundEffect の音声データです。
     *
     * @type {HTMLAudioElement}
     */
    this.audio = new Audio(soundEffectUrl);
    this.audio.preload = "auto";
  }

  /**
   * SoundEffect を再生します。
   *
   * @returns {void}
   */
  playBounce() {
    const sound = this.audio.cloneNode();
    sound.volume = 0.5;
    sound.play().catch(() => {});
  }
}

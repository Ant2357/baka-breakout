/**
 * SoundEffect を管理するサービスクラス。
 * 
 * @class
 * @exports SoundEffectService
 * @property {AudioContext} audioContext Web Audio API の AudioContext
 * @property {AudioBuffer|null} audioBuffer 効果音の音声データ
 * @property {number} volume 効果音の音量
 */
export default class SoundEffectService {

  /**
   * SoundEffectService Constructor
   *
   * @param {string} soundEffectUrl 音声ファイルの URL
   */
  constructor(soundEffectUrl) {
    this.audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();

    this.audioBuffer = null;

    this.volume = 0.5;

    /**
     * 効果音の読み込み処理。
     */
    this.load(soundEffectUrl);
  }

  /**
   * 効果音を読み込みます。
   *
   * @param {string} soundEffectUrl 音声ファイルの URL
   *
   * @returns {Promise<void>}
   */
  async load(soundEffectUrl) {
    try {
      const response = await fetch(soundEffectUrl);
      const arrayBuffer = await response.arrayBuffer();

      this.audioBuffer =
        await this.audioContext.decodeAudioData(arrayBuffer);

    } catch (error) {
      console.error("効果音の読み込みに失敗しました:", error);
    }
  }

  /**
   * AudioContext が停止している場合は再開します。
   *
   * @returns {Promise<void>}
   */
  async resumeContext() {
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
  }

  /**
   * 効果音を再生します。
   *
   * @returns {void}
   */
  play() {
    // 効果音の読み込みが完了していない場合は何もしない
    if (!this.audioBuffer) {
      return;
    }

    this.resumeContext().then(() => {

      /**
       * 効果音を再生するための AudioBufferSourceNode
       *
       * @type {AudioBufferSourceNode}
       */
      const source = this.audioContext.createBufferSource();
      source.buffer = this.audioBuffer;

      /**
       * 効果音の音量を制御します。
       *
       * @type {GainNode}
       */
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = this.volume;

      // 音声を接続
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // 再生
      source.start();

      // 再生終了後にAudioNodeを解放
      source.addEventListener("ended", () => {
        source.disconnect();
        gainNode.disconnect();
      });
    }).catch(() => {});
  }
}

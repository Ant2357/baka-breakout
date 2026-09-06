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
     * Web Audio API の AudioContext
     *
     * @type {AudioContext}
     */
    this.audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();

    /**
     * 効果音の音声データ。
     *
     * @type {AudioBuffer|null}
     */
    this.audioBuffer = null;

    /**
     * 効果音の音量。
     *
     * @type {number}
     */
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
  playBounce() {
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

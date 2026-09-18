/**
 * プレイヤーが操作するパドルを表すクラス。
 * 
 * @class
 * @exports Paddle
 * @property {number} x パドルのX座標
 * @property {number} y パドルのY座標
 * @property {number} w パドルの幅
 * @property {number} h パドルの高さ
 */
export default class Paddle {

  /**
   * Paddle インスタンスを生成します。
   *
   * @param {number} x パドルの初期X座標
   * @param {number} y パドルの初期Y座標
   * @param {number} width パドルの幅
   * @param {number} height パドルの高さ
   */
  constructor(x, y, width, height) {
    /**
     * パドルのX座標です。
     * @type {number}
     */
    this.x = x;

    /**
     * パドルのY座標です。
     * @type {number}
     */
    this.y = y;

    /**
     * パドルの幅です。
     * @type {number}
     */
    this.w = width;

    /**
     * パドルの高さです。
     * @type {number}
     */
    this.h = height;
  }

  /**
   * パドルを指定したマウス位置へ移動します。
   *
   * パドルがキャンバス外へはみ出さないように、
   * 左右の端で移動範囲を制限します。
   *
   * @param {number} mouseX マウスのX座標
   * @param {number} canvasWidth キャンバスの幅
   * @returns {void}
   */
  moveTo(mouseX, canvasWidth) {
    const half = this.w / 2;
    this.x = Math.max(
      half,
      Math.min(mouseX, canvasWidth - half)
    );
  }
}

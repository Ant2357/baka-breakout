/**
 * プレイヤーが操作するパドルを表すクラス。
 * 
 * @class
 * @exports Paddle
 * @property {number} x パドルのX座標
 * @property {number} y パドルのY座標
 * @property {number} w パドルの幅
 * @property {number} h パドルの高さ
 * @property {number} speed パドルの移動速度
 */
export default class Paddle {

  /**
   * Paddle Constructor
   *
   * @param {number} x パドルの初期X座標
   * @param {number} y パドルの初期Y座標
   * @param {number} width パドルの幅
   * @param {number} height パドルの高さ
   * @param {number} [speed=8] パドルの移動速度
   */
  constructor(x, y, width, height, speed = 8) {
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

    /**
     * パドルの移動速度です。
     * @type {number}
     */
    this.speed = speed;
  }

  /**
   * パドルを指定した方向ベクトルに基づき移動します。
   * 画面からはみ出さないように座標を制限します。
   *
   * @param {number} dx X方向の移動値 (-1, 0, 1)
   * @param {number} dy Y方向の移動値 (-1, 0, 1)
   * @param {number} canvasWidth キャンバスの幅
   * @param {number} canvasHeight キャンバスの高さ
   * @returns {void}
   */
  move(dx, dy, canvasWidth, canvasHeight) {
    const halfW = this.w / 2;
    const halfH = this.h / 2;

    // 斜め移動時の速度を一定にするための正規化
    const length = Math.hypot(dx, dy);
    if (length > 0) {
      dx /= length;
      dy /= length;
    }

    this.x += dx * this.speed;
    this.y += dy * this.speed;

    // X軸の画面外判定
    this.x = Math.max(halfW, Math.min(this.x, canvasWidth - halfW));

    // Y軸の画面外判定
    this.y = Math.max(halfH, Math.min(this.y, canvasHeight - halfH));
  }

  /**
   * パドルを指定したマウス位置へ移動します。
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

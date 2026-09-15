/**
 * ブロック崩しで使用するボールを表すクラス。
 *
 * ボールの位置・速度・半径・生存状態を管理し、
 * 移動や反射に関する基本的な操作を提供します。
 * 
 * @class
 * @exports Ball
 */
export default class Ball {

  /**
   * Ball インスタンスを生成します。
   *
   * @param {number} x 初期X座標
   * @param {number} y 初期Y座標
   * @param {number} vx X方向の速度
   * @param {number} vy Y方向の速度
   * @param {number} [radius=8] ボールの半径
   */
  constructor(x, y, vx, vy, radius = 8) {
    /**
     * ボールのX座標です。
     * @type {number}
     */
    this.x = x;

    /**
     * ボールのY座標です。
     * @type {number}
     */
    this.y = y;

    /**
     * X方向の速度です。
     * @type {number}
     */
    this.vx = vx;

    /**
     * Y方向の速度です。
     * @type {number}
     */
    this.vy = vy;

    /**
     * ボールの半径です。
     * @type {number}
     */
    this.radius = radius;

    /**
     * ボールが有効かどうかを表します。
     * @type {boolean}
     */
    this.alive = true;

    /**
     * ブロックと衝突した回数です。
     * @type {number}
     */
    this.bounces = 0;
  }

  /**
   * ボールの位置を現在の速度に応じて更新します。
   *
   * @returns {void}
   */
  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  /**
   * ボールの速度を設定します。
   *
   * @param {number} vx 新しいX方向の速度
   * @param {number} vy 新しいY方向の速度
   * @returns {void}
   */
  setVelocity(vx, vy) {
    this.vx = vx;
    this.vy = vy;
  }

  /**
   * X方向の速度を反転します。
   *
   * @returns {void}
   */
  reverseX() {
    this.vx *= -1;
  }

  /**
   * Y方向の速度を反転します。
   *
   * @returns {void}
   */
  reverseY() {
    this.vy *= -1;
  }

  /**
   * ボールを消滅状態にします。
   *
   * @returns {void}
   */
  destroy() {
    this.alive = false;
  }
}

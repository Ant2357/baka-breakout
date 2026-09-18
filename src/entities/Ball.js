/**
 * ブロック崩しで使用するボールを表すクラス。
 *
 * ボールの位置・速度・半径・生存状態を管理し、
 * 移動や反射に関する基本的な操作を提供します。
 * 
 * @class
 * @exports Ball
 * @property {number} x ボールのX座標
 * @property {number} y ボールのY座標
 * @property {number} vx ボールのX方向の速度
 * @property {number} vy ボールのY方向の速度
 * @property {number} [radius=8] ボールの半径
 * @property {boolean} [alive=true] ボールが生存状態
 * @property {number} [bounces=0] ブロックと衝突した回数
 */
export default class Ball {

  /**
   * Ball インスタンスを生成します。
   *
   * @param {number} x ボールのX座標
   * @param {number} y ボールのY座標
   * @param {number} vx ボールのX方向の速度
   * @param {number} vy ボールのY方向の速度
   * @param {number} [radius=8] ボールの半径
   * @param {boolean} [alive=true] ボールが生存状態
   * @param {number} [bounces=0] ブロックと衝突した回数
   */
  constructor(x, y, vx, vy, radius = 8, alive = true, bounces = 0) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.alive = alive;
    this.bounces = bounces;
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

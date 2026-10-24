/**
 * ボスが発射するパドル攻撃用の小さい三角形の弾クラス。
 * 
 * @class
 * @exports BossBullet
 * @property {number} x 生成X座標
 * @property {number} y 生成Y座標
 * @property {number} vx X方向速度
 * @property {number} vy Y方向速度
 * @property {number} size 弾のサイズ
 * @property {boolean} alive 生存状態
 */
export default class BossBullet {
  /**
   * BossBullet Constructor
   * 
   * @param {number} x 生成X座標
   * @param {number} y 生成Y座標
   * @param {number} vx X方向速度
   * @param {number} vy Y方向速度
   */
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = 600;
    this.alive = true;
  }

  /**
   * 弾の位置を更新します。
   */
  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  /**
   * 弾を消滅させます。
   */
  destroy() {
    this.alive = false;
  }
}

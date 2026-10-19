import BossBullet from "./BossBullet";

/**
 * 三角形のボスキャラクラス。
 * 
 * @class
 * @exports Boss
 */
export default class Boss {
  /**
   * @param {p5} p p5.js インスタンス
   * @param {number} canvasWidth キャンバスの幅
   */
  constructor(p, canvasWidth) {
    this.p = p;
    this.x = canvasWidth / 2;
    this.y = 110;
    this.w = 120;
    this.h = 90;
    this.maxHp = 400;
    this.hp = this.maxHp;
    this.alive = true;

    this.vx = 2.5; // 左右移動速度
    this.shootTimer = 0;
  }

  /**
   * ボスの位置や攻撃タイマーを更新します。
   * 
   * @param {number} canvasWidth キャンバスの幅
   * @returns {boolean} 弾を発射するタイミングかどうか
   */
  update(canvasWidth) {
    if (!this.alive) return false;

    // 左右に往復移動
    this.x += this.vx;
    if (this.x < this.w / 2 + 30 || this.x > canvasWidth - this.w / 2 - 30) {
      this.vx *= -1;
    }

    // 一定間隔で弾を発射
    this.shootTimer++;
    if (this.shootTimer >= 150) {
      this.shootTimer = 0;
      return true;
    }
    return false;
  }

  /**
   * ダメージを受けます。
   * 
   * @param {number} [amount=1] ダメージ量
   */
  damage(amount = 1) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
    }
  }

  /**
   * パドルへ向かう小さい三角形の弾を生成します。
   * 
   * @returns {BossBullet}
   */
  createBullet() {
    return new BossBullet(this.x, this.y + this.h / 2, 0, 4.5);
  }
}

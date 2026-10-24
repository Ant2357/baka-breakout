/**
 * パドル被弾時のエフェクトクラス。
 * 
 * @class
 * @exports PaddleHitEffect
 * @property {p5} p p5.js インスタンス
 * @property {boolean} active エフェクトがアクティブかどうか
 * @property {number} duration エフェクトの持続時間
 * @property {number} currentFrame 現在のフレーム数
 * @property {number} x 被弾地点X
 * @property {number} y 被弾地点Y
 */
export default class PaddleHitEffect {
  /**
   * PaddleHitEffect Constructor
   * 
   * @param {p5} p p5.js インスタンス
   */
  constructor(p) {
    this.p = p;
    this.active = false;
    this.duration = 25;
    this.currentFrame = 0;
    this.x = 0;
    this.y = 0;
  }

  /**
   * 被弾エフェクトを発動します。
   * 
   * @param {number} x 被弾地点X
   * @param {number} y 被弾地点Y
   */
  trigger(x, y) {
    this.active = true;
    this.currentFrame = this.duration;
    this.x = x;
    this.y = y;
  }

  /**
   * 被弾タイマーの更新。
   */
  update() {
    if (!this.active) return;
    this.currentFrame--;
    if (this.currentFrame <= 0) {
      this.active = false;
    }
  }

  /**
   * エフェクトの描画。
   */
  draw() {
    if (!this.active) return;
    const p = this.p;

    p.push();
    const progress = 1 - this.currentFrame / this.duration;

    // 画面赤フラッシュ
    p.fill(255, 0, 0, (1 - progress) * 100);
    p.rect(0, 0, p.width, p.height);

    // パドル周辺の拡がる赤いリング
    p.noFill();
    p.stroke(255, 50, 50, (1 - progress) * 255);
    p.strokeWeight(4);
    p.ellipse(this.x, this.y, progress * 140);

    p.pop();
  }
}
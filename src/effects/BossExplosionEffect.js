/**
 * ボス撃破時の爆発エフェクトクラス。
 * 
 * @class
 * @exports BossExplosionEffect
 * @property {p5} p p5.js インスタンス
 * @property {Array} particles 爆発パーティクルの配列
 * @property {boolean} active エフェクトがアクティブかどうか
 * @property {number} duration エフェクトの持続時間
 * @property {number} currentFrame 現在のフレーム数
 */
export default class BossExplosionEffect {
  /**
   * @param {p5} p p5.js インスタンス
   */
  constructor(p) {
    this.p = p;
    this.particles = [];
    this.active = false;
    this.duration = 60;
    this.currentFrame = 0;
  }

  /**
   * 爆発エフェクトを発動します。
   * 
   * @param {number} x 爆発の中心X
   * @param {number} y 爆発の中心Y
   */
  trigger(x, y) {
    this.active = true;
    this.currentFrame = this.duration;
    this.particles = [];

    // 破片パーティクルを多数生成
    for (let i = 0; i < 40; i++) {
      const angle = this.p.random(this.p.TWO_PI);
      const speed = this.p.random(2, 12);
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: this.p.random(6, 18),
        color: this.p.color(
          255,
          this.p.random(50, 180),
          this.p.random(0, 100)
        )
      });
    }
  }

  /**
   * パーティクルの更新処理。
   */
  update() {
    if (!this.active) return;

    this.currentFrame--;
    if (this.currentFrame <= 0) {
      this.active = false;
      return;
    }

    for (const part of this.particles) {
      part.x += part.vx;
      part.y += part.vy;
      part.vx *= 0.96; // 減速
      part.vy *= 0.96;
    }
  }

  /**
   * 爆発エフェクトを描画します。
   */
  draw() {
    if (!this.active) return;
    const p = this.p;

    p.push();
    p.noStroke();

    // 撃破瞬間のホワイトフラッシュ
    if (this.currentFrame > this.duration - 10) {
      p.fill(255, 255, 255, 180);
      p.rect(0, 0, p.width, p.height);
    }

    // 粒子描画
    const progress = this.currentFrame / this.duration;
    for (const part of this.particles) {
      p.fill(part.color);
      p.ellipse(part.x, part.y, part.size * progress);
    }

    p.pop();
  }
}

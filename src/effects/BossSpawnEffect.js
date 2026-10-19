/**
 * ボス登場時のエフェクトクラス。
 * 
 * @class
 * @exports BossSpawnEffect
 */
export default class BossSpawnEffect {
  /**
   * @param {p5} p p5.js インスタンス
   */
  constructor(p) {
    this.p = p;
    this.active = false;
    this.duration = 80; // 表示フレーム数
    this.currentFrame = 0;
  }

  /**
   * エフェクトを発動します。
   */
  trigger() {
    this.active = true;
    this.currentFrame = this.duration;
  }

  /**
   * タイマーを更新します。
   */
  update() {
    if (!this.active) return;
    this.currentFrame--;
    if (this.currentFrame <= 0) {
      this.active = false;
    }
  }

  /**
   * エフェクトを描画します。
   */
  draw() {
    if (!this.active) return;
    const p = this.p;

    p.push();
    const alpha = p.map(this.currentFrame, 0, this.duration, 0, 160);
    p.fill(255, 0, 60, alpha * 0.4);
    p.rect(0, 0, p.width, p.height);

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(38);
    p.fill(255, 80, 80);
    p.text("⚠️ WARNING: BOSS APPROACHING ⚠️", p.width / 2, p.height / 2);
    p.pop();
  }
}

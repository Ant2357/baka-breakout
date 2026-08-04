/**
 * 衝突時に表示する集中線エフェクト。
 */
export default class ImpactLineEffect {

  /**
   * @param {p5} p
   */
  constructor(p) {
    this.p = p;
    this.timer = 0;
    this.duration = 50;
  }

  /**
   * エフェクト開始
   */
  trigger() {
    this.timer = Math.max(
      this.timer,
      this.duration
    );
  }

  /**
   * 更新
   */
  update() {
    if (this.timer > 0) {
      this.timer--;
    }
  }

  /**
   * 描画
   */
  draw() {
    if (this.timer <= 0) {
      return;
    }

    const p = this.p;

    const alpha =
      p.map(
        this.timer,
        0,
        this.duration,
        0,
        180
      );

    p.push();

    p.translate(
      p.width / 2,
      p.height / 2
    );

    p.stroke(255, alpha);
    p.strokeWeight(2);

    const lineCount = 80;

    for (let i = 0; i < lineCount; i++) {
      const angle = p.TWO_PI * i / lineCount;

      const start = p.random(20, 70);
      const end = Math.max(p.width, p.height);

      const x1 = Math.cos(angle) * start;
      const y1 = Math.sin(angle) * start;
      const x2 = Math.cos(angle) * end;
      const y2 = Math.sin(angle) * end;

      p.line(
        x1,
        y1,
        x2,
        y2
      );
    }

    p.pop();
  }
}

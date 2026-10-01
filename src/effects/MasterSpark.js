/**
 * 霧雨魔理沙の「マスタースパーク」エフェクト・攻撃処理クラス
 * 
 * @class
 * @exports MasterSpark
 * @property {p5} p p5.js インスタンス
 * @property {AudioService} audio 効果音を再生するサービス
 * @property {boolean} active マスタースパークが発射中かどうか
 * @property {number} duration 照射フレーム数 (約1秒)
 * @property {number} currentFrame 現在のフレーム数
 * @property {number} x 発射X座標 (パドルの中心)
 * @property {number} y 発射Y座標 (パドルの上面)
 * @property {number} beamWidth ビームの極太幅 (px)
 * @property {Array} stars 星のエフェクト用配列
 */
export default class MasterSpark {
  /**
   * @param {p5} p p5.js インスタンス
   * @param {AudioService} masterSparkSE マスタースパークの効果音を再生するサービス
   * @param {AudioService} killBrickSE ブロック破壊時の効果音を再生するサービス 
   */
  constructor(p, masterSparkSE, killBrickSE) {
    this.p = p;
    this.masterSparkSE = masterSparkSE;
    this.killBrickSE = killBrickSE;

    this.active = false;
    this.duration = 60; // 照射フレーム数 (約1秒)
    this.currentFrame = 0;
    this.x = 0;
    this.y = 0;
    this.beamWidth = 35; // ビームの極太幅 (px)

    // 星のエフェクト用
    this.stars = [];
  }

  /**
   * マスタースパークを発射します
   * @param {number} x 発射X座標 (パドルの中心)
   * @param {number} y 発射Y座標 (パドルの上面)
   */
  trigger(x, y) {
    this.active = true;
    this.currentFrame = this.duration;
    this.x = x;
    this.y = y;

    if (this.masterSparkSE) {
      this.masterSparkSE.play();
    }

    // 星エフェクトの初期化
    this.stars = [];
    for (let i = 0; i < 30; i++) {
      this.stars.push({
        x: this.p.random(-this.beamWidth / 2, this.beamWidth / 2),
        y: this.p.random(0, this.y),
        size: this.p.random(8, 20),
        speedY: this.p.random(-15, -5),
        color: this.p.color(this.p.random(200, 255), this.p.random(200, 255), 255)
      });
    }
  }

  /**
   * パドルの移動に合わせて位置を更新し、衝突判定とタイマー処理を行います
   * @param {number} paddleX 現在のパドルX座標
   * @param {number} paddleY 現在のパドルY座標
   * @param {GameState} state ゲーム状態
   * @param {ImpactLineEffect} impactEffect 衝突エフェクト
   */
  update(paddleX, paddleY, state, impactEffect) {
    if (!this.active) return;

    // パドルに追従
    this.x = paddleX;
    this.y = paddleY;

    this.currentFrame--;
    if (this.currentFrame <= 0) {
      this.active = false;
      return;
    }

    // ビーム領域内のブロックを破壊
    const leftX = this.x - this.beamWidth / 2;
    const rightX = this.x + this.beamWidth / 2;

    // let destroyedInThisFrame = 0;

    for (const brick of state.bricks) {
      if (brick.hit) continue;

      // ブロックがビームの横幅内に存在するか判定
      const brickRight = brick.x + brick.w;
      const brickBottom = brick.y + brick.h;

      if (
        brickRight >= leftX &&
        brick.x <= rightX &&
        brickBottom <= this.y
      ) {
        brick.destroy();
        state.score += 10;

        if (this.killBrickSE) {
          this.killBrickSE.play();
        }

        // destroyedInThisFrame++;
        if (impactEffect) {
          impactEffect.trigger();
        }
      }
    }

    // 星エフェクトの更新
    for (const star of this.stars) {
      star.y += star.speedY;
      if (star.y < 0) {
        star.y = this.y;
        star.x = this.p.random(-this.beamWidth / 2, this.beamWidth / 2);
      }
    }
  }

  /**
   * 圧倒的な極太ビームと光彩を描画します
   */
  draw() {
    if (!this.active) return;

    const p = this.p;

    p.push();
    // 加算合成で発光感を演出
    p.blendMode(p.ADD);
    p.noStroke();

    // 時間経過に応じたビームの太さの拡縮(出現と消滅時にアニメーション)
    const progress = this.currentFrame / this.duration;
    let scale = 1;
    if (progress > 0.8) {
      scale = p.map(progress, 1, 0.8, 0, 1);
    } else if (progress < 0.2) {
      scale = p.map(progress, 0.2, 0, 1, 0);
    }

    const currentWidth = this.beamWidth * scale;

    // 1. 外側の虹色・オーラ(レイヤー重ね描画)
    const layers = [
      { w: currentWidth * 1.4, color: p.color(255, 0, 128, 50) },
      { w: currentWidth * 1.2, color: p.color(0, 200, 255, 80) },
      { w: currentWidth * 1.0, color: p.color(255, 230, 0, 120) },
      { w: currentWidth * 0.6, color: p.color(255, 255, 255, 200) }
    ];

    for (const layer of layers) {
      p.fill(layer.color);
      p.rect(this.x - layer.w / 2, 0, layer.w, this.y);
    }

    // 2. 発射口周辺の強烈なフラッシュ
    p.fill(255, 255, 200, 220);
    p.ellipse(this.x, this.y, currentWidth * 1.8, currentWidth * 0.8);

    // 3. 飛び散る星のエフェクト
    for (const star of this.stars) {
      p.fill(star.color);
      p.rect(this.x + star.x, star.y, star.size, star.size);
    }

    p.pop();
  }
}

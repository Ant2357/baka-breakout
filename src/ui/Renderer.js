/**
 * ゲーム画面の描画を管理するクラス。
 * 
 * @class
 * @exports Renderer
 * @property {p5} p p5.js インスタンス
 * @property {p5.Element} shareButton Xシェアボタン
 */
export default class Renderer {

  /**
   * Renderer Constructor
   *
   * @param {p5} p p5.js インスタンス
   */
  constructor(p) {
    this.p = p;

    // Xシェアボタン
    this.shareButton = null;
  }

  /**
   * ゲーム全体を描画します。
   *
   * ゲーム状態に応じて各オブジェクトを描画し、
   * 必要に応じてタイトル画面または結果画面を表示します。
   *
   * @param {GameState} state ゲームの状態
   * @param {Paddle} paddle プレイヤーのパドル
   * @param {ImpactLineEffect} impactEffect 衝突エフェクト
   * @param {BossSpawnEffect} bossSpawnEffect ボス出現エフェクト
   * @returns {void}
   */
  draw(state, paddle, impactEffect, bossSpawnEffect, bossExplosionEffect, paddleHitEffect) {
    this.drawBackground();

    this.drawHUD(state);
    this.drawBricks(state.bricks);
    this.drawPaddle(paddle);
    this.drawBalls(state.balls);

    this.drawBoss(state.boss);
    this.drawBossBullets(state.bossBullets);
    this.drawBossHP(state.boss);

    impactEffect.draw();
    if (bossSpawnEffect) bossSpawnEffect.draw();
    if (bossExplosionEffect) bossExplosionEffect.draw();
    if (paddleHitEffect) paddleHitEffect.draw();

    if (state.title) {
      this.drawTitle();
    }

    if (state.gameOver || state.cleared) {
      this.drawResult(state);
    }

    // Xシェアボタンを更新
    this.updateShareButton(state);
  }

  /**
   * ゲーム背景を描画します。
   *
   * @returns {void}
   */
  drawBackground() {
    const p = this.p;

    p.background(15, 23, 42);

    p.noStroke();
    p.fill(30, 41, 59);
    p.rect(0, 0, p.width, p.height);
  }

  /**
   * HUD（スコア・ライフ・操作説明）を描画します。
   *
   * @param {GameState} state ゲームの状態
   * @returns {void}
   */
  drawHUD(state) {
    const p = this.p;

    p.fill(148, 163, 184);

    p.textAlign(p.LEFT, p.TOP);
    p.textSize(18);
    p.text(`SCORE: ${state.score}`, 20, 18);
    p.text(`LIVES: ${state.lives}`, 20, 42);

    const text = [
      "クリックでボール発射 / Rでリスタート",
      "Mキーでめっちゃ凄いレーザービーム発射",
      "Bキーでボス出現",
    ].join("\n");

    p.text(
      text,
      20,
      p.height - 90
    );
  }

  /**
   * ブロックを描画します。
   *
   * @param {Brick[]} bricks 描画対象のブロック一覧
   * @returns {void}
   */
  drawBricks(bricks) {
    const p = this.p;

    for (const brick of bricks) {
      if (brick.hit) {
        continue;
      }

      p.noStroke();
      p.fill(brick.color);
      p.rect(
        brick.x,
        brick.y,
        brick.w,
        brick.h,
        6
      );
    }
  }

  /**
   * パドルを描画します。
   *
   * @param {Paddle} paddle 描画対象のパドル
   * @returns {void}
   */
  drawPaddle(paddle) {
    const p = this.p;

    p.noStroke();

    p.fill(226, 232, 240);
    p.rectMode(p.CENTER);
    p.rect(
      paddle.x,
      paddle.y,
      paddle.w,
      paddle.h,
      8
    );
    p.rectMode(p.CORNER);
  }

  /**
   * ボールを描画します。
   *
   * @param {Ball[]} balls 描画対象のボール一覧
   * @returns {void}
   */
  drawBalls(balls) {
    const p = this.p;

    for (const ball of balls) {
      this.drawSpeedLines(ball);

      p.noStroke();
      p.fill(250);
      p.circle(
        ball.x,
        ball.y,
        ball.radius * 2
      );
    }
  }

  /**
   * ボールの後方へ集中線を描画します。
   *
   * @param {Ball} ball
   */
  drawSpeedLines(ball) {
    const p = this.p;

    const speed = Math.hypot(
      ball.vx,
      ball.vy
    );

    if (speed < 0.1) {
      return;
    }

    // 移動方向
    const dx = ball.vx / speed;
    const dy = ball.vy / speed;

    // 後方方向
    const backX = -dx;
    const backY = -dy;

    p.push();

    p.stroke(255, 160);
    p.strokeWeight(2);
    p.noFill();

    const lineCount = 12;

    for (let i = 0; i < lineCount; i++) {
      // ボール周囲へばらつかせる
      const offset = p.random(-14, 14);

      const px = -dy * offset;
      const py = dx * offset;

      const length = p.random(18, 45);

      const x1 = ball.x + px;
      const y1 = ball.y + py;
      const x2 = x1 + backX * length;
      const y2 = y1 + backY * length;

      p.line(
        x1,
        y1,
        x2,
        y2
      );
    }

    p.pop();
  }

  /**
   * タイトル画面を描画します。
   *
   * @returns {void}
   */
  drawTitle() {
    const p = this.p;

    p.fill(0, 0, 0, 120);
    p.rect(0, 0, p.width, p.height);

    p.fill(255);
    p.textAlign(
      p.CENTER,
      p.CENTER
    );

    p.textSize(42);
    p.text(
      "めちゃくちゃ頭の悪いブロック崩し",
      p.width / 2,
      p.height / 2 - 20
    );

    p.textSize(18);
    p.text(
      "クリックでスタート",
      p.width / 2,
      p.height / 2 + 24
    );
  }

  /**
   * ゲームオーバーまたはクリア画面を描画します。
   *
   * @param {GameState} state ゲームの状態
   * @returns {void}
   */
  drawResult(state) {
    const p = this.p;

    p.fill(0, 0, 0, 120);
    p.rect(0, 0, p.width, p.height);

    p.fill(255);

    p.textAlign(
      p.CENTER,
      p.CENTER
    );

    p.textSize(42);
    p.text(
      state.gameOver
        ? "GAME OVER"
        : "CLEAR!",
      p.width / 2,
      p.height / 2 - 20
    );

    p.textSize(18);
    p.text(
      "クリックで最初から",
      p.width / 2,
      p.height / 2 + 24
    );
  }

  /**
   * Xシェアボタンの表示状態を更新します。
   *
   * クリア時のみボタンを表示します。
   *
   * @param {GameState} state ゲームの状態
   * @returns {void}
   */
  updateShareButton(state) {
    const p = this.p;

    // クリアしていない場合はボタンを非表示
    if (!state.cleared) {
      if (this.shareButton) {
        this.shareButton.hide();
      }

      return;
    }

    // ボタンがまだ存在しない場合は生成
    if (!this.shareButton) {
      this.shareButton = p.createA(
        "https://x.com/intent/post",
        "𝕏 ポストでシェア"
      );

      this.shareButton.attribute("target", "_blank");

      // ゲーム側のクリック処理にイベントを伝えない
      this.shareButton.mousePressed((event) => {
        event.stopPropagation();
      });

      // ボタン風のデザイン
      this.shareButton.style("display", "inline-block");
      this.shareButton.style("padding", "10px 18px");
      this.shareButton.style("margin-top", "16px");
      this.shareButton.style("background", "#000");
      this.shareButton.style("color", "#fff");
      this.shareButton.style("text-decoration", "none");
      this.shareButton.style("border-radius", "8px");
      this.shareButton.style("font-size", "16px");
      this.shareButton.style("font-family", "sans-serif");
    }

    // シェアする文章
    const text = [
      "「めちゃくちゃ頭の悪いブロック崩し」をクリアしました！",
      "",
      `スコア：${state.score}`,
      "",
      "あなたはクリアできますか？",
      "https://ant2357.github.io/baka-breakout/",
      "#めちゃくちゃ頭の悪いブロック崩し"
    ].join("\n");

    const shareUrl =
      "https://x.com/intent/post?text=" +
      encodeURIComponent(text);

    this.shareButton.attribute(
      "href",
      shareUrl
    );

    // ゲーム画面中央に配置
    this.shareButton.position(
      p.width / 2 - 80,
      p.height / 2 + 55
    );

    this.shareButton.show();
  }

  /**
   * 三角形のボスキャラを描画します。
   * @param {Boss} boss 
   */
  drawBoss(boss) {
    if (!boss || !boss.alive) return;
    const p = this.p;

    p.push();
    p.noStroke();
    p.fill(239, 68, 68); // 赤色の三角形

    // 三角形の頂点計算 (上頂点、左下、右下)
    const x = boss.x;
    const y = boss.y;
    const w = boss.w;
    const h = boss.h;

    p.triangle(
      x, y - h / 2,         // 上
      x - w / 2, y + h / 2, // 左下
      x + w / 2, y + h / 2  // 右下
    );

    // ボスの目玉やコアのアクセント
    p.fill(255, 255, 255);
    p.ellipse(x, y, 20, 20);
    p.fill(0);
    p.ellipse(x, y, 8, 8);

    p.pop();
  }

  /**
   * ボスの放つ小さい三角形の弾を描画します。
   * @param {BossBullet[]} bullets 
   */
  drawBossBullets(bullets) {
    const p = this.p;
    p.push();
    p.noStroke();
    p.fill(244, 63, 94);

    for (const b of bullets) {
      if (!b.alive) continue;
      // 下向きの小さい三角形
      p.triangle(
        b.x, b.y + b.size / 2,
        b.x - b.size / 2, b.y - b.size / 2,
        b.x + b.size / 2, b.y - b.size / 2
      );
    }
    p.pop();
  }

  /**
   * 画面上部にボスのHPゲージを描画します。
   * @param {Boss} boss 
   */
  drawBossHP(boss) {
    if (!boss || !boss.alive) return;
    const p = this.p;

    p.push();
    const barWidth = 300;
    const barHeight = 16;
    const barX = p.width / 2 - barWidth / 2;
    const barY = 20;

    // 背景枠
    p.fill(30, 41, 59, 200);
    p.stroke(148, 163, 184);
    p.strokeWeight(2);
    p.rect(barX, barY, barWidth, barHeight, 4);

    // 現在HPバー
    const hpRatio = Math.max(0, boss.hp / boss.maxHp);
    p.noStroke();
    p.fill(239, 68, 68);
    p.rect(barX + 2, barY + 2, (barWidth - 4) * hpRatio, barHeight - 4, 2);

    // ラベル
    p.fill(255);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(12);
    p.text(`BOSS HP: ${boss.hp} / ${boss.maxHp}`, p.width / 2, barY + barHeight / 2);

    p.pop();
  }
}

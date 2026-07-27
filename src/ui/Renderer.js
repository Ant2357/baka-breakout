/**
 * ゲーム画面の描画を管理するクラス。
 */
export default class Renderer {

  /**
   * Renderer インスタンスを生成します。
   *
   * @param {p5} p p5.js インスタンス
   */
  constructor(p) {
    this.p = p;
  }

  /**
   * ゲーム全体を描画します。
   *
   * ゲーム状態に応じて各オブジェクトを描画し、
   * 必要に応じてタイトル画面または結果画面を表示します。
   *
   * @param {GameState} state ゲームの状態
   * @param {Paddle} paddle プレイヤーのパドル
   * @returns {void}
   */
  draw(state, paddle) {
    const p = this.p;

    this.drawBackground();
    this.drawHUD(state);
    this.drawBricks(state.bricks);
    this.drawPaddle(paddle);
    this.drawBalls(state.balls);

    if (state.title) {
      this.drawTitle();
    }

    if (state.gameOver || state.cleared) {
      this.drawResult(state);
    }
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
    p.text(
      "クリックでボール発射 / Rでリスタート",
      20,
      p.height - 32
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

    p.noStroke();
    p.fill(250);

    for (const ball of balls) {
      p.circle(
        ball.x,
        ball.y,
        ball.radius * 2
      );
    }
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
}

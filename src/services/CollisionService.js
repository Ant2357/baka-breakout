/**
 * ボールの衝突判定を管理するサービスクラス。
 *
 * 壁・パドル・ブロックとの衝突判定を行い、
 * ゲーム状態やボールの挙動を更新します。
 */
export default class CollisionService {

  /**
   * CollisionService インスタンスを生成します。
   *
   * @param {p5} p p5.js インスタンス
   * @param {GameState} state ゲームの状態
   * @param {AudioService} audio 効果音を再生するサービス
   * @param {ImpactLineEffect} impactEffect 衝突エフェクト
   */
  constructor(p, state, audio, impactEffect) {
    this.p = p;
    this.state = state;
    this.audio = audio;
    this.impactEffect = impactEffect;
  }

  /**
   * ボールに対する衝突判定を行います。
   *
   * 壁・パドル・ブロックとの衝突を順番に判定します。
   *
   * @param {Ball} ball 判定対象のボール
   * @param {Paddle} paddle 判定対象のパドル
   * @returns {void}
   */
  handle(ball, paddle) {
    this.handleWall(ball);
    this.handlePaddle(ball, paddle);
    this.handleBricks(ball);
  }

  /**
   * ボールと壁との衝突判定を行います。
   *
   * 左右および上部の壁ではボールを反射し、
   * 画面下まで落下した場合はボールを消滅させます。
   *
   * @param {Ball} ball 判定対象のボール
   * @returns {void}
   */
  handleWall(ball) {
    if (ball.x < ball.radius) {
      ball.x = ball.radius;
      ball.reverseX();
      this.audio.playBounce();
    }

    if (ball.x > this.p.width - ball.radius) {
      ball.x = this.p.width - ball.radius;
      ball.reverseX();
      this.audio.playBounce();
    }

    if (ball.y < ball.radius) {
      ball.y = ball.radius;
      ball.reverseY();
      this.audio.playBounce();
    }

    if (ball.y > this.p.height + 50) {
      ball.destroy();
    }
  }

  /**
   * ボールとパドルとの衝突判定を行います。
   *
   * 衝突位置に応じて反射角度を調整し、
   * ボールの速度が上限を超えないよう制限します。
   *
   * @param {Ball} ball 判定対象のボール
   * @param {Paddle} paddle 判定対象のパドル
   * @returns {void}
   */
  handlePaddle(ball, paddle) {
    if (
      ball.vy > 0 &&
      ball.x > paddle.x - paddle.w / 2 - ball.radius &&
      ball.x < paddle.x + paddle.w / 2 + ball.radius &&
      ball.y + ball.radius >= paddle.y - paddle.h / 2 &&
      ball.y - ball.radius <= paddle.y + paddle.h / 2
    ) {
      ball.y = paddle.y - paddle.h / 2 - ball.radius;
      ball.reverseY();

      const offset =
        (ball.x - paddle.x) /
        (paddle.w / 2);

      ball.vx += offset * 1.8;

      const speed = Math.sqrt(
        ball.vx * ball.vx +
        ball.vy * ball.vy
      );

      if (speed > 11) {
        const scale = 11 / speed;

        ball.vx *= scale;
        ball.vy *= scale;
      }

      this.audio.playBounce();
    }
  }

  /**
   * ボールとブロックとの衝突判定を行います。
   *
   * 衝突したブロックを破壊し、
   * スコアを加算してボールを反射させます。
   *
   * @param {Ball} ball 判定対象のボール
   * @returns {void}
   */
  handleBricks(ball) {
    for (const brick of this.state.bricks) {
      if (brick.hit) {
        continue;
      }

      if (
        ball.x > brick.x &&
        ball.x < brick.x + brick.w &&
        ball.y > brick.y &&
        ball.y < brick.y + brick.h
      ) {
        brick.destroy();
        this.state.score += 10;

        ball.reverseY();
        ball.bounces++;
        this.audio.playBounce();
        this.impactEffect.trigger();
        break;
      }
    }
  }
}

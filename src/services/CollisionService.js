/**
 * 衝突判定を管理するサービスクラス。
 * 
 * 壁・パドル・ブロック、およびマスタースパークとの衝突判定を行い、
 * ゲーム状態やオブジェクトの挙動を更新します。
 * 
 * @class
 * @exports CollisionService
 * @property {p5} p p5.js インスタンス
 * @property {GameState} state ゲームの状態
 * @property {SoundEffectService} audio 効果音を再生するサービス
 * @property {ImpactLineEffect} impactEffect 衝突エフェクト
 */
export default class CollisionService {

  /**
   * CollisionService Constructor
   *
   * @param {p5} p p5.js インスタンス
   * @param {GameState} state ゲームの状態
   * @param {SoundEffectService} audio 効果音を再生するサービス
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
   * マスタースパークとブロックの衝突判定を行います。
   *
   * @param {MasterSpark} masterSpark マスタースパークのインスタンス
   * @returns {void}
   */
  handleMasterSpark(masterSpark) {
    const area = masterSpark.getArea();
    if (!area) return;

    for (const brick of this.state.bricks) {
      if (brick.hit) continue;

      const brickRight = brick.x + brick.w;
      const brickBottom = brick.y + brick.h;

      // ブロックがビームの攻撃エリア内にあるか判定
      if (
        brickRight >= area.leftX &&
        brick.x <= area.rightX &&
        brickBottom <= area.bottomY &&
        brick.y >= area.topY
      ) {
        brick.destroy();
        this.state.score += 10;

        if (this.audio) {
          this.audio.play();
        }

        if (this.impactEffect) {
          this.impactEffect.trigger();
        }
      }
    }
  }

  /**
   * ボールと壁との衝突判定を行います。
   *
   * @param {Ball} ball 判定対象のボール
   */
  handleWall(ball) {
    if (ball.x < ball.radius) {
      ball.x = ball.radius;
      ball.reverseX();
      this.audio.play();
    }

    if (ball.x > this.p.width - ball.radius) {
      ball.x = this.p.width - ball.radius;
      ball.reverseX();
      this.audio.play();
    }

    if (ball.y < ball.radius) {
      ball.y = ball.radius;
      ball.reverseY();
      this.audio.play();
    }

    if (ball.y > this.p.height + 50) {
      ball.destroy();
    }
  }

  /**
   * ボールとパドルとの衝突判定を行います。
   *
   * @param {Ball} ball 判定対象のボール
   * @param {Paddle} paddle 判定対象のパドル
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

      const offset = (ball.x - paddle.x) / (paddle.w / 2);
      ball.vx += offset * 1.8;

      const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      if (speed > 11) {
        const scale = 11 / speed;
        ball.vx *= scale;
        ball.vy *= scale;
      }

      this.audio.play();
    }
  }

  /**
   * ボールとブロックとの衝突判定を行います。
   *
   * @param {Ball} ball 判定対象のボール
   */
  handleBricks(ball) {
    for (const brick of this.state.bricks) {
      if (brick.hit) continue;

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
        this.audio.play();
        this.impactEffect.trigger();
        break;
      }
    }
  }
}

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
   * @param {BossExplosionEffect} bossExplosionEffect ボス爆発エフェクト
   * @param {PaddleHitEffect} paddleHitEffect パドル被弾エフェクト
   */
  constructor(p, state, audio, impactEffect, bossExplosionEffect, paddleHitEffect) {
    this.p = p;
    this.state = state;
    this.audio = audio;
    this.impactEffect = impactEffect;
    this.bossExplosionEffect = bossExplosionEffect;
    this.paddleHitEffect = paddleHitEffect;
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

  /**
   * ボールとボスとの衝突判定を行います。
   * 
   * @param {Boss} boss 判定対象のボス
   * @param {Ball[]} balls ボールの一覧
   */
  handleBoss(boss, balls) {
    if (!boss || !boss.alive) return;

    for (const ball of balls) {
      // 三角形(または簡易的にAABB/円近似)との当たり判定
      // ここではボスの外接矩形をベースに判定します
      const halfW = boss.w / 2;
      const halfH = boss.h / 2;
      
      if (
        ball.x > boss.x - halfW - ball.radius &&
        ball.x < boss.x + halfW + ball.radius &&
        ball.y > boss.y - halfH - ball.radius &&
        ball.y < boss.y + halfH + ball.radius
      ) {
        boss.damage(1);
        ball.reverseY();
        this.audio.play();
        this.impactEffect.trigger();
        this.state.score += 50;

        // ボス死亡判定とエフェクト発動
        if (!boss.alive && this.bossExplosionEffect) {
          this.bossExplosionEffect.trigger(boss.x, boss.y);
        }
        break;
      }
    }
  }

  /**
   * マスタースパークとボスの衝突判定を行います。
   * 
   * @param {MasterSpark} masterSpark 
   * @param {Boss} boss 
   */
  handleMasterSparkBoss(masterSpark, boss) {
    if (!boss || !boss.alive) return;
    const area = masterSpark.getArea();
    if (!area) return;

    const halfW = boss.w / 2;
    const halfH = boss.h / 2;

    if (
      boss.x + halfW >= area.leftX &&
      boss.x - halfW <= area.rightX &&
      boss.y + halfH >= area.topY &&
      boss.y - halfH <= area.bottomY
    ) {
      boss.damage(2); // レーザーは強力にダメージ
      this.state.score += 5;
      if (this.impactEffect) {
        this.impactEffect.trigger();
      }

      // ボス死亡判定とエフェクト発動
      if (!boss.alive && this.bossExplosionEffect) {
        this.bossExplosionEffect.trigger(boss.x, boss.y);
      }
    }
  }

  /**
   * ボスの弾とパドルとの衝突判定を行います。
   * 
   * @param {BossBullet} bullet 
   * @param {Paddle} paddle 
   */
  handleBossBullet(bullet, paddle) {
    if (!bullet.alive) return;

    if (
      bullet.x > paddle.x - paddle.w / 2 - bullet.size / 2 &&
      bullet.x < paddle.x + paddle.w / 2 + bullet.size / 2 &&
      bullet.y > paddle.y - paddle.h / 2 - bullet.size / 2 &&
      bullet.y < paddle.y + paddle.h / 2 + bullet.size / 2
    ) {
      bullet.destroy();
      this.audio.play();

      // 被弾エフェクトを呼び出す
      if (this.paddleHitEffect) {
        this.paddleHitEffect.trigger(bullet.x, paddle.y);
      }
      this.state.loseLife(); // パドルに当たるとライフが減る
    }

    // 画面下部に達したら消す
    if (bullet.y > this.p.height + 20) {
      bullet.destroy();
    }
  }
}

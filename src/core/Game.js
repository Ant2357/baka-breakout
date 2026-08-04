import GameState from "./GameState";
import Ball from "../entities/Ball";
import Paddle from "../entities/Paddle";

import BrickFactory from "../factories/BrickFactory";

import CollisionService from "../services/CollisionService";
import Renderer from "../ui/Renderer";

import ImpactLineEffect from "../effects/ImpactLineEffect";

/**
 * ブロック崩しゲーム全体を管理するクラス。
 *
 * ゲーム状態、ボール・パドル・ブロックの生成、
 * 更新処理、描画処理、入力処理を統括する。
 */
export default class Game {
  /**
   * Game インスタンスを生成します。
   *
   * @param {p5} p p5.js インスタンス
   * @param {AudioService} bounceSE 効果音を再生するサービス
   * @param {BGMService} bgm BGMを再生するサービス
   */
  constructor(p, bounceSE, bgm) {
    this.p = p;
    this.bounceSE = bounceSE;
    this.bgm = bgm;

    this.state = new GameState();

    this.renderer = new Renderer(p);

    this.impactEffect = new ImpactLineEffect(p);

    this.collision = new CollisionService(
      p,
      this.state,
      bounceSE,
      this.impactEffect
    );

    this.paddle = new Paddle(
      p.width / 2,
      p.height - 44,
      120,
      16
    );

    this.createBricks();
  }

  /**
   * 現在のキャンバスサイズに合わせて
   * ブロックを生成します。
   *
   * @returns {void}
   */
  createBricks() {
    this.state.bricks =
      BrickFactory.create(this.p.width, 10, 5);
  }

  /**
   * ゲームを初期状態へリセットします。
   *
   * ライフ・スコア・ブロックなどを初期化し、
   * 新しいボールを生成します。
   *
   * @returns {void}
   */
  reset() {
    this.state.reset();
    this.createBricks();
    this.spawnBall();
  }

  /**
   * パドルの位置からボールを発射します。
   *
   * 指定した座標へ向かうように初速度を計算し、
   * 新しいボールをゲームへ追加します。
   *
   * @param {number} [targetX=this.p.mouseX] 発射方向のX座標
   * @param {number} [targetY=this.p.mouseY] 発射方向のY座標
   * @returns {void}
   */
  spawnBall(targetX = this.p.mouseX, targetY = this.p.mouseY) {
    const originX = this.paddle.x;
    const originY = this.paddle.y - this.paddle.h / 2 - 10;

    const dir = this.p.createVector(
      targetX - originX,
      targetY - originY
    );

    if (dir.magSq() < 1) {
      dir.set(0, -1);
    }

    dir.normalize();
    dir.mult(8);

    dir.y = Math.min(dir.y, -4);

    this.state.addBall(
      new Ball(
        originX,
        originY,
        dir.x,
        dir.y
      )
    );
  }

  /**
   * ゲームを1フレーム更新します。
   *
   * ボールの移動、衝突判定、
   * ライフ管理、ゲームクリア判定を行います。
   *
   * @returns {void}
   */
  update() {
    if (!this.state.isPlaying()) {
      return;
    }

    for (const brick of this.state.bricks) {
      brick.escape(
        this.state.balls,
        this.state.bricks,
        this.p.width
      );
    }

    for (const ball of this.state.balls) {
      ball.update();
      this.collision.handle(ball, this.paddle);
    }

    this.state.removeDeadBalls();

    if (this.state.balls.length === 0) {
      this.state.loseLife();

      if (!this.state.gameOver) {
        this.spawnBall();
      }
    }

    this.impactEffect.update();

    this.state.checkClear();
  }

  /**
   * ゲーム画面を描画します。
   *
   * @returns {void}
   */
  draw() {
    this.renderer.draw(
      this.state,
      this.paddle,
      this.impactEffect
    );
  }

  /**
   * マウス移動時にパドルを移動します。
   *
   * @param {number} x マウスのX座標
   * @returns {void}
   */
  mouseMoved(x) {
    this.paddle.moveTo(
      x,
      this.p.width
    );
  }

  /**
   * マウスクリック時の処理を行います。
   *
   * タイトル画面の開始、ゲームオーバー後のリセット、
   * または新しいボールの発射を行います。
   *
   * @param {number} x マウスのX座標
   * @param {number} y マウスのY座標
   * @returns {void}
   */
  mousePressed(x, y) {
    if (this.state.title) {
      this.state.title = false;
      this.spawnBall(x, y);

      this.bgm.play();
      return;
    }

    if (this.state.gameOver || this.state.cleared) {
      this.reset();
      return;
    }

    this.spawnBall(x, y);
  }

  /**
   * キー入力時の処理を行います。
   *
   * Rキーが押された場合はゲームをリセットします。
   *
   * @param {string} key 押されたキー
   * @returns {void}
   */
  keyPressed(key) {
    if (key === "r" || key === "R") {
      this.reset();
    }
  }

  /**
   * キャンバスサイズ変更時の処理を行います。
   *
   * キャンバスサイズを更新し、
   * パドル位置とブロック配置を再生成します。
   *
   * @param {number} width 新しいキャンバス幅
   * @param {number} height 新しいキャンバス高さ
   * @returns {void}
   */
  resize(width, height) {
    this.p.resizeCanvas(width, height);
    this.paddle.y = height - 44;
    this.createBricks();
  }
}

import GameState from "./GameState";
import Ball from "../entities/Ball";
import Paddle from "../entities/Paddle";

import BrickFactory from "../factories/BrickFactory";

import CollisionService from "../services/CollisionService";
import Renderer from "../ui/Renderer";

import ImpactLineEffect from "../effects/ImpactLineEffect";
import MasterSpark from "../effects/MasterSpark";

/**
 * ブロック崩しゲーム全体を管理するクラス。
 *
 * ゲーム状態、ボール・パドル・ブロックの生成、
 * 更新処理、描画処理、入力処理を統括する。
 * 
 * @class
 * @exports Game
 * @property {p5} p p5.js インスタンス
 * @property {BGMService} bgm BGMを再生するサービス
 * @property {GameState} state ゲームの状態
 * @property {Renderer} renderer ゲーム画面を描画するサービス
 * @property {ImpactLineEffect} impactEffect 衝突エフェクト
 * @property {CollisionService} collision 衝突判定を行うサービス
 * @property {Paddle} paddle パドル
 * @property {boolean} isKeyboardUsed キーボード入力が使用されているかどうか
 */
export default class Game {
  /**
   * Game Constructor
   *
   * @param {p5} p p5.js インスタンス
   * @param {BGMService} bgm BGMを再生するサービス
   * @param {AudioService} screamSE 悲鳴の効果音を再生するサービス
   * @param {AudioService} masterSparkSE マスタースパークの効果音を再生するサービス
   */
  constructor(p, bgm, screamSE, masterSparkSE) {
    this.p = p;
    this.bgm = bgm;

    this.state = new GameState();

    this.renderer = new Renderer(p);

    this.impactEffect = new ImpactLineEffect(p);

    this.masterSpark = new MasterSpark(p, masterSparkSE, screamSE);

    this.collision = new CollisionService(
      p,
      this.state,
      screamSE,
      this.impactEffect
    );

    this.paddle = new Paddle(
      p.width / 2,
      p.height - 44,
      120,
      16
    );

    this.isKeyboardUsed = false;

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

    this.isKeyboardUsed = false;
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
   * キー入力状態をチェックし、パドルを移動させます。
   * 
   * @returns {void}
   */
  handleInput() {
    let dx = 0;
    let dy = 0;

    // いずれかの移動キーが押されたかを判定
    let isKeyPressed = false;

    // 左移動 (A または 左矢印)
    if (this.p.keyIsDown(65) || this.p.keyIsDown(this.p.LEFT_ARROW)) {
      dx -= 1;
      isKeyPressed = true;
    }
    // 右移動 (D または 右矢印)
    if (this.p.keyIsDown(68) || this.p.keyIsDown(this.p.RIGHT_ARROW)) {
      dx += 1;
      isKeyPressed = true;
    }
    // 上移動 (W または 上矢印)
    if (this.p.keyIsDown(87) || this.p.keyIsDown(this.p.UP_ARROW)) {
      dy -= 1;
      isKeyPressed = true;
    }
    // 下移動 (S または 下矢印)
    if (this.p.keyIsDown(83) || this.p.keyIsDown(this.p.DOWN_ARROW)) {
      dy += 1;
      isKeyPressed = true;
    }

    // 一度でもキーが押されたらキーボードフラグをオンにする
    if (isKeyPressed) {
      this.isKeyboardUsed = true;
    }

    // 斜め移動時に移動速度が速くなりすぎないよう正規化
    if (dx !== 0 || dy !== 0) {
      this.paddle.move(dx, dy, this.p.width, this.p.height);
    }
  }

  /**
   * ゲームを1フレーム更新します。
   *
   * ボールの移動、衝突判定、
   * ライフ管理、ゲームクリア判定などを行います。
   * @returns {void}
   */
  update() {
    if (!this.state.isPlaying()) {
      return;
    }

    // パドルのキー入力を反映
    this.handleInput();

    this.masterSpark.update(
      this.paddle.x,
      this.paddle.y,
      this.state,
      this.impactEffect
    );

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

    this.masterSpark.draw();
  }

  /**
   * マウス移動時にパドルを移動します。
   *
   * @param {number} x マウスのX座標
   * @returns {void}
   */
  mouseMoved(x) {
    if (this.isKeyboardUsed) {
      return;
    }

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

    if ((key === "m" || key === "M") && this.state.isPlaying()) {
      this.masterSpark.trigger(this.paddle.x, this.paddle.y);
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

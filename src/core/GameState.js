/**
 * ゲーム全体の状態を管理するクラス。
 *
 * ボール、ブロック、スコア、ライフ、
 * ゲームの進行状態などを保持します。
 * 
 * @class
 * @exports GameState
 * @property {Ball[]} balls ボールの一覧
 * @property {Brick[]} bricks ブロックの一覧
 * @property {number} score 現在のスコア
 * @property {number} lives 残りライフ数
 * @property {boolean} title 現在タイトル画面かどうか
 * @property {boolean} gameOver ゲームオーバー状態かどうか
 * @property {boolean} cleared ゲームクリア状態かどうか
 */
export default class GameState {
  /**
   * GameState Constructor
   */
  constructor() {
    this.balls = [];
    this.bricks = [];
    this.score = 0;
    this.lives = 3;
    this.title = true;
    this.gameOver = false;
    this.cleared = false;
  }

  /**
   * ゲーム状態を初期状態(ゲーム開始状態)へリセットします。
   *
   * ボール・ブロック・スコア・ライフを初期化し、
   * ゲームオーバーおよびクリア状態を解除します。
   *
   * @returns {void}
   */
  reset() {
    this.balls = [];
    this.bricks = [];

    this.score = 0;
    this.lives = 3;

    this.title = false;
    this.gameOver = false;
    this.cleared = false;
  }

  /**
   * ボールをゲームへ追加します。
   *
   * @param {Ball} ball 追加するボール
   * @returns {void}
   */
  addBall(ball) {
    this.balls.push(ball);
  }

  /**
   * 死亡したボールをボール一覧から削除します。
   *
   * @returns {void}
   */
  removeDeadBalls() {
    this.balls = this.balls.filter(ball => ball.alive);
  }

  /**
   * ゲームがプレイ中かどうかを判定します。
   *
   * @returns {boolean}
   * プレイ中の場合は `true`、それ以外は `false`
   */
  isPlaying() {
    return !this.title && !this.gameOver && !this.cleared;
  }

  /**
   * ライフを1つ減らします。
   *
   * ライフが0以下になった場合は
   * ゲームオーバー状態へ移行します。
   *
   * @returns {void}
   */
  loseLife() {
    this.lives--;

    if (this.lives <= 0) {
      this.gameOver = true;
    }
  }

  /**
   * ゲームクリアかどうかを判定します。
   *
   * すべてのブロックが破壊されている場合、
   * クリア状態へ移行します。
   *
   * @returns {void}
   */
  checkClear() {
    this.cleared = this.bricks.every(brick => brick.hit);
  }
}

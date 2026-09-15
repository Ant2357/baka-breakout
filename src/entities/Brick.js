/**
 * ブロック崩しで使用するブロックを表すクラス。
 *
 * ブロックの位置・サイズ・色・破壊状態を管理します。
 * 
 * @class
 * @exports Brick
 */
export default class Brick {

  /**
   * Brick インスタンスを生成します。
   *
   * @param {number} x ブロックのX座標
   * @param {number} y ブロックのY座標
   * @param {number} homeX ブロックのホームポジションX座標
   * @param {number} homeY ブロックのホームポジションY座標
   * @param {number} speed ブロックの移動速度
   * @param {number} width ブロックの幅
   * @param {number} height ブロックの高さ
   * @param {string} color ブロックの描画色
   */
  constructor(
    x,
    y,
    width,
    height,
    color
  ) {
    /**
     * ブロックのX座標です。
     * @type {number}
     */
    this.x = x;

    /**
     * ブロックのY座標です。
     * @type {number}
     */
    this.y = y;

    /**
     * ブロックのホームポジションX座標
     * @type {number}
     */
    this.homeX = x;

    /**
     * ブロックのホームポジションY座標
     * @type {number}
     */
    this.homeY = y;

    /**
     * ブロックの移動速度
     * @type {number}
     */
    this.speed = 4;

    /**
     * ブロックの幅です。
     * @type {number}
     */
    this.w = width;

    /**
     * ブロックの高さです。
     * @type {number}
     */
    this.h = height;

    /**
     * ブロックの描画色です。
     * @type {string}
     */
    this.color = color;

    /**
     * ブロックが破壊済みかどうかを表します。
     *
     * @type {boolean}
     */
    this.hit = false;
  }

  /**
   * ブロックを破壊済み状態にします。
   *
   * @returns {void}
   */
  destroy() {
    this.hit = true;
  }

  /**
   * ブロックが生きているかどうかを判定します。
   *
   * @returns {boolean}
   * 生きている場合は `true`、破壊済みの場合は `false`
   */
  isAlive() {
    return !this.hit;
  }

  /**
   * ボールから逃げます。
   *
   * @param {Ball[]} balls
   * @param {Brick[]} bricks
   * @param {number} canvasWidth
   * @returns {void}
   */
  escape(
    balls,
    bricks,
    canvasWidth
  ) {
    if (this.hit || balls.length === 0) {
      return;
    }

    const centerX = this.x + this.w / 2;
    const centerY = this.y + this.h / 2;

    let moveX = 0;
    let moveY = 0;

    //--------------------------------------------------
    // ボールから逃げる
    //--------------------------------------------------

    let nearest = null;
    let nearestDistSq = Infinity;

    for (const ball of balls) {
      const dx = ball.x - centerX;
      const dy = ball.y - centerY;
      const distSq = dx * dx + dy * dy;

      if (distSq < nearestDistSq) {
        nearestDistSq = distSq;
        nearest = ball;
      }
    }

    const ESCAPE_DISTANCE = 280;
    if (nearestDistSq > ESCAPE_DISTANCE * ESCAPE_DISTANCE) {
      return;
    }

    // 最も近いボールまでの距離
    const distance = Math.sqrt(nearestDistSq);

    if (nearest) {
      const dx = centerX - nearest.x;
      const dy = centerY - nearest.y;
      const len = Math.hypot(dx, dy);

      if (len > 0) {
        moveX += dx / len;
        moveY += dy / len;
      }
    }

    //--------------------------------------------------
    // 他ブロックと離れる
    //--------------------------------------------------

    const separateDistance = this.w;

    for (const brick of bricks) {
      if (brick === this || brick.hit) {
        continue;
      }

      const ox = brick.x + brick.w / 2;
      const oy = brick.y + brick.h / 2;

      const dx = centerX - ox;
      const dy = centerY - oy;

      const dist = Math.hypot(dx, dy);

      if (
        dist > 0 &&
        dist < separateDistance
      ) {
        moveX +=
          dx / dist *
          (separateDistance - dist) /
          separateDistance;

        moveY +=
          dy / dist *
          (separateDistance - dist) /
          separateDistance;
      }
    }

    //--------------------------------------------------
    // 元の位置へ戻ろうとする
    //--------------------------------------------------

    moveX += (this.homeX - this.x) * 0.01;
    moveY += (this.homeY - this.y) * 0.01;

    //--------------------------------------------------
    // ボールが近いほど速く逃げる
    //--------------------------------------------------

    const MIN_SPEED = this.speed;
    const MAX_SPEED = this.speed * 3;

    const t = 1 - distance / ESCAPE_DISTANCE;

    const currentSpeed =
      MIN_SPEED +
      (MAX_SPEED - MIN_SPEED) * t;

    //--------------------------------------------------
    // 移動
    //--------------------------------------------------

    const len = Math.hypot(moveX, moveY);

    if (len > 0) {
      this.x += moveX / len * currentSpeed;
      this.y += moveY / len * currentSpeed;
    }

    this.x = Math.max(
      0,
      Math.min(canvasWidth - this.w, this.x)
    );
  }
}

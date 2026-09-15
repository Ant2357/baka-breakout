import Brick from "../entities/Brick";

/**
 * ブロックを生成するファクトリークラス。
 * 
 * @class
 * @exports BrickFactory
 */
export default class BrickFactory {

  /**
   * キャンバスサイズや行・列数に応じて、
   * ブロックを等間隔で配置した配列を生成します。
   *
   * @param {number} canvasWidth キャンバスの幅
   * @param {number} cols 横方向のブロック数
   * @param {number} rows 縦方向のブロック数
   * @param {Object} [options={}] 生成オプション
   * @param {number} [options.margin=32] 左右の余白
   * @param {number} [options.top=72] 最上段ブロックのY座標
   * @param {number} [options.gap=0] ブロック同士の横方向の間隔
   * @param {number} [options.height=24] ブロックの高さ
   * @returns {Brick[]} 生成されたブロックの配列
   */
  static create(
    canvasWidth,
    cols,
    rows,
    options = {}
  ) {

    const {
      margin = 32,
      top = 72,
      gap = 0,
      height = 24
    } = options;

    const totalGap = gap * (cols - 1);

    const brickWidth =
      (canvasWidth - margin * 2 - totalGap) / cols;

    const colors = [
      "#f97316",
      "#fb7185",
      "#facc15",
      "#34d399",
      "#60a5fa"
    ];

    /** @type {Brick[]} */
    const bricks = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        bricks.push(
          new Brick(
            margin + col * (brickWidth + gap),
            top + row * (height + 10),
            brickWidth,
            height,
            colors[row % colors.length]
          )
        );
      }
    }

    return bricks;
  }
}

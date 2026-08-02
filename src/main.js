import p5 from "p5";

import Game from "./core/Game";
import SoundEffectService from "./services/SoundEffectService";
import BGMService from "./services/BGMService";

/**
 * ブロック崩しゲームのエントリーポイントです。
 */
new p5((p) => {

  /**
   * ゲーム本体です。
   * @type {Game}
   */
  let game;

  /**
   * p5.js の初期化時に呼び出されます。
   */
  p.setup = () => {
    p.createCanvas(
      p.windowWidth,
      p.windowHeight
    );

    const soundUrl = new URL('./assets/sounds/scream.mp3', import.meta.url).href;
    const bounceSE = new SoundEffectService(soundUrl);

    const bgmUrl = new URL("./assets/bgms/bgm.mp3", import.meta.url).href;
    const bgm = new BGMService(bgmUrl);

    game = new Game(
      p,
      bounceSE,
      bgm
    );
  };

  /**
   * 毎フレーム呼び出されます。
   *
   * ゲームの更新および描画を行います。
   */
  p.draw = () => {
    game.update();
    game.draw();
  };

  /**
   * ウィンドウサイズ変更時に呼び出されます。
   */
  p.windowResized = () => {
    game.resize(
      p.windowWidth,
      p.windowHeight
    );
  };

  /**
   * マウス移動時に呼び出されます。
   */
  p.mouseMoved = () => {
    game.mouseMoved(
      p.mouseX
    );
  };

  /**
   * マウスドラッグ時に呼び出されます。
   */
  p.mouseDragged = () => {
    game.mouseMoved(
      p.mouseX
    );
  };

  /**
   * マウスクリック時に呼び出されます。
   */
  p.mousePressed = () => {
    game.mousePressed(
      p.mouseX,
      p.mouseY
    );
  };

  /**
   * キー入力時に呼び出されます。
   */
  p.keyPressed = () => {
    game.keyPressed(
      p.key
    );
  };
});

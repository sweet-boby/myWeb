import { GameObjectManager } from "./GameObjectManager";
import { Singleton } from "./SingleTon";

export enum SceneType {
  None,
  Manu,
  Game,
  Selector,
}

export abstract class Scene extends Singleton {
  sceneType: SceneType = SceneType.None;
  gameObjectManager: GameObjectManager = GameObjectManager.getInstance();
  isGameLoop: boolean = true;
  isInit = false;
  isInitOnce = false;
  async init(callback: () => Promise<void>) {
    if (this.isInit) return Promise.resolve();
    this.isInit = true;
    await callback();
    this.isInit = false;
  }

  async initOnce(callback: () => Promise<void>) {
    if (this.isInitOnce) return;
    this.isInitOnce = true;
    await callback();
  }

  setGameLoop(isGameLoop: boolean) {
    this.isGameLoop = isGameLoop;
  }
  onEnter(resource: any): void {}
  onUpdate(deltaTime: number): void {}
  onDraw(canvas: HTMLCanvasElement): void | CanvasRenderingContext2D {
    const ctx = canvas.getContext("2d");
    if (!canvas) {
      return;
    }
    if (!ctx) {
      return;
    }
    // 获取Canvas元素的实际宽度和高度
    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas?.offsetHeight;

    // 将Canvas的实际宽度和高度设置为获取到的值
    canvas.width = canvasWidth * devicePixelRatio;
    canvas.height = canvasHeight * devicePixelRatio;

    // 清空
    ctx.clearRect(
      0,
      0,
      canvas.offsetWidth as number,
      canvas.offsetHeight as number
    );
    return ctx;
  }
  onExit(): void {}
}

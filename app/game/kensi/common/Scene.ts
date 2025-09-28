import { GameObjectManager } from "./GameObjectManager";

export enum SceneType {
  None,
  Manu,
  Game,
  Selector,
}

export abstract class Scene {
  sceneType: SceneType = SceneType.None;
  gameObjectManager: GameObjectManager = GameObjectManager.getInstance();
  isGameLoop: boolean = true;
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

import { Component } from "../common/GameObjectComponent";
import { Atlas, ResourcesManager } from "../common/ResourcesManager";

export class Animation extends Component {
  protected atlas: Atlas = new Atlas();
  protected timer: number = 0;
  protected interval: number = 1000 / 15;
  protected idxFrame: number = 0;
  protected isLoop: boolean = true;
  protected callback: ((...arg: any) => void) | null = null; // 回调函数，用于在动画结束时执行一些操作;
  resourcesManager = ResourcesManager.getInstance();

  onUpdate(deltaTime: number): void {
    if (!this.atlas) return;
    this.timer += deltaTime;
    if (this.timer >= this.interval) {
      this.timer = 0;
      this.idxFrame++;
      if (this.idxFrame >= this.atlas.getlen()) {
        if (this.isLoop) {
          this.idxFrame = 0;
        } else {
          this.idxFrame = this.atlas.getlen() - 1;
          if (this.callback) this.callback();
        }
      }
    }
  }

  onDraw(ctx: CanvasRenderingContext2D): void {
    const frame = this.getFrame();
    const pos = this.gameObject.transform.position;
    const frameX = frame.width;
    const frameY = frame.height;
    ctx.drawImage(frame, pos.x - frameX / 2, pos.y - frameY / 2);
  }
  //绘制翻转的图片
  onFlipDraw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const x = this.gameObject.transform.position.x;
    const y = this.gameObject.transform.position.y;
    const width = this.getFrame().width;
    const height = this.getFrame().height;
    ctx.translate(x + width / 2, y + height / 2);
    ctx.scale(-1, 1);
    ctx.translate(-(x + width / 2) + width, -(y + height / 2));
    this.onDraw(ctx);
    ctx.restore();
  }

  addAtlasImages(path: string[]) {
    path.map((path) => {
      if (!this.atlas) return;
      this.atlas.addImage(
        this.resourcesManager.getImage(path) as HTMLImageElement
      );
    });
  }

  reset() {
    this.timer = 0;
    this.idxFrame = 0;
  }

  setCallback(callback: (...arg: any) => void) {
    this.callback = callback;
  }

  setAtlas(atlas: Atlas) {
    this.atlas = atlas;
  }

  setIsLoop(isLoop: boolean) {
    this.isLoop = isLoop;
  }

  setInterval(interval: number) {
    this.interval = interval;
  }

  getFrame(): HTMLImageElement {
    return this.atlas?.getImage(this.idxFrame) as HTMLImageElement;
  }

  getIdxFrame(): number {
    return this.idxFrame;
  }

  checkFinish(): boolean {
    if (this.isLoop) {
      return false;
    }
    if (this.atlas) {
      return this.idxFrame >= this.atlas.getlen() - 1;
    } else {
      return false;
    }
  }
}

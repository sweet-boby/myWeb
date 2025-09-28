import { GameObject } from "./GameObject";
export abstract class Component {
  gameObject: GameObject;

  constructor(gameObject: GameObject) {
    this.gameObject = gameObject;
  }
  onStart() {}
  onUpdate(deltaTime: number) {}
  onDraw(ctx: CanvasRenderingContext2D) {}
  onDestroy() {}
}

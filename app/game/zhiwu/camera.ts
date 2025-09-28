import { Vector2 } from "./vector2";

export class Camera {
  private position: Vector2;
  private isShake: boolean = false;

  constructor() {
    this.position = new Vector2(0, 0);
  }

  getPosition() {
    return this.position;
  }

  setPosition(position: Vector2) {
    this.position = position;
  }

  reset(pos: Vector2) {
    this.position = pos;
  }

  onUpdate(deltaTime: number) {
    if (this.isShake) {
      this.position.x += (Math.random() * 10 - 5) * 0.5;
      this.position.y += (Math.random() * 10 - 5) * 0.5;
    }
  }

  shake(time: number) {
    this.isShake = true;
    const pos = new Vector2(this.position.x, this.position.y);
    setTimeout(() => {
      this.isShake = false;
      this.reset(pos);
    }, time);
  }
}

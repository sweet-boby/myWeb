import { Component } from "../common/GameObjectComponent";
import { Body } from "matter-js";
import { PhysicsManager } from "../common/PhysicsManager";
export class CollisionBox extends Component {
  body: Body | null = null;
  callback: ((otherBox: CollisionBox) => void) | null = null;
  private enabled: boolean = true;
  ignoreGravity: boolean = false;
  onDraw(ctx: CanvasRenderingContext2D): void {
    PhysicsManager.getInstance().draw(ctx, this);
  }
  onDestroy(): void {
    PhysicsManager.getInstance().removeBody(this);
  }

  onCallback(otherBox: CollisionBox) {
    if (this.callback) this.callback(otherBox);
  }

  setEnabled(enabled: boolean) {
    if (this.body) {
      if (enabled) {
        this.body.render.fillStyle = "#fff";
        this.enabled = enabled;
      } else {
        this.body.render.fillStyle = "#000";
        this.enabled = enabled;
      }
    }
  }

  getEnabled() {
    return this.enabled;
  }

  setBody(body: Body) {
    PhysicsManager.getInstance().removeBody(this);
    this.body = body;
    PhysicsManager.getInstance().addBody(this);
  }
}

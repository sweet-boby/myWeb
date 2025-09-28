import { Vector2 } from "../vector2";
import { CollisionBox } from "../collisionManege";

export type CollisionShape = {
  y: number;
  left: number;
  right: number;
};

export class Platform {
  img: HTMLImageElement | null = null;
  pos: Vector2 = new Vector2(0, 0);
  collision_box_player: CollisionBox | null = null;

  onDraw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "green";
    ctx.drawImage(this?.img as HTMLImageElement, this.pos.x, this.pos.y);
  }
}

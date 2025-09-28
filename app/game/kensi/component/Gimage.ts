import { Component } from "../common/GameObjectComponent";
import { ResourcesManager } from "../common/ResourcesManager";

export class Gimage extends Component {
  image: HTMLImageElement | null = null;
  resourceManager = ResourcesManager.getInstance();
  onDraw(ctx: CanvasRenderingContext2D): void {
    if (!this.image) return;
    const imgWidth = this.image.width;
    const imgHeight = this.image.height;
    const pos = this.gameObject.transform.position;
    ctx.drawImage(
      this.image,
      pos.x - imgWidth / 2,
      pos.y - imgHeight / 2,
      this.image.width,
      this.image.height
    );
  }
}

import { GameObject, GameObjectTag } from "../common/GameObject";
import { Component } from "../common/GameObjectComponent";
import { GameObjectManager } from "../common/GameObjectManager";

export class Camera extends Component {
  onStart(): void {
    this.gameObject.tag = GameObjectTag.Camera;
  }

  onDraw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(
      -this.gameObject.transform.position.x,
      -this.gameObject.transform.position.y
    );

    // // 获取canvas的宽高
    // const canvasWidth = ctx.canvas.width;
    // const canvasHeight = ctx.canvas.height;
    // //3840 x 2160
    // // 计算缩放比例
    // const scaleX = canvasWidth / 3840;
    // const scaleY = canvasHeight / 2160;

    // ctx.scale(scaleY, scaleY);

    // console.log(canvasWidth, canvasHeight);
    GameObjectManager.getInstance()
      .getGameObjects()
      .forEach((gameObject) => {
        if (gameObject.tag !== GameObjectTag.Camera) {
          gameObject.onDraw(ctx);
        }
      });
    ctx.restore();
  }

  lookAt(target: GameObject): void {
    const cameraPosition = this.gameObject.transform.position;
    const targetPosition = target.transform.position;
    cameraPosition.x = targetPosition.x;
    cameraPosition.y = targetPosition.y;
  }
}

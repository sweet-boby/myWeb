import { GameObjectTag } from "../common/GameObject";
import { Component } from "../common/GameObjectComponent";
import { GameObjectManager } from "../common/GameObjectManager";

export class Camera extends Component {
  onStart(): void {
    this.gameObject.tag = GameObjectTag.Camera;
  }

  onUpdate(deltaTime: number): void {
    // const play = GameObjectManager.getInstance().findGameObjectByName("player");
    // if (!play) return;
    // this.gameObject.transform.position.x = play.transform.position.x;
    // this.gameObject.transform.position.y = play.transform.position.y;
  }
  onDraw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(
      -this.gameObject.transform.position.x,
      -this.gameObject.transform.position.y
    );
    GameObjectManager.getInstance()
      .getGameObjects()
      .forEach((gameObject) => {
        if (gameObject.tag !== GameObjectTag.Camera) {
          gameObject.onDraw(ctx);
        }
      });
    ctx.restore();
  }
}

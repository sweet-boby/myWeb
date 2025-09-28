import { Bodies } from "matter-js";
import { GameObject } from "../../common/GameObject";
import { GameObjectManager } from "../../common/GameObjectManager";
import { CollisionBox } from "../../component/CollisionBox";
import { Gimage } from "../../component/Gimage";
import { PhysicsManager } from "../../common/PhysicsManager";
import { Component } from "../../common/GameObjectComponent";

class BgImage extends Gimage {
  onStart(): void {
    this.image = this.resourceManager.getImage(
      "/kensi/background.png"
    ) as HTMLImageElement;
  }
}

class BgCollisionBox extends Component {
  boxs: CollisionBox[] = [];
  onStart(): void {
    // PhysicsManager.getInstance().setDebugMode(true);
    const img = this.gameObject.findComponent(Gimage)?.image;
    if (!img) return;
    const floor = new CollisionBox(this.gameObject);
    floor.setBody(
      Bodies.rectangle(
        this.gameObject.transform.position.x,
        this.gameObject.transform.position.y + 260,
        img?.width + 200 || 2000,
        5,
        {
          isStatic: true,
          label: "bg1",
          render: { fillStyle: "#256" },
        }
      )
    );
    this.boxs.push(floor);

    const wallLeft = new CollisionBox(this.gameObject);
    wallLeft.setBody(
      Bodies.rectangle(
        this.gameObject.transform.position.x - img?.width / 2,
        0,
        10,
        img?.height || 2000,
        {
          isStatic: true,
          label: "wall2",
          friction: 0,
          frictionStatic: 0,
          render: { fillStyle: "#000" },
        }
      )
    );
    this.boxs.push(wallLeft);

    const wallRight = new CollisionBox(this.gameObject);
    wallRight.setBody(
      Bodies.rectangle(
        this.gameObject.transform.position.x + img?.width / 2,
        0,
        10,
        img?.height || 2000,
        {
          isStatic: true,
          label: "wall3",
          friction: 0,
          frictionStatic: 0,
          render: { fillStyle: "#f8f" },
        }
      )
    );
    this.boxs.push(wallRight);
  }

  onDraw(ctx: CanvasRenderingContext2D): void {
    this.boxs.forEach((box) => {
      box.onDraw(ctx);
    });
  }
  onDestroy(): void {
    this.boxs.forEach((box) => {
      PhysicsManager.getInstance().removeBody(box);
    });
    this.boxs = [];
  }
}

export const bgFactory = () => {
  const bg = new GameObject();
  bg.name = "bg";
  bg.addComponent(BgImage);
  bg.addComponent(BgCollisionBox);
  GameObjectManager.getInstance().add(bg);
  return bg;
};

import { Bodies, Body } from "matter-js";
import { GameObject } from "../../common/GameObject";
import { GameObjectManager } from "../../common/GameObjectManager";
import { Animation } from "../../component/Animation";
import { AnimationManager } from "../../component/AnimationManager";
import { CollisionBox } from "../../component/CollisionBox";
import { Controller } from "../../component/controller";
import { getImgUtils } from "../../Util/ImgUtil";
import { PhysicsManager } from "../../common/PhysicsManager";
import { table, time } from "console";
import { Player } from "./player";
import { PlayerController } from "./playerController";

class PlayController extends Controller {
  left: boolean = false;
  right: boolean = false;
  up: boolean = false;
  down: boolean = false;
  keydownCallback = (e: KeyboardEvent) => {
    switch (e.key) {
      case "w":
        this.up = true;
        break;
      case "s":
        this.down = true;
        break;
      case "a":
        this.left = true;
        break;
      case "d":
        this.right = true;

        break;
    }
  };
  keyupCallback = (e: KeyboardEvent) => {
    switch (e.key) {
      case "w":
        this.up = false;
        break;
      case "s":
        this.down = false;
        break;
      case "a":
        this.left = false;
        break;
      case "d":
        this.right = false;
        break;
    }
  };
  onUpdate(deltaTime: number): void {
    const box = this.gameObject.findComponent(CollisionBox);
    const body = box?.body;
    if (!body) return;
    const velocity = Body.getVelocity(body);

    if (this.left) {
      Body.setVelocity(body, {
        x: -6,
        y: velocity.y,
      });
      this.gameObject
        .findComponent(PlayAnimationManager)
        ?.playAnimation("left");
    }
    if (this.right) {
      Body.setVelocity(body, {
        x: 6,
        y: velocity.y,
      });
      this.gameObject
        .findComponent(PlayAnimationManager)
        ?.playAnimation("right");
    }
    if (this.up) {
      const box = this.gameObject.findComponent(CollisionBox);
      if (box?.body) {
        const v = Body.getVelocity(box.body);
        if (v.y == 0)
          Body.setVelocity(box.body, {
            x: velocity.x,
            y: -12,
          });
      }
    }
    if (this.down) {
      // Body.setVelocity(body, {
      //   x: velocity.x,
      //   y: 6,
      // });
    }
  }
}

class PlayAnimationManager extends AnimationManager {
  onStart(): void {
    const img = this.resourcesManager.getImage("/kensi/player/idle.png");
    const { imageToAtlas } = getImgUtils();
    if (!img) return;
    imageToAtlas(img, 5).then((atlas) => {
      const idle = new Animation(this.gameObject);
      idle.setAtlas(atlas);
      idle.setInterval(1000 / 5);
      this.animations.set("idle", idle);
      this.playAnimation("idle");
    });
  }
}

class PlayCollisionBox extends CollisionBox {
  onStart(): void {
    this.body = Bodies.rectangle(
      this.gameObject.transform.position.x,
      this.gameObject.transform.position.y,
      50,
      80,
      {
        label: "player",
        isStatic: false,
        isSleeping: false,
        isSensor: false,
        inertia: Infinity, // Prevent rotation
        angularVelocity: 0, // Ensure no initial angular velocity
        frictionAir: 0, // Remove air friction that might cause rotation
      }
    );

    this.onCallback = (collision: any) => {};
    PhysicsManager.getInstance().addBody(this);
  }
  onUpdate(deltaTime: number): void {
    if (!this.body) return;
    this.gameObject.transform.position.x = this.body.position.x;
    this.gameObject.transform.position.y = this.body.position.y - 20;
  }
}

export const playerFactory = () => {
  const play = new GameObject();
  play.name = "player";
  play.transform.position.x = -500;
  // play.addComponent(PlayAnimationManager);
  // play.addComponent(PlayController);
  // play.addComponent(PlayCollisionBox);
  play.addComponent(Player);
  play.addComponent(PlayerController);
  GameObjectManager.getInstance().add(play);
  return play;
};

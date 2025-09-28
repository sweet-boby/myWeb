import { Bodies, Body } from "matter-js";
import { GameObject } from "../../common/GameObject";
import { Component } from "../../common/GameObjectComponent";
import { ResourcesManager } from "../../common/ResourcesManager";
import { Animation } from "../../component/Animation";
import { CollisionBox } from "../../component/CollisionBox";
import { PhysicsManager } from "../../common/PhysicsManager";
import { GameObjectManager } from "../../common/GameObjectManager";
import { time } from "console";

let id = 0;
const SWORD_SPEED = 8;

export class Sword extends Component {
  isValid: boolean = true;
  animation: Animation;
  collisionBox: CollisionBox;
  isFaceRight: boolean = true;
  constructor(gameObject: GameObject) {
    super(gameObject);
    const atlas = ResourcesManager.getInstance().getAtlas("/kensi/enemy/sword");
    this.animation = new Animation(gameObject);
    if (atlas) this.animation.setAtlas(atlas);
    this.animation.setInterval(1000 / 5);
    const position = gameObject.transform.position;
    this.collisionBox = new CollisionBox(gameObject);
    this.collisionBox.setBody(
      Bodies.rectangle(position.x, position.y, 170, 20, {
        isSensor: true,
        label: "enemySword" + id,
      })
    );
    this.collisionBox.ignoreGravity = true;
  }

  onUpdate(deltaTime: number): void {
    this.animation.onUpdate(deltaTime);
    if (this.collisionBox.body) {
      this.gameObject.transform.position.x = this.collisionBox.body.position.x;
      this.gameObject.transform.position.y = this.collisionBox.body.position.y;
    }
    Body.setVelocity(this.collisionBox.body!, {
      x: this.isFaceRight ? SWORD_SPEED : -SWORD_SPEED,
      y: 0,
    });

    const position = this.gameObject.transform.position;
    if (position.x > 1000 || position.x <= -1000) {
      this.isValid = false;
    }
    if (!this.isValid) {
      GameObjectManager.getInstance().remove(this.gameObject);
    }
  }

  onDraw(ctx: CanvasRenderingContext2D): void {
    if (this.isFaceRight) {
      this.animation.onFlipDraw(ctx);
    } else {
      this.animation.onDraw(ctx);
    }
    this.collisionBox.onDraw(ctx);
  }
  onDestroy(): void {
    PhysicsManager.getInstance().removeBody(this.collisionBox);
  }
}

export const swordFactory = (x: number, y: number, isFaceRight: boolean) => {
  const sword = new GameObject();
  sword.transform.position.x = x;
  sword.transform.position.y = y;
  sword.addComponent(Sword);
  const sw = sword.findComponent(Sword);
  if (sw) sw.isFaceRight = isFaceRight;
  id++;
  GameObjectManager.getInstance().add(sword);
  return sword;
};

import { Bodies, Body } from "matter-js";
import { GameObject, GameObjectTag } from "../../common/GameObject";
import { Component } from "../../common/GameObjectComponent";
import { Animation } from "../../component/Animation";
import { CollisionBox } from "../../component/CollisionBox";
import { ResourcesManager } from "../../common/ResourcesManager";
import { GameObjectManager } from "../../common/GameObjectManager";
import { Vector2 } from "../../common/vector2";

const SPEED_DASH = 3;
let barbId = 0;

enum BardState {
  idle,
  aim,
  dash,
  break,
}

interface Position {
  x: number;
  y: number;
}

export class Barb extends Component {
  currentState = BardState.idle;
  collisionBox: CollisionBox;
  looseAnimation: Animation;
  breakAnimation: Animation;
  currentAnimation: Animation;
  isValid = true;
  totalTime = 0;
  diffP;
  basePosition: Vector2 = new Vector2(0, 0);
  constructor(gameObject: GameObject) {
    super(gameObject);
    const position = gameObject.transform.position;
    this.basePosition = position;
    this.diffP = Math.floor(Math.random() * 3);

    setTimeout(() => {
      if (this.currentState === BardState.idle) {
        this.currentState = BardState.aim;
        this.basePosition.x = this.gameObject.transform.position.x;
        this.basePosition.y = this.gameObject.transform.position.y;

        setTimeout(() => {
          if (this.currentState === BardState.aim) {
            this.currentState = BardState.dash;
            const player =
              GameObjectManager.getInstance().findGameObjectByName("player")!;
            const playerPos = player.transform.position;
            const v = playerPos
              .sub(this.gameObject.transform.position)
              .normalize();
            if (this.collisionBox.body) {
              Body.setPosition(this.collisionBox.body, {
                x: this.gameObject.transform.position.x,
                y: this.gameObject.transform.position.y,
              });
              Body.setVelocity(this.collisionBox.body, {
                x: v.x * SPEED_DASH,
                y: v.y * SPEED_DASH,
              });
            }
          }
        }, 750);
      }
    }, Math.floor(Math.random() * 2) * 1000 + 3000);

    this.collisionBox = new CollisionBox(gameObject);
    this.collisionBox.setBody(
      Bodies.rectangle(position.x, position.y, 50, 50, {
        isSensor: true,
        frictionAir: 0, // 设置空气阻力为0
        label: "enemyBarb" + barbId,
      })
    );
    this.collisionBox.ignoreGravity = true;
    this.collisionBox.callback = (other) => {
      if (this.collisionBox.getEnabled() && other.getEnabled()) {
        if (other.body?.label.includes("player")) {
          this.onBreak();
        }
      }
    };

    this.looseAnimation = new Animation(gameObject);
    const loose = ResourcesManager.getInstance().getAtlas(
      "/kensi/enemy/barb_loose"
    );
    if (loose) this.looseAnimation.setAtlas(loose);
    this.looseAnimation.setInterval(1000 / 3);
    const breakAtlas = ResourcesManager.getInstance().getAtlas(
      "/kensi/enemy/barb_break"
    );
    this.breakAnimation = new Animation(gameObject);
    if (breakAtlas) this.breakAnimation.setAtlas(breakAtlas);
    this.breakAnimation.setInterval(1000 / 3);
    this.breakAnimation.setIsLoop(false);
    this.breakAnimation.setCallback(() => {
      this.isValid = false;
    });
    this.currentAnimation = this.looseAnimation;
  }

  onUpdate(deltaTime: number): void {
    this.totalTime += deltaTime;
    switch (this.currentState) {
      case BardState.idle:
        this.gameObject.transform.position.y =
          this.basePosition.y +
          Math.sin(this.totalTime * 0.01 + this.diffP) * 5;
        break;
      case BardState.aim:
        this.gameObject.transform.position.x =
          this.basePosition.x + (Math.random() - 0.5) * 10;
        break;
      case BardState.dash:
        if (this.gameObject.transform.position.y <= -560) this.onBreak();
        if (this.gameObject.transform.position.y >= 260) this.onBreak();
        this.gameObject.transform.position.x =
          this.collisionBox.body!.position.x;
        this.gameObject.transform.position.y =
          this.collisionBox.body!.position.y;
        break;
      case BardState.break:
        if (!this.isValid) {
          GameObjectManager.getInstance().remove(this.gameObject);
        }
        break;
    }
    this.currentAnimation =
      this.currentState === BardState.break
        ? this.breakAnimation
        : this.looseAnimation;
    this.currentAnimation.onUpdate(deltaTime);
  }

  onDraw(ctx: CanvasRenderingContext2D): void {
    this.currentAnimation.onDraw(ctx);
    this.collisionBox.onDraw(ctx);
  }

  onBreak() {
    this.currentState = BardState.break;
    this.collisionBox.setEnabled(false);
    const breakAudio = ResourcesManager.getInstance().getAudioSource(
      "/kensi/audio/barb_break.mp3"
    );
    if (breakAudio) {
      ResourcesManager.getInstance().playAudioSource(breakAudio);
    }
  }

  onDestroy(): void {
    this.collisionBox.onDestroy();
  }
}

export const bardFactory = (x: number, y: number) => {
  const barb = new GameObject();
  barb.tag = GameObjectTag.Enemy;
  barb.transform.position = new Vector2(x, y);
  barb.addComponent(Barb);
  barbId++;
  GameObjectManager.getInstance().add(barb);
  return barb;
};

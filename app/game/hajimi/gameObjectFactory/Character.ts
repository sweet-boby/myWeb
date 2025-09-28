import { Component } from "@/app/engine/common/GameObjectComponent";
import { ResourcesManager } from "@/app/engine/common/ResourcesManager";
import { Vector2 } from "@/app/engine/common/vector2";
import { Animation } from "@/app/engine/component/Animation";

enum Diraction {
  front,
  back,
  left,
  right,
}

enum CharacterState {
  idle,
  run,
}

export class Character extends Component {
  animationPool: Map<string, Animation> = new Map();
  currentAnimation: Animation | null = null;
  resourceManager = ResourcesManager.getInstance();
  facing: keyof typeof Diraction = "front";
  velocity = new Vector2(0, 0);
  posTarget: Vector2 = new Vector2(0, -1000);
  SPEED = 0.5;

  approx(a: Vector2, b: Vector2) {
    return Math.abs(a.x - b.x) < 0.01 && Math.abs(a.y - b.y) < 0.01;
  }

  setTarget(target: Vector2) {
    this.posTarget = target;
  }

  onUpdate(deltaTime: number): void {
    // this.currentAnimation?.onUpdate(deltaTime);
    if (!this.approx(this.posTarget, this.gameObject.transform.position)) {
      this.velocity = this.posTarget
        .sub(this.gameObject.transform.position)
        .normalize()
        .mul(this.SPEED);
    } else {
      this.velocity = new Vector2(0, 0);
    }

    if (
      this.posTarget.sub(this.gameObject.transform.position).getLen() <=
      this.velocity.mul(deltaTime).getLen()
    ) {
      this.gameObject.transform.position = new Vector2(
        this.posTarget.x,
        this.posTarget.y
      );
    } else {
      this.gameObject.transform.position =
        this.gameObject.transform.position.add(this.velocity.mul(deltaTime));
    }

    if (this.approx(this.velocity, new Vector2(0, 0))) {
      this.switchAnimation(this.facing, "idle");
    } else {
      if (Math.abs(this.velocity.y) >= 0.0001) {
        this.facing = this.velocity.y > 0 ? "front" : "back";
      } else if (Math.abs(this.velocity.x) >= 0.0001) {
        this.facing = this.velocity.x > 0 ? "right" : "left";
      }
      this.switchAnimation(this.facing, "run");
    }

    this.currentAnimation?.onUpdate(deltaTime);
  }

  switchAnimation(
    facing: keyof typeof Diraction,
    state: keyof typeof CharacterState
  ) {}

  onDraw(ctx: CanvasRenderingContext2D): void {
    this.currentAnimation?.onDraw(ctx);
  }
}

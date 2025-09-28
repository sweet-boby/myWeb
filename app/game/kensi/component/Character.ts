import { Animation } from "../component/Animation";
import { StateMachine } from "./StateMachine";
import { Component } from "../common/GameObjectComponent";
import { CollisionBox } from "./CollisionBox";
import { PhysicsManager } from "../common/PhysicsManager";
import { StateNode } from "./StateNode";

interface AnimationGroup {
  left: Animation;
  right: Animation;
}

export class Character extends Component {
  hp: number = 10;
  isInvulnerable: boolean = false; // 无敌状态
  isBlinking: boolean = false;
  isFaceRight: boolean = true;
  currentAnimation: AnimationGroup | null = null;
  animationPool: Map<string, AnimationGroup> = new Map();
  stateMachine: StateMachine | null = null;
  isBlinkInvisible: boolean = false; // 闪烁可见状态
  hitBox: CollisionBox | null = null;
  hurtBox: CollisionBox | null = null;

  decreaseHP() {
    if (this.isInvulnerable) return;
    this.hp -= 1;
    if (this.hp > 0) {
      this.makeInvulnerable();
    }
    this.onHurt();
  }

  makeInvulnerable() {
    this.isInvulnerable = true;
    setTimeout(() => {
      this.isInvulnerable = false;
      this.isBlinkInvisible = false;
    }, 300);
  }

  switchState<T extends StateNode>(
    state: new (...arg: ConstructorParameters<typeof StateNode>) => T
  ) {
    if (this.stateMachine) {
      this.stateMachine.switchTo(state);
    }
  }

  setAnimation(animationName: string) {
    const animation = this.animationPool.get(animationName);
    if (animation) {
      this.currentAnimation = animation;
    }
    this.currentAnimation?.left.reset();
    this.currentAnimation?.right.reset();
  }

  onUpdate(deltaTime: number): void {
    if (this.stateMachine) {
      this.stateMachine.onUpdate(deltaTime);
    }

    if (this.hurtBox) {
      if (this.hurtBox.body) {
        this.gameObject.transform.position.x = this.hurtBox.body.position.x;
        this.gameObject.transform.position.y =
          this.hurtBox.body.position.y - 20;
      }
    }

    if (this.currentAnimation) {
      const animation = this.isFaceRight
        ? this.currentAnimation.right
        : this.currentAnimation.left;
      animation.onUpdate(deltaTime);
    }
  }

  onHurt() {}

  onDraw(ctx: CanvasRenderingContext2D): void {
    if (
      !this.currentAnimation ||
      (this.isBlinkInvisible && this.isInvulnerable)
    )
      return;

    const animation = this.isFaceRight
      ? this.currentAnimation?.right
      : this.currentAnimation?.left;
    if (animation) {
      animation.onDraw(ctx);
    }

    if (this.hitBox) {
      this.hitBox.onDraw(ctx);
    }

    if (this.hurtBox) {
      this.hurtBox.onDraw(ctx);
    }
  }

  onDestroy(): void {
    if (this.hitBox) PhysicsManager.getInstance().removeBody(this.hitBox);
    if (this.hurtBox) PhysicsManager.getInstance().removeBody(this.hurtBox);
  }
}

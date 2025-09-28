import { Component } from "../common/GameObjectComponent";
import { ResourcesManager } from "../common/ResourcesManager";
import { Animation } from "./Animation";

export class AnimationManager extends Component {
  protected animations: Map<string, Animation> = new Map();
  protected currentAnimation: Animation | null = null;
  protected resourcesManager = ResourcesManager.getInstance();
  onUpdate(deltaTime: number): void {
    if (this.currentAnimation) {
      this.currentAnimation.onUpdate(deltaTime);
    }
  }

  onDraw(ctx: CanvasRenderingContext2D): void {
    if (this.currentAnimation) {
      this.currentAnimation.onDraw(ctx);
    }
  }

  playAnimation(name: string): void {
    const animation = this.animations.get(name);
    if (animation) {
      this.currentAnimation = animation;
      // this.currentAnimation.reset();
    }
  }

  addAnimation(name: string, animation: Animation): void {
    this.animations.set(name, animation);
  }
}

import { GameObjectManager } from "@/app/engine/common/GameObjectManager";
import { Character } from "./Character";
import { Vector2 } from "@/app/engine/common/vector2";

export class Manbo extends Character {
  posTarget: Vector2 = new Vector2(10, 0);
  onStart(): void {
    try {
      const animationlist = [
        "manbo_idle_back",
        "manbo_idle_front",
        "manbo_idle_left",
        "manbo_idle_right",
        "manbo_run_back",
        "manbo_run_front",
        "manbo_run_left",
        "manbo_run_right",
      ];

      animationlist.map((item) => {
        this.animationPool.set(
          item,
          this.resourceManager.atlasToAnimation(item, this.gameObject)!
        );
      });
      this.currentAnimation = this.animationPool.get("manbo_idle_front")!;
    } catch (e) {
      console.log(e);
    }
  }

  switchAnimation(
    facing: "front" | "back" | "left" | "right",
    state: "idle" | "run"
  ): void {
    const animationKey = `manbo_${state}_${facing}`;
    this.currentAnimation = this.animationPool.get(animationKey)!;
    // this.currentAnimation.reset();
  }
}

export const manboFactory = () => {
  const manbo = GameObjectManager.getInstance().createGameObject();
  manbo.transform.position.x = 0;
  manbo.transform.position.y = -1000;
  manbo.addComponent(Manbo);
  return manbo;
};

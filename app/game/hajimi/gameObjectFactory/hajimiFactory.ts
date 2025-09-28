import { GameObjectManager } from "@/app/engine/common/GameObjectManager";
import { Character } from "./Character";

export class Hajimi extends Character {
  onStart(): void {
    try {
      const animationlist = [
        "hajimi_idle_back",
        "hajimi_idle_front",
        "hajimi_idle_left",
        "hajimi_idle_right",
        "hajimi_run_back",
        "hajimi_run_front",
        "hajimi_run_left",
        "hajimi_run_right",
      ];

      animationlist.map((item) => {
        this.animationPool.set(
          item,
          this.resourceManager.atlasToAnimation(item, this.gameObject)!
        );
      });
      this.currentAnimation = this.animationPool.get("hajimi_idle_back")!;
    } catch (e) {
      console.log(e);
    }
  }

  switchAnimation(
    facing: "front" | "back" | "left" | "right",
    state: "idle" | "run"
  ): void {
    const animationKey = `hajimi_${state}_${facing}`;
    this.currentAnimation = this.animationPool.get(animationKey)!;
    // this.currentAnimation.reset();
  }
}

export const hajimiFactory = () => {
  const hajimi = GameObjectManager.getInstance().createGameObject();
  hajimi.transform.position.x = 0;
  hajimi.transform.position.y = -1000;
  hajimi.addComponent(Hajimi);
  return hajimi;
};

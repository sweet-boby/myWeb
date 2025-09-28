import { GameObjectManager } from "@/app/engine/common/GameObjectManager";
import { Gimage } from "@/app/engine/component/Gimage";

class BgImage extends Gimage {
  onStart(): void {
    this.image = this.resourceManager.getImage(
      "/hajimi/resources/background.png"
    ) as HTMLImageElement;
  }
}

export const bgFactory = () => {
  const bg = GameObjectManager.getInstance().createGameObject();
  bg.addComponent(BgImage);
  return bg;
};

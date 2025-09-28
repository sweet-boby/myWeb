import { Atlas, ResourcesManager } from "../common/ResourcesManager";
import { Animation } from "./Animation";

export class EnemyAnimation extends Animation {
  onStart(): void {
    this.atlas = new Atlas();
    this.interval = 1000 / 10;
    const paths = [
      "img/enemy_left_0.png",
      "img/enemy_left_1.png",
      "img/enemy_left_2.png",
      "img/enemy_left_3.png",
      "img/enemy_left_4.png",
      "img/enemy_left_5.png",
    ];
    paths.map((path) => {
      if (this.atlas)
        this.atlas.addImage(
          this.resourcesManager.getImage(path) as HTMLImageElement
        );
    });
  }
}

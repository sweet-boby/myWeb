import { Scene, SceneType } from "@/app/engine/common/Scene";

export class ManuScene extends Scene {
  sceneType: SceneType = SceneType.Manu;
  onUpdate(deltaTime: number): void {
    console.log("ManuScene");
  }
}

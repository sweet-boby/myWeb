import { GameObject } from "@/app/engine/common/GameObject";
import { GameObjectManager } from "@/app/engine/common/GameObjectManager";
import { Camera } from "@/app/engine/component/Camera";

export const cameraFactory = (name: string = "camera") => {
  const camera = new GameObject();
  camera.name = name;
  camera.addComponent(Camera);
  GameObjectManager.getInstance().add(camera);
  return camera;
};

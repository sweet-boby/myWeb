import { GameObject } from "../common/GameObject";
import { GameObjectManager } from "../common/GameObjectManager";
import { Camera } from "../component/Camera";

export const cameraFactory = (name: string = "camera") => {
  const camera = new GameObject();
  camera.name = name;
  camera.addComponent(Camera);
  GameObjectManager.getInstance().add(camera);
  return camera;
};

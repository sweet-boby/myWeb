import { Scene, SceneType } from "./Scene";

export class SceneManager {
  private scenes: Map<SceneType, Scene> = new Map();
  private currentScene: Scene | null = null;
  private resource: any = null;

  addScene(scene: Scene): void {
    this.scenes.set(scene.sceneType, scene);
  }

  setResource(resource: any): void {
    this.resource = resource;
  }
  enterScene(sceneType: SceneType): void {
    const scene = this.scenes.get(sceneType);
    if (!scene) {
      console.error(`Scene ${sceneType} not found.`);
      return;
    }

    if (this.currentScene) {
      this.currentScene.onExit();
      this.currentScene.setGameLoop(false);
    }

    this.currentScene = scene;
    this.currentScene.onEnter(this.resource);
    this.currentScene.setGameLoop(true);
  }
  update(deltaTime: number): void {
    if (this.currentScene) {
      this.currentScene.onUpdate(deltaTime);
    }
  }

  draw(canvas: HTMLCanvasElement): void {
    if (this.currentScene) {
      this.currentScene.onDraw(canvas);
    }
  }

  exitScene(): void {
    if (this.currentScene) {
      this.currentScene.onExit();
      this.currentScene = null;
    }
  }
  getCurrentScene(): Scene | null {
    return this.currentScene;
  }
}

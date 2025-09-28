import { useEffect } from "react";
import { Animation } from "../animation";
import { Camera } from "../camera";
import { GameResources } from "../animation";
import { setStatusType } from "../inferUtil";
import { Vector2 } from "../vector2";

export abstract class Scene {
  sceneType: SceneType | null = null;
  camera: Camera = new Camera();
  setUIdata: setStatusType | null = null;
  onEnter(resource: any): void {}
  onKeyDown(e: KeyboardEvent, switchScene: Function): void {}
  onKeyUp(e: KeyboardEvent, switchScene: Function): void {}
  onInput(e: KeyboardEvent, switchScene: Function): void {}
  onUpdate(deltaTime: number): void {}
  onDraw(canvas: HTMLCanvasElement): void | CanvasRenderingContext2D {
    const ctx = canvas.getContext("2d");
    if (!canvas) {
      return;
    }
    if (!ctx) {
      return;
    }
    // 获取Canvas元素的实际宽度和高度
    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas?.offsetHeight;

    // 将Canvas的实际宽度和高度设置为获取到的值
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // 清空
    ctx.clearRect(
      0,
      0,
      canvas.offsetWidth as number,
      canvas.offsetHeight as number
    );
    return ctx;
  }
  onExit(): void {}
}

export enum SceneType {
  Manu,
  Game,
  Selector,
}

export class ManuScene extends Scene {
  sceneType: SceneType = SceneType.Manu;
  private gameres: GameResources | null = null;
  onEnter(resource: GameResources) {
    console.log("进入菜单场景");
    if (!this.gameres) {
      this.gameres = resource;
    }
  }

  onKeyDown(e: KeyboardEvent, switchScene: Function): void {}

  onKeyUp(e: KeyboardEvent, switchScene: Function): void {
    switchScene(SceneType.Selector);
  }

  onInput(e: KeyboardEvent, switchScene: Function) {}

  onUpdate(deltaTime: number) {
    // console.log("Updating Manu Scene");
  }

  onDraw(canvas: HTMLCanvasElement): void {
    // console.log("Drawing Manu Scene");
    const ctx = super.onDraw(canvas);
    if (!ctx) {
      return;
    }

    ctx.drawImage(
      this.gameres?.menu_background as HTMLImageElement,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }
  onExit(): void {
    console.log("退出菜单场景");
    // this.gameres?.bgm_menu.pause(); // 暂停
    this.gameres?.bgm_menu.play();
  }
}

// export class SceneManager {
//   private scenes: Scene[] = [];
//   private currentScene: Scene | null = null;
//   public currentSceneIndex: number = 0; // 0 for game, 1 for men
//   constructor() {
//     this.scenes = [];
//     this.currentScene = null;
//   }

//   addScene(scene: Scene) {
//     this.scenes.push(scene);
//   }

//   setScene(index: number) {
//     if (index >= 0 && index < this.scenes.length) {
//       if (this.currentScene) {
//         this.currentScene.onExit();
//       }
//       this.currentScene = this.scenes[index];
//       this.currentScene.onEnter();
//     }
//   }

//   onInput() {
//     if (this.currentScene) {
//       this.currentScene.onInput(this);
//     }
//   }

//   onUpdate() {
//     if (this.currentScene) {
//       this.currentScene.onUpdate();
//     }
//   }

//   onDraw() {
//     if (this.currentScene) {
//       this.currentScene.onDraw();
//     }
//   }
// }

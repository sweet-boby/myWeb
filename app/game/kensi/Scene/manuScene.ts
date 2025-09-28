import { GameObject } from "../common/GameObject";
import { ResourcesManager } from "../common/ResourcesManager";
import { Scene, SceneType } from "../common/Scene";
import { Controller } from "../component/controller";
import Down from "../component/down";
import { bgFactory } from "../gameObjectFactory/BgFactory/bgFactory";
import { cameraFactory } from "../gameObjectFactory/cameraFactory";
import { getMsgUtil } from "../Util/MsgUtil";

export class ManuScene extends Scene {
  sceneType: SceneType = SceneType.Manu;
  resourcesManager: ResourcesManager = ResourcesManager.getInstance();
  resourceInit: boolean = false;
  resourceFetching: boolean = false;
  private static _instance: ManuScene;
  static getInstance(): ManuScene {
    if (!ManuScene._instance) {
      ManuScene._instance = new ManuScene();
    }
    return ManuScene._instance;
  }
  private constructor() {
    super();
  }

  onEnter() {
    this.gameObjectManager.clear();
    if (!this.resourceInit && !this.resourceFetching) {
      this.resourcesManager
        .getloadfileUrl("/kensi")
        .then((res) => {
          return this.resourcesManager.loadfile(res);
        })
        .then((res) => {
          const paths = res.urls
            .filter((i) => i.includes("/kensi/enemy"))
            .map((i) => {
              const arr = i.split("/");
              return "/kensi/" + arr[2] + "/" + arr[3];
            });
          const set = new Set(paths);
          for (let i of set.values()) {
            this.resourcesManager.filePathToAtlas(i, i);
          }
          if (this.resourceInit) return;
          cameraFactory();
          bgFactory();
          this.resourceInit = true;
          this.resourceFetching = false;
          return;
        });
      this.resourceFetching = true;
    } else if (!this.resourceFetching) {
      cameraFactory();
      bgFactory();
    }

    const toGame = () => {
      const { emitMsgEvent } = getMsgUtil();
      emitMsgEvent("SwitchScene", SceneType.Game);
      window.removeEventListener("keydown", toGame);
    };
    window.addEventListener("keydown", toGame);
  }

  onUpdate(deltaTime: number): void {
    this.gameObjectManager.update(deltaTime);
  }

  onDraw(canvas: HTMLCanvasElement): void | CanvasRenderingContext2D {
    const ctx = super.onDraw(canvas);
    if (!ctx) return;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    this.gameObjectManager.draw(ctx);
    ctx.font = "60px Arial";
    ctx.fillStyle = "white"; // 设置字体颜色为白色
    ctx.textAlign = "center"; // 设置文本水平居中
    ctx.textBaseline = "middle"; // 设置文本垂直居中
    ctx.fillText("按任意键开始游戏", 0, 0); // 将文本绘制在画布中心
  }
  onExit(): void {
    this.gameObjectManager.clear();
  }
}

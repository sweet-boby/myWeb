import { Scene, SceneType } from "../common/Scene";
import { ResourcesManager } from "../common/ResourcesManager";
import { GameObjectManager } from "../common/GameObjectManager";
import { GameObject } from "../common/GameObject";
import { EnemyAnimation } from "../component/EnemyAnimation";
import { Controller } from "../component/controller";
import { Camera } from "../component/Camera";
import { bgFactory } from "../gameObjectFactory/BgFactory/bgFactory";
import { cameraFactory } from "../gameObjectFactory/cameraFactory";
import { playerFactory } from "../gameObjectFactory/PlayFactory/playFactory";
import { PhysicsManager } from "../common/PhysicsManager";
import { getImgUtils } from "../Util/ImgUtil";
import { Body } from "matter-js";
import { swordFactory } from "../gameObjectFactory/EnemyFactory/sword";
import { bardFactory } from "../gameObjectFactory/EnemyFactory/barb";
import { enemyFactory } from "../gameObjectFactory/EnemyFactory/enemy";

export class GameScene extends Scene {
  sceneType: SceneType = SceneType.Game;
  resourcesManager: ResourcesManager = ResourcesManager.getInstance();
  gameObjectManager: GameObjectManager = GameObjectManager.getInstance();
  bgmAudio = this.resourcesManager.getAudioSource("/kensi/audio/bgm.mp3");
  resourceInit: boolean = false;
  resourceFetching: boolean = false;
  private static _instance: GameScene;
  static getInstance(): GameScene {
    if (!GameScene._instance) {
      GameScene._instance = new GameScene();
    }
    return GameScene._instance;
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
          this.bgmAudio = this.resourcesManager.getAudioSource(
            "/kensi/audio/bgm.mp3"
          );

          if (this.bgmAudio) {
            this.resourcesManager.playAudioSource(this.bgmAudio);
          }
          cameraFactory();
          bgFactory();
          playerFactory();
          enemyFactory();
          this.resourceInit = true;
          this.resourceFetching = false;
          // swordFactory(0, 150, true);
          // swordFactory(100, 200, false);
          // bardFactory(200, 0);
        });

      this.resourceFetching = true;
    } else if (!this.resourceFetching) {
      this.bgmAudio = this.resourcesManager.getAudioSource(
        "/kensi/audio/bgm.mp3"
      );
      if (this.bgmAudio) {
        this.resourcesManager.playAudioSource(this.bgmAudio);
      }
      cameraFactory();
      bgFactory();
      playerFactory();
      enemyFactory();
    }

    PhysicsManager.getInstance().onCollisionStart((event) => {
      const pairs = event.pairs;
      pairs.forEach((pair) => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        const collisionbox = PhysicsManager.getInstance().getCollisionBoxs();
        const boxA = collisionbox.get(bodyA.label);
        const boxB = collisionbox.get(bodyB.label);
        if (boxA && boxB) {
          boxA.onCallback(boxB);
          boxB.onCallback(boxA);
        }
      });
    });

    PhysicsManager.getInstance().onBeforeUpdate(
      PhysicsManager.getInstance().igoreBoxGravity
    );
  }

  onUpdate(deltaTime: number): void {
    if (!this.isGameLoop) return;
    this.gameObjectManager.update(deltaTime);
    PhysicsManager.getInstance().update(deltaTime);
  }
  onDraw(canvas: HTMLCanvasElement): void | CanvasRenderingContext2D {
    if (!this.isGameLoop) return;
    const ctx = super.onDraw(canvas);
    if (!ctx) return;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.font = "60px Arial";
    ctx.fillStyle = "white"; // 设置字体颜色为白色
    ctx.textAlign = "center"; // 设置文本水平居中
    ctx.textBaseline = "middle"; // 设置文本垂直居中
    ctx.fillText("游戏加载中", 0, 0); // 将文本绘制在画布中心
    this.gameObjectManager.draw(ctx);
    // PhysicsManager.getInstance().draw(ctx);
  }
  onExit(): void {
    this.gameObjectManager.clear();
    PhysicsManager.getInstance()
      .getEvents()
      .off(PhysicsManager.getInstance().getEngine(), "collisionStart");
    PhysicsManager.getInstance()
      .getEvents()
      .off(PhysicsManager.getInstance().getEngine(), "beforeUpdate");

    if (this.bgmAudio) {
      this.resourcesManager.closeAllAudio();
    }
  }
}

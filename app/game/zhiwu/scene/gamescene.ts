import { GameResources, Animation } from "../animation";
import { Vector2 } from "../vector2";
import { Scene, SceneType } from "./scene";
import { Platform, CollisionShape } from "../gameobject/platform";
import {
  Peashooter,
  Player,
  SunFlower,
  PlayerFactory,
  PlayerType,
  PlayerId,
} from "../gameobject/player";
import {
  CollisionBox,
  CollisionLayer,
  CollisionManege,
} from "../collisionManege";
import { getCustomEventEmitter } from "@/app/zhiwu/gameMessageUtil";

import { BulletManege } from "../gameobject/bullet";
import { getMsgUtil } from "../MsgUtil";

export class GameScene extends Scene {
  sceneType: SceneType = SceneType.Game;
  private gameres: GameResources | null = null;
  private animation_peashooter: Animation = new Animation(1000 / 20);
  private animation_sunflower: Animation = new Animation(1000 / 20);
  private platformLarge: Platform = new Platform();
  private platformSmall_1: Platform = new Platform();
  private platformSmall_2: Platform = new Platform();
  private platformSmall_3: Platform = new Platform();
  private p1: Player | null = null;
  private p2: Player | null = null;
  private collisionManege: CollisionManege = CollisionManege.getInstance();
  private bulletManege: BulletManege = BulletManege.getInstance();
  private showUI: boolean = false;
  private event = getCustomEventEmitter();
  private playerType_1P: PlayerType = PlayerType.Peashooter;
  private playerType_2P: PlayerType = PlayerType.SunFlower;
  private isGameOver: boolean = false;

  constructor() {
    super();
    const { GameMsgType, onMsgEvent } = getMsgUtil();
    onMsgEvent(GameMsgType.Selector, (data) => {
      console.log("收到选择器消息");
      this.playerType_1P = data.playerType_1P;
      this.playerType_2P = data.playerType_2P;
    });
  }

  onEnter(resource: GameResources) {
    this.showUI = true;
    this.isGameOver = false;
    const { emitMsgEvent, onMsgEvent, GameMsgType } = getMsgUtil();
    onMsgEvent(GameMsgType.Gameover, (data: any) => {
      console.log("收到游戏结束消息", data);
      // emitMsgEvent(GameMsgType.SwitchScene, SceneType.Manu);
      if (this.isGameOver) {
        return;
      }
      this.event.emitCustomEvent({
        showAnimation: true,
        winner: data,
      });

      setTimeout(() => {
        this.event.emitCustomEvent({
          showAnimation: false,
        });
        this.isGameOver = true;
        emitMsgEvent(GameMsgType.SwitchScene, SceneType.Manu);
      }, 5000);
    });
    console.log("进入游戏场景");
    if (!this.gameres) {
      this.gameres = resource;
      this.animation_peashooter.setAtlas(this.gameres.peashooter_idle_left);
      this.animation_sunflower.setAtlas(this.gameres.sunflower_idle_left);
    }
    this.event.emitCustomEvent({
      show: this.showUI,
      p1avatar:
        this.playerType_1P === PlayerType.Peashooter
          ? resource.avatar_peashooter
          : resource.avatar_sunflower,
      p2avatar:
        this.playerType_2P === PlayerType.Peashooter
          ? resource.avatar_peashooter
          : resource.avatar_sunflower,
      winnerimg1: resource.first_player_winner,
      winnerimg2: resource.second_player_winner,
    });
    this.camera.setPosition(new Vector2(360, 40));

    this.p1 = PlayerFactory.createPlayer(
      this.playerType_1P, // 这里可以根据你的需求来设置玩家类型..,
      resource,
      PlayerId.Player_1,
      this.camera
    );

    this.p2 = PlayerFactory.createPlayer(
      this.playerType_2P, // 这里可以根据你的需求来设置玩家类型..,
      resource,
      PlayerId.Player_2,
      this.camera
    );

    this.platformLarge.img = this.gameres?.platform_large as HTMLImageElement;
    this.platformLarge.pos = new Vector2(482, 459);

    this.platformLarge.collision_box_player = CollisionBox.create()
      .setSize(new Vector2(this.platformLarge.img.width - 50, 1))
      .setPos(
        new Vector2(
          this.platformLarge.pos.x + this.platformLarge.img.width / 2,
          this.platformLarge.pos.y + 50
        )
      )
      .setLayerDst(CollisionLayer.Player);

    this.platformSmall_1.img = this.gameres?.platform_small as HTMLImageElement;
    this.platformSmall_1.pos = new Vector2(482, 379);

    this.platformSmall_1.collision_box_player = CollisionBox.create()
      .setSize(new Vector2(this.platformSmall_1.img.width - 50, 1))
      .setPos(
        new Vector2(
          this.platformSmall_1.pos.x + this.platformSmall_1.img.width / 2,
          this.platformSmall_1.pos.y + this.platformSmall_1.img.height / 2
        )
      )
      .setLayerDst(CollisionLayer.Player);

    this.platformSmall_2.img = this.gameres?.platform_small as HTMLImageElement;
    this.platformSmall_2.pos = new Vector2(
      482 + this.platformLarge.img.width - this.platformSmall_1.img.width,
      380
    );
    this.platformSmall_2.collision_box_player = CollisionBox.create()
      .setSize(new Vector2(this.platformSmall_2.img.width - 50, 1))
      .setPos(
        new Vector2(
          this.platformSmall_2.pos.x + this.platformSmall_2.img.width / 2,
          this.platformSmall_2.pos.y + this.platformSmall_2.img.height / 2
        )
      )
      .setLayerDst(CollisionLayer.Player);

    this.platformSmall_3.img = this.gameres?.platform_small as HTMLImageElement;
    this.platformSmall_3.pos = new Vector2(
      (this.platformSmall_1.pos.x + this.platformSmall_2.pos.x) / 2,
      200
    );
    this.platformSmall_3.collision_box_player = CollisionBox.create()
      .setSize(new Vector2(this.platformSmall_3.img.width - 50, 1))
      .setPos(
        new Vector2(
          this.platformSmall_3.pos.x + this.platformSmall_3.img.width / 2,
          this.platformSmall_3.pos.y + this.platformSmall_3.img.height / 2
        )
      )
      .setLayerDst(CollisionLayer.Player);
  }
  onKeyDown(e: KeyboardEvent, switchScene: Function): void {
    if (e.key === "m") {
      switchScene(SceneType.Manu);
    }
    this.p1?.onKeyDown(e);
    this.p2?.onKeyDown(e);
  }

  onKeyUp(e: KeyboardEvent, switchScene: Function): void {
    this.p1?.onKeyUp(e);
    this.p2?.onKeyUp(e);
  }

  onInput(e: KeyboardEvent, switchScene: Function) {
    if (e.key === "m") {
      switchScene(SceneType.Manu);
    }
  }

  onUpdate(deltaTime: number): void {
    // console.log("Updating Game Scene", deltaTime);
    if (this.isGameOver) {
      return;
    }
    this.animation_peashooter?.onUpdate(deltaTime);
    this.animation_sunflower?.onUpdate(deltaTime);
    this.p1?.onUpdate(deltaTime);
    this.p2?.onUpdate(deltaTime);
    this.camera.onUpdate(deltaTime);
    this.collisionManege.processCollide(deltaTime);
    this.bulletManege.onUpdata(deltaTime);

    this.event.emitCustomEvent({
      mp1: this.p1?.mp,
      mp2: this.p2?.mp,
      hp1: this.p1?.hp,
      hp2: this.p2?.hp,
    });
  }

  onDraw(canvas: HTMLCanvasElement): void {
    // console.log("Drawing Game Scene");
    // 由于camera是Scene类的私有属性，GameScene类无法直接访问
    // 需要在Scene类中添加公共方法来访问camera，或者移除此行代码
    const ctx = super.onDraw(canvas);
    if (!ctx) {
      return;
    }
    const camerapos = this.camera.getPosition();
    ctx.translate(-camerapos.x, -camerapos.y);
    ctx.drawImage(this.gameres?.sky as HTMLImageElement, 300, 0);
    ctx.drawImage(this.gameres?.hills as HTMLImageElement, 0, 0);
    // ctx.drawImage(this.gameres?.platform_large as HTMLImageElement, 482, 459);
    this.platformLarge.onDraw(ctx);
    this.platformSmall_1.onDraw(ctx);
    this.platformSmall_2.onDraw(ctx);
    this.platformSmall_3.onDraw(ctx);
    this.p1?.onDraw(ctx);
    this.p2?.onDraw(ctx);
    // ctx.drawImage(this.animation_peashooter.getFrame(), 0, 0);
    // ctx.drawImage(this.animation_sunflower.getFrame(), 360, 40);

    this.bulletManege.onDraw(ctx);
    this.collisionManege.onDebugRender(ctx);
  }
  onExit(): void {
    console.log("退出游戏场景");
    this.collisionManege.clear();
    this.showUI = false;
    this.isGameOver = false;
    this.gameres?.bgm_game.pause();
    if (this.gameres?.bgm_game) {
      this.gameres.bgm_game.currentTime = 0;
    }
    this.event.emitCustomEvent({
      show: this.showUI,
    });
  }
}

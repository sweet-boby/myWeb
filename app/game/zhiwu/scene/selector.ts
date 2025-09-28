import { Scene, SceneType } from "./scene";
import { GameResources } from "../animation";
import { Animation, Atlas } from "../animation";
import { Dispatch, SetStateAction } from "react";
import { getMaxAge } from "next/dist/server/image-optimizer";

import { PlayerType } from "../gameobject/player";
import { getMsgUtil } from "../MsgUtil";

export type UIdata = {
  msg?: string;
  img_VS: HTMLImageElement;
  img_1P: HTMLImageElement;
  img_2P: HTMLImageElement;
  img_1P_desc: HTMLImageElement;
  img_2P_desc: HTMLImageElement;
  img_gravestone_left: HTMLImageElement;
  img_gravestone_right: HTMLImageElement;
  img_selector_tip: HTMLImageElement;
  img_selector_background: HTMLImageElement;
  img_1P_selector_btn_idle_left: HTMLImageElement;
  img_1P_selector_btn_idle_right: HTMLImageElement;
  img_1P_selector_btn_down_left: HTMLImageElement;
  img_1P_selector_btn_down_right: HTMLImageElement;
  img_2P_selector_btn_idle_left: HTMLImageElement;
  img_2P_selector_btn_idle_right: HTMLImageElement;
  img_2P_selector_btn_down_left: HTMLImageElement;
  img_2P_selector_btn_down_right: HTMLImageElement;
  img_peashooter_selector_background_left: HTMLImageElement;
  img_peashooter_selector_background_right: HTMLImageElement;
  img_sunflower_selector_background_left: HTMLImageElement;
  img_sunflower_selector_background_right: HTMLImageElement;

  atlas_peashooter_idle_right?: Atlas;
  atlas_sunflower_idle_right?: Atlas;

  img_avatar_peashooter: HTMLImageElement;
  img_avatar_sunflower: HTMLImageElement;

  animetion_peashooter_frame: HTMLImageElement;
  animetion_sunflower_frame: HTMLImageElement;
  playerType_1P: PlayerType;
  playerType_2P: PlayerType;
};

export default class Selector extends Scene {
  sceneType: SceneType = SceneType.Selector;
  setUIdata: Dispatch<SetStateAction<object | null | undefined>> | null = null;
  private gameres: GameResources | null = null;
  private animation_peashooter: Animation = new Animation(1000 / 15);
  private animation_sunflower: Animation = new Animation(1000 / 15);
  private playerType_1P: PlayerType = PlayerType.Peashooter;
  private playerType_2P: PlayerType = PlayerType.SunFlower;
  private isKeyDownA: boolean = false;
  private isKeyDownD: boolean = false;
  private isKeyDownLeft: boolean = false;
  private isKeyDownRight: boolean = false;
  private selector_background_scroll_offset_x = 0;

  onEnter(resource: GameResources) {
    console.log("进入选择场景");
    if (!this.gameres) {
      this.gameres = resource;
      this.animation_peashooter?.setAtlas(resource.peashooter_idle_right);
      this.animation_sunflower?.setAtlas(resource.sunflower_idle_right);
    }
    this.setUIdata?.((prev) => {
      return {
        ...prev,
        img_VS: resource.vs,
        img_1P: resource.first_player,
        img_2P: resource.second_player,
        img_1P_desc: resource.first_player_desc,
        img_2P_desc: resource.second_player_desc,
        img_gravestone_left: resource.gravestone,
        img_gravestone_right: resource.gravestone,
        img_selector_tip: resource.selector_tip,
        img_selector_background: resource.selector_background,
        img_1P_selector_btn_idle_left: resource.first_player_Selector_btn_idle,
        img_1P_selector_btn_idle_right: resource.first_player_Selector_btn_idle,
        img_1P_selector_btn_down_left: resource.first_player_Selector_btn_down,
        img_1P_selector_btn_down_right: resource.first_player_Selector_btn_down,
        img_2P_selector_btn_idle_left: resource.second_player_Selector_btn_idle,
        img_2P_selector_btn_idle_right:
          resource.second_player_Selector_btn_idle,
        img_2P_selector_btn_down_left: resource.second_player_Selector_btn_down,
        img_2P_selector_btn_down_right:
          resource.second_player_Selector_btn_down,
        img_peashooter_selector_background_left:
          resource.peashooter_selector_background,
        img_peashooter_selector_background_right:
          resource.peashooter_selector_background,
        img_sunflower_selector_background_left:
          resource.sunflower_selector_background,
        img_sunflower_selector_background_right:
          resource.sunflower_selector_background,

        atlas_peashooter_idle_right: resource.peashooter_idle_right,
        atlas_sunflower_idle_right: resource.sunflower_idle_right,

        img_avatar_peashooter: resource.avatar_peashooter,
        img_avatar_sunflower: resource.avatar_sunflower,

        animetion_peashooter_frame:
          this.animation_peashooter?.getFrame() as HTMLImageElement,
        animetion_sunflower_frame:
          this.animation_sunflower?.getFrame() as HTMLImageElement,

        playerType_1P: this.playerType_1P,
        playerType_2P: this.playerType_2P,

        msg: "选择你的角色",
      } as UIdata;
    });
  }

  onKeyDown(e: KeyboardEvent, switchScene: Function): void {
    if (e.key === "m") {
      switchScene(SceneType.Manu);
    }
    if (e.key === "a") {
      this.isKeyDownA = true;
    }
    if (e.key === "d") {
      this.isKeyDownD = true;
    }
    if (e.key === "ArrowLeft") {
      this.isKeyDownLeft = true;
    }
    if (e.key === "ArrowRight") {
      this.isKeyDownRight = true;
    }
  }

  onKeyUp(e: KeyboardEvent, switchScene: Function): void {
    if (e.key === "a") {
      this.isKeyDownA = false;
      this.playerType_1P =
        this.playerType_1P === PlayerType.Peashooter
          ? PlayerType.SunFlower
          : PlayerType.Peashooter;
    }
    if (e.key === "d") {
      this.isKeyDownD = false;
      this.playerType_1P =
        this.playerType_1P === PlayerType.Peashooter
          ? PlayerType.SunFlower
          : PlayerType.Peashooter;
    }
    if (e.key === "ArrowLeft") {
      this.isKeyDownLeft = false;
      this.playerType_2P =
        this.playerType_2P === PlayerType.Peashooter
          ? PlayerType.SunFlower
          : PlayerType.Peashooter;
    }
    if (e.key === "ArrowRight") {
      this.isKeyDownRight = false;
      this.playerType_2P =
        this.playerType_2P === PlayerType.Peashooter
          ? PlayerType.SunFlower
          : PlayerType.Peashooter;
    }
    if (e.key === "Enter") {
      const { GameMsgType, emitMsgEvent } = getMsgUtil();
      emitMsgEvent(GameMsgType.Selector, {
        playerType_1P: this.playerType_1P,
        playerType_2P: this.playerType_2P,
      });
      switchScene(SceneType.Game);
    }
  }

  onInput(e: KeyboardEvent, switchScene: Function) {
    if (e.key === "m") {
      switchScene(SceneType.Manu);
    }
  }

  onUpdate(deltaTime: number): void {
    // console.log("Updating selector Scene");
    this.animation_peashooter?.onUpdate(deltaTime);
    this.animation_sunflower?.onUpdate(deltaTime);
    this.selector_background_scroll_offset_x += 5;
    if (
      this.selector_background_scroll_offset_x >
      (this.gameres?.selector_background.width as number) / 2
    ) {
      this.selector_background_scroll_offset_x = 0;
    }
    // console.log(this.selector_background_scroll_offset_x);
    // if (this.isKeyDownA || this.isKeyDownD) {
    //   this.playerType_1P =
    //     this.playerType_1P === PlayerType.Peashooter
    //       ? PlayerType.SunFlower
    //       : PlayerType.Peashooter;
    // }
    // if (this.isKeyDownLeft || this.isKeyDownRight) {
    //   this.playerType_2P =
    //     this.playerType_2P === PlayerType.Peashooter
    //       ? PlayerType.SunFlower
    //       : PlayerType.Peashooter;
    // }
  }

  onDraw(canvas: HTMLCanvasElement): void {
    // console.log("Drawing selector Scene");
    const ctx = super.onDraw(canvas);
    if (!ctx) {
      return;
    }

    this.setUIdata?.((prev) => {
      return {
        ...prev,
        animetion_peashooter_frame:
          this.animation_peashooter?.getFrame() as HTMLImageElement,
        animetion_sunflower_frame:
          this.animation_sunflower?.getFrame() as HTMLImageElement,
        playerType_1P: this.playerType_1P,
        playerType_2P: this.playerType_2P,
      } as UIdata;
    });

    ctx.drawImage(
      this.gameres?.selector_background as HTMLImageElement,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // 绘制第一张图片：当前可见的部分
    ctx.drawImage(
      this.gameres?.peashooter_selector_background as HTMLImageElement,
      0,
      0,
      (this.gameres?.selector_background.width as number) / 2 -
        this.selector_background_scroll_offset_x,
      canvas.height,
      this.selector_background_scroll_offset_x,
      0,
      (this.gameres?.selector_background.width as number) / 2 -
        this.selector_background_scroll_offset_x,
      canvas.height
    );

    ctx.drawImage(
      this.gameres?.peashooter_selector_background as HTMLImageElement,
      this.selector_background_scroll_offset_x -
        (this.gameres?.peashooter_selector_background.width as number),
      0
    );

    //向日葵背景
    const selector_background_scroll_offset_x_2 =
      (this.gameres?.selector_background.width as number) -
      this.selector_background_scroll_offset_x;

    ctx.drawImage(
      this.gameres?.sunflower_selector_background as HTMLImageElement,
      selector_background_scroll_offset_x_2,
      0
    );

    ctx.drawImage(
      this.gameres?.sunflower_selector_background as HTMLImageElement,
      this.selector_background_scroll_offset_x,
      0,
      (this.gameres?.sunflower_selector_background.width as number) -
        this.selector_background_scroll_offset_x,
      canvas.height,
      canvas.width / 2,
      0,
      (this.gameres?.sunflower_selector_background.width as number) -
        this.selector_background_scroll_offset_x,
      canvas.height
    );
  }
  onExit(): void {
    console.log("退出选择场景");
    this.setUIdata?.(null);
    this.gameres?.bgm_menu.pause();
    this.gameres?.bgm_game.play();
  }
}

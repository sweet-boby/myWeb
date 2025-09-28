import { Aladin } from "next/font/google";
import { FunctionRetrunPromiseType } from "./inferUtil";
import { loadAudioBuffer } from "./audioUtils";

export class Atlas {
  private images: HTMLImageElement[] = [];

  constructor(imagesrc: string, num: number) {
    if (num > 0) {
      for (let i = 1; i <= num; i++) {
        let image = new Image();
        image.src = imagesrc + i + ".png";
        this.images.push(image);
      }
    }
  }

  clear() {
    this.images = [];
  }

  getlen() {
    return this.images.length;
  }

  getImage(index: number): HTMLImageElement {
    return this.images[index];
  }
  addImage(image: HTMLImageElement) {
    this.images.push(image);
  }
}

export class Animation {
  private atlas: Atlas | null = null;
  private timer: number;
  private interval: number;
  private idxFrame: number;
  private isLoop: boolean;
  private callback: Function | null = null; // 回调函数，用于在动画结束时执行一些操作;

  constructor(
    // atlas: Atlas,
    interval: number = 1000 / 15,
    isLoop: boolean = true,
    callback: Function | null = null
  ) {
    // this.atlas = atlas;
    this.timer = 0;
    this.interval = interval;
    this.idxFrame = 0;
    this.isLoop = isLoop;
    this.callback = callback;
  }

  reset() {
    this.timer = 0;
    this.idxFrame = 0;
  }

  setCallback(callback: Function) {
    this.callback = callback;
  }

  setAtlas(atlas: Atlas) {
    this.atlas = atlas;
  }

  setIsLoop(isLoop: boolean) {
    this.isLoop = isLoop;
  }

  setInterval(interval: number) {
    this.interval = interval;
  }

  getFrame(): HTMLImageElement {
    return this.atlas?.getImage(this.idxFrame) as HTMLImageElement;
  }

  getIdxFrame(): number {
    return this.idxFrame;
  }

  checkFinish(): boolean {
    if (this.isLoop) {
      return false;
    }
    if (this.atlas) {
      return this.idxFrame >= this.atlas.getlen() - 1;
    } else {
      return false;
    }
  }

  onUpdate(deltaTime: number) {
    if (!this.atlas) return;
    this.timer += deltaTime;
    if (this.timer >= this.interval) {
      this.timer = 0;
      this.idxFrame++;
      if (this.idxFrame >= this.atlas.getlen()) {
        if (this.isLoop) {
          this.idxFrame = 0;
        } else {
          this.idxFrame = this.atlas.getlen() - 1;
          if (this.callback) this.callback();
        }
      }
    }
  }

  onDraw(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const frame = this.getFrame();
    ctx.drawImage(frame, x, y);
  }
}

export const flipAtlas = async (atlas: Atlas): Promise<Atlas> => {
  const newAtlas = new Atlas("", 0);

  for (let i = 0; i < atlas.getlen(); i++) {
    const originalImg = atlas.getImage(i);
    const flippedImg = await new Promise<HTMLImageElement>((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(originalImg);

      // 等待原始图片加载完成
      if (!originalImg.complete || !originalImg.naturalWidth) {
        originalImg.onload = () => {
          canvas.width = originalImg.width;
          canvas.height = originalImg.height;

          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(originalImg, 0, 0);

          const flipped = new Image();
          flipped.onload = () => resolve(flipped);
          flipped.src = canvas.toDataURL();
        };
      } else {
        canvas.width = originalImg.width;
        canvas.height = originalImg.height;

        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(originalImg, 0, 0);

        const flipped = new Image();
        flipped.onload = () => resolve(flipped);
        flipped.src = canvas.toDataURL();
      }
    });

    newAtlas.addImage(flippedImg);
  }

  return newAtlas;
};

export const loadGameRes = async () => {
  // 加载字体
  const font = new FontFace("myFont", "url(/zhiwu/IPix.ttf)");
  await font.load();
  document.fonts.add(font);

  // 加载图片
  const first_player_cursor = new Image();
  first_player_cursor.src = "zhiwu\\1P_cursor.png";
  await first_player_cursor.decode();

  const first_player_desc = new Image();
  first_player_desc.src = "zhiwu\\1P_desc.png";
  await first_player_desc.decode();

  const first_player_Selector_btn_down = new Image();
  first_player_Selector_btn_down.src = "zhiwu\\1P_selector_btn_down.png";
  await first_player_Selector_btn_down.decode();

  const first_player_Selector_btn_idle = new Image();
  first_player_Selector_btn_idle.src = "zhiwu\\1P_selector_btn_idle.png";
  await first_player_Selector_btn_idle.decode();

  const first_player_winner = new Image();
  first_player_winner.src = "zhiwu\\1P_winner.png";
  await first_player_winner.decode();

  const first_player = new Image();
  first_player.src = "zhiwu\\1P.png";
  await first_player.decode();

  const second_player_cursor = new Image();
  second_player_cursor.src = "zhiwu\\2P_cursor.png";
  await second_player_cursor.decode();

  const second_player_desc = new Image();
  second_player_desc.src = "zhiwu\\2P_desc.png";
  await second_player_desc.decode();

  const second_player_Selector_btn_down = new Image();
  second_player_Selector_btn_down.src = "zhiwu\\2P_selector_btn_down.png";
  await second_player_Selector_btn_down.decode();

  const second_player_Selector_btn_idle = new Image();
  second_player_Selector_btn_idle.src = "zhiwu\\2P_selector_btn_idle.png";
  await second_player_Selector_btn_idle.decode();
  const second_player_winner = new Image();
  second_player_winner.src = "zhiwu\\2P_winner.png";
  await second_player_winner.decode();

  const second_player = new Image();
  second_player.src = "zhiwu\\2P.png";
  await second_player.decode();

  const avatar_peashooter = new Image();
  avatar_peashooter.src = "zhiwu\\avatar_peashooter.png";
  await avatar_peashooter.decode();

  const avatar_sunflower = new Image();
  avatar_sunflower.src = "zhiwu\\avatar_sunflower.png";
  await avatar_sunflower.decode();

  const gravestone = new Image();
  gravestone.src = "zhiwu\\gravestone.png";
  await gravestone.decode();

  const hills = new Image();
  hills.src = "zhiwu\\hills.png";
  await hills.decode();

  const jump_effect_right = new Atlas("zhiwu\\jump_effect_", 5);
  const jump_effect_left = await flipAtlas(jump_effect_right);

  const land_effect_right = new Atlas("zhiwu\\land_effect_", 2);
  const land_effect_left = await flipAtlas(land_effect_right);

  const menu_background = new Image();
  menu_background.src = "zhiwu\\menu_background.png";
  await menu_background.decode();

  const pea_break_right = new Atlas("zhiwu\\pea_break_", 3);
  const pea_break_left = await flipAtlas(pea_break_right);

  const pea = new Image();
  pea.src = "zhiwu\\pea.png";
  await pea.decode();

  const peashooter_attack_ex_right = new Atlas(
    "zhiwu\\peashooter_attack_ex_",
    3
  );
  const peashooter_attack_ex_left = await flipAtlas(peashooter_attack_ex_right);

  const peashooter_die_right = new Atlas("zhiwu\\peashooter_die_", 4);
  const peashooter_die_left = await flipAtlas(peashooter_die_right);

  const peashooter_idle_right = new Atlas("zhiwu\\peashooter_idle_", 9);
  const peashooter_idle_left = await flipAtlas(peashooter_idle_right);

  const peashooter_run_right = new Atlas("zhiwu\\peashooter_run_", 5);
  const peashooter_run_left = await flipAtlas(peashooter_run_right);

  const peashooter_selector_background = new Image();
  peashooter_selector_background.src =
    "zhiwu\\peashooter_selector_background.png";
  const platform_large = new Image();
  platform_large.src = "zhiwu\\platform_large.png";
  await platform_large.decode();

  const platform_small = new Image();
  platform_small.src = "zhiwu\\platform_small.png";
  await platform_small.decode();

  const run_effect_right = new Atlas("zhiwu\\run_effect_", 4);
  const run_effect_left = await flipAtlas(run_effect_right);

  const selector_background = new Image();
  selector_background.src = "zhiwu\\selector_background.png";
  await selector_background.decode();

  const selector_tip = new Image();
  selector_tip.src = "zhiwu\\selector_tip.png";
  await selector_tip.decode();

  const sky = new Image();
  sky.src = "zhiwu\\sky.png";
  await sky.decode();

  const sun = new Atlas("zhiwu\\sun_", 5);
  const sun_ex = new Atlas("zhiwu\\sun_ex_", 5);
  const sun_ex_explode = new Atlas("zhiwu\\sun_ex_explode_", 5);
  const sun_explode = new Atlas("zhiwu\\sun_explode_", 5);
  const sun_text = new Atlas("zhiwu\\sun_text_", 6);

  const sunflower_attack_ex_right = new Atlas("zhiwu\\sunflower_attack_ex_", 9);
  const sunflower_attack_ex_left = await flipAtlas(sunflower_attack_ex_right);

  const sunflower_die_right = new Atlas("zhiwu\\sunflower_die_", 2);
  const sunflower_die_left = await flipAtlas(sunflower_die_right);

  const sunflower_idle_right = new Atlas("zhiwu\\sunflower_idle_", 8);
  const sunflower_idle_left = await flipAtlas(sunflower_idle_right);

  const sunflower_run_right = new Atlas("zhiwu\\sunflower_run_", 5);
  const sunflower_run_left = await flipAtlas(sunflower_run_right);

  const sunflower_selector_background = new Image();
  sunflower_selector_background.src =
    "zhiwu\\sunflower_selector_background.png";
  sunflower_selector_background.decode();

  const vs = new Image();
  vs.src = "zhiwu\\VS.png";
  await vs.decode();

  const winner_bar = new Image();
  winner_bar.src = "zhiwu\\winnner_bar.png";
  await winner_bar.decode();

  //加载音效
  const bgm_game = new Audio("zhiwu\\bgm_game.mp3");
  const bgm_menu = new Audio("zhiwu\\bgm_menu.mp3");
  bgm_menu.loop = true;
  bgm_menu.autoplay = false;
  const pea_break_1 = await loadAudioBuffer("zhiwu\\pea_break_1.mp3");
  const pea_break_2 = await loadAudioBuffer("zhiwu\\pea_break_2.mp3");
  const pea_break_3 = await loadAudioBuffer("zhiwu\\pea_break_3.mp3");
  const pea_shoot_1 = await loadAudioBuffer("zhiwu\\pea_shoot_1.mp3");
  const pea_shoot_2 = await loadAudioBuffer("zhiwu\\pea_shoot_2.mp3");
  const pea_shoot_ex = await loadAudioBuffer("zhiwu\\pea_shoot_ex.mp3");
  const sun_explode_ex = await loadAudioBuffer("zhiwu\\sun_explode_ex.mp3");
  const sun_explode_audio = await loadAudioBuffer("zhiwu\\sun_explode.mp3");
  const sun_text_audio = await loadAudioBuffer("zhiwu\\sun_text.mp3");
  const ui_confirm = await loadAudioBuffer("zhiwu\\ui_confirm.wav");
  const ui_switch = await loadAudioBuffer("zhiwu\\ui_switch.wav");
  const ui_win = await loadAudioBuffer("zhiwu\\ui_win.wav");

  return {
    font,
    first_player_cursor,
    first_player_desc,
    first_player_Selector_btn_down,
    first_player_Selector_btn_idle,
    first_player_winner,
    first_player,
    second_player_cursor,
    second_player_desc,
    second_player_Selector_btn_down,
    second_player_Selector_btn_idle,
    second_player_winner,
    second_player,
    avatar_peashooter,
    avatar_sunflower,
    gravestone,
    hills,
    jump_effect_right,
    jump_effect_left,
    land_effect_right,
    land_effect_left,
    menu_background,
    pea_break_right,
    pea_break_left,
    pea,
    peashooter_attack_ex_right,
    peashooter_attack_ex_left,
    peashooter_die_right,
    peashooter_die_left,
    peashooter_idle_right,
    peashooter_idle_left,
    peashooter_run_right,
    peashooter_run_left,
    peashooter_selector_background,
    platform_large,
    platform_small,
    run_effect_right,
    run_effect_left,
    selector_background,
    selector_tip,
    sky,
    sun,
    sun_ex,
    sun_explode,
    sun_ex_explode,
    sun_text,
    sunflower_attack_ex_right,
    sunflower_attack_ex_left,
    sunflower_die_right,
    sunflower_die_left,
    sunflower_idle_right,
    sunflower_idle_left,
    sunflower_run_right,
    sunflower_run_left,
    sunflower_selector_background,
    vs,
    winner_bar,
    bgm_game,
    bgm_menu,
    pea_break_1,
    pea_break_2,
    pea_break_3,
    pea_shoot_1,
    pea_shoot_2,
    pea_shoot_ex,
    sun_explode_ex,
    sun_explode_audio,
    sun_text_audio,
    ui_confirm,
    ui_switch,
    ui_win,
  };
};

export type GameResources = FunctionRetrunPromiseType<typeof loadGameRes>;

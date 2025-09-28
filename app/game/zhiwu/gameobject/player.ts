import { Vector2 } from "../vector2";
import { Animation, GameResources } from "../animation";
import {
  CollisionBox,
  CollisionBoxWithDemage,
  CollisionLayer,
  CollisionManege,
} from "../collisionManege";
import { Camera } from "../camera";
import { BulletManege, PeaBullet, SunBullet, SunBulletEX } from "./bullet";
import { playSound } from "../audioUtils";

import { getMsgUtil } from "../MsgUtil";

export enum PlayerId {
  Player_1,
  Player_2,
}

export enum PlayerType {
  Peashooter,
  SunFlower,
}

export class Player {
  pos: Vector2 = new Vector2(0, 0);
  size: Vector2 = new Vector2(96, 96);
  velocity: Vector2 = new Vector2(0, 0);
  current_animation: Animation | null = null;
  animation_idle_right: Animation = new Animation(1000 / 15);
  animation_idle_left: Animation = new Animation(1000 / 15);
  animation_run_right: Animation = new Animation(1000 / 15);
  animation_run_left: Animation = new Animation(1000 / 15);

  is_left_key_down: boolean = false;
  is_right_key_down: boolean = false;
  is_up_key_down: boolean = false;
  is_down_key_down: boolean = false;

  is_facing_right: boolean = false;

  run_velocity = 0.4;
  jump_velocity = 0.61;
  gravity = 0.0008;
  collision_box_platform: CollisionBox | null = null;
  collision_box_hurt: CollisionBox | null = null;
  playerid: PlayerId | null = PlayerId.Player_1;
  can_attack: boolean = true;
  attack_cd = 500;

  is_attack_ex = false;

  mp = 0;
  hp = 100;

  isAlive = true;

  gameResources: GameResources | null = null;

  camera: Camera | null = null;

  constructor(GameResources: GameResources, camera: Camera) {
    this.gameResources = GameResources;
    this.camera = camera;
  }

  onKeyDown(e: KeyboardEvent): void {
    if (this.playerid === PlayerId.Player_1) {
      switch (e.key) {
        case "a":
          this.is_left_key_down = true;
          break;
        case "d":
          this.is_right_key_down = true;
          break;
        case "w":
          this.onJump();
          this.is_up_key_down = true;
          break;
        case "s":
          this.is_down_key_down = true;
          break;
        case "f":
          if (this.can_attack) {
            this.onAttack();
            this.can_attack = false;
            setTimeout(() => {
              this.can_attack = true;
            }, this.attack_cd);
          }
          break;
        case "g":
          if (this.mp >= 100) {
            this.mp = 0;
            this.onAttackEX();
          }
        default:
          break;
      }
    } else {
      switch (e.key) {
        case "ArrowLeft":
          this.is_left_key_down = true;
          break;
        case "ArrowRight":
          this.is_right_key_down = true;
          break;
        case "ArrowUp":
          this.onJump();
          this.is_up_key_down = true;
          break;
        case "ArrowDown":
          this.is_down_key_down = true;
          break;
        case ".":
          if (this.can_attack) {
            this.onAttack();
            this.can_attack = false;
            setTimeout(() => {
              this.can_attack = true;
            }, this.attack_cd);
          }
          break;
        case "/":
          if (this.mp >= 100) {
            this.mp = 0;
            this.onAttackEX();
          }
          break;
        default:
          break;
      }
    }
  }
  onKeyUp(e: KeyboardEvent): void {
    if (this.playerid === PlayerId.Player_1) {
      switch (e.key) {
        case "a":
          this.is_left_key_down = false;
          break;
        case "d":
          this.is_right_key_down = false;
          break;
        case "w":
          this.is_up_key_down = false;
          break;
        case "s":
          this.is_down_key_down = false;
          break;
        default:
          break;
      }
    } else {
      switch (e.key) {
        case "ArrowLeft":
          this.is_left_key_down = false;
          break;
        case "ArrowRight":
          this.is_right_key_down = false;
          break;
        case "ArrowUp":
          this.is_up_key_down = false;
          break;
        case "ArrowDown":
          this.is_down_key_down = false;
          break;
        default:
          break;
      }
    }
  }
  onUpdate(deltaTime: number): void {
    if (this.pos.y > 1000) {
      if (this.isAlive) {
        this.isAlive = false;
        this.hp = 0;
        this.velocity.y = -1;
        this.collision_box_hurt?.setEnable(false);
        this.collision_box_platform?.setEnable(false);
        const { GameMsgType, emitMsgEvent } = getMsgUtil();
        emitMsgEvent(
          GameMsgType.Gameover,
          this.playerid === PlayerId.Player_1 ? "2" : "1"
        );
      }
    }

    const direction =
      Number(this.is_right_key_down) - Number(this.is_left_key_down);

    if (direction != 0) {
      if (!this.is_attack_ex) this.is_facing_right = direction > 0;
      this.current_animation = this.is_facing_right
        ? this.animation_run_right
        : this.animation_run_left;
      const distance = this.run_velocity * direction * deltaTime;
      this.onRun(distance);
    } else {
      this.current_animation = this.is_facing_right
        ? this.animation_idle_right
        : this.animation_idle_left;
    }
    this.current_animation?.onUpdate(deltaTime);

    this.moveAndcollide(deltaTime);
    this.collision_box_platform?.setPos(
      new Vector2(this.pos.x + 48, this.pos.y + 48)
    );
    this.collision_box_hurt?.setPos(
      new Vector2(this.pos.x + 48, this.pos.y + 48)
    );
  }
  onDraw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this.current_animation?.getFrame() as HTMLImageElement,
      this.pos.x,
      this.pos.y
    );
  }

  onRun(distance: number) {
    if (this.is_attack_ex) return;
    this.pos.x += distance;
  }

  onJump() {
    if (this.velocity.y !== 0 || this.is_attack_ex) return;
    this.velocity.y = -this.jump_velocity;
  }

  moveAndcollide(deltaTime: number) {
    this.velocity.y += this.gravity * deltaTime;
    this.pos.x += this.velocity.x * deltaTime;
    this.pos.y += this.velocity.y * deltaTime;
  }

  onAttack() {}

  onAttackEX() {}
}

export class Peashooter extends Player {
  animation_attack_left: Animation = new Animation();
  animation_attack_right: Animation = new Animation();
  audio_pea_shooter_1?: AudioBuffer;
  audio_pea_shooter_2?: AudioBuffer;
  audio_pea_break_1?: AudioBuffer;
  audio_pea_break_2?: AudioBuffer;
  audio_pea_break_3?: AudioBuffer;
  audio_pea_ex?: AudioBuffer;

  constructor(GameResources: GameResources, camera: Camera) {
    super(GameResources, camera);
    this.animation_idle_right.setAtlas(GameResources.peashooter_idle_right);
    this.animation_idle_left.setAtlas(GameResources?.peashooter_idle_left);
    this.animation_run_right.setAtlas(GameResources.peashooter_run_right);
    this.animation_run_left.setAtlas(GameResources.peashooter_run_left);
    this.animation_attack_left.setAtlas(
      GameResources.peashooter_attack_ex_left
    );
    this.animation_attack_right.setAtlas(
      GameResources.peashooter_attack_ex_right
    );
    this.audio_pea_shooter_1 = GameResources.pea_shoot_1;
    this.audio_pea_shooter_2 = GameResources.pea_shoot_2;
    this.audio_pea_break_1 = GameResources.pea_break_1;
    this.audio_pea_break_2 = GameResources.pea_break_2;
    this.audio_pea_break_3 = GameResources.pea_break_3;
    this.audio_pea_ex = GameResources.pea_shoot_ex;

    this.current_animation = this.animation_idle_right;
  }

  spwanPeaBullet(addmp: number) {
    const bullet = new PeaBullet(
      this.gameResources as GameResources,
      this.playerid!,
      new Vector2(this.pos.x + (this.is_facing_right ? 96 : 0), this.pos.y + 35)
    );

    bullet.collision_box_attack = CollisionBoxWithDemage.create()
      .setDemage(10)
      .setSize(new Vector2(16, 16))
      .setPos(
        new Vector2(
          this.pos.x + (this.is_facing_right ? 96 : 0),
          this.pos.y + 35
        )
      )
      .setLayerSrc(
        this.playerid === PlayerId.Player_1
          ? CollisionLayer.Player1Bullet
          : CollisionLayer.Player2Bullet
      )
      .setLayerDst(
        this.playerid === PlayerId.Player_1
          ? CollisionLayer.Player2
          : CollisionLayer.Player1
      )
      .setOnCollision(() => {
        this.mp += this.is_attack_ex ? 0 : addmp;
        console.log("mp", this.mp);
        Math.random() > 0.5
          ? playSound(this.audio_pea_break_1!)
          : Math.random() > 0.5
          ? playSound(this.audio_pea_break_2!)
          : playSound(this.audio_pea_break_3!);

        bullet.valid = false;
        // bullet.collision_box_attack?.setEnable(false);
        bullet.current_animation =
          bullet.animation_break.getFrame() as HTMLImageElement;
      });

    BulletManege.getInstance().addBullet(bullet);

    if (this.is_facing_right) {
      bullet.velocity.x = 0.5;
    } else {
      bullet.velocity.x = -0.5;
    }
  }

  onUpdate(deltaTime: number): void {
    super.onUpdate(deltaTime);
    if (this.is_attack_ex) {
      this.camera?.shake(10);
      this.current_animation = this.is_facing_right
        ? this.animation_attack_right
        : this.animation_attack_left;
      this.current_animation?.onUpdate(deltaTime);
    }
  }

  onAttack(): void {
    Math.random() > 0.5
      ? playSound(this.audio_pea_shooter_1!)
      : playSound(this.audio_pea_shooter_2!);
    this.spwanPeaBullet(15);
  }

  onAttackEX(): void {
    this.is_attack_ex = true;
    playSound(this.audio_pea_ex!);
    const interval = setInterval(() => {
      this.spwanPeaBullet(1);
    }, 100);
    setTimeout(() => {
      this.is_attack_ex = false;
      clearInterval(interval);
    }, 3000);
  }
}

export class SunFlower extends Player {
  sun_explode_ex?: AudioBuffer;
  sun_explode_audio?: AudioBuffer;
  sun_text_audio?: AudioBuffer;
  sunflower_attack_ex_right: Animation = new Animation(1000 / 5);
  sunflower_attack_ex_left: Animation = new Animation(1000 / 5);
  constructor(GameResources: GameResources, camera: Camera) {
    super(GameResources, camera);
    this.animation_idle_right.setAtlas(GameResources.sunflower_idle_right);
    this.animation_idle_left.setAtlas(GameResources.sunflower_idle_left);
    this.animation_run_right.setAtlas(GameResources.sunflower_run_right);
    this.animation_run_left.setAtlas(GameResources.sunflower_run_left);
    this.sun_explode_audio = GameResources.sun_explode_audio;
    this.sun_explode_ex = GameResources.sun_explode_ex;
    this.sun_text_audio = GameResources.sun_text_audio;
    this.sunflower_attack_ex_right.setAtlas(
      GameResources.sunflower_attack_ex_right
    );
    this.sunflower_attack_ex_left.setAtlas(
      GameResources.sunflower_attack_ex_left
    );
    this.sunflower_attack_ex_left.setIsLoop(false);
    this.sunflower_attack_ex_right.setIsLoop(false);
    this.current_animation = this.animation_idle_right;
    this.gameResources = GameResources;
  }

  onUpdate(deltaTime: number): void {
    super.onUpdate(deltaTime);
    if (this.is_attack_ex) {
      this.current_animation = this.is_facing_right
        ? this.sunflower_attack_ex_right
        : this.sunflower_attack_ex_left;
      this.current_animation?.onUpdate(deltaTime);
      if (this.current_animation.checkFinish()) {
        this.is_attack_ex = false;
        this.sunflower_attack_ex_left.reset();
        this.sunflower_attack_ex_right.reset();
      }
    }
  }

  onAttack(): void {
    const bullet = new SunBullet(
      this.gameResources as GameResources,
      this.playerid!,
      new Vector2(this.pos.x + (this.is_facing_right ? 96 : 0), this.pos.y + 35)
    );

    bullet.collision_box_attack = CollisionBoxWithDemage.create()
      .setDemage(15)
      .setSize(new Vector2(96, 96))
      .setPos(
        new Vector2(
          this.pos.x + (this.is_facing_right ? 96 : 0),
          this.pos.y + 35
        )
      )
      .setLayerSrc(
        this.playerid === PlayerId.Player_1
          ? CollisionLayer.Player1Bullet
          : CollisionLayer.Player2Bullet
      )
      .setLayerDst(
        this.playerid === PlayerId.Player_1
          ? CollisionLayer.Player2
          : CollisionLayer.Player1
      )
      .setOnCollision(() => {
        this.mp += 35;
        // console.log("mp", this.mp);
        playSound(this.sun_explode_audio!);
        this.camera?.shake(500);
        bullet.valid = false;
        // bullet.collision_box_attack?.setEnable(false);
        bullet.current_animation =
          bullet.animation_break.getFrame() as HTMLImageElement;
      });

    BulletManege.getInstance().addBullet(bullet);

    if (this.is_facing_right) {
      bullet.velocity.x = 0.3;
      bullet.velocity.y = -0.5;
    } else {
      bullet.velocity.x = -0.3;
      bullet.velocity.y = -0.5;
    }
  }

  onAttackEX(): void {
    this.is_attack_ex = true;

    const bullet = new SunBulletEX(
      this.gameResources as GameResources,
      this.playerid!,
      new Vector2(this.pos.x + (this.is_facing_right ? 350 : -350), 0)
    );

    bullet.collision_box_attack = CollisionBoxWithDemage.create()
      .setDemage(35)
      .setSize(new Vector2(288, 288))
      .setPos(
        new Vector2(
          this.pos.x + (this.is_facing_right ? 96 : 0),
          this.pos.y + 35
        )
      )
      .setLayerSrc(
        this.playerid === PlayerId.Player_1
          ? CollisionLayer.Player1Bullet
          : CollisionLayer.Player2Bullet
      )
      .setLayerDst(
        this.playerid === PlayerId.Player_1
          ? CollisionLayer.Player2
          : CollisionLayer.Player1
      )
      .setOnCollision(() => {
        this.mp += 25;
        // console.log("mp", this.mp);
        playSound(this.sun_explode_audio!);
        this.camera?.shake(500);
        bullet.valid = false;
        // bullet.collision_box_attack?.setEnable(false);
        bullet.current_animation =
          bullet.animation_break.getFrame() as HTMLImageElement;
      });

    BulletManege.getInstance().addBullet(bullet);

    if (this.is_facing_right) {
      bullet.velocity.x = 0.3;
      bullet.velocity.y = -0.5;
    } else {
      bullet.velocity.x = -0.3;
      bullet.velocity.y = -0.5;
    }
  }
}

export class PlayerFactory {
  static createPlayer(
    playerType: PlayerType,
    GameResources: GameResources,
    playerid: PlayerId,
    camera: Camera
  ) {
    let player: Player | null = null;
    let pos: Vector2 | null = null;
    switch (playerType) {
      case PlayerType.Peashooter:
        player = new Peashooter(GameResources, camera);
        break;
      case PlayerType.SunFlower:
        player = new SunFlower(GameResources, camera);
        break;
    }
    player.playerid = playerid;
    pos =
      playerid === PlayerId.Player_1
        ? new Vector2(
            camera.getPosition().x + 150,
            camera.getPosition().y + 100
          )
        : new Vector2(
            camera.getPosition().x + 1000,
            camera.getPosition().y + 100
          );
    player.pos = pos;
    player.is_facing_right = playerid === PlayerId.Player_1;
    player.collision_box_platform = CollisionBox.create()
      .setSize(new Vector2(96, 96))
      .setPos(new Vector2(player.pos.x + 48, player.pos.y + 48))
      .setLayerSrc(CollisionLayer.Player)
      .setOnCollision((boxDst: CollisionBox, deltaTime: number) => {
        if (player) {
          const that = player;
          const delta_pos_y = that.velocity.y * deltaTime;
          const last_tick_foot_pos_y = that.pos.y + that.size.y - delta_pos_y;
          if (last_tick_foot_pos_y <= boxDst.pos!.y) {
            that.pos.y = boxDst.pos!.y - that.size.y;
            that.velocity.y = 0;
          }
        }
      });

    player.collision_box_hurt = CollisionBox.create()
      .setSize(new Vector2(96, 96))
      .setPos(new Vector2(player.pos.x + 48, player.pos.y + 48))
      .setLayerSrc(
        playerid === PlayerId.Player_1
          ? CollisionLayer.Player1
          : CollisionLayer.Player2
      )
      .setLayerDst(
        playerid === PlayerId.Player_1
          ? CollisionLayer.Player2Bullet
          : CollisionLayer.Player1Bullet
      )
      .setOnCollision((boxDst: CollisionBoxWithDemage, deltaTime: number) => {
        player!.hp -= boxDst.getDemage();
        boxDst.setEnable(false);
        if (player!.hp <= 0) {
          const { GameMsgType, emitMsgEvent } = getMsgUtil();

          emitMsgEvent(
            GameMsgType.Gameover,
            playerid === PlayerId.Player_1 ? "2" : "1"
          );
          player.isAlive = false;
          player.hp = 0;
          player.velocity.y = -1;
          player.collision_box_hurt?.setEnable(false);
          player.collision_box_platform?.setEnable(false);
          console.log("player die");
        }
      });
    return player;
  }
}

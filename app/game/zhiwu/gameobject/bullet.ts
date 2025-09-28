import { Animation, GameResources } from "../animation";
import {
  CollisionBox,
  CollisionBoxWithDemage,
  CollisionLayer,
  CollisionManege,
} from "../collisionManege";
import { Vector2 } from "../vector2";
import { PlayerId } from "./player";

class Bullet {
  pos: Vector2 = new Vector2(0, 0);
  size: Vector2 = new Vector2(16, 16);
  velocity: Vector2 = new Vector2(0, 0);
  current_animation: HTMLImageElement | null = null;
  valid: boolean = true;
  can_remove: boolean = false;
  playerid: PlayerId = PlayerId.Player_1;
  collision_box_attack: CollisionBoxWithDemage | null = null;
  onUpdata(deltaTime: number) {}
  onDraw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.current_animation as HTMLImageElement,
      this.pos.x - (this.current_animation?.width as number) / 2,
      this.pos.y - (this.current_animation?.height as number) / 2
    );
  }
  removeCollisionBox() {
    if (this.collision_box_attack) {
      CollisionManege.getInstance().removeCollisionBox(
        this.collision_box_attack
      );
    }
  }
}

export class PeaBullet extends Bullet {
  size: Vector2 = new Vector2(64, 64);
  animation_idle: HTMLImageElement | null = null;
  animation_break: Animation = new Animation();
  constructor(gameResources: GameResources, playerid: PlayerId, pos: Vector2) {
    super();
    setTimeout(() => {
      this.can_remove = true;
    }, 5000);
    this.pos = pos;
    this.playerid = playerid;
    this.animation_idle = gameResources.pea;
    this.animation_break.setAtlas(gameResources.pea_break_right);
    this.animation_break.setIsLoop(false);
    this.current_animation = this.animation_idle;
  }

  onUpdata(deltaTime: number) {
    this.pos = this.pos.add(this.velocity.mul(deltaTime));
    this.collision_box_attack?.setPos(this.pos);
    if (!this.valid) {
      this.animation_break.onUpdate(deltaTime);
      this.current_animation =
        this.animation_break.getFrame() as HTMLImageElement;
      // console.log("check finish");
      if (this.animation_break.checkFinish()) {
        // console.log("remove bullet");
        this.can_remove = true;
      }
      return;
    }
  }
}

export class SunBullet extends Bullet {
  size: Vector2 = new Vector2(64, 64);
  animation_idle: Animation = new Animation();
  animation_break: Animation = new Animation();
  constructor(gameResources: GameResources, playerid: PlayerId, pos: Vector2) {
    super();
    setTimeout(() => {
      this.can_remove = true;
    }, 5000);

    this.pos = pos;
    this.playerid = playerid;
    this.animation_idle.setAtlas(gameResources.sun);
    this.animation_break.setAtlas(gameResources.sun_explode);
    this.animation_break.setIsLoop(false);
    this.current_animation = this.animation_idle.getFrame() as HTMLImageElement;
  }

  onUpdata(deltaTime: number) {
    if (!this.valid) {
      this.animation_break.onUpdate(deltaTime);
      this.current_animation =
        this.animation_break.getFrame() as HTMLImageElement;
      // console.log("check finish");
      if (this.animation_break.checkFinish()) {
        // console.log("remove bullet");
        this.can_remove = true;
      }
      return;
    }
    this.velocity.y += 0.0009 * deltaTime;
    this.pos = this.pos.add(this.velocity.mul(deltaTime));
    this.collision_box_attack?.setPos(this.pos);
    this.animation_idle.onUpdate(deltaTime);
    this.current_animation = this.animation_idle.getFrame() as HTMLImageElement;
  }
}

export class SunBulletEX extends SunBullet {
  constructor(gameResources: GameResources, playerid: PlayerId, pos: Vector2) {
    super(gameResources, playerid, pos);
    this.animation_idle.setAtlas(gameResources.sun_ex);
    this.animation_break.setAtlas(gameResources.sun_ex_explode);
    this.animation_break.setIsLoop(false);
  }

  onUpdata(deltaTime: number) {
    if (!this.valid) {
      this.animation_break.onUpdate(deltaTime);
      this.current_animation =
        this.animation_break.getFrame() as HTMLImageElement;
      // console.log("check finish");
      if (this.animation_break.checkFinish()) {
        // console.log("remove bullet");
        this.can_remove = true;
      }
      return;
    }
    this.pos.y += 0.09 * deltaTime;
    this.collision_box_attack?.setPos(this.pos);
    this.animation_idle.onUpdate(deltaTime);
    this.current_animation = this.animation_idle.getFrame() as HTMLImageElement;
  }
}

export class BulletManege {
  private bullets: Bullet[] = [];
  private static Instance: BulletManege | null = null;
  private constructor() {}

  static getInstance() {
    if (this.Instance === null) {
      this.Instance = new BulletManege();
    }
    return this.Instance;
  }

  addBullet(bullet: Bullet) {
    this.bullets.push(bullet);
  }

  onUpdata(deltaTime: number) {
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].onUpdata(deltaTime);
      if (this.bullets[i].can_remove) {
        this.bullets[i].removeCollisionBox();
        this.bullets.splice(i, 1);
        i--;
      }
    }
  }

  onDraw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].onDraw(ctx);
    }
  }
}

import { Vector2 } from "./vector2";

export enum CollisionLayer {
  None,
  Player,
  Player1,
  Player2,
  Player1Bullet,
  Player2Bullet,
  Platform,
}

export class CollisionBox {
  size: Vector2 | null = null;
  pos: Vector2 | null = null;
  enable: boolean = true;
  onCollision: Function | null = null;
  layer_src: CollisionLayer = CollisionLayer.None;
  layer_dst: CollisionLayer = CollisionLayer.None;
  checkCollision: (otherBox: CollisionBox) => boolean = (
    otherBox: CollisionBox
  ) => {
    const is_collide_x =
      Math.max(
        this.pos!.x + this.size!.x / 2,
        otherBox.pos!.x + otherBox.size!.x / 2
      ) -
        Math.min(
          this.pos!.x - this.size!.x / 2,
          otherBox.pos!.x - otherBox.size!.x / 2
        ) <=
      this.size!.x + otherBox.size!.x;

    const is_collide_y =
      Math.max(
        this.pos!.y + this.size!.y / 2,
        otherBox.pos!.y + otherBox.size!.y / 2
      ) -
        Math.min(
          this.pos!.y - this.size!.y / 2,
          otherBox.pos!.y - otherBox.size!.y / 2
        ) <=
      this.size!.y + otherBox.size!.y;
    return is_collide_x && is_collide_y;
  };

  protected constructor() {}

  setSize(size: Vector2) {
    this.size = size;
    return this;
  }

  getSize() {
    return this.size;
  }

  setPos(pos: Vector2) {
    this.pos = pos;
    return this;
  }

  setLayerSrc(layer: CollisionLayer) {
    this.layer_src = layer;
    return this;
  }

  setLayerDst(layer: CollisionLayer) {
    this.layer_dst = layer;
    return this;
  }

  setOnCollision(onCollision: Function) {
    this.onCollision = onCollision;
    return this;
  }

  setCheckCollision(checkCollision: (otherBox: CollisionBox) => boolean) {
    this.checkCollision = checkCollision;
    return this;
  }

  setEnable(enable: boolean) {
    this.enable = enable;
    return this;
  }

  static create() {
    const box = new CollisionBox();
    CollisionManege.getInstance().createCollisionBox(box);
    return box;
  }
}

export class CollisionBoxWithDemage extends CollisionBox {
  demage: number = 0;

  setDemage(demage: number) {
    this.demage = demage;
    return this;
  }

  getDemage() {
    return this.demage;
  }

  static create() {
    const box = new CollisionBoxWithDemage();
    CollisionManege.getInstance().createCollisionBox(box);
    return box;
  }
}

export class CollisionManege {
  private static instance: CollisionManege | null = null;

  private collision_boxes: CollisionBox[] = [];

  private constructor() {}

  static getInstance() {
    if (!CollisionManege.instance) {
      CollisionManege.instance = new CollisionManege();
    }
    return CollisionManege.instance;
  }

  createCollisionBox(box: CollisionBox) {
    this.collision_boxes.push(box);
  }

  removeCollisionBox(collision_box: CollisionBox) {
    this.collision_boxes = this.collision_boxes.filter(
      (box) => box !== collision_box
    );
  }

  processCollide(deltaTime: number) {
    if (this.collision_boxes.length === 0) {
      return;
    }

    for (let bos_src of this.collision_boxes) {
      if (!bos_src.enable || bos_src.layer_dst === CollisionLayer.None) {
        continue;
      }

      for (let bos_dst of this.collision_boxes) {
        if (!bos_dst.enable) {
          continue;
        }

        if (bos_src === bos_dst) {
          continue;
        }

        if (bos_src.layer_dst !== bos_dst.layer_src) {
          continue;
        }

        if (bos_dst.checkCollision(bos_src)) {
          bos_dst.onCollision?.(bos_src, deltaTime);
        }
      }
    }
  }

  onDebugRender(ctx: CanvasRenderingContext2D) {
    // console.log("onDebugRender", this.collision_boxes);
    for (let box of this.collision_boxes) {
      if (!box.enable) {
        continue;
      }
      // console.log("ondebug");
      ctx.strokeStyle = "red";
      // 画一个空心框
      ctx.strokeRect(
        box.pos!.x - box.size!.x / 2,
        box.pos!.y - box.size!.y / 2,
        box.size!.x,
        box.size!.y
      );
    }
  }

  clear() {
    this.collision_boxes = [];
  }
}

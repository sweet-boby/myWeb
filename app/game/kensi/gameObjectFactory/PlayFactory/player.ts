import { Character } from "../../component/Character";
import { Animation } from "../../component/Animation";
import { ResourcesManager } from "../../common/ResourcesManager";
import { getImgUtils } from "../../Util/ImgUtil";
import { Bodies, Body } from "matter-js";
import { CollisionBox } from "../../component/CollisionBox";
import { PhysicsManager } from "../../common/PhysicsManager";
import {
  PlayerAttackState,
  PlayerDeadState,
  PlayerFallState,
  PlayerIdleState,
  PlayerJumpState,
  PlayerRollState,
  PlayerRunState,
} from "./playStateNode";
import { StateMachine } from "../../component/StateMachine";
import { GameObject } from "../../common/GameObject";
import { GameObjectManager } from "../../common/GameObjectManager";
import { Gimage } from "../../component/Gimage";
import { getMsgUtil } from "../../Util/MsgUtil";
export enum AttackDirection {
  Up,
  Down,
  Left,
  Right,
}

export const CD_ROLL = 750;
export const CD_ATTACK = 500;
export const SPEED_RUN = 6;
export const SPEED_JUMP = 10;
export const SPEED_ROLL = 8;

export class Player extends Character {
  isRolling: boolean = false;
  isRollingCdComp: boolean = true;
  isAttacking: boolean = false;
  isAttackingCdComp: boolean = true;
  attackDirection: AttackDirection = AttackDirection.Up;

  isLeftKeyDown: boolean = false;
  isRightKeyDown: boolean = false;
  isUpKeyDown: boolean = false;
  isDownKeyDown: boolean = false;
  isAttackKeyDown: boolean = false;

  animationSlashUp: Animation | null = null;
  animationSlashDown: Animation | null = null;
  animationSlashLeft: Animation | null = null;
  animationSlashRight: Animation | null = null;
  currentSlashAnimation: Animation | null = null;

  isJumpVfxVisible: boolean = false;
  jumpVfxAnimation: Animation | null = null;
  isLandVfxVisible: boolean = false;
  landVfxAnimation: Animation | null = null;

  onStart(): void {
    const { emitMsgEvent } = getMsgUtil();
    emitMsgEvent("GameUI", this.hp);

    const load = async () => {
      const resourcesManager = ResourcesManager.getInstance();
      const { imageToAtlas, filpAtlas } = getImgUtils();
      const attackImg = resourcesManager.getImage("/kensi/player/attack.png")!;
      const attackAtlasRight = await imageToAtlas(attackImg, 5);
      const attackAtlasLeft = await filpAtlas(attackAtlasRight);
      resourcesManager.addAtlas("attackright", attackAtlasRight);
      resourcesManager.addAtlas("attackleft", attackAtlasLeft);
      const attackleft = new Animation(this.gameObject);
      attackleft.setAtlas(attackAtlasLeft);
      attackleft.setInterval(1000 / 25);
      attackleft.setIsLoop(false);
      attackleft.setCallback(() => {
        this.isAttacking = false;
        if (this.hitBox) this.hitBox.setEnabled(false);
      });
      const attackright = new Animation(this.gameObject);
      attackright.setAtlas(attackAtlasRight);
      attackright.setInterval(1000 / 25);
      attackright.setIsLoop(false);
      attackright.setCallback(() => {
        this.isAttacking = false;
        if (this.hitBox) this.hitBox.setEnabled(false);
      });

      this.animationPool.set("attack", {
        left: attackleft,
        right: attackright,
      });

      const deadImg = resourcesManager.getImage("/kensi/player/dead.png");
      const deadAtlasRight = await imageToAtlas(deadImg!, 6);
      const deadAtlasLeft = await filpAtlas(deadAtlasRight);
      resourcesManager.addAtlas("deadright", deadAtlasRight);
      resourcesManager.addAtlas("deadleft", deadAtlasLeft);
      const deadleft = new Animation(this.gameObject);
      deadleft.setAtlas(deadAtlasLeft);
      deadleft.setInterval(1000 / 5);
      deadleft.setIsLoop(false);
      const deadright = new Animation(this.gameObject);
      deadright.setAtlas(deadAtlasRight);
      deadright.setInterval(1000 / 5);
      deadright.setIsLoop(false);
      this.animationPool.set("dead", {
        left: deadleft,
        right: deadright,
      });

      const fallImg = resourcesManager.getImage("/kensi/player/fall.png");
      const fallAtlasRight = await imageToAtlas(fallImg!, 5);
      const fallAtlasLeft = await filpAtlas(fallAtlasRight);
      resourcesManager.addAtlas("fallright", fallAtlasRight);
      resourcesManager.addAtlas("fallleft", fallAtlasLeft);
      const fallleft = new Animation(this.gameObject);
      fallleft.setAtlas(fallAtlasLeft);
      fallleft.setInterval(1000 / 5);
      const fallright = new Animation(this.gameObject);
      fallright.setAtlas(fallAtlasRight);
      fallright.setInterval(1000 / 5);

      this.animationPool.set("fall", {
        left: fallleft,
        right: fallright,
      });

      const idleright = await resourcesManager.imageToAnimation(
        this.gameObject,
        "/kensi/player/idle.png",
        5,
        "idleright"
      );
      idleright?.setInterval(1000 / 5);
      const idleleft = await resourcesManager.flipAtlasToAnimation(
        this.gameObject,
        "idleright",
        "idleleft"
      );
      idleleft?.setInterval(1000 / 5);
      if (idleleft && idleright)
        this.animationPool.set("idle", {
          left: idleleft,
          right: idleright,
        });

      const jumpImg = resourcesManager.getImage("/kensi/player/jump.png");
      const jumpAtlasRight = await imageToAtlas(jumpImg!, 5);
      const jumpAtlasLeft = await filpAtlas(jumpAtlasRight);
      resourcesManager.addAtlas("jumpright", jumpAtlasRight);
      resourcesManager.addAtlas("jumpleft", jumpAtlasLeft);
      const jumpleft = new Animation(this.gameObject);
      jumpleft.setAtlas(jumpAtlasLeft);
      jumpleft.setInterval(1000 / 5);
      const jumpright = new Animation(this.gameObject);
      jumpright.setAtlas(jumpAtlasRight);
      jumpright.setInterval(1000 / 5);

      this.animationPool.set("jump", {
        left: jumpleft,
        right: jumpright,
      });

      const rollImg = resourcesManager.getImage("/kensi/player/roll.png");
      const rollAtlasRight = await imageToAtlas(rollImg!, 7);
      const rollAtlasLeft = await filpAtlas(rollAtlasRight);
      resourcesManager.addAtlas("rollright", rollAtlasRight);
      resourcesManager.addAtlas("rollleft", rollAtlasLeft);
      const rollleft = new Animation(this.gameObject);
      rollleft.setAtlas(rollAtlasLeft);
      rollleft.setInterval(1000 / 20);
      rollleft.setIsLoop(false);
      rollleft.setCallback(() => {
        this.isRolling = false;
      });
      const rollright = new Animation(this.gameObject);
      rollright.setAtlas(rollAtlasRight);
      rollright.setInterval(1000 / 20);
      rollright.setIsLoop(false);
      rollright.setCallback(() => {
        this.isRolling = false;
      });
      this.animationPool.set("roll", {
        left: rollleft,
        right: rollright,
      });

      const runImg = resourcesManager.getImage("/kensi/player/run.png");
      const runAtlasRight = await imageToAtlas(runImg!, 10);
      const runAtlasLeft = await filpAtlas(runAtlasRight);
      resourcesManager.addAtlas("runright", runAtlasRight);
      resourcesManager.addAtlas("runleft", runAtlasLeft);
      const runleft = new Animation(this.gameObject);
      runleft.setAtlas(runAtlasLeft);
      const runright = new Animation(this.gameObject);
      runright.setAtlas(runAtlasRight);

      this.animationPool.set("run", {
        left: runleft,
        right: runright,
      });

      const slashImgUp = resourcesManager.getImage(
        "/kensi/player/vfx_attack_up.png"
      );
      const slashAtlasUp = await imageToAtlas(slashImgUp!, 5);
      resourcesManager.addAtlas("slashup", slashAtlasUp);
      this.animationSlashUp = new Animation(this.gameObject);
      this.animationSlashUp.setAtlas(slashAtlasUp);
      this.animationSlashUp.setIsLoop(false);

      const slashImgDown = resourcesManager.getImage(
        "/kensi/player/vfx_attack_down.png"
      );
      const slashAtlasDown = await imageToAtlas(slashImgDown!, 5);
      resourcesManager.addAtlas("slashdown", slashAtlasDown);
      this.animationSlashDown = new Animation(this.gameObject);
      this.animationSlashDown.setAtlas(slashAtlasDown);
      this.animationSlashDown.setIsLoop(false);

      const slashImgLeft = resourcesManager.getImage(
        "/kensi/player/vfx_attack_left.png"
      );
      const slashAtlasLeft = await imageToAtlas(slashImgLeft!, 5);
      resourcesManager.addAtlas("slashleft", slashAtlasLeft);
      this.animationSlashLeft = new Animation(this.gameObject);
      this.animationSlashLeft.setAtlas(slashAtlasLeft);
      this.animationSlashLeft.setIsLoop(false);

      const slashImgRight = resourcesManager.getImage(
        "/kensi/player/vfx_attack_right.png"
      );
      const slashAtlasRight = await imageToAtlas(slashImgRight!, 5);
      resourcesManager.addAtlas("slashright", slashAtlasRight);
      this.animationSlashRight = new Animation(this.gameObject);
      this.animationSlashRight.setAtlas(slashAtlasRight);
      this.animationSlashRight.setIsLoop(false);

      const jumpVfxImg = resourcesManager.getImage(
        "/kensi/player/vfx_jump.png"
      );
      const jumpVfxAtlas = await imageToAtlas(jumpVfxImg!, 5);
      resourcesManager.addAtlas("jumpvfx", jumpVfxAtlas);
      this.jumpVfxAnimation = new Animation(this.gameObject);
      this.jumpVfxAnimation.setAtlas(jumpVfxAtlas);
      this.jumpVfxAnimation.setInterval(1000 / 25);
      this.jumpVfxAnimation.setIsLoop(false);
      this.jumpVfxAnimation.setCallback(() => {
        this.isJumpVfxVisible = false;
      });

      const landVfxImg = resourcesManager.getImage(
        "/kensi/player/vfx_land.png"
      );
      const landVfxAtlas = await imageToAtlas(landVfxImg!, 5);
      resourcesManager.addAtlas("landvfx", landVfxAtlas);
      this.landVfxAnimation = new Animation(this.gameObject);
      this.landVfxAnimation.setAtlas(landVfxAtlas);
      this.landVfxAnimation.setIsLoop(false);
      this.landVfxAnimation.setInterval(1000 / 25);
      this.landVfxAnimation.setCallback(() => {
        this.isLandVfxVisible = false;
      });

      this.stateMachine = new StateMachine(this.gameObject);
      this.stateMachine?.addState(PlayerAttackState);
      this.stateMachine?.addState(PlayerRunState);
      this.stateMachine?.addState(PlayerFallState);
      this.stateMachine?.addState(PlayerDeadState);
      this.stateMachine?.addState(PlayerIdleState);
      this.stateMachine?.addState(PlayerRollState);
      this.stateMachine?.addState(PlayerJumpState);

      this.stateMachine?.switchTo(PlayerIdleState);
    };
    load();
    const position = this.gameObject.transform.position;
    this.hitBox = new CollisionBox(this.gameObject);
    this.hitBox.setBody(
      Bodies.rectangle(position.x, position.y, 200, 200, {
        label: "playerhitbox",
        isSensor: true,
        render: {
          fillStyle: "#f00",
        },
      })
    );
    this.hitBox.ignoreGravity = true;
    this.hitBox.callback = (other: CollisionBox) => {};
    this.hitBox.setEnabled(false);

    this.hurtBox = new CollisionBox(this.gameObject);
    this.hurtBox.setBody(
      Bodies.rectangle(position.x, position.y, 50, 80, {
        label: "playerhurtbox",
        inertia: Infinity, // Prevent rotation
        angularVelocity: 0, // Ensure no initial angular velocity
        frictionAir: 0, // Remove air friction that might cause rotation
      })
    );
    this.hurtBox.callback = (other: CollisionBox) => {
      if (other.body) {
        if (this.hurtBox?.getEnabled() && other.getEnabled()) {
          if (other.body.label.includes("enemy")) {
            this.decreaseHP();
          }
        }
      }
    };
  }

  onUpdate(deltaTime: number): void {
    const { x, y } = this.getMoveAxis();
    if (x !== 0) {
      this.isFaceRight = x > 0;
    }

    const bg = GameObjectManager.getInstance().findGameObjectByName("bg");
    const bgImg = bg?.findComponent(Gimage)?.image;
    const position = this.hurtBox?.body?.position;

    if (bg && bgImg && position && this.hurtBox && this.hurtBox.body) {
      const bgWidth = bgImg.width;
      const bgPosition = bg.transform.position;
      const bgRight = bgPosition.x + bgWidth / 2;
      const bgLeft = bgPosition.x - bgWidth / 2;
      const bgBottom = bgPosition.y + 260;
      if (position.x > bgRight) {
        Body.setPosition(this.hurtBox.body, {
          x: bgRight - 100,
          y: position.y,
        });
      } else if (position.x < bgLeft) {
        Body.setPosition(this.hurtBox.body, {
          x: bgLeft + 100,
          y: position.y,
        });
      }
      if (position.y > bgBottom) {
        Body.setPosition(this.hurtBox.body, {
          x: position.x,
          y: bgBottom - 60,
        });
      }
    }

    if (this.isAttacking) {
      this.currentSlashAnimation?.onUpdate(deltaTime);
    }

    if (this.isJumpVfxVisible) {
      this.jumpVfxAnimation?.onUpdate(deltaTime);
    }
    if (this.landVfxAnimation) {
      this.landVfxAnimation.onUpdate(deltaTime);
    }

    super.onUpdate(deltaTime);
  }

  onDraw(ctx: CanvasRenderingContext2D): void {
    if (this.isJumpVfxVisible) {
      this.jumpVfxAnimation?.onDraw(ctx);
    }
    if (this.isLandVfxVisible) {
      this.landVfxAnimation?.onDraw(ctx);
    }

    super.onDraw(ctx);
    if (this.isAttacking) this.currentSlashAnimation?.onDraw(ctx);
  }

  setRolling(isRolling: boolean) {
    this.isRolling = isRolling;
  }

  getRolling() {
    return this.isRolling;
  }

  canRoll() {
    return this.isRollingCdComp && !this.isRolling && this.isDownKeyDown;
  }

  setAttacking(isAttacking: boolean) {
    this.isAttacking = isAttacking;
  }

  getAttacking() {
    return this.isAttacking;
  }

  canAttack() {
    return this.isAttackingCdComp && !this.isAttacking && this.isAttackKeyDown;
  }

  canJump() {
    return this.isOnFloor() && this.isUpKeyDown;
  }

  getMoveAxis() {
    let x = 0;
    let y = 0;
    if (this.isLeftKeyDown) {
      x = -1;
    }
    if (this.isRightKeyDown) {
      x = 1;
    }
    if (this.isUpKeyDown) {
      y = -1;
    }
    if (this.isDownKeyDown) {
      y = 1;
    }
    return { x, y };
  }

  isOnFloor() {
    const vy = this.hurtBox?.body?.velocity.y!;
    return vy <= 0.1 && vy >= 0;
  }

  getAttackDirection() {
    if (this.isUpKeyDown) {
      this.attackDirection = AttackDirection.Up;
    } else if (this.isDownKeyDown) {
      this.attackDirection = AttackDirection.Down;
    } else {
      this.attackDirection = this.isFaceRight
        ? AttackDirection.Right
        : AttackDirection.Left;
    }
    return this.attackDirection;
  }

  onHurt(): void {
    const { emitMsgEvent } = getMsgUtil();
    emitMsgEvent("GameUI", this.hp);

    const hurtAudio = ResourcesManager.getInstance().getAudioSource(
      "/kensi/audio/player_hurt.mp3"
    );
    if (hurtAudio) {
      ResourcesManager.getInstance().playAudioSource(hurtAudio);
    }
    const interval = setInterval(() => {
      this.isBlinkInvisible = !this.isBlinkInvisible;
    }, 90);
    setTimeout(() => {
      clearInterval(interval);
    }, 300);
  }

  onJump() {
    this.isJumpVfxVisible = true;
    if (this.jumpVfxAnimation) this.jumpVfxAnimation.reset();
  }

  onLand() {
    this.isLandVfxVisible = true;
    this.landVfxAnimation?.reset();
  }

  onAttack() {
    this.isAttackingCdComp = false;
    setTimeout(() => {
      this.isAttackingCdComp = true;
    }, CD_ATTACK);
    switch (this.attackDirection) {
      case AttackDirection.Up:
        this.currentSlashAnimation = this.animationSlashUp;
        break;
      case AttackDirection.Down:
        this.currentSlashAnimation = this.animationSlashDown;
        break;
      case AttackDirection.Left:
        this.currentSlashAnimation = this.animationSlashLeft;
        break;
      case AttackDirection.Right:
        this.currentSlashAnimation = this.animationSlashRight;
        break;
    }
    this.currentSlashAnimation?.reset();
  }

  onRoll() {
    this.isRollingCdComp = false;
    setTimeout(() => {
      this.isRollingCdComp = true;
    }, CD_ROLL);
  }
}

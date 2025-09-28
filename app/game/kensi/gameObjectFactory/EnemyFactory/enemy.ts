import { Bodies, Body } from "matter-js";
import { ResourcesManager } from "../../common/ResourcesManager";
import { Animation } from "../../component/Animation";
import { Character } from "../../component/Character";
import { CollisionBox } from "../../component/CollisionBox";
import { GameObject, GameObjectTag } from "../../common/GameObject";
import { GameObjectManager } from "../../common/GameObjectManager";
import { bardFactory } from "./barb";
import { swordFactory } from "./sword";
import { Controller } from "../../component/controller";
import { StateMachine } from "../../component/StateMachine";
import {
  EnemyAimStateNode,
  EnemyDashInAirStateNode,
  EnemyDashOnFloorStateNode,
  EnemyDeadStateNode,
  EnemyFallStateNode,
  EnemyIdleStateNode,
  EnemyJumpStateNode,
  EnemyRunStateNode,
  EnemySquatStateNode,
  EnemyThrowBarbStateNode,
  EnemyThrowSilkStateNode,
  EnemyThrowSwordStateNode,
} from "./enemyStateNode";
import { Gimage } from "../../component/Gimage";

class EnemyController extends Controller {
  index = 0;
  keydownCallback: (e: KeyboardEvent) => void = (e) => {
    const enemy = this.gameObject.findComponent(Enemy);
    if (!enemy) return;
    switch (e.key) {
      case "b":
        enemy?.throwBarb();
        break;
      case "n":
        enemy?.throwSword();
        break;
      case "m":
        enemy?.onThrowSilk();
        break;
      case ",":
        const animations = [...enemy.animationPool.keys()];
        const a = enemy.animationPool.get(animations[this.index]);
        a?.left.reset();
        a?.right.reset();
        if (a) enemy.currentAnimation = a;
        else this.index = 0;
        this.index++;
        break;
      case ".":
        enemy.isFaceRight = !enemy.isFaceRight;
        break;
    }
  };
}

export class Enemy extends Character {
  isFaceRight = true;
  isThrowingSilk = false;
  isDashInAir = false;
  isDashOnFloor = false;
  animationSilk: Animation | null = null;
  animationDashInAirVfx: Animation | null = null;
  animationDashOnFloorVfx: Animation | null = null;
  currentDashAnimation: Animation | null = null;
  onStart(): void {
    const resourcesManager = ResourcesManager.getInstance();
    const aim = resourcesManager.atlasToAnimation(
      "/kensi/enemy/aim",
      this.gameObject
    );
    if (aim) {
      aim?.setInterval(50);
      aim?.setIsLoop(false);
      this.animationPool.set("aim", { left: aim, right: aim });
    }

    const dashInair = resourcesManager.atlasToAnimation(
      "/kensi/enemy/dash_in_air",
      this.gameObject
    );
    if (dashInair) {
      dashInair.setInterval(50);
      dashInair.setIsLoop(false);
      this.animationPool.set("dash_in_air", {
        left: dashInair,
        right: dashInair,
      });
    }

    const dashOnFloor = resourcesManager.atlasToAnimation(
      "/kensi/enemy/dash_on_floor",
      this.gameObject
    );
    if (dashOnFloor) {
      dashOnFloor.setInterval(50);
      dashOnFloor.setIsLoop(false);
      this.animationPool.set("dash_on_floor", {
        left: dashOnFloor,
        right: dashOnFloor,
      });
    }

    const fall = resourcesManager.atlasToAnimation(
      "/kensi/enemy/fall",
      this.gameObject
    );
    if (fall) {
      fall.setInterval(50);
      fall.setIsLoop(false);
      this.animationPool.set("fall", {
        left: fall,
        right: fall,
      });
    }

    const idle = resourcesManager.atlasToAnimation(
      "/kensi/enemy/idle",
      this.gameObject
    );
    if (idle) {
      idle.setInterval(50);
      idle.setIsLoop(true);
      this.animationPool.set("idle", {
        left: idle,
        right: idle,
      });
    }

    const jump = resourcesManager.atlasToAnimation(
      "/kensi/enemy/jump",
      this.gameObject
    );
    if (jump) {
      jump.setInterval(50);
      jump.setIsLoop(false);
      this.animationPool.set("jump", {
        left: jump,
        right: jump,
      });
    }

    const run = resourcesManager.atlasToAnimation(
      "/kensi/enemy/run",
      this.gameObject
    );
    if (run) {
      run.setInterval(50);
      run.setIsLoop(true);
      this.animationPool.set("run", {
        left: run,
        right: run,
      });
    }

    const squat = resourcesManager.atlasToAnimation(
      "/kensi/enemy/squat",
      this.gameObject
    );
    if (squat) {
      squat.setInterval(100);
      squat.setIsLoop(false);
      this.animationPool.set("squat", {
        left: squat,
        right: squat,
      });
    }

    const throwBarb = resourcesManager.atlasToAnimation(
      "/kensi/enemy/throw_barb",
      this.gameObject
    );
    if (throwBarb) {
      throwBarb.setInterval(100);
      throwBarb.setIsLoop(false);
      this.animationPool.set("throwBarb", {
        left: throwBarb,
        right: throwBarb,
      });
    }
    const throwSilk = resourcesManager.atlasToAnimation(
      "/kensi/enemy/throw_silk",
      this.gameObject
    );
    if (throwSilk) {
      throwSilk.setInterval(100);
      throwSilk.setIsLoop(false);
      this.animationPool.set("throwSilk", {
        left: throwSilk,
        right: throwSilk,
      });
    }

    const throwSword = resourcesManager.atlasToAnimation(
      "/kensi/enemy/throw_sword",
      this.gameObject
    );
    if (throwSword) {
      throwSword.setInterval(50);
      throwSword.setIsLoop(false);
      this.animationPool.set("throwSword", {
        left: throwSword,
        right: throwSword,
      });
    }

    this.animationSilk = resourcesManager.atlasToAnimation(
      "/kensi/enemy/silk",
      this.gameObject
    )!;
    this.animationSilk.setInterval(100);
    this.animationSilk.setIsLoop(false);

    this.animationDashInAirVfx = resourcesManager.atlasToAnimation(
      "/kensi/enemy/vfx_dash_in_air",
      this.gameObject
    )!;
    this.animationDashInAirVfx.setInterval(100);
    this.animationDashInAirVfx.setIsLoop(false);

    this.animationDashOnFloorVfx = resourcesManager.atlasToAnimation(
      "/kensi/enemy/vfx_dash_on_floor",
      this.gameObject
    )!;
    this.animationDashOnFloorVfx.setInterval(100);
    this.animationDashOnFloorVfx.setIsLoop(false);

    this.stateMachine = new StateMachine(this.gameObject);
    this.stateMachine.addState(EnemyAimStateNode);
    this.stateMachine.addState(EnemyDashInAirStateNode);
    this.stateMachine.addState(EnemyDashOnFloorStateNode);
    this.stateMachine.addState(EnemyDeadStateNode);
    this.stateMachine.addState(EnemyFallStateNode);
    this.stateMachine.addState(EnemyIdleStateNode);
    this.stateMachine.addState(EnemyJumpStateNode);
    this.stateMachine.addState(EnemyRunStateNode);
    this.stateMachine.addState(EnemySquatStateNode);
    this.stateMachine.addState(EnemyThrowBarbStateNode);
    this.stateMachine.addState(EnemyThrowSilkStateNode);
    this.stateMachine.addState(EnemyThrowSwordStateNode);
    this.stateMachine.switchTo(EnemyIdleStateNode);

    const position = this.gameObject.transform.position;
    this.hurtBox = new CollisionBox(this.gameObject);
    this.hurtBox.setBody(
      Bodies.rectangle(position.x, position.y, 50, 80, {
        label: "enemyhurtbox",
        inertia: Infinity, // Prevent rotation
        angularVelocity: 0, // Ensure no initial angular velocity
        frictionAir: 0, // Remove air friction that might cause rotation
      })
    );

    this.hurtBox.callback = (other: CollisionBox) => {
      // console.log("hit", other.body?.label);
      if (other.body) {
        if (this.hurtBox?.getEnabled() && other.getEnabled()) {
          if (other.body.label.includes("playerhitbox")) {
            this.decreaseHP();
            // console.log(this.hp, "enemy");
          }
        }
      }
    };

    this.hitBox = new CollisionBox(this.gameObject);
    this.hitBox.setBody(
      Bodies.rectangle(position.x, position.y, 200, 200, {
        label: "enemyhitbox",
        inertia: Infinity, // Prevent rotation
        isSensor: true,
        angularVelocity: 0, // Ensure no initial angular velocity
        frictionAir: 0, // Remove air friction that might cause rotation
      })
    );
    this.hitBox.setEnabled(true);
    this.hitBox.ignoreGravity = true;
  }

  onUpdate(deltaTime: number): void {
    if (this.stateMachine) {
      this.stateMachine.onUpdate(deltaTime);
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

    if (this.hurtBox) {
      if (this.hurtBox.body) {
        this.gameObject.transform.position.x = this.hurtBox.body.position.x;
        this.gameObject.transform.position.y =
          this.hurtBox.body.position.y - 20;
      }
    }

    if (this.animationSilk && !this.animationSilk.checkFinish()) {
      this.animationSilk.onUpdate(deltaTime);
    }

    if (this.currentAnimation) {
      const animation = this.currentAnimation.left;
      animation.onUpdate(deltaTime);
    }
  }

  onDraw(ctx: CanvasRenderingContext2D): void {
    if (
      !this.currentAnimation ||
      (this.isBlinkInvisible && this.isInvulnerable)
    )
      return;

    if (this.isFaceRight) {
      this.currentAnimation?.left.onFlipDraw(ctx);
    } else {
      this.currentAnimation?.left.onDraw(ctx);
    }

    if (this.animationSilk && !this.animationSilk.checkFinish()) {
      this.animationSilk.onDraw(ctx);
    }

    if (this.hitBox) {
      this.hitBox.onDraw(ctx);
    }

    if (this.hurtBox) {
      this.hurtBox.onDraw(ctx);
    }
  }

  isOnFloor() {
    const vy = this.hurtBox?.body?.velocity.y!;
    return vy <= 0.1 && vy >= -0.1;
  }

  throwBarb() {
    const position = this.gameObject.transform.position;
    const numbarb = Math.floor(Math.random() * 3) + 3;
    const enemyNum = GameObjectManager.getInstance().findGameObjectsByTag(
      GameObjectTag.Enemy
    );
    if (enemyNum.length >= 10) {
      const randx = Math.floor((Math.random() - 0.5) * 700) + position.x;
      const randy = -30 * Math.random();
      bardFactory(randx, randy);
      return;
    }
    for (let i = 0; i <= numbarb; i++) {
      const randx = Math.floor((Math.random() - 0.5) * 700) + position.x;
      const randy = -30 * Math.random();
      bardFactory(randx, randy);
    }
  }
  throwSword() {
    const position = this.gameObject.transform.position;
    swordFactory(position.x, position.y + 20, this.isFaceRight);
  }
  onDash() {
    if (this.isDashInAir) {
      this.currentDashAnimation = this.animationDashInAirVfx;
    } else {
      this.currentDashAnimation = this.animationDashOnFloorVfx;
    }
  }
  onThrowSilk() {
    this.animationSilk?.reset();
  }

  onHurt(): void {
    let hurtAudio = ResourcesManager.getInstance().getAudioSource(
      "/kensi/audio/enemy_hurt_1.mp3"
    );
    switch (Math.floor(Math.random() * 3)) {
      case 0:
        hurtAudio = ResourcesManager.getInstance().getAudioSource(
          "/kensi/audio/enemy_hurt_1.mp3"
        );
        break;
      case 1:
        hurtAudio = ResourcesManager.getInstance().getAudioSource(
          "/kensi/audio/enemy_hurt_2.mp3"
        );
        break;
      case 2:
        hurtAudio = ResourcesManager.getInstance().getAudioSource(
          "/kensi/audio/enemy_hurt_3.mp3"
        );
        break;
    }
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
}

export const enemyFactory = () => {
  const enemy = new GameObject();
  enemy.transform.position.x = 500;
  enemy.addComponent(Enemy);
  enemy.addComponent(EnemyController);
  GameObjectManager.getInstance().add(enemy);
  return enemy;
};

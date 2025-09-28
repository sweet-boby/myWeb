import { Body } from "matter-js";
import { StateNode } from "../../component/StateNode";
import { Enemy } from "./enemy";
import { GameObjectManager } from "../../common/GameObjectManager";
import { Vector2 } from "../../common/vector2";
import { ResourcesManager } from "../../common/ResourcesManager";
import { getMsgUtil } from "../../Util/MsgUtil";
import { SceneType } from "../../common/Scene";

const SPEED_DASH = 13;
const SPEED_JUMP = 10;
const SPEED_RUN = 5;
export class EnemyAimStateNode extends StateNode {
  onEnter(): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (enemy && enemy.hurtBox && enemy.hurtBox.body) {
      enemy.setAnimation("aim");
      enemy.currentAnimation?.left.reset();
      enemy.currentAnimation?.right.reset();
      enemy.hurtBox.ignoreGravity = true;
      Body.setVelocity(enemy.hurtBox.body, { x: 0, y: 0 });
      enemy.currentAnimation?.left.setCallback(() => {
        enemy.hurtBox!.ignoreGravity = false;
        enemy.switchState(EnemyDashInAirStateNode);
      });
    }
  }

  onUpdate(deltaTime: number): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (enemy!.hp <= 0) {
      enemy!.switchState(EnemyDeadStateNode);
      return;
    } else {
      Body.setVelocity(enemy!.hurtBox!.body!, { x: 0, y: 0 });
    }
  }
}

export class EnemyDashInAirStateNode extends StateNode {
  dashAudio = ResourcesManager.getInstance().getAudioSource(
    "/kensi/audio/enemy_dash.mp3"
  );
  target_velocity: Vector2 = new Vector2(0, 0);
  timer: ReturnType<typeof setTimeout> | null = null;
  onEnter(): void {
    const enemy = this.gameObject.findComponent(Enemy);
    const player =
      GameObjectManager.getInstance().findGameObjectByName("player");
    if (enemy && enemy.hurtBox && enemy.hurtBox.body && player) {
      enemy.isFaceRight =
        player.transform.position.x > enemy.gameObject.transform.position.x;
      enemy.setAnimation("dash_in_air");
      enemy.isDashInAir = true;
      enemy.onDash();
      const enemyPos = enemy.gameObject.transform.position;
      const playerPos = player.transform.position;
      this.target_velocity = playerPos
        .sub(enemyPos)
        .normalize()
        .mul(SPEED_DASH);
      enemy.hurtBox.ignoreGravity = true;
      Body.setVelocity(enemy.hurtBox.body, {
        x: this.target_velocity.x,
        y: this.target_velocity.y,
      });

      this.timer = setTimeout(() => {
        enemy.isDashInAir = false;
      }, 1000);
    }

    // 播放冲刺音乐
    this.dashAudio = ResourcesManager.getInstance().getAudioSource(
      "/kensi/audio/enemy_dash.mp3"
    );
    if (this.dashAudio) {
      ResourcesManager.getInstance().playAudioSource(this.dashAudio);
    }
  }

  onUpdate(deltaTime: number): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (!enemy || !enemy.hurtBox || !enemy.hurtBox.body) return;
    if (enemy!.hp <= 0) {
      enemy!.switchState(EnemyDeadStateNode);
      return;
    } else if (enemy.isOnFloor() || !enemy.isDashInAir) {
      enemy.switchState(EnemyIdleStateNode);
      return;
    }
  }

  onExit(): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (enemy && enemy.hurtBox && enemy.hurtBox.body) {
      enemy.hurtBox.ignoreGravity = false;
      enemy.isDashInAir = false;
      clearTimeout(this.timer!);
      this.timer = null;
    }
  }
}

export class EnemyDashOnFloorStateNode extends StateNode {
  dashAudio = ResourcesManager.getInstance().getAudioSource(
    "/kensi/audio/enemy_dash.mp3"
  );
  target_velocity: Vector2 = new Vector2(0, 0);
  timer: ReturnType<typeof setTimeout> | null = null;
  onEnter(): void {
    const enemy = this.gameObject.findComponent(Enemy);
    const player =
      GameObjectManager.getInstance().findGameObjectByName("player");
    if (enemy && enemy.hurtBox && enemy.hurtBox.body && player) {
      enemy.isFaceRight =
        player.transform.position.x > enemy.gameObject.transform.position.x;
      enemy.setAnimation("dash_on_floor");
      enemy.isDashOnFloor = true;
      enemy.onDash();
      // 播放冲刺音乐
      this.dashAudio = ResourcesManager.getInstance().getAudioSource(
        "/kensi/audio/enemy_dash.mp3"
      );
      if (this.dashAudio) {
        ResourcesManager.getInstance().playAudioSource(this.dashAudio);
      }

      const enemyPos = enemy.gameObject.transform.position;
      const playerPos = player.transform.position;
      this.target_velocity = playerPos
        .sub(enemyPos)
        .normalize()
        .mul(SPEED_DASH);
      enemy.hurtBox.ignoreGravity = true;
      enemy.hurtBox.body.isSensor = true;
      Body.setVelocity(enemy.hurtBox.body, {
        x: this.target_velocity.x,
        y: enemy.hurtBox.body.velocity.y,
      });
      this.timer = setTimeout(() => {
        enemy.isDashOnFloor = false;
      }, 500);
    }
  }

  onUpdate(deltaTime: number): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (!enemy || !enemy.hurtBox || !enemy.hurtBox.body) return;
    Body.setVelocity(enemy.hurtBox.body, {
      x: this.target_velocity.x,
      y: enemy.hurtBox.body.velocity.y,
    });
    if (enemy!.hp <= 0) {
      enemy!.switchState(EnemyDeadStateNode);
      return;
    } else if (!enemy.isDashOnFloor) {
      enemy.switchState(EnemyIdleStateNode);
      return;
    }
  }

  onExit(): void {
    clearTimeout(this.timer!);
    this.timer = null;
    const enemy = this.gameObject.findComponent(Enemy);
    enemy!.hurtBox!.body!.isSensor! = false;
  }
}

export class EnemyDeadStateNode extends StateNode {
  onEnter(): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (enemy && enemy.hurtBox && enemy.hurtBox.body) {
      enemy.setAnimation("dead");
      enemy.hurtBox.setEnabled(false);
    }
    setTimeout(() => {
      //弹窗提示你赢了
      alert("你赢了");
      const { emitMsgEvent } = getMsgUtil();
      emitMsgEvent("SwitchScene", SceneType.Manu);
    }, 1000);
  }
}

export class EnemyFallStateNode extends StateNode {
  onEnter(): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (enemy && enemy.hurtBox && enemy.hurtBox.body) {
      enemy.setAnimation("fall");
      enemy.hurtBox.body.friction = 0.0001;
    }
  }

  onUpdate(deltaTime: number): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (!enemy || !enemy.hurtBox || !enemy.hurtBox.body) return;
    if (enemy!.hp <= 0) {
      enemy!.switchState(EnemyDeadStateNode);
      return;
    } else if (enemy.isOnFloor()) {
      enemy.switchState(EnemyIdleStateNode);
      return;
    }
  }

  onExit(): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (enemy && enemy.hurtBox && enemy.hurtBox.body) {
      enemy.hurtBox.body.friction = 0.1;
    }
  }
}
export class EnemyIdleStateNode extends StateNode {
  timer: ReturnType<typeof setTimeout> | null = null;
  onEnter(): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (enemy && enemy.hurtBox && enemy.hurtBox.body) {
      enemy.setAnimation("idle");
      enemy.currentAnimation?.left.reset();
      enemy.currentAnimation?.right.reset();
      enemy.hurtBox.ignoreGravity = false;
      Body.setVelocity(enemy.hurtBox.body, {
        x: 0,
        y: enemy.hurtBox.body.velocity.y,
      });

      const waitTime = enemy.hp > 5 ? Math.random() * 500 : Math.random() * 250;
      const random = Math.random();
      this.timer = setTimeout(() => {
        if (enemy!.hp > 5) {
          if (random <= 0.25) {
            if (!enemy.isOnFloor()) {
              enemy.switchState(EnemyFallStateNode);
            } else {
              enemy.switchState(EnemyJumpStateNode);
            }
          } else if (random <= 0.5) {
            if (!enemy.isOnFloor()) {
              enemy.switchState(EnemyFallStateNode);
            } else {
              enemy.switchState(EnemyRunStateNode);
            }
          } else if (random <= 0.8) {
            enemy.switchState(EnemySquatStateNode);
          } else if (random <= 0.9) {
            enemy.switchState(EnemyThrowSilkStateNode);
          } else {
            enemy.switchState(EnemyThrowSwordStateNode);
          }
        } else {
          if (random <= 0.25) {
            if (!enemy.isOnFloor()) {
              enemy.switchState(EnemyFallStateNode);
            } else {
              enemy.switchState(EnemyJumpStateNode);
            }
          } else if (random <= 0.6) {
            enemy.switchState(EnemyThrowSwordStateNode);
          } else if (random <= 0.7) {
            enemy.switchState(EnemyThrowSilkStateNode);
          } else if (random <= 0.9) {
            enemy.switchState(EnemyThrowBarbStateNode);
          } else {
            enemy.switchState(EnemySquatStateNode);
          }
        }
      }, waitTime);
    }
  }

  onUpdate(deltaTime: number): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (!enemy || !enemy.hurtBox || !enemy.hurtBox.body) return;
    if (enemy!.hp <= 0) {
      enemy!.switchState(EnemyDeadStateNode);
      return;
    } else if (!enemy.isOnFloor()) {
      enemy.switchState(EnemyFallStateNode);
      return;
    }
  }

  onExit(): void {
    const enemy = this.gameObject.findComponent(Enemy);
    const player =
      GameObjectManager.getInstance().findGameObjectByName("player");
    if (enemy && enemy.hurtBox && enemy.hurtBox.body && player) {
      const enemyPos = enemy.gameObject.transform.position;
      const playerPos = player.transform.position;
      enemy.isFaceRight = playerPos.x > enemyPos.x;
      clearTimeout(this.timer!);
      this.timer = null;
    }
  }
}

export class EnemyJumpStateNode extends StateNode {
  onEnter(): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (enemy && enemy.hurtBox && enemy.hurtBox.body) {
      enemy.setAnimation("jump");
      enemy.hurtBox.ignoreGravity = false;
      Body.setVelocity(enemy.hurtBox.body, {
        x: enemy.hurtBox.body.velocity.x,
        y: -SPEED_JUMP,
      });
    }
  }

  onUpdate(deltaTime: number): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (!enemy || !enemy.hurtBox || !enemy.hurtBox.body) return;
    if (enemy!.hp <= 0) {
      enemy!.switchState(EnemyDeadStateNode);
      return;
    } else if (enemy.hurtBox.body.velocity.y > 0) {
      const random = Math.random();
      if (enemy.hp > 5) {
        if (random <= 0.5) {
          enemy.switchState(EnemyAimStateNode);
        } else if (random <= 0.8) {
          enemy.switchState(EnemyFallStateNode);
        } else {
          enemy.switchState(EnemyThrowSilkStateNode);
        }
      } else {
        if (random <= 0.5) {
          enemy.switchState(EnemyThrowSilkStateNode);
        } else if (random <= 0.8) {
          enemy.switchState(EnemyFallStateNode);
        } else {
          enemy.switchState(EnemyAimStateNode);
        }
      }
    }
  }
}

export class EnemyRunStateNode extends StateNode {
  runAudio = ResourcesManager.getInstance().getAudioSource(
    "/kensi/audio/enemy_run.mp3"
  );
  onEnter(): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (enemy && enemy.hurtBox && enemy.hurtBox.body) {
      enemy.setAnimation("run");
      //播放跑步音乐
      this.runAudio = ResourcesManager.getInstance().getAudioSource(
        "/kensi/audio/enemy_run.mp3"
      );
      if (this.runAudio) {
        ResourcesManager.getInstance().playAudioSource(this.runAudio, true);
      }
    }
  }
  onUpdate(deltaTime: number): void {
    const enemy = this.gameObject.findComponent(Enemy);
    const player =
      GameObjectManager.getInstance().findGameObjectByName("player");
    if (!enemy || !enemy.hurtBox || !enemy.hurtBox.body || !player) return;
    const enemyPos = enemy.gameObject.transform.position;
    const playerPos = player.transform.position;
    Body.setVelocity(enemy.hurtBox.body, {
      x: enemyPos.x < playerPos.x ? SPEED_RUN : -SPEED_RUN,
      y: enemy.hurtBox.body.velocity.y,
    });
    const minDistance = 100;
    if (enemy!.hp <= 0) {
      enemy!.switchState(EnemyDeadStateNode);
      return;
    } else if (Math.abs(enemyPos.x - playerPos.x) < minDistance) {
      const random = Math.random();
      if (enemy.hp > 5) {
        if (random <= 0.75) {
          enemy.switchState(EnemySquatStateNode);
        } else {
          enemy.switchState(EnemyThrowSilkStateNode);
        }
      } else {
        if (random <= 0.75) {
          enemy.switchState(EnemyThrowSilkStateNode);
        } else {
          enemy.switchState(EnemySquatStateNode);
        }
      }
    }
  }

  onExit(): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (enemy && enemy.hurtBox && enemy.hurtBox.body) {
      Body.setVelocity(enemy.hurtBox.body, { x: 0, y: 0 });
      //停止播放音乐
      if (this.runAudio) {
        ResourcesManager.getInstance().stopAudioSource(this.runAudio);
      }
    }
  }
}

export class EnemySquatStateNode extends StateNode {
  timer: ReturnType<typeof setTimeout> | null = null;
  onEnter(): void {
    const enemy = this.gameObject.findComponent(Enemy);
    const player =
      GameObjectManager.getInstance().findGameObjectByName("player");
    if (enemy && enemy.hurtBox && enemy.hurtBox.body && player) {
      enemy.setAnimation("squat");
      const enemyPos = enemy.gameObject.transform.position;
      const playerPos = player.transform.position;
      enemy.isFaceRight = playerPos.x > enemyPos.x;

      this.timer = setTimeout(() => {
        enemy.switchState(EnemyDashOnFloorStateNode);
      }, 500);
    }
  }

  onUpdate(deltaTime: number): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (!enemy || !enemy.hurtBox || !enemy.hurtBox.body) return;
    if (enemy!.hp <= 0) {
      enemy!.switchState(EnemyDeadStateNode);
      return;
    }
  }

  onExit(): void {
    clearTimeout(this.timer!);
    this.timer = null;
  }
}

export class EnemyThrowBarbStateNode extends StateNode {
  throwBarbAudio = ResourcesManager.getInstance().getAudioSource(
    "/kensi/audio/enemy_throw_barbs.mp3"
  );
  timer: ReturnType<typeof setTimeout> | null = null;
  onEnter(): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (enemy && enemy.hurtBox && enemy.hurtBox.body) {
      enemy.setAnimation("throwBarb");
      this.timer = setTimeout(() => {
        enemy.throwBarb();
        enemy.switchState(EnemyIdleStateNode);
      }, 800);
      //播放投掷音乐
      this.throwBarbAudio = ResourcesManager.getInstance().getAudioSource(
        "/kensi/audio/enemy_throw_barbs.mp3"
      );
      if (this.throwBarbAudio) {
        ResourcesManager.getInstance().playAudioSource(this.throwBarbAudio);
      }
    }
  }
  onUpdate(deltaTime: number): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (!enemy || !enemy.hurtBox || !enemy.hurtBox.body) return;
    if (enemy!.hp <= 0) {
      enemy!.switchState(EnemyDeadStateNode);
      return;
    }
  }
  onExit(): void {
    clearTimeout(this.timer!);
    this.timer = null;
  }
}

export class EnemyThrowSilkStateNode extends StateNode {
  throwSilkAudio = ResourcesManager.getInstance().getAudioSource(
    "/kensi/audio/enemy_throw_silks.mp3"
  );
  timer: ReturnType<typeof setTimeout> | null = null;
  onEnter(): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (enemy && enemy.hurtBox && enemy.hurtBox.body && enemy.hitBox) {
      enemy.setAnimation("throwSword");
      enemy.isThrowingSilk = true;
      enemy.hurtBox.ignoreGravity = true;
      enemy.hitBox.setEnabled(true);
      Body.setVelocity(enemy.hurtBox.body, {
        x: 0,
        y: 0,
      });
      enemy.onThrowSilk();
      this.updateHitBoxPosition();
      // 播放投掷音乐
      this.throwSilkAudio = ResourcesManager.getInstance().getAudioSource(
        "/kensi/audio/enemy_throw_silk.mp3"
      );
      if (this.throwSilkAudio) {
        ResourcesManager.getInstance().playAudioSource(this.throwSilkAudio);
      }

      this.timer = setTimeout(() => {
        enemy.isThrowingSilk = false;
        enemy.hurtBox!.ignoreGravity = false;
        if (!enemy.isOnFloor() && enemy.hp > 5 && Math.random() <= 0.25) {
          enemy.switchState(EnemyAimStateNode);
        } else if (!enemy.isOnFloor()) {
          enemy.switchState(EnemyFallStateNode);
        } else {
          enemy.switchState(EnemyIdleStateNode);
        }
      }, 900);
    }
  }

  onUpdate(deltaTime: number): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (!enemy || !enemy.hurtBox || !enemy.hurtBox.body) return;
    if (enemy!.hp <= 0) {
      enemy!.switchState(EnemyDeadStateNode);
      return;
    }
  }
  onExit(): void {
    clearTimeout(this.timer!);
    this.timer = null;
    const enemy = this.gameObject.findComponent(Enemy);
    if (
      enemy &&
      enemy.hurtBox &&
      enemy.hurtBox.body &&
      enemy.hitBox &&
      enemy.hitBox.body
    ) {
      enemy.hurtBox.ignoreGravity = false;
      enemy.isThrowingSilk = false;
      enemy.hitBox.setEnabled(false);
      Body.setPosition(enemy.hitBox.body, {
        x: 0,
        y: -1000,
      });
    }
  }

  updateHitBoxPosition() {
    const enemy = this.gameObject.findComponent(Enemy);
    if (!enemy) return;
    const position = enemy.hurtBox?.body?.position;
    if (!position) return;
    if (enemy.hitBox && enemy.hitBox.body) {
      Body.setPosition(enemy.hitBox.body, {
        x: position.x,
        y: position.y - 10,
      });
    }
  }
}

export class EnemyThrowSwordStateNode extends StateNode {
  throwSwordAudio = ResourcesManager.getInstance().getAudioSource(
    "/kensi/audio/enemy_throw_swords.mp3"
  );
  timer1: ReturnType<typeof setTimeout> | null = null;
  timer2: ReturnType<typeof setTimeout> | null = null;
  onEnter(): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (enemy && enemy.hurtBox && enemy.hurtBox.body) {
      enemy.setAnimation("throwSword");

      this.timer1 = setTimeout(() => {
        enemy.throwSword();
        //播放投掷音乐
        this.throwSwordAudio = ResourcesManager.getInstance().getAudioSource(
          "/kensi/audio/enemy_throw_sword.mp3"
        );
        if (this.throwSwordAudio) {
          ResourcesManager.getInstance().playAudioSource(this.throwSwordAudio);
        }
      }, 650);

      this.timer2 = setTimeout(() => {
        const random = Math.random();
        if (enemy.hp > 5) {
          if (random <= 0.5) {
            enemy.switchState(EnemySquatStateNode);
          } else if (random <= 0.8) {
            enemy.switchState(EnemyJumpStateNode);
          } else {
            enemy.switchState(EnemyIdleStateNode);
          }
        } else {
          if (random <= 0.5) {
            enemy.switchState(EnemyJumpStateNode);
          } else if (random <= 0.8) {
            enemy.switchState(EnemyThrowSilkStateNode);
          } else {
            enemy.switchState(EnemyIdleStateNode);
          }
        }
      }, 1000);
    }
  }

  onUpdate(deltaTime: number): void {
    const enemy = this.gameObject.findComponent(Enemy);
    if (!enemy || !enemy.hurtBox || !enemy.hurtBox.body) return;
    if (enemy!.hp <= 0) {
      enemy!.switchState(EnemyDeadStateNode);
      return;
    }
  }
  onExit(): void {
    clearTimeout(this.timer1!);
    clearTimeout(this.timer2!);
    this.timer1 = null;
    this.timer2 = null;
  }
}

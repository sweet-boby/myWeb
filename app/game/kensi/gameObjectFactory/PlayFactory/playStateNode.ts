import { Body } from "matter-js";
import { Component } from "../../common/GameObjectComponent";
import { StateNode } from "../../component/StateNode";
import {
  AttackDirection,
  Player,
  SPEED_JUMP,
  SPEED_ROLL,
  SPEED_RUN,
} from "./player";
import { ResourcesManager } from "../../common/ResourcesManager";
import { getMsgUtil } from "../../Util/MsgUtil";
import { SceneType } from "../../common/Scene";

export class PlayerAttackState extends StateNode {
  attackAudio?: AudioBufferSourceNode =
    ResourcesManager.getInstance().getAudioSource(
      "/kensi/audio/player_attack_1.mp3"
    );
  onEnter(): void {
    const player = this.gameObject.findComponent(Player);
    if (!player) return;
    if (player.hitBox) player.hitBox.setEnabled(true);
    player.setAnimation("attack");
    player.isAttacking = true;
    this.updateHitBoxPosition();
    player.onAttack();

    // 播放音效
    switch (Math.floor(Math.random() * 3)) {
      case 0:
        this.attackAudio = ResourcesManager.getInstance().getAudioSource(
          "/kensi/audio/player_attack_1.mp3"
        );
        break;
      case 1:
        this.attackAudio = ResourcesManager.getInstance().getAudioSource(
          "/kensi/audio/player_attack_2.mp3"
        );
        break;
      case 2:
        this.attackAudio = ResourcesManager.getInstance().getAudioSource(
          "/kensi/audio/player_attack_3.mp3"
        );
    }
    if (this.attackAudio) {
      ResourcesManager.getInstance().playAudioSource(this.attackAudio);
    }
  }

  onUpdate(deltaTime: number): void {
    const player = this.gameObject.findComponent(Player);
    if (!player) return;
    if (player.hp <= 0) {
      player.stateMachine?.switchTo(PlayerDeadState);
      return;
    } else if (!player.isAttacking) {
      if (player.hurtBox?.body?.velocity.y! > 0) {
        player.stateMachine?.switchTo(PlayerFallState);
        return;
      } else if (player.getMoveAxis().x === 0) {
        player.stateMachine?.switchTo(PlayerIdleState);
        return;
      } else if (player.isOnFloor() && player.getMoveAxis().x !== 0) {
        player.stateMachine?.switchTo(PlayerRunState);
        return;
      }
    }
  }

  onExit(): void {
    const player = this.gameObject.findComponent(Player);
    if (!player) return;
    if (player.hitBox) player.hitBox.setEnabled(false);
    player.isAttacking = false;
    Body.setPosition(player.hitBox!.body!, {
      x: 0,
      y: -1000,
    });
  }

  updateHitBoxPosition() {
    const player = this.gameObject.findComponent(Player);
    if (!player) return;
    const position = player.hurtBox?.body?.position;
    if (!position) return;
    const dir = player.getAttackDirection();
    if (player.hitBox && player.hitBox.body) {
      if (dir === AttackDirection.Up || dir === AttackDirection.Down) {
        Body.setPosition(player.hitBox.body, {
          ...position,
        });
      } else if (dir === AttackDirection.Right) {
        Body.setPosition(player.hitBox.body, {
          x: position.x + 50,
          y: position.y,
        });
      } else if (dir === AttackDirection.Left) {
        Body.setPosition(player.hitBox.body, {
          x: position.x - 50,
          y: position.y,
        });
      }
    }
  }
}

export class PlayerDeadState extends StateNode {
  deadAudio?: AudioBufferSourceNode =
    ResourcesManager.getInstance().getAudioSource(
      "/kensi/audio/player_dead.mp3"
    );
  onEnter(): void {
    const player = this.gameObject.findComponent(Player);
    if (!player) return;
    player.setAnimation("dead");
    // 播放死亡音效
    if (this.deadAudio) {
      ResourcesManager.getInstance().playAudioSource(this.deadAudio);
    }
    setTimeout(() => {
      alert("你输了");
      const { emitMsgEvent } = getMsgUtil();
      emitMsgEvent("SwitchScene", SceneType.Manu);
    }, 1000);
  }
}

export class PlayerFallState extends StateNode {
  landAudio?: AudioBufferSourceNode =
    ResourcesManager.getInstance().getAudioSource(
      "/kensi/audio/player_land.mp3"
    );
  onEnter(): void {
    const player = this.gameObject.findComponent(Player);
    if (!player || !player.hurtBox || !player.hurtBox.body) return;
    player.setAnimation("fall");
    player.hurtBox.body.friction = 0.0001;
  }
  onUpdate(deltaTime: number): void {
    const player = this.gameObject.findComponent(Player);
    if (!player) return;

    if (player.hp <= 0) {
      player.stateMachine?.switchTo(PlayerDeadState);
    } else if (player.isOnFloor()) {
      player.stateMachine?.switchTo(PlayerIdleState);
      player.onLand();
      //播放落地音效
      this.landAudio = ResourcesManager.getInstance().getAudioSource(
        "/kensi/audio/player_land.mp3"
      );
      if (this.landAudio) {
        ResourcesManager.getInstance().playAudioSource(this.landAudio);
      }
    } else if (player.canAttack()) {
      player.stateMachine?.switchTo(PlayerAttackState);
    }
  }

  onExit(): void {
    const player = this.gameObject.findComponent(Player);
    if (!player || !player.hurtBox || !player.hurtBox.body) return;
    player.hurtBox.body.friction = 0.1;
  }
}

export class PlayerIdleState extends StateNode {
  onEnter(): void {
    const player = this.gameObject.findComponent(Player);
    if (!player) return;
    player.setAnimation("idle");
  }

  onUpdate(deltaTime: number): void {
    const player = this.gameObject.findComponent(Player);
    if (!player) return;
    if (player.hp <= 0) {
      player.stateMachine?.switchTo(PlayerDeadState);
    } else if (player.canAttack()) {
      player.stateMachine?.switchTo(PlayerAttackState);
    } else if (player.hurtBox?.body?.velocity.y! > 0.1) {
      player.stateMachine?.switchTo(PlayerFallState);
    } else if (player.canJump()) {
      player.stateMachine?.switchTo(PlayerJumpState);
    } else if (player.canRoll()) {
      player.stateMachine?.switchTo(PlayerRollState);
    } else if (player.isOnFloor() && player.getMoveAxis().x != 0) {
      player.stateMachine?.switchTo(PlayerRunState);
    }
  }
}

export class PlayerJumpState extends StateNode {
  jumpAudio?: AudioBufferSourceNode =
    ResourcesManager.getInstance().getAudioSource(
      "/kensi/audio/player_jump.mp3"
    );
  onEnter(): void {
    const player = this.gameObject.findComponent(Player);
    if (!player) return;
    player.setAnimation("jump");
    if (player.hurtBox && player.hurtBox.body) {
      Body.setVelocity(player.hurtBox.body, {
        x: player.hurtBox.body.velocity.x,
        y: -SPEED_JUMP,
      });
    }
    player.onJump();
    // 播放跳跃音效
    this.jumpAudio = ResourcesManager.getInstance().getAudioSource(
      "/kensi/audio/player_jump.mp3"
    );
    if (this.jumpAudio) {
      ResourcesManager.getInstance().playAudioSource(this.jumpAudio);
    }
  }

  onUpdate(deltaTime: number): void {
    const player = this.gameObject.findComponent(Player);
    if (!player) return;
    if (player.hp <= 0) {
      player.stateMachine?.switchTo(PlayerDeadState);
    } else if (player.hurtBox?.body?.velocity.y! > 0) {
      player.stateMachine?.switchTo(PlayerFallState);
    } else if (player.canAttack()) {
      player.stateMachine?.switchTo(PlayerAttackState);
    }

    if (player.hurtBox && player.hurtBox.body) {
      const dir = player.getMoveAxis().x;
      Body.setVelocity(player.hurtBox.body, {
        x: player.hurtBox.body.velocity.x + dir * 0.09,
        y: player.hurtBox.body.velocity.y,
      });
    }
  }
}

export class PlayerRollState extends StateNode {
  rollAudio?: AudioBufferSourceNode =
    ResourcesManager.getInstance().getAudioSource(
      "/kensi/audio/player_roll.mp3"
    );
  rollDirRight = true;
  onEnter(): void {
    const player = this.gameObject.findComponent(Player);
    if (!player) return;
    player.setAnimation("roll");
    player.currentAnimation?.left.reset();
    player.currentAnimation?.right.reset();
    this.rollDirRight = player.isFaceRight;
    player.isRolling = true;
    if (player.hurtBox && player.hurtBox.body) {
      player.hurtBox.setEnabled(false);
      player.hurtBox.body.isSensor = true;
      player.hurtBox.body.friction = 0.00005;
      Body.setVelocity(player.hurtBox.body, {
        x: this.rollDirRight ? SPEED_ROLL : -SPEED_ROLL,
        y: player.hurtBox.body.velocity.y,
      });
    }
    player.onRoll();
    // 播放翻滚音效
    this.rollAudio = ResourcesManager.getInstance().getAudioSource(
      "/kensi/audio/player_roll.mp3"
    );
    if (this.rollAudio) {
      ResourcesManager.getInstance().playAudioSource(this.rollAudio);
    }
  }

  onUpdate(deltaTime: number): void {
    const player = this.gameObject.findComponent(Player);
    if (!player) return;

    // if (player.hurtBox && player.hurtBox.body) {
    //   Body.setVelocity(player.hurtBox.body, {
    //     x: this.rollDirRight ? SPEED_ROLL : -SPEED_ROLL,
    //     y: player.hurtBox.body.velocity.y,
    //   });
    // }

    if (!player.isRolling) {
      if (player.getMoveAxis().x !== 0) {
        player.stateMachine?.switchTo(PlayerRunState);
      } else if (player.canJump()) {
        player.stateMachine?.switchTo(PlayerJumpState);
      } else {
        player.stateMachine?.switchTo(PlayerIdleState);
      }
    }
  }

  onExit(): void {
    const player = this.gameObject.findComponent(Player);
    if (!player) return;
    if (player.hurtBox && player.hurtBox.body) {
      player.hurtBox.setEnabled(true);
      player.hurtBox.body.isSensor = false;
      player.hurtBox.body.friction = 0.1;
    }
    player.isRolling = false;
  }
}

export class PlayerRunState extends StateNode {
  runAudio?: AudioBufferSourceNode =
    ResourcesManager.getInstance().getAudioSource(
      "/kensi/audio/player_run.mp3"
    );

  onEnter(): void {
    const player = this.gameObject.findComponent(Player);
    if (!player) return;
    player.setAnimation("run");
    //播放奔跑音乐
    this.runAudio = ResourcesManager.getInstance().getAudioSource(
      "/kensi/audio/player_run.mp3"
    );
    if (this.runAudio) {
      ResourcesManager.getInstance().playAudioSource(this.runAudio, true);
    }
  }
  onUpdate(deltaTime: number): void {
    const player = this.gameObject.findComponent(Player);
    if (!player) return;
    if (player.hp <= 0) {
      player.stateMachine?.switchTo(PlayerDeadState);
    } else if (player.getMoveAxis().x === 0) {
      player.stateMachine?.switchTo(PlayerIdleState);
    } else if (player.canJump()) {
      player.stateMachine?.switchTo(PlayerJumpState);
    } else if (player.canAttack()) {
      player.stateMachine?.switchTo(PlayerAttackState);
    } else if (player.canRoll()) {
      player.stateMachine?.switchTo(PlayerRollState);
    }

    if (player.hurtBox && player.hurtBox.body) {
      Body.setVelocity(player.hurtBox.body, {
        x: player.isFaceRight ? SPEED_RUN : -SPEED_RUN,
        y: player.hurtBox.body.velocity.y,
      });
    }
  }
  onExit(): void {
    //停止音乐
    const r = ResourcesManager.getInstance();
    if (this.runAudio) {
      r.stopAudioSource(this.runAudio);
    }
  }
}

import { Controller } from "../../component/controller";
import { Player } from "./player";

export class PlayerController extends Controller {
  keydownCallback: (e: KeyboardEvent) => void = (e) => {
    const player = this.gameObject.findComponent(Player);
    if (!player) return;
    if (player.hp <= 0) return;
    switch (e.key) {
      case "w":
        player.isUpKeyDown = true;
        break;
      case "a":
        player.isLeftKeyDown = true;
        break;
      case "s":
        player.isDownKeyDown = true;
        break;
      case "d":
        player.isRightKeyDown = true;
        break;
      case " ":
        player.isAttackKeyDown = true;
        break;
    }
  };
  keyupCallback: (e: KeyboardEvent) => void = (e) => {
    const player = this.gameObject.findComponent(Player);
    if (!player) return;
    if (player.hp <= 0) return;
    switch (e.key) {
      case "w":
        player.isUpKeyDown = false;
        break;
      case "a":
        player.isLeftKeyDown = false;
        break;
      case "s":
        player.isDownKeyDown = false;
        break;
      case "d":
        player.isRightKeyDown = false;
        break;
      case " ":
        player.isAttackKeyDown = false;
        break;
    }
  };
}

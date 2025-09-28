import { GameObject } from "../common/GameObject";
import { Component } from "../common/GameObjectComponent";

export class Controller extends Component {
  keydownCallback: (e: KeyboardEvent) => void = (e) => {};
  keyupCallback: (e: KeyboardEvent) => void = (e) => {};

  onStart(): void {
    window.addEventListener("keydown", this.keydownCallback);
    window.addEventListener("keyup", this.keyupCallback);
  }
  onDestroy(): void {
    window.removeEventListener("keydown", this.keydownCallback);
    window.removeEventListener("keyup", this.keyupCallback);
  }
}

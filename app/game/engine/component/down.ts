import { Component } from "../common/GameObjectComponent";

export class Down extends Component {
  onUpdate(deltaTime: number) {
    this.gameObject.transform.position.y += 0.01 * deltaTime;
    // console.log(this.gameObject.transform.position.y);
    if (this.gameObject.transform.position.y > 450) {
      this.gameObject.transform.position.y = 450;
    }
  }
}

export default Down;

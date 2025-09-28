import { Component } from "../common/GameObjectComponent";
import { Vector2 } from "./vector2";

class Transform {
  position: Vector2;
  scale: Vector2;
  rotation: number;

  constructor() {
    this.position = new Vector2(0, 0);
    this.scale = new Vector2(1, 1);
    this.rotation = 0;
  }
}

export enum GameObjectTag {
  None = "none",
  Player = "player",
  Enemy = "enemy",
  Platform = "platform",
  Collectable = "collectable",
  Bullet = "bullet",
  Wall = "wall",
  Camera = "camera",
}

export enum GameObjectLayer {
  None = "none",
  Player = "player",
  Enemy = "enemy",
  Platform = "platform",
  Collectable = "collectable",
  Bullet = "bullet",
  Wall = "wall",
}

export class GameObject {
  private components: Component[] = [];
  transform: Transform;
  tag: GameObjectTag = GameObjectTag.None;
  layer: GameObjectLayer = GameObjectLayer.None;
  name: string = "none";

  constructor() {
    this.transform = new Transform();
  }

  addComponent<T extends Component>(componentType: new (...args: any[]) => T) {
    // this.components.push(component);
    const c = this.findComponent(componentType);
    if (!c) {
      const component = new componentType(this);
      component.onStart();
      this.components.push(component);
    }
  }

  removeComponent<T extends Component>(
    componentType: new (...args: any[]) => T
  ) {
    // const index = this.components.indexOf(component);
    const index = this.components.findIndex(
      (component) => component instanceof componentType
    );
    if (index !== -1) {
      this.components[index].onDestroy();
      this.components.splice(index, 1);
    }
  }

  clearComponents() {
    for (const component of this.components) {
      component.onDestroy();
    }
    this.components = [];
  }

  update(deltaTime: number) {
    for (const component of this.components) {
      component.onUpdate(deltaTime);
    }
  }

  onDraw(ctx: CanvasRenderingContext2D) {
    for (const component of this.components) {
      component.onDraw(ctx);
    }
  }

  findComponent<T extends Component>(
    componentType: new (...args: any[]) => T
  ): T | undefined {
    return this.components.find(
      (component): component is T => component instanceof componentType
    );
  }
}

import { GameObject, GameObjectLayer, GameObjectTag } from "./GameObject";

export class GameObjectManager {
  private static instance: GameObjectManager;
  private gameObjects: GameObject[] = [];

  private constructor() {}

  public static getInstance(): GameObjectManager {
    if (!GameObjectManager.instance) {
      GameObjectManager.instance = new GameObjectManager();
    }
    return GameObjectManager.instance;
  }

  public update(deltaTime: number): void {
    for (const gameObject of this.gameObjects) {
      gameObject.update(deltaTime);
    }
  }
  public draw(ctx: CanvasRenderingContext2D): void {
    for (const gameObject of this.gameObjects) {
      // gameObject.onDraw(ctx);
      if (gameObject.tag === GameObjectTag.Camera) {
        gameObject.onDraw(ctx);
      }
    }
  }

  public createGameObject(): GameObject {
    const gameObject = new GameObject();
    this.add(gameObject);
    return gameObject;
  }

  public add(gameObject: GameObject): void {
    this.gameObjects.push(gameObject);
    console.log(this.gameObjects.length);
  }

  public remove(gameObject: GameObject): void {
    const index = this.gameObjects.indexOf(gameObject);

    if (index !== -1) {
      this.gameObjects[index].clearComponents();
      this.gameObjects.splice(index, 1);
    }
  }

  public clear(): void {
    for (const gameObject of this.gameObjects) {
      gameObject.clearComponents();
    }
    this.gameObjects = [];
  }

  public getGameObjects(): GameObject[] {
    return this.gameObjects;
  }

  findGameObjectByName(name: string): GameObject | null {
    for (const gameObject of this.gameObjects) {
      if (gameObject.name === name) {
        return gameObject;
      }
    }
    return null;
  }

  findGameObjectsByName(name: string): GameObject[] {
    const gameObjects: GameObject[] = [];
    for (const gameObject of this.gameObjects) {
      if (gameObject.name === name) {
        gameObjects.push(gameObject);
      }
    }
    return gameObjects;
  }

  findGameObjectsByTag(tag: GameObjectTag): GameObject[] {
    const gameObjects: GameObject[] = [];
    for (const gameObject of this.gameObjects) {
      if (gameObject.tag === tag) {
        gameObjects.push(gameObject);
      }
    }
    return gameObjects;
  }
  findGameObjectsByLayer(layer: GameObjectLayer): GameObject[] {
    const gameObjects: GameObject[] = [];
    for (const gameObject of this.gameObjects) {
      if (gameObject.layer === layer) {
        gameObjects.push(gameObject);
      }
    }
    return gameObjects;
  }

  findGameObjectsByTagAndLayer(tag: GameObjectTag, layer: GameObjectLayer) {
    const gameObjects: GameObject[] = [];
    for (const gameObject of this.gameObjects) {
      if (gameObject.tag === tag && gameObject.layer === layer) {
        gameObjects.push(gameObject);
      }
    }
    return gameObjects;
  }

  findGameObjectsByTagAndName(tag: GameObjectTag, name: string) {
    const gameObjects: GameObject[] = [];
    for (const gameObject of this.gameObjects) {
      if (gameObject.tag === tag && gameObject.name === name) {
        gameObjects.push(gameObject);
      }
    }
    return gameObjects;
  }
}

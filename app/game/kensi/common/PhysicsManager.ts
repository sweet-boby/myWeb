import {
  Engine,
  World,
  Bodies,
  Render,
  Composite,
  Events,
  Body,
} from "matter-js";
import { CollisionBox } from "../component/CollisionBox";

export class PhysicsManager {
  private static _instance: PhysicsManager;
  private engine: Engine;
  private isDebugMode: boolean = false;
  private collisionBoxs: Map<string, CollisionBox> = new Map();

  private constructor() {
    this.engine = Engine.create();
    this.engine.gravity.y = 1; // Default gravity
  }

  public static getInstance(): PhysicsManager {
    if (!PhysicsManager._instance) {
      PhysicsManager._instance = new PhysicsManager();
    }
    return PhysicsManager._instance;
  }

  getCollisionBoxs() {
    return this.collisionBoxs;
  }

  public getEngine(): Engine {
    return this.engine;
  }

  public addBody(body: CollisionBox): void {
    if (!body.body) {
      return;
    }
    this.collisionBoxs.set(body.body.label, body);
    Composite.add(this.engine.world, body.body);
  }

  public removeBody(body: CollisionBox): void {
    if (!body.body) {
      return;
    }
    this.collisionBoxs.delete(body.body.label);
    Composite.remove(this.engine.world, body.body);
  }

  getAllBodies() {
    return Composite.allBodies(this.engine.world);
  }

  clearAllBodies() {
    Composite.clear(this.engine.world, true);
  }

  public update(deltaTime: number): void {
    Engine.update(this.engine, deltaTime);
  }

  public setDebugMode(enable: boolean): void {
    this.isDebugMode = enable;
  }

  getEvents() {
    return Events;
  }

  igoreBoxGravity() {
    const boxs = PhysicsManager.getInstance().getCollisionBoxs();
    const gravity = PhysicsManager.getInstance().getEngine().gravity;
    for (let box of boxs.values()) {
      const body = box.body;
      if (!body || !box.ignoreGravity) continue;
      Body.applyForce(body, body.position, {
        x: -gravity.x * gravity.scale * body.mass,
        y: -gravity.y * gravity.scale * body.mass,
      });
    }
  }

  public onBeforeUpdate(
    callback: (event: Matter.IEvent<Engine>) => void
  ): void {
    Events.on(this.engine, "beforeUpdate", callback);
  }

  public onCollisionEnd(
    callback: (event: Matter.IEventCollision<Engine>) => void
  ): void {
    Events.on(this.engine, "collisionEnd", callback);
  }

  public onCollisionStart(
    callback: (event: Matter.IEventCollision<Engine>) => void
  ): void {
    Events.on(this.engine, "collisionStart", callback);
  }

  public onCollisionActive(
    callback: (event: Matter.IEventCollision<Engine>) => void
  ): void {
    Events.on(this.engine, "collisionActive", callback);
  }

  public draw(ctx: CanvasRenderingContext2D, CollisionBox: CollisionBox): void {
    if (this.isDebugMode && this.engine) {
      ctx.save();
      ctx.beginPath();
      const body = CollisionBox.body;
      if (!body) {
        return;
      }
      const vertices = body.vertices;
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let j = 1; j < vertices.length; j++) {
        ctx.lineTo(vertices[j].x, vertices[j].y);
      }
      ctx.lineTo(vertices[0].x, vertices[0].y);

      ctx.lineWidth = 1;
      ctx.strokeStyle = body.render.fillStyle!; // Debug color for collision boxes
      ctx.stroke();
      ctx.restore();

      // 在每一个物体上绘制一个红色的圆形
      for (const box of this.collisionBoxs.values()) {
        const body = box.body;
        if (!body) {
          continue;
        }
        ctx.beginPath();
        ctx.arc(body.position.x, body.position.y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      }
    }
  }
}

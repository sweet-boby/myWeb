export class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  sub(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  mul(s: number): Vector2 {
    return new Vector2(this.x * s, this.y * s);
  }

  div(s: number): Vector2 {
    return new Vector2(this.x / s, this.y / s);
  }

  getLen() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const len = this.getLen();
    if (len > 0) {
      return this.div(len);
    }
    return this;
  }

  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }
}

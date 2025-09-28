import { ResourcesManager } from "@/app/engine/common/ResourcesManager";
import { Scene, SceneType } from "@/app/engine/common/Scene";
import { bgFactory } from "../gameObjectFactory/bgFactory";
import { GameObjectManager } from "@/app/engine/common/GameObjectManager";
import { cameraFactory } from "../gameObjectFactory/cameraFactory";
import { Hajimi, hajimiFactory } from "../gameObjectFactory/hajimiFactory";
import { Manbo, manboFactory } from "../gameObjectFactory/manboFactory";
import { Vector2 } from "@/app/engine/common/vector2";
import { GameObject } from "@/app/engine/common/GameObject";
import { getMsgUtil } from "@/app/engine/Util/MsgUtil";
import { Camera } from "@/app/engine/component/Camera";

const { emitMsgEvent } = getMsgUtil();

export class IPath {
  totalLength = 0;
  path: Vector2[] = [
    new Vector2(845, 845),
    new Vector2(1322, 842),
    new Vector2(1322, 442),
    new Vector2(2762, 442),
    new Vector2(2762, 842),
    new Vector2(3162, 842),
    new Vector2(3162, 1722),
    new Vector2(2122, 1722),
    new Vector2(2122, 1562),
    new Vector2(842, 1562),
    new Vector2(842, 842),
  ];
  segmentLengths: number[] = [];

  constructor() {
    // (845,845),(1322,842),(1322,442),(2762,442),(2762,842),(3162,842),(3162,1722),(2122,1722),(2122,1562),(842,1562),(842,842)
    this.transformPath();
    this.calculateSegmentLengths();
  }

  transformPath() {
    //3840 x 2160
    const transform = new Vector2(-3840 / 2, -2160 / 2);
    this.path = this.path.map((item) => item.add(transform));
  }

  calculateSegmentLengths() {
    for (let i = 1; i < this.path.length; i++) {
      const segmentLength = this.path[i].sub(this.path[i - 1]).getLen();
      this.segmentLengths.push(segmentLength);
      this.totalLength += segmentLength;
    }
  }

  getPointAtLength(progress: number) {
    if (progress < 0) {
      return this.path[0];
    }
    if (progress > 1) {
      return this.path[this.path.length - 1];
    }
    const targetLength = progress * this.totalLength;
    let currentLength = 0;

    for (let i = 1; i < this.path.length; ++i) {
      currentLength += this.segmentLengths[i - 1];
      if (currentLength >= targetLength) {
        const t =
          (targetLength - (currentLength - this.segmentLengths[i - 1])) /
          this.segmentLengths[i - 1];
        return this.path[i - 1].add(this.path[i].sub(this.path[i - 1]).mul(t));
      }
    }
    return this.path[this.path.length - 1];
  }
}

export class GameScene extends Scene {
  sceneType: SceneType = SceneType.Game;
  resourcesManager: ResourcesManager = ResourcesManager.getInstance();
  progressID = -1;
  stage: "wait" | "ready" | "racing" | "end" = "wait";
  syncDataRef: ReturnType<typeof setInterval> | null = null;
  progress1 = -1;
  progress2 = -1;
  numTotalChar = 0;
  path = new IPath();
  idxLine = 0;
  idxChar = 0;
  strText = "Hello World";
  strLineList: string[] = ["Hello World"];
  hajimi1: GameObject | null = null;
  manbo2: GameObject | null = null;
  camera: GameObject | null = null;
  valCountDown = 4;
  readyRef?: ReturnType<typeof setTimeout>;
  keydownCallback = (e: KeyboardEvent) => {
    emitMsgEvent("GameUI", "GameUI");
    if (this.stage === "wait" || this.stage === "end") {
      return;
    }
    if (this.idxLine >= this.strLineList.length) {
      return;
    }
    const strLine = this.strLineList[this.idxLine];

    console.log(e.key, strLine[this.idxChar]);
    if (e.key === strLine[this.idxChar]) {
      this.idxChar++;

      // 播放音乐

      // 播放音效
      this.progressID === 1 ? this.progress1++ : this.progress2++;
      if (this.idxChar >= strLine.length) {
        this.idxLine++;
        this.idxChar = 0;
      }
    }
    emitMsgEvent("GameUI", "GameUI");
  };

  onEnter(resource: any): void {
    this.reset();
    console.log("GameScene onEnter");
    window.addEventListener("keydown", this.keydownCallback);

    this.initOnce(async () => {
      await this.resourcesManager.loadFileByPath("/hajimi");

      const filepathlist = [
        "hajimi_idle_back",
        "hajimi_idle_front",
        "hajimi_idle_left",
        "hajimi_idle_right",
        "hajimi_run_back",
        "hajimi_run_front",
        "hajimi_run_left",
        "hajimi_run_right",
        "manbo_idle_back",
        "manbo_idle_front",
        "manbo_idle_left",
        "manbo_idle_right",
        "manbo_run_back",
        "manbo_run_front",
        "manbo_run_left",
        "manbo_run_right",
      ];

      filepathlist.map((filepath) => {
        this.resourcesManager.filePathToAtlas(
          `/hajimi/resources/${filepath}`,
          filepath
        );
      });

      GameObjectManager.getInstance().clear();
      ResourcesManager.getInstance().closeAllAudio();
      bgFactory();
      this.camera = cameraFactory();
      this.hajimi1 = hajimiFactory();
      this.manbo2 = manboFactory();
    });

    if (this.isInitOnce) {
      GameObjectManager.getInstance().clear();
      ResourcesManager.getInstance().closeAllAudio();
      bgFactory();
      this.camera = cameraFactory();
      this.hajimi1 = hajimiFactory();
      this.manbo2 = manboFactory();
    }

    this.init(async () => {
      if (this.progressID === -1) {
        const res = await fetch("/api/hajimiGame/login", {
          method: "POST",
          body: JSON.stringify({
            progressID: this.progressID,
            msg: "login",
          }),
        });
        const data = await res.json();
        if (data.progressID === -1) {
          console.log("你来晚了");
          return;
        }
        this.progressID = data.progressID;
        this.progressID === 1 ? (this.progress1 = 0) : (this.progress2 = 0);

        const res2 = await fetch("/api/hajimiGame/queryText", {
          method: "POST",
        });
        const data2 = await res2.json();
        this.strLineList = data2;
        this.strText = this.strLineList[this.idxLine];
        this.numTotalChar = this.strLineList.join("").length;
        console.log(data2, this.numTotalChar, this.strLineList, this.strText);
        const { emitMsgEvent } = getMsgUtil();
        emitMsgEvent("GameUI", "GameUI");
        this.syncDataRef = setInterval(async () => {
          if (this.progressID === -1) return;
          const res = await fetch("/api/hajimiGame/updata" + this.progressID, {
            method: "POST",
            body: JSON.stringify({
              progress: this.progressID === 1 ? this.progress1 : this.progress2,
            }),
          });
          const data = await res.json();
          this.progressID === 1
            ? (this.progress2 = data.progress_2)
            : (this.progress1 = data.progress_1);
          // console.log(data, this.progress1, this.progress2);
        }, 1000);
      }
    });
  }

  reset() {
    this.progressID = -1;
    this.stage = "wait";
    this.syncDataRef = null;
    this.progress1 = -1;
    this.progress2 = -1;
    this.numTotalChar = 0;
    this.idxLine = 0;
    this.idxChar = 0;
    this.strText = "Hello World";
    this.strLineList = ["Hello World"];
    this.hajimi1 = null;
    this.manbo2 = null;
    this.camera = null;
    this.valCountDown = 4;
    this.readyRef = undefined;
    this.progressID = -1;
    this.progress1 = -1;
    this.progress2 = -1;
    this.numTotalChar = 0;
    this.idxLine = 0;
    this.idxChar = 0;
    this.strText = "Hello World";
    this.strLineList = ["Hello World"];
    this.hajimi1 = null;
    this.manbo2 = null;
    this.camera = null;
    this.valCountDown = 4;
    this.readyRef = undefined;
  }

  onUpdate(deltaTime: number): void {
    if (!this.isGameLoop) return;
    if (this.stage === "wait") {
      if (this.progress1 >= 0 && this.progress2 >= 0) {
        this.stage = "ready";
      }
    } else {
      if (this.stage === "ready") {
        if (!this.readyRef) {
          this.valCountDown--;
          this.readyRef = setTimeout(() => {
            if (this.valCountDown < 0) this.stage = "racing";
            emitMsgEvent("GameUI", "GameUI");
            this.readyRef = undefined;
          }, 1000);
        }
      }

      if (
        (this.progressID === 1 && this.progress1 >= this.numTotalChar) ||
        (this.progressID === 2 && this.progress2 >= this.numTotalChar)
      ) {
        if (!(this.stage === "end")) {
          console.log("你赢了游戏结束");
          emitMsgEvent("GameUI", "win");
          this.stage = "end";
        }
      }
      if (
        (this.progressID === 1 && this.progress2 >= this.numTotalChar) ||
        (this.progressID === 2 && this.progress1 >= this.numTotalChar)
      ) {
        if (!(this.stage === "end")) {
          console.log("你输了游戏结束");
          emitMsgEvent("GameUI", "lose");
          this.stage = "end";
        }
      }
      this.hajimi1
        ?.findComponent(Hajimi)
        ?.setTarget(
          this.path.getPointAtLength(this.progress1 / this.numTotalChar)
        );
      this.manbo2
        ?.findComponent(Manbo)
        ?.setTarget(
          this.path.getPointAtLength(this.progress2 / this.numTotalChar)
        );
    }

    this.gameObjectManager.update(deltaTime);
    if (this.manbo2 && this.hajimi1)
      this.camera
        ?.findComponent(Camera)
        ?.lookAt(this.progressID === 1 ? this.hajimi1 : this.manbo2);
  }

  onDraw(canvas: HTMLCanvasElement): void | CanvasRenderingContext2D {
    if (!this.isGameLoop) return;
    const ctx = super.onDraw(canvas);
    if (!ctx) return;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.font = "60px Arial";
    ctx.fillStyle = "white"; // 设置字体颜色为白色
    ctx.textAlign = "center"; // 设置文本水平居中
    ctx.textBaseline = "middle"; // 设置文本垂直居中
    ctx.fillText("游戏加载中", 0, 0); // 将文本绘制在画布中心
    this.gameObjectManager.draw(ctx);
  }
  onExit(): void {
    GameObjectManager.getInstance().clear();
    ResourcesManager.getInstance().closeAllAudio();
    window.removeEventListener("keydown", this.keydownCallback);
    if (this.progressID != -1)
      fetch("/api/hajimiGame/login", {
        method: "POST",
        body: JSON.stringify({
          progressID: this.progressID,
          msg: "logout",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          this.progressID = data.progressID;
        });

    if (this.syncDataRef) clearInterval(this.syncDataRef);
  }
}

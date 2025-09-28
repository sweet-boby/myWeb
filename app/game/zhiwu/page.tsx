"use client";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { ManuScene, Scene, SceneType } from "./scene/scene";
import { GameScene } from "./scene/gamescene";
import Selector from "./scene/selector";
import { loadGameRes, GameResources } from "./animation";
import SelectorUI from "./sceneUI/selectorUI";
import GamesceneUI from "./sceneUI/gamesceneUI";
import { Camera } from "./camera";

import { getMsgUtil } from "./MsgUtil";

export default function Page() {
  const gameLoopRef = useRef<null | number>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [isGameLoop, setIsGameLoop] = useState(false);
  const scenes = useRef<Scene[] | null>(null);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const gameResource = useRef<null | GameResources>(null);
  const [uiData, setUiData] = useState<any>(null);
  const lastTime = useRef(0);

  const switchScene = useCallback(
    (sceneType: SceneType) => {
      if (!scenes.current) {
        console.log("scenes is null");
        return;
      }

      const scene = scenes.current.find(
        (scene) => scene.sceneType === sceneType
      );
      if (scene) {
        console.log("switch scene", scene.sceneType);
        currentScene?.onExit();
        console.log("current scene", currentScene?.sceneType);
        scene.onEnter(gameResource.current);
        setCurrentScene(scene);
      } else {
        console.log("scene not found");
      }
    },
    [currentScene]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      currentScene?.onKeyDown(e, switchScene);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      currentScene?.onKeyUp(e, switchScene);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [currentScene]);

  const gameLoop = useCallback(
    (timestamp: number) => {
      if (!isGameLoop) {
        lastTime.current = timestamp;
        // console.log("not loop", lastTime.current);
      } else if (timestamp - lastTime.current > 1000 / 25) {
        // console.log(timestamp, lastTime.current);
        currentScene?.onUpdate(timestamp - lastTime.current);
        currentScene?.onDraw(canvas.current as HTMLCanvasElement);
        lastTime.current = timestamp;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    },
    [currentScene, isGameLoop]
  );

  useEffect(() => {
    const { GameMsgType, onMsgEvent, removeMsgEvent } = getMsgUtil();
    onMsgEvent(GameMsgType.SwitchScene, switchScene);
    return () => {
      removeMsgEvent(GameMsgType.SwitchScene, switchScene);
    };
  }, [currentScene]); // 添加 currentScene 作为依赖项

  useEffect(() => {
    const manu = new ManuScene();
    const game = new GameScene();
    const selector = new Selector();
    selector.setUIdata = setUiData;
    scenes.current = [manu, game, selector];
    loadGameRes().then((res) => {
      console.log("res is", res);
      gameResource.current = res;
      // res.bgm_menu.pause();
      if (!currentScene) switchScene(SceneType.Manu);
      setIsGameLoop(true);
    });
  }, []);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(gameLoopRef.current as number);
      console.log("game loop cancel", gameLoopRef.current, lastTime);
    };
  }, [isGameLoop, currentScene]);

  return (
    <div>
      <div className=" relative bg-amber-300 w-[1280px] h-[720px]">
        <canvas
          ref={canvas}
          className=" absolute w-[1280px] h-[720px]"
          id="canvas"
        ></canvas>
        <div className=" absolute w-[1280px] h-[720px] ">
          <SelectorUI uiData={uiData} />
          <GamesceneUI />
        </div>
      </div>
      <div className="bg-red-300">
        <div onClick={() => setIsGameLoop(!isGameLoop)}>
          {!isGameLoop ? "game start" : "game pause"}
        </div>
        <Link href={"/"}>home</Link>
        <div>{currentScene?.sceneType}</div>
      </div>
    </div>
  );
}

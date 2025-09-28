"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, useCallback } from "react";
import Down from "./component/down";
import { Controller } from "./component/controller";
import { GameObject } from "./common/GameObject";
import { GameObjectManager } from "./common/GameObjectManager";
import { Scene, SceneType } from "./common/Scene";
import { SceneManager } from "./common/SceneManager";
import { getMsgUtil } from "./Util/MsgUtil";
import { GameScene } from "./Scene/gameScene";
import { ManuScene } from "./Scene/manuScene";
import { GameUI } from "./SceneUI/gameUI";
import { ResourcesManager } from "./common/ResourcesManager";

export default function Page() {
  const gameLoopRef = useRef<null | number>(null);
  const [isGameLoop, setIsGameLoop] = useState(false);
  const lastTime = useRef(0);
  const sceneManager = useRef<SceneManager>(new SceneManager());
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    sceneManager.current.addScene(GameScene.getInstance());
    sceneManager.current.addScene(ManuScene.getInstance());
    sceneManager.current.enterScene(SceneType.Manu);
    setCurrentScene(sceneManager.current.getCurrentScene());

    return () => {
      console.log("page unload");
      GameObjectManager.getInstance().clear();
      ResourcesManager.getInstance().closeAllAudio();
    };
  }, []);

  useEffect(() => {
    const { onMsgEvent, removeMsgEvent } = getMsgUtil();
    const switchScene = (data: SceneType) => {
      sceneManager.current.enterScene(data);
      setCurrentScene(sceneManager.current.getCurrentScene());
    };
    onMsgEvent("SwitchScene", switchScene);
    return () => {
      removeMsgEvent("SwitchScene", switchScene);
    };
  }, [currentScene]); // 添加 currentScene 作为依赖项

  const gameLoop = useCallback(
    (timestamp: number) => {
      currentScene?.onUpdate(timestamp - lastTime.current);
      currentScene?.onDraw(canvasRef.current as HTMLCanvasElement);
      lastTime.current = timestamp;

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    },
    [currentScene]
  );
  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(gameLoopRef.current as number);
    };
  }, [currentScene]);

  return (
    <div className=" bg-black  h-screen ">
      <Link
        href="/"
        className=" text-amber-400"
        onClick={() => {
          // GameObjectManager.getInstance().clear();
          // ResourcesManager.getInstance().closeAllAudio();
        }}
      >
        回到首页
      </Link>
      <div className=" relative">
        <GameUI currentScene={currentScene ? currentScene.sceneType : null} />
        <canvas className=" w-full" ref={canvasRef}></canvas>
      </div>
      {/* <div
        className=" text-amber-400"
        onClick={() => {
          if (!currentScene) return;
          currentScene.setGameLoop(!currentScene.isGameLoop);
          setIsGameLoop(currentScene.isGameLoop);
        }}
      >
        game loop:
        {isGameLoop ? "on" : "off"}
      </div>
      <div
        className=" text-amber-400"
        onClick={() => {
          const { emitMsgEvent } = getMsgUtil();
          emitMsgEvent("SwitchScene", SceneType.Manu);
        }}
      >
        manu
      </div>
      <div
        className=" text-amber-400"
        onClick={() => {
          const { GameMsgType, emitMsgEvent } = getMsgUtil();
          emitMsgEvent("SwitchScene", SceneType.Game);
        }}
      >
        game
      </div> */}
    </div>
  );
}

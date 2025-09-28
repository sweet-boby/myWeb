"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { SceneManager } from "../engine/common/SceneManager";
import { Scene, SceneType } from "../engine/common/Scene";
import { GameObjectManager } from "../engine/common/GameObjectManager";
import { ResourcesManager } from "../engine/common/ResourcesManager";
import { GameScene } from "./Scene/gameScene";
import { ManuScene } from "./Scene/manuScene";
// import { GameUI } from "./SceneUI/gameUI";

import dynamic from "next/dynamic";

const GameUI = dynamic(
  () => import("./SceneUI/gameUI").then((mod) => mod.GameUI),
  { ssr: false }
);

import localFont from "next/font/local";

const myFont = localFont({
  src: "./IPix.ttf",
});

export default function () {
  const sceneManager = useRef<SceneManager>(new SceneManager());
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastTime = useRef(0);
  const gameLoopRef = useRef<null | number>(null);

  const gameLoop = useCallback((timestamp: number) => {
    try {
      sceneManager.current.update(timestamp - lastTime.current);
      if (!canvasRef.current) {
        console.log("canvasRef.current is null");
        return;
      }
      sceneManager.current.draw(canvasRef.current as HTMLCanvasElement);
      lastTime.current = timestamp;
    } catch (e) {
      console.error(e);
    }
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    sceneManager.current.addScene(GameScene.getInstance());
    sceneManager.current.addScene(ManuScene.getInstance());
    sceneManager.current.enterScene(SceneType.Game);
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      console.log("page unload");
      cancelAnimationFrame(gameLoopRef.current as number);
      GameObjectManager.getInstance().clear();
      ResourcesManager.getInstance().closeAllAudio();
      sceneManager.current.exitScene();
    };
  }, []);

  return (
    <>
      <div className={myFont.className}>
        <div className=" relative">
          <canvas
            className="w-screen h-screen absolute"
            style={{
              backgroundColor: "#A0CD3E",
            }}
            ref={canvasRef}
          ></canvas>
          <div className=" absolute">
            <GameUI sceneManager={sceneManager} />
          </div>
        </div>
      </div>
    </>
  );
}

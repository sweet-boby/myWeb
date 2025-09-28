"use client";
import { getMsgUtil } from "@/app/engine/Util/MsgUtil";
import { useEffect, useMemo, useState } from "react";
import { GameScene } from "../Scene/gameScene";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ReadyUI = ({ valCount }: { valCount: number }) => {
  switch (valCount) {
    case 3:
      return (
        <>
          <div className=" flex justify-center items-center">
            <img src="/hajimi/resources/ui_3.png" alt="" />
          </div>
        </>
      );
    case 2:
      return (
        <>
          <div className=" flex justify-center items-center">
            <img src="/hajimi/resources/ui_2.png" alt="" />
          </div>
        </>
      );
    case 1:
      return (
        <>
          <div className=" flex justify-center items-center">
            <img src="/hajimi/resources/ui_1.png" alt="" />
          </div>
        </>
      );
    case 0:
      return (
        <>
          <div className=" flex justify-center items-center">
            <img src="/hajimi/resources/ui_fight.png" alt="" />
          </div>
        </>
      );
    default:
      return <></>;
  }
};

const WinUI = ({ isWin }: { isWin: "win" | "lose" | "null" }) => {
  const router = useRouter();
  switch (isWin) {
    case "win":
      setTimeout(() => {
        router.push("/");
      }, 1000);
      return (
        <>
          <div className="font-[myFont] text-9xl">你赢了</div>
        </>
      );
    case "lose":
      setTimeout(() => {
        router.push("/");
      }, 500);
      return (
        <>
          <div className="font-[myFont]  text-9xl">你输了</div>
        </>
      );
    default:
      return <></>;
  }
};

const ProgressIDUI = ({ progressID }: { progressID: number }) => {
  switch (progressID) {
    case -1:
      return (
        <>
          <div className="font-[myFont] ">你还没有登录</div>
        </>
      );
    case 1:
      return (
        <>
          <div className="font-[myFont] ">你已经登录:玩家1</div>
        </>
      );
    case 2:
      return (
        <>
          <div className="font-[myFont] ">你已经登录:玩家2</div>
        </>
      );
  }
};

export const GameUI = ({ sceneManager }: { sceneManager: any }) => {
  const { emitMsgEvent, removeMsgEvent, onMsgEvent } = getMsgUtil();
  const [isWin, setIsWin] = useState<"win" | "lose" | "null">("null");
  const [gameSceneData, setGameSceneData] = useState({
    ...GameScene.getInstance(),
  });

  const idxLine = useMemo(() => {
    return gameSceneData.idxLine;
  }, [gameSceneData]);

  const idxChar = useMemo(() => {
    return gameSceneData.idxChar;
  }, [gameSceneData]);

  const strLine = useMemo(() => {
    return gameSceneData.strLineList[idxLine];
  }, [gameSceneData]);

  const progressID = useMemo(() => {
    return gameSceneData.progressID;
  }, [gameSceneData]);

  useEffect(() => {
    const handleMsg = (msg: any) => {
      if (msg === "win") {
        setIsWin("win");
      }
      if (msg === "lose") {
        setIsWin("lose");
      }
      setGameSceneData({
        ...GameScene.getInstance(),
      });
    };
    onMsgEvent("GameUI", handleMsg);
    return () => {
      removeMsgEvent("GameUI", handleMsg);
    };
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 content-between  w-screen h-screen">
        <div>
          <h1 className=" font-[myFont]">hajimi</h1>
          <div>
            <ProgressIDUI progressID={progressID} />
          </div>
          <Link
            href="/"
            className=" text-white border-amber-200 border-2 rounded-2xl p-1  font-[myFont]"
          >
            回到首页
          </Link>

          {/* <div>
            <div
              onClick={() => {
                fetch("/api/hajimiGame/login", {
                  method: "POST",
                  body: JSON.stringify({
                    progressID: 1,
                    msg: "logout",
                  }),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    console.log(data);
                    // this.progressID = data.progressID;
                  });
                fetch("/api/hajimiGame/login", {
                  method: "POST",
                  body: JSON.stringify({
                    progressID: 2,
                    msg: "logout",
                  }),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    console.log(data);
                    // this.progressID = data.progressID;
                  });
              }}
            >
              清除登录
            </div>
          </div> */}
        </div>
        <div>
          <ReadyUI valCount={gameSceneData.valCountDown} />
          <WinUI isWin={isWin} />
        </div>
        <div className=" h-40 relative flex justify-center items-center">
          <img
            className=" absolute"
            src="/hajimi/resources/ui_textbox.png"
            alt=""
            width={1280}
            height={160}
          />
          <div className=" absolute font-[myFont]">
            {strLine &&
              Array(strLine.length)
                .fill("")
                .map((item, index) => {
                  return (
                    <>
                      <span
                        className={
                          index >= idxChar
                            ? " text-black text-3xl"
                            : " text-blue-500 text-3xl"
                        }
                        key={index + strLine[index]}
                      >
                        {strLine[index] === " " ? "_" : strLine[index]}
                      </span>
                    </>
                  );
                })}
          </div>
        </div>
      </div>
    </>
  );
};

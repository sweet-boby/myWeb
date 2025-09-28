import { useEffect, useState } from "react";
import { getCustomEventEmitter } from "@/app/zhiwu/gameMessageUtil";
import "./index.css";

type GameSceneUIProps = {
  mp1: number;
  mp2: number;
  hp1: number;
  hp2: number;
  show: boolean;
  p1avatar?: HTMLImageElement;
  p2avatar?: HTMLImageElement;
  winnerimg1?: HTMLImageElement;
  winnerimg2?: HTMLImageElement;
  showAnimation?: boolean;
  winner?: string;
};

const Playinfo = (prop: { avatar: string; hp: number; mp: number }) => {
  return (
    <>
      <div className=" flex items-center-safe">
        <div>
          <div>
            <img src={prop.avatar} alt="" />
          </div>
        </div>

        <div>
          <div>
            <progress
              id="progress-bar-hp"
              className="h-8  rounded-lg overflow-hidden"
              value={prop.hp}
              max="100"
            ></progress>
          </div>
          <div>
            <progress
              id="progress-bar-mp"
              className="h-8  rounded-lg overflow-hidden"
              value={prop.mp}
              max="100"
            ></progress>
          </div>
        </div>
      </div>
    </>
  );
};

export default function GamesceneUI() {
  const [data, setData] = useState<GameSceneUIProps>({
    mp1: 0,
    mp2: 0,
    hp1: 0,
    hp2: 0,
    show: false,
    showAnimation: false,
    winner: "1",
  });

  useEffect(() => {
    const eventEmitter = getCustomEventEmitter();
    eventEmitter.on(eventEmitter.customEvent, (data: GameSceneUIProps) => {
      setData((prev) => {
        return { ...prev, ...data };
      });
    });
  }, []);
  return (
    <div>
      {data.show && (
        <div className=" relative  w-[1280px] h-[720px] overflow-hidden  ">
          {data.showAnimation && (
            <div className="  transition-transform  absolute w-full h-full flex justify-center items-center">
              <div className=" w-full flex justify-center">
                <img
                  className=" animate-bounce absolute z-2 -translate-y-1/2"
                  src={
                    data.winner === "1"
                      ? data.winnerimg1?.src
                      : data.winnerimg2?.src
                  }
                  alt=""
                />
                <div className=" absolute z-0 top-1/2 -translate-y-1/2 bg-black h-40 opacity-40 w-15/10 blur-lg"></div>
              </div>
            </div>
          )}

          <div className="absolute flex items-end justify-center gap-10 w-full h-full">
            <Playinfo
              avatar={data.p1avatar?.src || ""}
              hp={data.hp1}
              mp={data.mp1}
            />
            <Playinfo
              avatar={data.p2avatar?.src || ""}
              hp={data.hp2}
              mp={data.mp2}
            />
          </div>
        </div>
      )}
    </div>
  );
}

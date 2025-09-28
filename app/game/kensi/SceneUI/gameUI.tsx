import { useEffect, useState } from "react";
import { getMsgUtil } from "../Util/MsgUtil";
import { SceneType } from "../common/Scene";
import Image from "next/image";
interface IProps {
  currentScene: SceneType | null;
}

export const GameUI = ({ currentScene }: IProps) => {
  const { onMsgEvent, removeMsgEvent } = getMsgUtil();
  const [hp, setHp] = useState(10);
  useEffect(() => {
    const HandleMsg = (msg: number) => {
      if (msg >= 0) setHp(msg);
    };
    onMsgEvent("GameUI", HandleMsg);
    return () => {
      removeMsgEvent("GameUI", HandleMsg);
    };
  }, []);

  if (currentScene === SceneType.Game)
    return (
      <>
        <div className=" absolute">
          <div className=" flex gap-1 h-8">
            {Array.from({ length: hp }).map((_, i) => (
              <Image
                width={26}
                height={21}
                src="/kensi/ui_heart.png"
                alt=""
                key={i}
              />
            ))}
          </div>
        </div>
      </>
    );
};

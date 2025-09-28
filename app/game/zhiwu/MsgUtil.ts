import { EventEmitter } from "events";

const msgEmitter = new EventEmitter();

enum GameMsgType {
  Gameover = "Gameover",
  SwitchScene = "SwitchScene",
  Selector = "Selector",
}

export const getMsgUtil = () => {
  const emitMsgEvent = (gameMsgtype: GameMsgType, data: any) => {
    msgEmitter.emit(gameMsgtype, data);
  };

  const onMsgEvent = (
    gameMsgtype: GameMsgType,
    callback: (data: any) => void
  ) => {
    msgEmitter.on(gameMsgtype, callback);
  };

  const removeMsgEvent = (
    gameMsgtype: GameMsgType,
    callback: (data: any) => void
  ) => {
    msgEmitter.removeListener(gameMsgtype, callback);
  };

  return {
    GameMsgType,
    emitMsgEvent,
    onMsgEvent,
    removeMsgEvent,
  };
};

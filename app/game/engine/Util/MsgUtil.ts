import { EventEmitter } from "events";

const msgEmitter = new EventEmitter();

enum GameMsgType {
  Gameover,
  SwitchScene,
  Selector,
  GameUI,
}

export const getMsgUtil = () => {
  const emitMsgEvent = (gameMsgtype: keyof typeof GameMsgType, data: any) => {
    msgEmitter.emit(gameMsgtype, data);
  };

  const onMsgEvent = (
    gameMsgtype: keyof typeof GameMsgType,
    callback: (data: any) => void
  ) => {
    msgEmitter.on(gameMsgtype, callback);
  };

  const removeMsgEvent = (
    gameMsgtype: keyof typeof GameMsgType,
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

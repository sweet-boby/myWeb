import { EventEmitter } from "events";

class CustomEventEmitter extends EventEmitter {
  customEvent: string = "customEvent";

  emitCustomEvent(data: any) {
    this.emit(this.customEvent, data);
  }
}

const customEventEmitter = new CustomEventEmitter();
export const getCustomEventEmitter = () => {
  return customEventEmitter;
};

// 添加监听器
// customEventEmitter.on(customEventEmitter.customEvent, (data) => {
//   console.log("Custom event has been triggered:", data);
// });

// 触发自定义事件
// customEventEmitter.emitCustomEvent("Custom event has been triggered!");

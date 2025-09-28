import { GameObject } from "../common/GameObject";
import { Component } from "../common/GameObjectComponent";
import { StateNode } from "./StateNode";

export class StateMachine extends Component {
  private states: Map<string, StateNode> = new Map();
  private currentState: StateNode | null = null;
  private needInitialize: boolean = true;

  onStart(): void {
    if (this.needInitialize) {
      this.states.forEach((state) => {
        state.onStart();
      });
    }
  }

  onEnter() {
    if (this.currentState) {
      this.currentState.onEnter();
    }
  }

  onUpdate(deltaTime: number) {
    if (this.currentState) {
      this.currentState.onUpdate(deltaTime);
    }
  }

  switchTo<T extends StateNode>(
    state: new (...arg: ConstructorParameters<typeof StateNode>) => T
  ): void {
    const stateName = state.name;
    const newState = this.states.get(stateName);
    if (newState) {
      if (this.currentState) {
        this.currentState.onExit();
      }
      this.currentState = newState;
      this.currentState.onEnter();
    }
  }

  addState<T extends StateNode>(
    state: new (...arg: ConstructorParameters<typeof StateNode>) => T
  ): void {
    const stateInstance = new state(this.gameObject);
    this.states.set(state.name, stateInstance);
    // this.states.set(state.constructor.name, state);
  }
}

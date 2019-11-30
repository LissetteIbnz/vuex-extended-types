import { Store } from "vuex";
import {
  ActionWithoutPayload,
  ActionWithPayload,
  GetterHelper,
  HandlerWithoutPayload,
  HandlerWithPayload,
  StateLocalByDefault
} from "./helpers";

/** Object class style */
export type DefineTypes<Methods> = {
  [Key in keyof Methods]: Methods[Key] extends undefined
    ? HandlerWithoutPayload<Methods>
    : HandlerWithPayload<Methods, Methods[Key]>;
};

export interface HelperTypes<Mutation, Action> {
  mutations?: DefineTypes<Mutation>;
  actions?: DefineTypes<Action>;
}

/** Mutations helpers */
export type DefineMutationTree<Mutation, State, RootState = undefined> = {
  [K in keyof Mutation]: (
    this: Store<StateLocalByDefault<State, RootState>>,
    state: State,
    handler: { payload: Mutation[K] }
  ) => void;
};

/** Actions helpers */
export type DefineActionTree<Actions, State, RootState = undefined> = {
  [Prop in keyof Actions]: Actions[Prop] extends undefined
    ? ActionWithoutPayload<State, RootState>
    : ActionWithPayload<State, Actions[Prop], RootState>;
};

/** Getters helpers */
export type DefineGetterTree<Getter, State, RootState = {}, RootGetter = {}> = {
  [K in keyof Getter]: (
    state: State,
    getters: Getter,
    rootState: RootState,
    rootGetters: RootGetter
  ) => Getter[K];
};

/** Store with getters of extended types */
export interface StoreTS<State, Getters> extends Omit<Store<State>, "getters"> {
  readonly getters: GetterHelper<Getters>;
}

import { CommitOptions, ActionContext, Store as OriginalStore } from "vuex";

/** Payload types */
export type HandlerWithPayload<Key, TypeKey> = (
  payload: TypeKey,
  root?: boolean
) => { type: keyof Key; payload: TypeKey; options?: CommitOptions };

export type HandlerWithoutPayload<Key> = (
  root?: boolean
) => { type: keyof Key; options?: CommitOptions };

/** Create Root State helper */
export type StateLocalByDefault<S, R> = R extends undefined ? any : R;

/** Action payload helpers */
export type ActionWithPayload<State, TypeOfKey, RootState = undefined> = (
  this: OriginalStore<StateLocalByDefault<State, RootState>>,
  ctx: ActionContext<State, StateLocalByDefault<State, RootState>>,
  handler: { payload: TypeOfKey }
) => void | Promise<any>;

export type ActionWithoutPayload<State, RootState = undefined> = (
  this: OriginalStore<StateLocalByDefault<State, RootState>>,
  ctx: ActionContext<State, StateLocalByDefault<State, RootState>>
) => void | Promise<any>;

/** Getters helpers */
export type GetterHelper<Getter> = { [K in keyof Getter]: Getter[K] };

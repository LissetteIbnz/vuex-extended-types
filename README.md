# Vuex Extended Types

Type helper based in Object-Style to ensure type safety in Vuex.

Allow to use type safety in Vuex with the [Object-style commit](https://vuex.vuejs.org/guide/mutations.html#object-style-commit) and dispatch.

A more complex [sample](https://github.com/LissetteIbnz/jsdaycan2019-vuex-typescript) implementing modules and [link](https://youtu.be/FmHcLbVYqec) to explained talk.

## Installation

```bash
# npm
$ npm install --save-dev @lissette.ibnz/vuex-extended-types

# yarn
$ yarn add --dev @lissette.ibnz/vuex-extended-types
```

## Example

```ts
import * as Vuex from "vuex";
import { DefineActionTree, DefineMutationTree, DefineGetterTree, DefineTypes, HelperTypes, StoreTS } from "@lissette.ibnz/vuex-extended-types";

/**
 * Declare module types
 */
export interface CounterState {
  count: number;
}

export interface CounterGetters {
  // getterName: returnType
  evenOrOdd: "even" | "odd";
}

export interface CounterMutations {
  // mutationName: payloadType
  increment: {
    amount: number;
  };
  decrement: undefined;
}

export interface CounterActions {
  // actionName: payloadType
  incrementAsync: {
    amount: number;
    delay: number;
  };
}

/** Implement the module */
const state: CounterState = {
  count: 0
};

const getters: DefineGetterTree<CounterGetters, CounterState> = {
  evenOrOdd: state => (state.count % 2 === 0 ? "even" : "odd")
};

const mutations: DefineMutationTree<CounterMutations, CounterState> = {
  increment(state, { payload }) { // <- Object-style payload
    state.count += payload.amount;
  },
  decrement(state) {
    state.count--;
  }
};

/** Define an object-style with mutations and export it */
export const counterMutationsHelper: DefineTypes<CounterMutations> = {
  increment: payload => ({ type: "increment", payload }),
  decrement: () => ({ type: "decrement" }),
};

const actions: DefineActionTree<CounterActions, CounterState> = {
  incrementAsync({ commit }, { payload }) { // <- Object-style payload
    setTimeout(() => {
      commit(counterMutationsHelper.increment(payload));
    }, payload.delay);
  }
};

/** Define an object-style with actions and export it */
const counterActionsHelper: DefineTypes<CounterActions> = {
  incrementAsync: payload => ({ type: "incrementAsync", payload })
};

/** Create a store as same as the ordinary way */
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});

/** Export a store as default with extended types of Vuex Store to use typed Getters */
export default store as StoreTS<CounterState, CounterGetters>;

/** Export an object-style type to use it in app */
export const counterHelpers: HelperTypes<CounterMutations, CounterActions> = {
  actions: counterActionsHelper,
  mutations: counterMutationsHelper
};

/** Use dispatch/commit methods with exported object-style type */
store.dispatch(
  counterHelpers.actions!.incrementAsync({ amount: 10, delay: 3000 })
);

store.commit(counterHelpers.mutations!.increment({ amount: 1 }));
store.commit(counterHelpers.mutations!.decrement());

// ! <- You can use the Non-Null Assertion Operator
···
computed: {
  isEven() { // <- Infers boolean automatically
    return store.getters.evenOrOdd === "even";
  }
}
```

## License

MIT

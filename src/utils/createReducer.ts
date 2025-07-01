/**
 * A utility function to create a reducer from a map of action handlers.
 * This version is designed to work with discriminated union types for actions,
 * which improves type safety.
 *
 * @param handlers - A map where keys are action types and values are handler functions.
 * @returns A reducer function.
 */
function createReducer<State, Action extends { type: string }>(
  handlers: { [K in Action['type']]?: (state: State, action: Extract<Action, { type: K }>) => State }
) {
  return function reducer(state: State, action: Action): State {
    const handler = handlers[action.type as Action['type']];
    if (handler) {
      // The type assertion here is safe because we're indexing by the action's own type.
      return handler(state, action as Extract<Action, { type: Action['type'] }>);
    }
    return state;
  };
}

export default createReducer;

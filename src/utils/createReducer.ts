function createReducer<
  State,
  ActionType extends { type: string; payload: any }
>(handlers: Record<string, (state: State, payload: any) => State>) {
  return function reducer(state: State, action: ActionType) {
    const handler = handlers[action.type];
    if (handler) {
      return handler(state, action.payload);
    }
    return state;
  };
}

export default createReducer;

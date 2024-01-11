const initialState = {
  num: 0,
};

const numCartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "INCREMENT_GLOBAL_NUMBER":
      return {
        ...state,
        num: state.num + 1,
      };
    case "DECREMENT_GLOBAL_NUMBER":
      return {
        ...state,
        num: state.num - 1,
      };

    case "UPDATE_NUM_CART":
      return {
        ...state,
        num: action.payload,
      };
    default:
      return state;
  }
};

export default numCartReducer;

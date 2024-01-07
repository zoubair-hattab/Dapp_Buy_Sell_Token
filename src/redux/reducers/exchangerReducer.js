import * as type from '../type/types';
const initialState = {};
export const exchangerReducer = (state = initialState, action) => {
  switch (action.type) {
    case type.LOADED_EXHANGER_CONTRACT:
      return {
        ...state,
        contract: action.payload,
      };

    default:
      return state;
  }
};

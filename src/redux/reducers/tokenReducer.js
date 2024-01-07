import * as type from '../type/types';
const initialState = {};
export const tokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case type.LOADED_TOKEN_CONTRACT:
      return {
        ...state,
        contract: action.payload,
      };

    default:
      return state;
  }
};

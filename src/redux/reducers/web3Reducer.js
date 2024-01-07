import * as type from '../type/types';
const initialState = {};
export const web3Reducer = (state = initialState, action) => {
  switch (action.type) {
    case type.LOADED_WEB3:
      return {
        ...state,
        connection: action.payload,
      };
    case type.LOADED_ACCOUNT:
      return {
        ...state,
        account: action.payload,
      };
    case type.LOADED_NETWORK:
      return {
        ...state,
        network: action.payload,
      };
    default:
      return state;
  }
};

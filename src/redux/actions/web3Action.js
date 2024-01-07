import * as type from '../type/types';

export const loadedWeb3 = (connection) => {
  return {
    type: type.LOADED_WEB3,
    payload: connection,
  };
};

export const loadedAccount = (account) => {
  return {
    type: type.LOADED_ACCOUNT,
    payload: account,
  };
};
export const loadedNetwork = (network) => {
  return {
    type: type.LOADED_NETWORK,
    payload: network,
  };
};

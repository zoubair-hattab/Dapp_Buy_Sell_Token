import { toast } from 'react-toastify';
import Web3 from 'web3';
import {
  loadedAccount,
  loadedNetwork,
  loadedWeb3,
} from '../redux/actions/web3Action';
export const networks = {
  80001: {
    chainId: '0x13881',
    chainName: 'soplia Network',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rpc2.sepolia.org'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
};
const hexToDecimal = (hex) => parseInt(hex, 16);

export const connectWallet = async (dispatch) => {
  try {
    if (
      typeof window !== 'undefined' &&
      typeof window.ethereum !== 'undefined'
    ) {
      const provider = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const network = await provider.eth.net.getId();
      await dispatch(loadedWeb3(provider));
      await dispatch(loadedAccount(accounts[0]));
      await dispatch(loadedNetwork(network));
    }
  } catch (error) {
    toast.error(error.message);
  }
};

export const currentWalletConnected = async (dispatch) => {
  try {
    if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
      const provider = new Web3(window.ethereum);
      const accounts = await provider.eth.getAccounts();
      if (accounts.length > 0) {
        const network = await provider.eth.net.getId();
        await dispatch(loadedWeb3(provider));
        await dispatch(loadedAccount(accounts[0]));
        await dispatch(loadedNetwork(network));
      } else {
        //   const contract = await loadCrowdFundingContract(provider, dispatch);
        //   return { provider, contract };
      }
    } else {
      toast.error('Please install MetaMask');
      // return { provider: null, contract: null };
    }
  } catch (err) {
    toast.error(err.message);
    //return { provider: null, contract: null };
  }
};

export const addWalletListener = async (dispatch) => {
  try {
    window.ethereum.on('accountsChanged', async (accounts) => {
      await dispatch(loadedAccount(accounts[0]));
      await currentWalletConnected(dispatch);
    });
  } catch (error) {
    console.log(error.message);
  }
};
export const addNeworkListener = async (dispatch) => {
  try {
    window.ethereum.on('chainChanged', async (network) => {
      await dispatch(loadedNetwork(hexToDecimal(network)));
      await currentWalletConnected(dispatch);
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const switchNework = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: networks[80001].chainId }],
    });
    window.location.reload();
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networks[80001]],
        });
        window.location.reload();
      } catch (addError) {
        if (addError.code === 4001) {
          toast.error('Please approve  network.');
        } else {
          toast.error(addError);
        }
      }
    } else {
      toast.error(switchError);
    }
  }
};

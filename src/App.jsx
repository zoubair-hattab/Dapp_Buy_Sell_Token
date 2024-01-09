import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './components/NavBar';
import {
  loadAccount,
  loadExchangeContract,
  loadTokenContract,
  loadWeb3,
} from './redux/interaction';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadBlockChain = async () => {
      const web3 = await loadWeb3(dispatch);
      await loadAccount(web3, dispatch);
      await loadExchangeContract(web3, dispatch);
      await loadTokenContract(web3, dispatch);
    };
    loadBlockChain();
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <NavBar />
    </>
  );
}

export default App;

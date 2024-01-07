import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  addNeworkListener,
  addWalletListener,
  currentWalletConnected,
} from './helper/helper';
import { useDispatch } from 'react-redux';
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const loadBloackchain = async () => {
      await currentWalletConnected(dispatch);
      await addWalletListener(dispatch);
      await addNeworkListener(dispatch);
    };
    loadBloackchain();
  });
  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      hello
    </div>
  );
}

export default App;

import React from 'react';
import { useSelector } from 'react-redux';
import { connectWithWallet } from '../helper/helper';

const NavBar = () => {
  const account = useSelector((state) => state.web3Reducer.account);

  return (
    <nav className="navbar navbar-expand-lg pl-md-5 pl-md-5 ">
      <a className="navbar-brand" href="#">
        Brownie Token Exchange
      </a>

      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <p
            className="nav-link"
            onClick={() => {
              if (!account) {
                connectWithWallet();
              }
            }}
          >
            {account
              ? account.slice(0, 10) + '...' + account.slice(36)
              : 'Connect'}
          </p>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;

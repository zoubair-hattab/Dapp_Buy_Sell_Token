require('@nomicfoundation/hardhat-toolbox');
module.exports = {
  solidity: '0.8.19',
  // defaultNetwork: "rinkeby",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
  },
};

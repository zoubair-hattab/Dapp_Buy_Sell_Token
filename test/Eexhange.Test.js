/* eslint-disable jest/valid-expect */
const {
  loadFixture,
} = require('@nomicfoundation/hardhat-toolbox/network-helpers');
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Exchange', () => {
  async function deployProjectFixture() {
    const [owner, address1, address2, feeAddress] = await ethers.getSigners();

    const feePercentage = 40;
    const Exchange = await ethers.getContractFactory('Exchange');
    const ExchangeContract = await Exchange.deploy(
      feeAddress.address,
      feePercentage
    );

    return {
      ExchangeContract,
      owner,
      address1,
      address2,
      feeAddress,
      feePercentage,
    };
  }
  it(`Fee Address should be `, async () => {
    const { feeAddress, ExchangeContract } = await loadFixture(
      deployProjectFixture
    );
    expect(await ExchangeContract.feeAccount()).to.equal(feeAddress.address);
  });
  it(`Fee Percantage should be`, async () => {
    const { ExchangeContract, feePercentage } = await loadFixture(
      deployProjectFixture
    );
    expect(await ExchangeContract.feePercent()).to.equal(feePercentage);
  });
});

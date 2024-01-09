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
    var ETHER = '0x0000000000000000000000000000000000000000';

    const Exchange = await ethers.getContractFactory('Exchange');
    const ExchangeContract = await Exchange.deploy(
      feeAddress.address,
      feePercentage
    );

    const tokenDeploy = await ethers.getContractFactory('Token');
    const TokenContract = await tokenDeploy.deploy();

    return {
      ExchangeContract,
      TokenContract,
      owner,
      address1,
      address2,
      feeAddress,
      feePercentage,
      ETHER,
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
  it('Deposits token', async () => {
    const { ExchangeContract, TokenContract, owner } = await loadFixture(
      deployProjectFixture
    );
    await TokenContract.connect(owner).approve(ExchangeContract.target, 1000);
    expect(
      await ExchangeContract.connect(owner).depositeToken(
        TokenContract.target,
        1000
      )
    )
      .to.emit(ExchangeContract, 'Deposite')
      .withArgs(TokenContract.target, owner.address, 1000, 1000);
    //Check contract balance
    const contractBalance = await TokenContract.balanceOf(
      ExchangeContract.target
    );
    expect(contractBalance.toString()).to.equal('1000');
    //Check token on exchange
    const tokenBalance = await ExchangeContract.tokens(
      TokenContract.target,
      owner.address
    );
    expect(tokenBalance.toString()).to.equal('1000');
  });

  it(`Reject ether deposited`, async () => {
    const { ExchangeContract, address2, ETHER } = await loadFixture(
      deployProjectFixture
    );
    await expect(
      ExchangeContract.connect(address2).depositeToken(ETHER, 10)
    ).to.be.revertedWith('Ether deposite not allowed');
  });
  it("Fail if user don't have enough token", async () => {
    const { ExchangeContract, address2, TokenContract } = await loadFixture(
      deployProjectFixture
    );
    await expect(
      ExchangeContract.connect(address2).depositeToken(TokenContract.target, 10)
    ).to.be.revertedWith('Account balance low');
  });
  it('Desposit Ehter', async () => {
    const { ExchangeContract, address2, ETHER } = await loadFixture(
      deployProjectFixture
    );
    expect(
      await ExchangeContract.connect(address2).depositeEther({
        value: ethers.parseEther('1'),
      })
    )
      .to.emit(ExchangeContract, 'Deposite')
      .withArgs(
        ETHER,
        address2,
        ethers.parseUnits('1'),
        ethers.parseUnits('1')
      );
    const etherBalance = await ExchangeContract.tokens(ETHER, address2.address);
    expect(etherBalance).to.equal(ethers.parseEther('1'));
  });
  it('withdraw ether', async () => {
    const { ExchangeContract, address2, ETHER } = await loadFixture(
      deployProjectFixture
    );

    await ExchangeContract.connect(address2).depositeEther({
      value: ethers.parseEther('2'),
    });
    expect(
      await ExchangeContract.connect(address2).withdrawEther(
        ethers.parseEther('1')
      )
    )
      .to.emit(ExchangeContract, 'Withdraw')
      .withArgs(
        ETHER,
        address2.address,
        ethers.parseEther('1'),
        ethers.parseEther('2')
      );
  });
});

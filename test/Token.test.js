/* eslint-disable jest/valid-expect */
const {
  loadFixture,
} = require('@nomicfoundation/hardhat-toolbox/network-helpers');
const { expect } = require('chai');
const { ethers } = require('hardhat');

const name = 'TestToken';
const symbol = 'TEST';
const totalSuply = '1000000000000000000000000';
describe('Token', () => {
  async function deployProjectFixture() {
    const [owner, address1, address2, address3, address4, address5] =
      await ethers.getSigners();

    const Token = await ethers.getContractFactory('Token');
    const TokenContract = await Token.deploy();

    return {
      TokenContract,
      owner,
      address1,
      address2,
      address3,
      address4,
      address5,
    };
  }
  it(`Name should be ${name}`, async () => {
    const { TokenContract } = await loadFixture(deployProjectFixture);
    expect(await TokenContract.name()).to.equal(name);
  });
  it(`Symbol should be ${symbol}`, async () => {
    const { TokenContract } = await loadFixture(deployProjectFixture);
    expect(await TokenContract.symbol()).to.equal(symbol);
  });
  it(`Total supply should be ${totalSuply}`, async () => {
    const { TokenContract } = await loadFixture(deployProjectFixture);
    const supply = await TokenContract.totalSupply();
    expect(supply.toString()).to.equal(totalSuply);
  });
  it('Assign supply to deploy', async () => {
    const { owner, TokenContract } = await loadFixture(deployProjectFixture);
    const ownerToken = await TokenContract.balanceOf(owner);
    const supply = await TokenContract.totalSupply();
    expect(ownerToken.toString()).to.equal(supply.toString());
  });
  it('Transfer', async () => {
    const { owner, address1, TokenContract } = await loadFixture(
      deployProjectFixture
    );
    expect(
      await TokenContract.transfer(address1.address, 100, {
        from: owner.address,
      })
    )
      .to.emit(TokenContract, 'Transfer')
      .withArgs(owner.address, address1.address, 100);
    const onwerBalance = await TokenContract.balanceOf(owner.address);
    expect(onwerBalance.toString()).to.equal('999999999999999999999900');

    const address1Balance = await TokenContract.balanceOf(address1.address);
    expect(address1Balance.toString()).to.equal('100');
  });
  it("Should fail if user doesn't have enough token", async () => {
    const { owner, address1, TokenContract, address2 } = await loadFixture(
      deployProjectFixture
    );
    const initialBalance = await TokenContract.balanceOf(owner.address);

    await expect(
      TokenContract.connect(address1).transfer(address2.address, 2)
    ).to.be.revertedWith('You dont have enough tokens');
    const currentBalance = await TokenContract.balanceOf(owner.address);
    expect(currentBalance.toString()).to.equal(initialBalance.toString());
  });
  it('Approve', async () => {
    const {
      owner,
      address1,

      TokenContract,
    } = await loadFixture(deployProjectFixture);
    expect(
      await TokenContract.approve(address1.address, 100, {
        from: owner.address,
      })
    )
      .to.emit(TokenContract, 'Approval')
      .withArgs(owner.address, address1.address, 100);
    const delegatedAmount = await TokenContract.allowance(
      owner.address,
      address1.address
    );
    expect(Number(delegatedAmount.toString()), 100);
  });
  it('Tansfer From', async () => {
    const {
      owner,
      address1,
      address2,
      address3,
      address4,
      address5,
      TokenContract,
    } = await loadFixture(deployProjectFixture);
    await TokenContract.transfer(address1.address, 10000, {
      from: owner.address,
    });
    await expect(
      TokenContract.connect(address5).transferFrom(
        address3.address,
        address4.address,
        10
      )
    ).to.be.revertedWith('Account balance low');
    await TokenContract.connect(address1).approve(address2.address, 1000);
    //Transfer amount from account1 to account2 using account0
    expect(
      await TokenContract.connect(address2).transferFrom(
        address1.address,
        address3.address,
        10
      )
    )
      .to.emit(TokenContract, 'Transfer')
      .withArgs(address1.address, address3.address, 10);

    const receiverBalance = await TokenContract.balanceOf(address3.address);
    const allowanceBalance = await TokenContract.allowance(
      address1.address,
      address2.address
    );
    expect(Number(receiverBalance.toString())).to.equal(10);
    expect(Number(allowanceBalance.toString())).to.equal(990);
  });
});

const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Token Contract', function () {
  let Token
  let hardhatToken
  let owner
  let addr1
  let addr2
  let addrs

  beforeEach(async function () {
    Token = await ethers.getContractFactory('Token')
    ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()
    hardhatToken = await Token.deploy()
  })

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address)
    })
    it('Should assign the total supply of tokens to the owner', async function () {
      const ownerBalance = await hardhatToken.balanceOf(owner.address)
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance)
    })
  })
  describe('Transactions', function () {
    it('Should Transfer Tokens between the accounts', async function () {
      // FROM OWNER TO ADDRESS 1
      await hardhatToken.transfer(addr1.address, 5)
      const addr1Balance = await hardhatToken.balanceOf(addr1.address)
      expect(addr1Balance).to.equal(5)
      // FROM ADDRESS 1 to 2
      await hardhatToken.connect(addr1).transfer(addr2.address, 5)
      const addr2Balance = await hardhatToken.balanceOf(addr2.address)
      expect(addr2Balance).to.equal(5)
    })

    it('Should fail if sender doesnt have enough tokens', async function () {
      const initalOwnerBalance = await hardhatToken.balanceOf(owner.address)
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1),
      ).to.be.revertedWith('Not Enough Tokens')
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initalOwnerBalance,
      )
    })
    it('Should update balances after transfers', async function () {
      const initalOwnerBalance = await hardhatToken.balanceOf(owner.address)
      await hardhatToken.transfer(addr1.address, 5)
      await hardhatToken.transfer(addr2.address, 10)

      const finalOwnerBalance = await hardhatToken.balanceOf(owner.address)

      expect(finalOwnerBalance).to.equal(initalOwnerBalance - 15)

      const addr1Balance = await hardhatToken.balanceOf(addr1.address)
      expect(addr1Balance).to.equal(5)

      const addr2Balance = await hardhatToken.balanceOf(addr2.address)
      expect(addr2Balance).to.equal(10)
    })
  })
})

// describe('Token Contract', function () {
//   it('Deployment Should Assign a Total Supply to the Owner', async function () {
//     const [owner] = await ethers.getSigners()
//     // console.log('Signers Object: ', owner)

//     const Token = await ethers.getContractFactory('Token')
//     const hardhatToken = await Token.deploy()

//     const ownerBalance = await hardhatToken.balanceOf(owner.address)
//     // console.log('Owner Address: ', owner.address)

//     expect(await hardhatToken.totalSupply()).to.equal(ownerBalance)
//   })
//   it('Should Transfer between accounts', async function () {
//     const [owner, addr1, addr2] = await ethers.getSigners()

//     // console.log(addr1,addr2)
//     const Token = await ethers.getContractFactory('Token')
//     const hardhatToken = await Token.deploy()

//     await hardhatToken.transfer(addr1.address, 10)
//     expect(await hardhatToken.balanceOf(addr1.address)).to.equal(10)
//     await hardhatToken.connect(addr1).transfer(addr2.address, 5)
//     expect(await hardhatToken.balanceOf(addr2.address)).to.equal(5)
//   })
// })

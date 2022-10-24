const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Token Contract', function () {
  it('Deployment Should Assign a Total Supply to the Owner', async function () {
    const [owner] = await ethers.getSigners()
    console.log('Signers Object: ', owner)

    const Token = await ethers.getContractFactory('Token')
    const hardhatToken = await Token.deploy()

    const ownerBalance = await hardhatToken.balanceOf(owner.address)
    console.log('Owner Address: ', owner.address)

    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance)
  })
  it('',async function(){
    
  })
})
 
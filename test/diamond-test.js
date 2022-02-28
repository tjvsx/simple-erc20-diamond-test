const { expect } = require('chai');

describe('MyToken', function () {
  let signer;
  let nobody;
  let instance;

  describe('#cutFacets', function () {

    before(async function () {
      [signer, nobody] = await ethers.getSigners();
    });
  
    beforeEach(async function () {
      //deploy diamond contract
      const MyDiamondFactory = await ethers.getContractFactory('MyDiamond');
      const diamond = await MyDiamondFactory.deploy();
      await diamond.deployed();
  
      //deploy uninitialized token contract
      const MyTokenFactory = await ethers.getContractFactory('MyToken');
      const mytoken = await MyTokenFactory.deploy();
      await mytoken.deployed();

      //declare facets to be cut
      const facetCuts = [
        {
          target: mytoken.address,
          action: 0,
          selectors: Object.keys(mytoken.interface.functions).map(
            (fn) => mytoken.interface.getSighash(fn),
          ),
        },
      ];
  
      //do the cut
      await diamond
        .connect(signer)
        .diamondCut(facetCuts, ethers.constants.AddressZero, '0x');

        //get the instance of the new mytoken facet
      instance = await ethers.getContractAt('MyToken', diamond.address);
    });

    describe('MyToken facet', function() {

      it('can call functions through diamond address', async function() {

        //initialize MyToken's storage (functions won't return values if using constructor in MyToken (unless called through mytoken.address). to call through diamond.address, you must init storage after cut)
        await instance.initialize("MyToken", "MTN", 18, 100);
        
        //get the total supply (or anything in erc20metadatastorage struct)
        const totalSupply = await instance.connect(signer).totalSupply();

        expect(totalSupply).to.equal(100)
      })
    })

  });
});
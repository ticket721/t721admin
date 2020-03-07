const { T721A_CONTRACT_NAME, T721T_CONTRACT_NAME } = require('./constants');

module.exports = {
    refundedMintFor: async function refundedMintFor() {

        const {accounts, expect} = this;

        const T721Admin = this.contracts[T721A_CONTRACT_NAME];
        const T721Token = this.contracts[T721T_CONTRACT_NAME];

        await web3.eth.sendTransaction({
            from: accounts[0],
            to: T721Admin.address,
            value: web3.utils.toWei('1', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await T721Admin.refundedMintFor(accounts[1], 100, {from: accounts[0], gasPrice: 100000000, gas: 1000000});
        const endingBalance = await web3.eth.getBalance(accounts[0]);

        const balance = await T721Token.balanceOf(accounts[1]);
        expect(balance.toString()).to.equal('100');

        expect(initialBalance - endingBalance).to.equal(0);

    }
};

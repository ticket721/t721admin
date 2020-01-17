const { T721A_CONTRACT_NAME } = require('./constants');

module.exports = {
    refundedExecute: async function refundedExecute() {

        const {accounts, expect} = this;

        const T721Admin = this.contracts[T721A_CONTRACT_NAME];
        const Dummy = this.contracts.Dummy;

        const data = Dummy.contract.methods.inc().encodeABI();

        await web3.eth.sendTransaction({from: accounts[0], to: T721Admin.address, value: web3.utils.toWei('1', 'ether')});

        const balance = await web3.eth.getBalance(accounts[0]);

        await T721Admin.refundedExecute(0, Dummy.address, 0, data, {gasPrice: 1});

        const difference = balance - (await web3.eth.getBalance(accounts[0]));

        expect(difference).to.equal(0);
        expect((await Dummy.value()).toNumber()).to.equal(1);

    }
};

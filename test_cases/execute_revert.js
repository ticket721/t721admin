const { T721A_CONTRACT_NAME } = require('./constants');

module.exports = {
    execute_revert: async function execute_revert() {

        const {accounts, expect} = this;

        const T721Admin = this.contracts[T721A_CONTRACT_NAME];
        const Dummy = this.contracts.Dummy;

        const data = Dummy.contract.methods.ko().encodeABI();

        await web3.eth.sendTransaction({from: accounts[0], to: T721Admin.address, value: web3.utils.toWei('1', 'ether')});

        await expect(T721Admin.execute(0, Dummy.address, 0, data, {gasPrice: 1000000000000})).to.eventually.be.rejectedWith('This error is expected');
    }
};

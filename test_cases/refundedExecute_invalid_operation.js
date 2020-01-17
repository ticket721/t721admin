const { T721A_CONTRACT_NAME } = require('./constants');

module.exports = {
    refundedExecute_invalid_operation: async function refundedExecute_invalid_operation() {

        const {accounts, expect} = this;

        const T721Admin = this.contracts[T721A_CONTRACT_NAME];
        const Dummy = this.contracts.Dummy;

        const data = Dummy.contract.methods.inc().encodeABI();

        await web3.eth.sendTransaction({from: accounts[0], to: T721Admin.address, value: web3.utils.toWei('1', 'ether')});

        await expect(T721Admin.refundedExecute(2, Dummy.address, 0, data, {gasPrice: 1})).to.eventually.be.rejectedWith('T721Admin::refundedExecute | invalid operation type');


    }
};

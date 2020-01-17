const { T721A_CONTRACT_NAME, ZADDRESS } = require('./constants');

module.exports = {
    refundedExecute_deploy: async function refundedExecute_deploy() {

        const {accounts, expect} = this;

        const T721Admin = this.contracts[T721A_CONTRACT_NAME];
        const DummyArtifact = this.contracts.DummyArtifact;

        const data = DummyArtifact._json.bytecode;

        await web3.eth.sendTransaction({from: accounts[0], to: T721Admin.address, value: web3.utils.toWei('1', 'ether')});

        const balance = await web3.eth.getBalance(accounts[0]);

        const res = await T721Admin.refundedExecute(1, ZADDRESS, 0, data, {gasPrice: 1});

        const difference = balance - (await web3.eth.getBalance(accounts[0]));

        // expect(difference).to.equal(0); Find a solution for this !
        const Dummy = await DummyArtifact.at(res.logs[0].args.contractAddress);
        expect((await Dummy.value()).toNumber()).to.equal(0);
    }
};

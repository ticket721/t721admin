const { T721A_CONTRACT_NAME, T721T_CONTRACT_NAME } = require('./constants');

module.exports = {
    mintFor: async function mintFor() {

        const {accounts, expect} = this;

        const T721Admin = this.contracts[T721A_CONTRACT_NAME];
        const T721Token = this.contracts[T721T_CONTRACT_NAME];

        await T721Admin.mintFor(accounts[1], 100, {from: accounts[0]});

        const balance = await T721Token.balanceOf(accounts[1]);

        expect(balance.toString()).to.equal('100');

    }
};

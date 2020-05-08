const { T721A_CONTRACT_NAME, T721T_CONTRACT_NAME } = require('./constants');

module.exports = {
    mintFor_not_minter: async function mintFor_not_minter() {

        const {accounts, expect} = this;

        const T721Admin = this.contracts[T721A_CONTRACT_NAME];

        await expect(T721Admin.mintFor(accounts[1], 100, {from: accounts[1]})).to.eventually.be.rejectedWith('T721Admin::onlyMinter | sender is not minter');
    }
};

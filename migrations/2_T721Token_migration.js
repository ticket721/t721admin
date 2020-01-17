const T721Admin = artifacts.require('T721Admin');
const Dummy = artifacts.require('Dummy');
const config = require('../truffle-config');

const ZADDRESS = '0x0000000000000000000000000000000000000000';

module.exports = async function(deployer, networkName, accounts) {

    if (['test', 'soliditycoverage'].indexOf(networkName) !== -1) {
        await deployer.deploy(Dummy);
    }

    const staticGasCost = 32227;
    let deployStaticGasCost = 16512;

    if (networkName === 'soliditycoverage') {
        deployStaticGasCost += 16384;//32768;
    }

    await deployer.deploy(T721Admin, [accounts[0]], staticGasCost, deployStaticGasCost);

};


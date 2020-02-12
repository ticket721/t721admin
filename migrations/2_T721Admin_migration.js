const T721Admin = artifacts.require('T721Admin');
const Dummy = artifacts.require('Dummy');
const config = require('../truffle-config');

const ZADDRESS = '0x0000000000000000000000000000000000000000';

module.exports = async function(deployer, networkName, accounts) {

    if (['test', 'soliditycoverage'].indexOf(networkName) !== -1) {
        await deployer.deploy(Dummy);
    }

    const staticGasCost = 32808 + 63;
    let deployStaticGasCost = 32768;

    if (networkName === 'soliditycoverage') {
        deployStaticGasCost += 0;//32768;
    }

    let extra_admins = [];
    if (config.networks[networkName].t721config && config.networks[networkName].t721config.dev) {

        extra_admins = config.networks[networkName].t721config.dev.extraAdmins;
        const value = config.networks[networkName].t721config.dev.extraAdminsEth;
        for (const admin of extra_admins) {
            await web3.eth.sendTransaction({
                from: accounts[0],
                to: admin,
                value: web3.utils.toWei(value, 'ether')
            });
            console.log(`Credited Extra Admin ${admin} with ${value} ETH`);
        }

    }

    await deployer.deploy(T721Admin, [accounts[0], ...extra_admins], staticGasCost, deployStaticGasCost);

    if (config.networks[networkName].t721config && config.networks[networkName].t721config.dev) {

        const T721AdminInstance = await T721Admin.deployed();
        const value = config.networks[networkName].t721config.dev.t721adminFunds;

        await web3.eth.sendTransaction({
            from: accounts[0],
            to: T721AdminInstance.address,
            value: web3.utils.toWei(value, 'ether'),
        });

        console.log(`Credited T721Admin with ${value} ETH`);

    }

};


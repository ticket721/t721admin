const T721Admin = artifacts.require('T721Admin');
const Dummy = artifacts.require('Dummy');
const T721TokenMock = artifacts.require('T721TokenMock');
const config = require('../truffle-config');

const ZADDRESS = '0x0000000000000000000000000000000000000000';

const hasArtifact = (name) => {
    return (config && config.artifacts
        && config.artifacts[name]);
};

const getArtifact = (name) => {
    return config.artifacts[name];
}

module.exports = async function(deployer, networkName, accounts) {

    let tokenAddress;

    if (['test', 'soliditycoverage'].indexOf(networkName) !== -1) {
        await deployer.deploy(Dummy);
        await deployer.deploy(T721TokenMock);
        tokenAddress = (await T721TokenMock.deployed()).address;
    } else {

        if (hasArtifact('t721token')) {

            const network_id = await web3.eth.net.getId();
            const T721Token = getArtifact('t721token').T721Token;

            tokenAddress = T721Token.networks[network_id].address;

        } else {
            throw new Error('T721Admin deployment requires T721Token');
        }

    }

    const staticGasCost = 32808 + 63;
    let mintingStaticGasCost = 69516 + 6700;
    let deployStaticGasCost = 32768;

    if (networkName === 'soliditycoverage') {
        deployStaticGasCost += 0;//32768;
        mintingStaticGasCost += 703;
    }

    if (process.env.GITHUB_SHA) {
        mintingStaticGasCost -= 45;
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

    await deployer.deploy(T721Admin, [accounts[0], ...extra_admins], staticGasCost, deployStaticGasCost, tokenAddress, mintingStaticGasCost);

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

    if (['test', 'soliditycoverage'].indexOf(networkName) !== -1) {

        const t721Admin = await T721Admin.deployed();
        const t721token = await T721TokenMock.deployed();
        await t721token.addOwner(t721Admin.address);

    }

};


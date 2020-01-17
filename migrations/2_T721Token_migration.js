const T721Admin = artifacts.require('T721Admin');
const config = require('../truffle-config');

const ZADDRESS = '0x0000000000000000000000000000000000000000';

// const hasArtifact = (name) => {
//     return (config && config.artifacts
//         && config.artifacts[name]);
// };
//
// const getArtifact = (name) => {
//     return config.artifacts[name];
// }

module.exports = async function(deployer, networkName, accounts) {

    await deployer.deploy(T721Admin, [accounts[0]]);

};


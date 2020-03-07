const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { revert, snapshot } = require('../test_cases/utils');
chai.use(chaiAsPromised);
const expect = chai.expect;

const { T721A_CONTRACT_NAME, T721T_CONTRACT_NAME } = require('../test_cases/constants');

const { constructor } = require('../test_cases/constructor');
const { addAdmin } = require('../test_cases/addAdmin');
const { rmAdmin } = require('../test_cases/rmAdmin');
const { vote_invalid_index } = require('../test_cases/vote_invalid_index');
const { vote_outdated_vote } = require('../test_cases/vote_outdated_vote');
const { vote_useless_vote } = require('../test_cases/vote_useless_vote');
const { addAdmin_already_admin } = require('../test_cases/addAdmin_already_admin');
const { rmAdmin_not_admin } = require('../test_cases/rmAdmin_not_admin');
const { addAdmin_zero_addr } = require('../test_cases/addAdmin_zero_addr');
const { addAdmin_vote_false } = require('../test_cases/addAdmin_vote_false');
const { addAdmin_not_admin_sender } = require('../test_cases/addAdmin_not_admin_sender');

const { refundedExecute } = require('../test_cases/refundedExecute');
const { refundedExecute_revert } = require('../test_cases/refundedExecute_revert');
const { refundedExecute_deploy } = require('../test_cases/refundedExecute_deploy');
const { refundedExecute_invalid_operation } = require('../test_cases/refundedExecute_invalid_operation');

const { execute } = require('../test_cases/execute');
const { execute_revert } = require('../test_cases/execute_revert');
const { execute_deploy } = require('../test_cases/execute_deploy');
const { execute_invalid_operation } = require('../test_cases/execute_invalid_operation');

const { mintFor } = require('../test_cases/mintFor');
const { refundedMintFor } = require('../test_cases/refundedMintFor');

contract('T721Admin', (accounts) => {

    before(async function() {

        const T721AdminArtifact = artifacts.require(T721A_CONTRACT_NAME);
        const T721AdminInstance = await T721AdminArtifact.deployed();
        const T721TokenArtifact = artifacts.require(T721T_CONTRACT_NAME);
        const T721TokenInstance = await T721TokenArtifact.deployed();

        const DummyArtifact = artifacts.require('Dummy');
        const DummyInstance = await DummyArtifact.deployed();

        this.contracts = {
            [T721A_CONTRACT_NAME]: T721AdminInstance,
            [T721T_CONTRACT_NAME]: T721TokenInstance,
            'Dummy': DummyInstance,
            'DummyArtifact': DummyArtifact,
        };

        this.snap_id = await snapshot();
        this.accounts = accounts;
        this.expect = expect;
    });

    beforeEach(async function() {
        const status = await revert(this.snap_id);
        expect(status).to.be.true;
        this.snap_id = await snapshot();
    });

    describe('Membership', function() {

        it('initial admins', constructor);
        it('add admin', addAdmin);
        it('rm admin', rmAdmin);
        it('vote on invalid idx', vote_invalid_index);
        it('vote on outdated vote', vote_outdated_vote);
        it('vote useless vote', vote_useless_vote);
        it('add admin that is already admin', addAdmin_already_admin);
        it('rm admin that is not admin', rmAdmin_not_admin);
        it('add zero addr', addAdmin_zero_addr);
        it('vote false', addAdmin_vote_false);
        it('modifier owner check', addAdmin_not_admin_sender);

    });

    describe('Relay', function() {

        it('run inc with refundedExecute', refundedExecute);
        it('run ko with refundedExecute', refundedExecute_revert);
        it('deploy dummy with refundedExecute', refundedExecute_deploy);
        it('uses an invalid operation type', refundedExecute_invalid_operation);

        it('run inc with execute', execute);
        it('run ko with execute', execute_revert);
        it('deploy dummy with execute', execute_deploy);
        it('uses an invalid operation type', execute_invalid_operation);

    });

    describe('Minting', function() {

        it('mintFor', mintFor);

        it('refundedMintFor', refundedMintFor);

    });

});

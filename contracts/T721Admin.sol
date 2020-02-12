pragma solidity 0.5.15;

contract T721Admin {

    uint256 constant OPERATION_CREATE = 1;
    uint256 constant OPERATION_CALL = 0;
    uint256 public staticGasCost;
    uint256 public deployStaticGasCost;

    struct Vote {
        uint256 reason;
        address target;
        uint256 yes;
        uint256 no;
        mapping (address => uint256) voters;
        uint256 version;
    }

    mapping (address => bool) adminMapping;
    uint256 public adminCount;
    uint256 public version;
    Vote[] public votes;

    event NewVote(address indexed target, uint256 indexed reason, uint256 idx);
    event NewAdmin(address indexed admin);
    event ByeAdmin(address indexed admin);
    event ContractCreated(address indexed contractAddress);

    function _addAdmin(address _admin) internal {

        adminMapping[_admin] = true;
        adminCount += 1;
        version += 1;

        emit NewAdmin(_admin);

    }

    function _rmAdmin(address _admin) internal {

        adminMapping[_admin] = false;
        adminCount -= 1;
        version += 1;

        emit ByeAdmin(_admin);
    }

    constructor(address[] memory _admins, uint256 _staticGasCost, uint256 _deployStaticGasCost) public {

        for (uint256 idx = 0; idx < _admins.length; ++idx) {
            _addAdmin(_admins[idx]);
        }

        version = 0;

        staticGasCost = _staticGasCost;
        deployStaticGasCost = _deployStaticGasCost;
    }

    function isAdmin(address _admin) public view returns (bool) {
        return adminMapping[_admin];
    }

    modifier onlyAdmin() {
        require(adminMapping[msg.sender] == true, "T721Admin::onlyAdmin | sender is not admin");
        _;
    }

    function addAdmin(address _admin) public onlyAdmin {

        require(isAdmin(_admin) == false, "T721Admin::addAdmin | address is already admin");
        require(_admin != address(0), "T721Admin::addAdmin | cannot add 0 addr");

        uint256 idx = votes.push(Vote({
            reason: 1,
            target: _admin,
            yes: 0,
            no: 0,
            version: version
            })) - 1;

        emit NewVote(_admin, 1, idx);

    }

    function rmAdmin(address _admin) public onlyAdmin {

        require(isAdmin(_admin) == true, "T721Admin::rmAdmin | address is not admin");

        uint256 idx = votes.push(Vote({
            reason: 2,
            target: _admin,
            yes: 0,
            no: 0,
            version: version
            })) - 1;

        emit NewVote(_admin, 2, idx);
    }

    function vote(uint256 idx, bool vote) public onlyAdmin {

        require(votes.length > idx, "T721Admin::vote | invalid vote index");
        require(votes[idx].version == version, "T721Admin::vote | outdated vote");
        require(votes[idx].voters[msg.sender] != 1 + (vote == true ? 1 : 0), "T721Admin::vote | useless vote");

        votes[idx].yes += 0 + (vote == true ? 1 : 0);
        votes[idx].no += 0 + (vote == false ? 1 : 0);
        votes[idx].voters[msg.sender] = 1 + (vote == true ? 1 : 0);

        if ((votes[idx].yes * 100) / adminCount >= 50) {

            if (votes[idx].reason == 1) {

                _addAdmin(votes[idx].target);

            } else {

                _rmAdmin(votes[idx].target);

            }

        }

    }

    function refundedExecute(uint256 _operationType, address _to, uint256 _value, bytes calldata _data)
    external
    onlyAdmin
    {

        uint startGas = gasleft();

        if (_operationType == OPERATION_CALL) {

            executeCall(_to, _value, _data);

        } else if (_operationType == OPERATION_CREATE) {

            address newContract = executeCreate(_data);
            emit ContractCreated(newContract);

        } else {

            revert("T721Admin::refundedExecute | invalid operation type");

        }

        uint gasUsed = startGas - gasleft();
        msg.sender.transfer((gasUsed + staticGasCost + deployStaticGasCost * _operationType) * tx.gasprice);

    }

    function execute(uint256 _operationType, address _to, uint256 _value, bytes calldata _data)
    external
    onlyAdmin
    {

        if (_operationType == OPERATION_CALL) {

            executeCall(_to, _value, _data);

        } else if (_operationType == OPERATION_CREATE) {

            address newContract = executeCreate(_data);
            emit ContractCreated(newContract);

        } else {

            revert("T721Admin::execute | invalid operation type");

        }

    }

    // copied from GnosisSafe
    // https://github.com/gnosis/safe-contracts/blob/v0.0.2-alpha/contracts/base/Executor.sol
    function executeCall(address to, uint256 value, bytes memory data)
    internal
    {
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            let message := mload(0x40)

            let result := call(gas, to, value, add(data, 0x20), mload(data), 0, 0)

            let size := returndatasize

            returndatacopy(message, 0, size)

            if eq(result, 0) { revert(message, size) }
        }
    }

    // copied from GnosisSafe
    // https://github.com/gnosis/safe-contracts/blob/v0.0.2-alpha/contracts/base/Executor.sol
    function executeCreate(bytes memory data)
    internal
    returns (address newContract)
    {
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            newContract := create(0, add(data, 0x20), mload(data))
        }
    }

    function() external payable onlyAdmin {}

}

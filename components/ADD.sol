// SPDX-License-Identifier: MIT
import "./ERC20Token.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
pragma solidity ^0.8.0;

contract Promissory {
    using SafeMath for uint256;

    address public USDT;

    address public promissoryOwner;

    event PropertyAdded(
        uint256 indexed PropertyId,
        address indexed PropertyOwner,
        string PropertyTokenName,
        string PropertyTokenSymbol,
        uint256 PropertyTokenSupply,
        uint256 PropertyInterestRate,
        uint256 PropertyLockingPeriod
    );
    event PropertyBanned(
        uint256 indexed PropertyId,
        address indexed PropertyOwner
    );
    event PropertyApprovedAndTokenized(
        uint256 indexed PropertyId,
        address indexed PropertyOwner,
        string TokenName,
        string TokenSymbol,
        uint256 TokenSupply,
        address indexed PropertyTokenAddress,
        PropertyStatus Status,
        uint256 NumberOfLockedTokens
    );
    event InterestRateUpdated(
        uint256 indexed PropertyId,
        uint256 indexed InterestRate
    );
    event Invested(
        uint256 PropertyId,
        address Investor,
        uint256 InvestmentAmount,
        uint256 TokenSupply,
        uint256 InterestRate
    );
    event InvestmentClaimed(
        address indexed PropertyOwner,
        uint256 indexed PropertyId,
        uint256 indexed ClaimedAmount
    );
    event InvestmentReturned(
        address indexed PropertyOwner,
        address indexed Investor,
        uint256 indexed ReturnedAmount,
        uint256 InvestedAmount
    );
    event ReturnClaimed(
        address indexed Investor,
        uint256 indexed PropertyId,
        uint256 indexed ReturnedAmount
    );
    event PropertyTokensClaimed(
        address indexed PropertyOwner,
        uint256 indexed PropertyId,
        uint256 indexed ClaimedTokens
    );
    event TokenSupplyUpdated(
        address indexed Owner,
        uint256 indexed PropertyId,
        uint256 TokenSupply
    );
    event LockingPeriodUpdated(
        uint256 indexed PropertyId,
        uint256 indexed LockingPeriod
    );

    enum PropertyStatus {
        PENDING,
        ADDED,
        APPROVED,
        BANNED
    }

    struct Property {
        uint256 propertyId;
        address owner;
        string tokenName;
        string tokenSymbol;
        uint256 tokenSupply;
        uint256 interestRate; //handle 2 decimal points (1000)
        uint256 lockingPeriod;
        PropertyStatus status;
    }

    Property[] public property;

    using Counters for Counters.Counter;
    Counters.Counter public _propertyIdCount;

    // Struct for storing investment information
    struct Investment {
        address investor;
        uint256 investmentAmount;
        uint256 timeStamp;
    }

    mapping(uint256 => Property) public propertyIdToProperty;
    mapping(uint256 => address) public propertyIdToTokenAddress;
    mapping(uint256 => uint256) public lockedTokens;
    mapping(uint256 => uint256) public totalInvestedAmount;
    mapping(uint256 => uint256) public claimedInvestment;
    mapping(uint256 => mapping(address => Investment)) public investments;
    mapping(uint256 => Investment[]) public propertyIdToInvestment;

    constructor() // address _promissoryOwner,
    // address _USDT
    {
        promissoryOwner = 0x78315cF7082dBb0174da3286D436BfE7577dF836;
        USDT = 0x2aC68A7Fa635972335d1d0880aa8861c5a46Bf88;
    }

    modifier checkPromissoryOwner() {
        if (msg.sender != promissoryOwner)
            revert("Caller is not the owner of the platform");
        _;
    }

    function getAllProperties() public view returns (Property[] memory) {
        Property[] memory result = new Property[](_propertyIdCount.current());
        uint256 i = 0;
        for (
            uint256 propertyId = 0;
            propertyId <= _propertyIdCount.current();
            propertyId++
        ) {
            if (property[propertyId].propertyId > 0) {
                result[i] = property[propertyId];
                i = i.add(1);
            }
        }
        return result;
    }

    function getAllInvestments(uint256 _propertyId)
        public
        view
        returns (Investment[] memory)
    {
        return propertyIdToInvestment[_propertyId];
    }

    /// @notice creates a new property
    function addProperty(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _tokenSupply,
        uint256 _interestRate,
        uint256 _lockingPeriod
    ) external {
        Property memory userProperty;
        userProperty.propertyId = _propertyIdCount.current();
        _propertyIdCount.increment();
        userProperty.owner = msg.sender;
        userProperty.tokenName = _tokenName;
        userProperty.tokenSymbol = _tokenSymbol;
        userProperty.tokenSupply = _tokenSupply;
        userProperty.interestRate = _interestRate;
        userProperty.lockingPeriod = _lockingPeriod;

        userProperty.status = PropertyStatus.ADDED;
        propertyIdToProperty[userProperty.propertyId] = userProperty;

        property.push(
            Property(
                userProperty.propertyId,
                userProperty.owner,
                userProperty.tokenName,
                userProperty.tokenSymbol,
                userProperty.tokenSupply,
                userProperty.interestRate,
                userProperty.lockingPeriod,
                userProperty.status
            )
        );

        emit PropertyAdded(
            userProperty.propertyId,
            msg.sender,
            userProperty.tokenName,
            userProperty.tokenSymbol,
            userProperty.tokenSupply,
            userProperty.interestRate,
            userProperty.lockingPeriod
        );
    }

    function banProperty(uint256 _propertyId) external checkPromissoryOwner {
        require(
            propertyIdToProperty[_propertyId].status == PropertyStatus.ADDED,
            "Property do not exist!!"
        );

        Property storage propertyStatus = property[_propertyId];
        propertyStatus.status = PropertyStatus.BANNED;

        propertyIdToProperty[_propertyId].status = PropertyStatus.BANNED;

        emit PropertyBanned(
            _propertyId,
            propertyIdToProperty[_propertyId].owner
        );
    }

    function approveProperty(uint256 _propertyId)
        external
        checkPromissoryOwner
    {
        require(
            propertyIdToProperty[_propertyId].status == PropertyStatus.ADDED,
            "Property do not exist!"
        );

        ERC20Token t = new ERC20Token(
            propertyIdToProperty[_propertyId].tokenName,
            propertyIdToProperty[_propertyId].tokenSymbol,
            propertyIdToProperty[_propertyId].tokenSupply
        );

        propertyIdToTokenAddress[_propertyId] = address(t);

        ERC20Token(propertyIdToTokenAddress[_propertyId]).approve(
            address(this),
            propertyIdToProperty[_propertyId].tokenSupply
        );

        ERC20Token(propertyIdToTokenAddress[_propertyId]).transfer(
            address(this),
            propertyIdToProperty[_propertyId].tokenSupply
        );
        lockedTokens[_propertyId] += propertyIdToProperty[_propertyId]
            .tokenSupply;

        propertyIdToProperty[_propertyId].status = PropertyStatus.APPROVED;

        Property storage propertyStatus = property[_propertyId];
        propertyStatus.status = PropertyStatus.APPROVED;

        emit PropertyApprovedAndTokenized(
            _propertyId,
            propertyIdToProperty[_propertyId].owner,
            propertyIdToProperty[_propertyId].tokenName,
            propertyIdToProperty[_propertyId].tokenSymbol,
            propertyIdToProperty[_propertyId].tokenSupply,
            propertyIdToTokenAddress[_propertyId],
            propertyIdToProperty[_propertyId].status,
            // _numberOfTokensToLock
            propertyIdToProperty[_propertyId].tokenSupply
        );
    }

    function updateInterestRate(uint _propertyId, uint256 _interestRate)
        external
    {
        require(
            propertyIdToProperty[_propertyId].status == PropertyStatus.ADDED,
            "Property has already been APPROVED or BANNED!"
        );
        require(
            propertyIdToProperty[_propertyId].owner == msg.sender,
            "You are not the owner of this Property!"
        );

        propertyIdToProperty[_propertyId].interestRate = _interestRate;

        Property storage propertyInterestRate = property[_propertyId];
        propertyInterestRate.interestRate = _interestRate;

        emit InterestRateUpdated(_propertyId, _interestRate);
    }

    function updateTokenSupply(uint _propertyId, uint256 _tokenSupply)
        external
    {
        require(
            propertyIdToProperty[_propertyId].status == PropertyStatus.ADDED,
            "Property has already been APPROVED or BANNED!"
        );
        require(
            propertyIdToProperty[_propertyId].owner == msg.sender,
            "You are not the owner of this Property!"
        );

        propertyIdToProperty[_propertyId].tokenSupply = _tokenSupply;

        Property storage propertyTokenSupply = property[_propertyId];
        propertyTokenSupply.tokenSupply = _tokenSupply;

        emit TokenSupplyUpdated(msg.sender, _propertyId, _tokenSupply);
    }

    function updateLockingPeriod(uint _propertyId, uint256 _updateLockingPeriod)
        external
    {
        require(
            propertyIdToProperty[_propertyId].status == PropertyStatus.ADDED,
            "Property has already been APPROVED or BANNED!"
        );
        require(
            propertyIdToProperty[_propertyId].owner == msg.sender,
            "You are not the owner of this Property!"
        );

        propertyIdToProperty[_propertyId].lockingPeriod = _updateLockingPeriod;

        Property storage propertyLockingPeriod = property[_propertyId];
        propertyLockingPeriod.lockingPeriod = _updateLockingPeriod;

        emit LockingPeriodUpdated(_propertyId, _updateLockingPeriod);
    }

    function investInProperty(uint256 _propertyId, uint256 _investmentAmount)
        external
    {
        require(
            propertyIdToProperty[_propertyId].status == PropertyStatus.APPROVED,
            "Property isn't approved yet!, Wait for platform to approve this property."
        );
        require(
            _investmentAmount <= lockedTokens[_propertyId],
            "Invested Amount exceeds the number of Property Tokens available"
        );

        IERC20(USDT).approve(address(this), _investmentAmount);
        IERC20(USDT).transferFrom(msg.sender, address(this), _investmentAmount);
        totalInvestedAmount[_propertyId] += _investmentAmount;

        ERC20Token(propertyIdToTokenAddress[_propertyId]).approve(
            msg.sender,
            _investmentAmount
        );
        ERC20Token(propertyIdToTokenAddress[_propertyId]).transferFrom(
            address(this),
            msg.sender,
            _investmentAmount
        );
        lockedTokens[_propertyId] -= _investmentAmount;

        uint256 timeNow = block.timestamp;
        investments[_propertyId][msg.sender] = Investment({
            investor: msg.sender,
            investmentAmount: _investmentAmount,
            // timeStamp: block.timestamp.div(86400)
            timeStamp: timeNow
        });

        propertyIdToInvestment[_propertyId].push(
            investments[_propertyId][msg.sender]
        );

        emit Invested(
            _propertyId,
            msg.sender,
            _investmentAmount,
            propertyIdToProperty[_propertyId].tokenSupply,
            propertyIdToProperty[_propertyId].interestRate
        );
    }

    function claimInvestment(
        uint256 _propertyId,
        uint256 _numberOfTokensToClaim
    ) external {
        require(
            msg.sender == propertyIdToProperty[_propertyId].owner,
            "You are not the onwer of this property!"
        );
        uint256 remainingInvetment = totalInvestedAmount[_propertyId] -
            claimedInvestment[_propertyId];
        require(
            _numberOfTokensToClaim <= remainingInvetment,
            "Amount exceeds than available!"
        );

        IERC20(USDT).approve(
            propertyIdToProperty[_propertyId].owner,
            _numberOfTokensToClaim
        );
        IERC20(USDT).transferFrom(
            address(this),
            propertyIdToProperty[_propertyId].owner,
            _numberOfTokensToClaim
        );

        claimedInvestment[_propertyId] += _numberOfTokensToClaim;

        emit InvestmentClaimed(msg.sender, _propertyId, _numberOfTokensToClaim);
    }

    function returnInvestment(uint256 _propertyId, address _investor) external {
        require(
            msg.sender == propertyIdToProperty[_propertyId].owner,
            "You are not the owner of this property!"
        );

        uint256 _blockTimeStamp = block.timestamp;
        require(
            (investments[_propertyId][_investor]).timeStamp +
                propertyIdToProperty[_propertyId].lockingPeriod <
                _blockTimeStamp,
            "Locking period isn't completed yet!"
        );

        uint256 _investedAmount = (investments[_propertyId][_investor])
            .investmentAmount; //500 * 10 ** 18
        uint256 _interestRate = propertyIdToProperty[_propertyId].interestRate;
        uint256 _interestAmount = (_investedAmount * _interestRate).div(10000);

        uint256 returnAmount = (
            (investments[_propertyId][_investor]).investmentAmount
        ) + _interestAmount;

        IERC20(USDT).approve(address(this), returnAmount);
        IERC20(USDT).transferFrom(msg.sender, address(this), returnAmount);

        emit InvestmentReturned(
            msg.sender,
            _investor,
            returnAmount,
            (investments[_propertyId][_investor]).investmentAmount
        );
    }

    /// @notice Investors can claim the returned investment amount and return the proeprty token to property owner
    function claimReturn(uint256 _propertyId, uint256 _returnAmount) external {
        require(
            msg.sender == (investments[_propertyId][msg.sender]).investor,
            "You have not invested in this property!"
        );

        IERC20(USDT).approve(msg.sender, _returnAmount);
        IERC20(USDT).transferFrom(address(this), msg.sender, _returnAmount);
        totalInvestedAmount[_propertyId] -= (
            investments[_propertyId][msg.sender]
        ).investmentAmount;

        ERC20Token(propertyIdToTokenAddress[_propertyId]).approve(
            address(this),
            (investments[_propertyId][msg.sender]).investmentAmount
        );
        ERC20Token(propertyIdToTokenAddress[_propertyId]).transferFrom(
            msg.sender,
            address(this),
            (investments[_propertyId][msg.sender]).investmentAmount
        );
        lockedTokens[_propertyId] += (investments[_propertyId][msg.sender])
            .investmentAmount;

        emit ReturnClaimed(msg.sender, _propertyId, _returnAmount);
    }

    /// @notice Property Onwers can claim the property tokens locked in the smart contract
    function claimPropertyTokens(uint256 _propertyId, uint256 _claimTokens)
        external
    {
        require(
            msg.sender == propertyIdToProperty[_propertyId].owner,
            "You are not the owner of this property!"
        );
        require(
            _claimTokens <= lockedTokens[_propertyId],
            "You are claiming more tokens than locked!"
        );

        ERC20Token(propertyIdToTokenAddress[_propertyId]).approve(
            msg.sender,
            _claimTokens
        );
        ERC20Token(propertyIdToTokenAddress[_propertyId]).transferFrom(
            address(this),
            msg.sender,
            _claimTokens
        );
        lockedTokens[_propertyId] -= _claimTokens;

        emit PropertyTokensClaimed(msg.sender, _propertyId, _claimTokens);
    }

    function getProperties() public view returns (Property[] memory) {
        return property;
    }
}

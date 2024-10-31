// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    uint256 public totalDeposits;
    uint256 public totalWithdrawals;
    uint256 public withdrawalLimit; // New variable for withdrawal limit

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event BalanceIncreased(uint256 percentage, uint256 newBalance);
    event WithdrawalLimitSet(uint256 limit);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
        withdrawalLimit = initBalance; // Initialize to the initial balance
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        balance += _amount;
        totalDeposits += 1;
        assert(balance == _previousBalance + _amount);
        emit Deposit(_amount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(_withdrawAmount <= withdrawalLimit, "Withdrawal amount exceeds limit");
        
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({balance: balance, withdrawAmount: _withdrawAmount});
        }
        
        balance -= _withdrawAmount;
        totalWithdrawals += 1;
        assert(balance == (_previousBalance - _withdrawAmount));
        emit Withdraw(_withdrawAmount);
    }

    // New Functions

    function increaseBalanceByPercentage(uint256 percentage) public {
        require(msg.sender == owner, "Only the owner can increase the balance");
        uint256 increaseAmount = (balance * percentage) / 100;
        balance += increaseAmount;
        emit BalanceIncreased(percentage, balance);
    }

    function getAccountActivity() public view returns (uint256 deposits, uint256 withdrawals) {
        return (totalDeposits, totalWithdrawals);
    }

    function setWithdrawalLimit(uint256 _limit) public {
        require(msg.sender == owner, "Only the owner can set the withdrawal limit");
        withdrawalLimit = _limit;
        emit WithdrawalLimitSet(_limit);
    }
}

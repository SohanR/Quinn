const SHA256 = require('crypto-js/sha256');


class Transaction{
    constructor(fromAddress, toAddress,amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
//creating block
class Block{
    constructor(timestamp, transactions, previousHash = ' '){
        
        this.timestamp = timestamp;
        this.transaction = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }

    mineBlock(difficulty) {
        while (
            this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
        ) {
          this.nonce++;
          this.hash = this.calculateHash();
        }
    
        console.log("Block Mined --> " + this.hash);
    }

}




class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.dificulty = 5;
        this.pendingTransactions = [];
        this.minigReward = 100;

    }


    createGenesisBlock(){
        return new Block(0, "30/10/22","Genesis Block","0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddres){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!!!!');
        
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddres, this.minigReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction)
    }

    getBalanceAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount
                }
            }
        }

        return balance;
    }

    // checking block validity
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
            
        }

        return true;
    }
}

let Quinn = new Blockchain();

// Quinn.addBlock(new Block(1,"30/10/22", {amount:4}));
// Quinn.addBlock(new Block(2,"31/10/22", {amount:10}));

// console.log('Is blockchain valid ? ' + Quinn.isChainValid());

//Quinn.chain[1].data = {amount:100}
//Quinn.chain[1].hash = Quinn.chain[1].calculateHash

//console.log(JSON.stringify(Quinn,null, 4));


Quinn.createTransaction(new Transaction('address1', 'address2', 100))
Quinn.createTransaction(new Transaction('address2', 'address1', 50))

console.log('Starting the miner........ \n');

Quinn.minePendingTransactions('sohan-address')

console.log('\n balance of sohan is ', Quinn.getBalanceAddress('sohan-address'))




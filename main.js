const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        //creating string of zeros of specific length(difficulty + 1 currently)
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        //initializing chain with array that includes genesis block
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, "09/04/2018", "Genesis 77777777777777777777", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for( let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            //rechecking hash value
            if (currentBlock.hash != currentBlock.calculateHash()) {
                return false;
            }
            //checking if hash points at previous block hash
            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let artSevenCoin = new Blockchain();

artSevenCoin.addBlock(new Block(1, "09/04/2018", { amount: 4 }));
artSevenCoin.addBlock(new Block(1, "09/04/2018", { amount: 7 }));

console.log('Is blockchain valid? ' + artSevenCoin.isChainValid());

artSevenCoin.chain[1].data = { amount: 100};

console.log('Is blockchain still valid? ' + artSevenCoin.isChainValid());

// console.log(JSON.stringify(artSevenCoin, null, 4));
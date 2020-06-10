import React from 'react';

import * as CryptoJS from 'crypto-ts';

class Block {
    static calculateBlockHash = ( //static이 없으면 아래처럼 외부에서 바로 불러낼 수 없다.
        index:number,               // 없이 사용하려면 클래스를 호출해야 한다.
        previousHash:string, 
        timestamp:number,
        data:string
        ):string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
            //cryptojs는 암호화 프로그래밍을 할 때 사용됨.
            //SHA는 암호화 시키는 단계이며 뒤에 숫자는 그 단계의 구별이라고 보면 된다.
            // 뒤에 숫자는 어느정도 정해져 있는 듯 하며 256보다 위에 것은 
            // 같은 암호라도 변화시키는 양이 더 많다.
    
    static validateStructure = (aBlock : Block): boolean => // 구조 검증
        typeof aBlock.index === "number" &&
        typeof aBlock.hash ==="string" &&
        typeof aBlock.previousHash === "string" &&
        typeof aBlock.timestamp === "number" &&
        typeof aBlock.data === "string";
    

    public index:number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    constructor(
        index:number, 
        hash: string, 
        previousHash: string, 
        data: string,
        timestamp: number
    ){
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}

//Block.calculateBlockHash();

const genesisBlock:Block = new Block(0, '2020202020', "", "Hello", 123456);
let blockchain: Block[] = [genesisBlock]; //genesisBlock을 Block타입으로 배열로 만듬.

const getBlockchain = () : Block[] => blockchain;
const getLatesBlock = () : Block => blockchain[blockchain.length -1]; // 블록체인의 길이, 블록체인 안에서 가장 최근의 것을 리턴.
const getNewTimeStamp = () : number => Math.round(new Date().getTime() / 1000);
console.log(blockchain);

//블록타입의 배열 인스턴스를 지정함.
// 여기서 표기된 Block들은 위의 클래스 명이고 해당 클래스의 타입을 사용하려면 
// 사용되는 부분을 다 통일시켜야함

//여기서 얘기하는 블록은 사용되어야 될 내용의 타입들을 지정한 클래스나 인터페이스를 지칭하는 
// 것으로 보인다. 

// 사용되어야 할 내용의 타입들이 지정된 블록 이름으로 구분하여 사용하는 듯 하다.

// blockchain.push("stuff"); 이런 식으로 추가하려 하면 해당 블록에 없거나, 
// 블록이 아니기 때문에 추가할 수 없다.


const createNewBlock = (data:string) :Block =>{
    const previousBlock : Block = getLatesBlock();
    const newIndex : number = previousBlock.index + 1;
    const newTimestamp : number = getNewTimeStamp();
    const newHash : string = Block.calculateBlockHash( // 인자로 받은 내용을 다 합쳐서 Hash로 만듬
        newIndex, 
        previousBlock.hash, // 이전 Hash까지 합쳐서 새로운 Hash를 만들어 냄.
        newTimestamp, 
        data
        ); // cryptoJS 함수를 가진 이 부분이 아마 블록체인에서 제일 중요한 부분인 듯.

    const newBlock: Block = new Block( //전부 위에서 짜여진 내부에서 데이터를 가져옴
        newIndex, 
        newHash, 
        previousBlock.hash, 
        data, // 여기서 들어오는 내용 중 외부에서 새로 추가되는 부분은 여기 뿐.
        newTimestamp
        );
    addBlock(newBlock);
    return newBlock;
};

//createNewBlock 안의 구조
// previousBlock : getLatesBlock로 가장 마지막에 생성된 blockchain을 가져옴
// newIndex : previousBlock으로 가져온 마지막으로 생성된 blockchain의 index값에 +1 을 함.
// newTimestamp : 생성된 날짜를 저장. 밀리세컨드로 계산되면 숫자가 너무 많아 일반 세컨드로 사용(추측)
// newHash : 위에서 생성한 newIndex와 newTimestamp, previousBlock의 hash값, 
//      그리고 추가한 data값 까지 포함해서 Block 클래스에 있는 calculateBlockHash 함수를 통해
//      새로운 hash 값을 생성. 블록체인의 보안성은 여기서 나옴.
// newBlock : 위에 있는 내용을 전부 포함해서 새로운 Block을 생성함.
//      newHash에서 쓰인 내용은 새로운 hash를 만들때 사용한 것이고 여기서 사용한 내용은
//      데이터 저장, 기록을 위한 내용들이다.
// addBlock : 
     

// console.log(createNewBlock("hello"),createNewBlock('Bye Bye'));


// 해쉬 검증
const getHashforBlock = (aBlock: Block) : string => Block.calculateBlockHash(
    aBlock.index, aBlock.previousHash, aBlock.timestamp, aBlock.data);
//  createNewBlock 내의 newHash와 같은 값을 기대해하기 위함.

// 구조 검증 , 이전 현재 의 비교 검증
const isBlockValid = (candidateBlock :Block, previousBlock :Block) :boolean => {
    if(!Block.validateStructure(candidateBlock)){ 
        return false; // 새로운 Block이 Block클래스 안의 구조 검증 함수에서 true를 반환 하는지 확인
    } else if (previousBlock.index +1 !== candidateBlock.index){
        return false; // index가 같은지 확인.
    } else if (previousBlock.hash !== candidateBlock.previousHash){
        return false; // 마지막에 생성된 Block과 새로 생성된 Block의 이전 hash 가 같은지 확인.
    } else if(getHashforBlock(candidateBlock) !== candidateBlock.hash){
        return false; // 새로 생성된 Block의 hash와 해쉬 검증을 통해 나온 hash가 같은지 확인.
    } else { 
        return true; // 전부 통과 했다면 true;
    }
}
//  isBlockValid : 새로운 Block을 이전 Block에서 추가될 부분이나 같아야 할 부분을 비교해서
//          전부 해당할 경우 true를 반환함.

const addBlock = (candidateBlock: Block) :void => { //리턴할게 없는 함수일 시 타입을 void로.
    if(isBlockValid(candidateBlock, getLatesBlock())){
        blockchain.push(candidateBlock); //위의 검증을 전부 통과했다면 blockchain 배열에 내용 추가.
    }
}


// 실행문

createNewBlock("second Block");
createNewBlock('third Block');
createNewBlock('fourth Block');

console.log(blockchain);
console.log('crypto'+ CryptoJS.SHA256('abc').toString());

const App_1 = () => {
    return (
        <div>
            hello
        </div>
    );
};

export default App_1;

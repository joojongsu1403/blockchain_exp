import React from 'react';
import './App.css';

// interface Human {
//   name:string;
//   age:number;
//   gender: string;
// }

// const person = {
//   name:'nicolas',
//   age: 22,
//   gender: 'male'
// }

class Human { // 리액트 등의 라이브러리에선 interface가 아닌 class로 작성해야 할 부분이 있다.
  public name: string; // 타입 스크립트에서만 사용하는 부분
  public age: number; // public 외부에서도 접근 가능, private 오직 해당 class 내부에서만 접근가능
  public gender: string; // 자바스크립트로 컴파일 되면 여기까지 해당 부분은 표시되지 않음
  constructor(name:string, age:number, gender:string){ // 컴파일시 여기서 부터 표시됨.
    this.name = name;
    this.age = age;
    this.gender = gender;
  }
}

//constructor(gender?:string) 해당 위치에 ?가 들어가면 해당 타입을 선택사항으로 바꿀 수 있음
//타입스크립트에선 명시한 부분은 내용이 없으면 에러를 반환함

const lynn = new Human("lynn",18,"female");


const sayHi = (person:Human):string => { 
  return `${person.name},${person.age},${person.gender}`
}// 해당 인자에 person이 없지만 뒤에 Human으로 지정했기에 인식이 된다.
// 그러나 위에서 public이 아닌 private로 지정되어 있으면 인식되지 않는다.

function App() {
  // console.log(sayHi(person));
  console.log(sayHi(lynn));
  return (
    <div className="App">
      
    </div>
  );
}

export default App;


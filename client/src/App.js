import React, { Component,useState } from "react";

import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      border: Array(15).fill(null), 
      chessArr: null, 
      palyArr: [
        /*  { row: 0, col: 0, chess: 1, } */
      ], 
      chess: null, 
      row: 0, 
      col: 0, 


    contractAdd:null,
    storageValue: 0, web3: null, accounts: null, contract: null ,
    Winner:null, 
    timer :null,
    PlayerColor:null,
    inGame:'No',
    inTurn:null
    };
    
  }


  

  componentDidMount = async () => {
    try {
      this.state.timer = setTimeout(() => 
        //console.log('Hello, World!')
        window.location.reload()
      , 25000)  // 25 second reload page
      // Get network provider and web3 instance.
      
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        '0x500b9ca60BED6AE6405FE751A53a673e53767058',                   //need to change every migrate
      );
      this.setState({ web3,accounts:accounts,contract:instance})
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      //this.setState({ web3, accounts, contract: instance }, this.runExample);


      

      // set color
      console.log('host',await this.state.contract.methods.getHost().call(),this.state.accounts[0])
      if(this.state.accounts[0]==await this.state.contract.methods.getHost().call()){
        this.setState({PlayerColor: 'Black first' });
        this.setState({inGame: 'in game ' })
      }else if (this.state.accounts[0]==await this.state.contract.methods.getGuest().call()){
        this.setState({PlayerColor: 'White second' });
        this.setState({inGame: 'in game' })
      }
      if(this.state.accounts[0]==await this.state.contract.methods.getActivePlayer().call()){
        this.setState({inTurn: 'Your Turn' })
      }else{
        this.setState({inTurn: 'Not Your Turn' })
      }
      







      // board https://github.com/hy-cz/gobang
      let { chessArr } = this.state;
      chessArr = Array(15).fill("");
      chessArr.map((item, index) => {
        chessArr[index] = Array(20).fill("");
      });
      this.setState({ chessArr });

      
      //by contract assign to palyArr
      const bbb=await this.state.contract.methods.getBoard().call();
      for (let i =0 ; i < 15; i++) {
        for (let j=0;j<15;j++){
          if (bbb[i][j]!=0){
            let chessP=bbb[i][j];
            console.log(chessP===1)
            this.setState(
              {
                palyArr: 
                [...this.state.palyArr, { row:j, col:i, chess:chessP}],
              })
          }
        }
      }
      


      console.log('board',bbb);
      console.log('palyArr',this.state.palyArr);
      

      //get winner
      const gameWinner=await this.state.contract.methods.getVictorPlayer().call();
      if (gameWinner==0){

        this.setState({ Winner:'Not Finnish Game' });
        if(await this.state.contract.methods.checkTie().call()==1){
          this.setState({ Winner:'tie' });
        }
      }else{
        this.setState({ Winner:gameWinner });
      }
      
      //console.log('winner',gameWinner==0);



    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  

  startGame = async () => {
    try{
      
      const player=this.state.accounts[0];
      //console.log("player1: ",player)
      await this.state.contract.methods.startGame().send({
        from: player,
        value:500000000000000000, //  0.5 ether
         });
      console.log("acction: ")
      window.location.reload();


    }catch(error){
      console.log("Start game Error: ", error)
    }
    
  };
  joinGame = async () => {
    try{
      const player=this.state.accounts[0];
      //console.log("player2: ",player)
      await this.state.contract.methods.joinGame().send({
        from: player,
        value:500000000000000000, //  0.5 ether
      });
      console.log("acction: ")
      window.location.reload();


    }catch(error){
      console.log("join game Error: ", error)
    };

  }
  moveStep = async (col,row) =>{
    
    const player=this.state.accounts[0];

    
    console.log("row and col ",row,col);

    await this.state.contract.methods.moveGame(row,col).send({ from: player });
    window.location.reload();
    
  }

  clear=async()=>{
    const player=this.state.accounts[0];
    await this.state.contract.methods.clear().send({ from: player })
    console.log('balance : ',this.state.web3.eth.getBalance('0x491F4ceA96361e3e17f187E35A7b62F2225fE23e'))
  }

  
  



// test = async () =>{
//   const player=this.state.accounts[0];
//   await this.state.contract.methods.set().send({ from: player });
//   window.location.reload();
// }






  render() {
    const { border, palyArr } = this.state;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Gobang !</h1>
        <p>Now player account:{this.state.accounts[0]} </p>
        <p>whether in Game:  {this.state.inGame} </p>
        <p>your color is :{this.state.PlayerColor} </p>
        <p>Winner: {this.state.Winner} </p>
        <h2>{this.state.inTurn}</h2>
        <button onClick={this.startGame}>Start Game</button>
        <button onClick={this.joinGame}>join Game</button>
        {/* <button onClick={this.checkWin}>checkWin</button> */}
        <button onClick={this.clear}>clear</button>
        
        
        
        

        <div className="chessboard">
            {border.map((row, rowIndex) => (
              <div className="chessboard-row" key={`row + ${rowIndex}`}>
                {border.map((col, colIndex) => (
                  <div className="chessboard-col" key={`col + ${colIndex}`}>
                    <div className="chessboard-cell">
                      {/* board game */}
                      {this.state.palyArr.find(
                        (item) => item.row === rowIndex && item.col === colIndex
                      ) ? (
                        this.state.palyArr.find(
                          (item) => item.row === rowIndex && item.col === colIndex
                        ).chess == 1 ? (
                          <div className="chessboard-cell-black"></div>
                        ) : (
                          <div className="chessboard-cell-white"></div>
                        )
                      ) : (
                        <div
                          className="chessboard-cell-click"
                          onClick={() => this.moveStep(rowIndex, colIndex)}
                        ></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        
      </div>
    );
  }
}

export default App;

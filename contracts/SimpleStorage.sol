// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.16.0;

contract SimpleStorage {
  
  uint constant public gameCost = 0.5 ether;

  address public hostPlayer;
  address public guestPlayer;

  address public activePlayer;
  address public victorPlayer;

  uint[15][15] private board;
  uint private chessCount;
  

  

  mapping(address => uint) private playerChess;
  uint private winningPrice=0;

  //test
  uint public storedData=0;
  

  function startGame() public payable{

    require(msg.value==gameCost);
    require(hostPlayer==address(0));
    hostPlayer=msg.sender;
    
    playerChess[hostPlayer] = 1;
    winningPrice=winningPrice+gameCost;

    //activePlayer=hostPlayer;        

  }
  function joinGame() public payable{
    require(msg.value==gameCost);
    require(guestPlayer == address(0));
    require(msg.sender!=hostPlayer);
    require(hostPlayer!=address(0));
    guestPlayer = msg.sender;


    playerChess[guestPlayer] = 2;
    winningPrice=winningPrice+gameCost;
    activePlayer=hostPlayer;
  }

  
  function checkWin(uint row,uint col,address player)public{
    require(victorPlayer==address(0));
    //victorPlayer=hostPlayer;
    uint nowPlayer=playerChess[player];
    uint UpDownCount=1;
    //纵向
    for(uint i=row+1; i<15;i++){
      if (board[i][col]!= nowPlayer){
        break;
      }
      UpDownCount=UpDownCount+1;
    }
    if (row==0 ){

    }
    else{
      for(uint i=row-1; i>=0;i--){
        if (board[i][col]!= nowPlayer){
          break;
        }
        UpDownCount=UpDownCount+1;
        if(i==0){
          break;
        }
    }
    }
    
    
    //横向
    uint LRcount=1;
    for(uint i=col+1; i<15;i++){
      if (board[row][i]!= nowPlayer){
        break;
      }
      LRcount=LRcount+1;
    }

    if (col==0 ){ // in order for 'Panic: Arithmetic overflow',

    }
    else {
      for(uint i=col-1; i>=0;i--){
        if (board[row][i]!= nowPlayer){
          break;
        }
        LRcount=LRcount+1;
        if(i==0){
          break;
        }
      }
    }
    

    //左斜
    uint LCount=1;
    uint j=row;
    if(row==14||col==14){

    }else{
      for(uint i=col+1; i<15;i++){
      j=j+1;
      if (board[j][i]!= nowPlayer){
        break;
      }
      LCount=LCount+1;
    }
    }
    
    if (row==0 || col==0){

    }
    else{
      j=row;
      for(uint i=col-1; i>=0;i--){
        j=j-1;
        if (board[j][i]!= nowPlayer|| j<0){
          break;
        }
        LCount=LCount+1;

        if(j==0||i==0){
          break;
        }

      }
    }
    

    //右斜
    uint RCount=1;
    if(row==14||col==0){

    }else{
      j=col;
      for(uint i=row+1; i<15;i++){
        j=j-1;
        if (board[i][j]!= nowPlayer){
          break;
        }
        RCount=RCount+1;
        if(j==0){
          break;
        }
      }
      
    }

    if(row==0||col==14){

    }
    else{
      j=col;
      for(uint i=row-1; i>=0;i--){
        j=j+1;
        if (board[i][j]!= nowPlayer|| j>14){
          break;
        }
        RCount=RCount+1;
        if(i==0){
          break;
        }
    }
    }
    


    //win 
    if(UpDownCount>=5 || LRcount>=5 ||LCount>=5||RCount>=5){
      victorPlayer=player;
      payable(msg.sender).transfer(winningPrice);
      winningPrice=0;
      //activePlayer=address(0);
    }else if(chessCount==225){
      payable(hostPlayer).transfer(gameCost);
      payable(guestPlayer).transfer(gameCost);
      //activePlayer=address(0);
    }

  }
  
  function moveGame(uint row,uint col) public{
    require(board[row][col]==0);
    require(msg.sender==activePlayer);
    require(activePlayer!=address(0));
    require(victorPlayer==address(0));
    board[row][col]=playerChess[activePlayer];
    chessCount=chessCount+1;
    checkWin(row,col,activePlayer); 


    if(activePlayer==hostPlayer){
      activePlayer=guestPlayer;
    }else{
      activePlayer=hostPlayer;
    }
    if(victorPlayer!=address(0)){
      activePlayer=address(0);
    }else if(chessCount==225){
      activePlayer=address(0);
    }
    
  }



  function checkTie() public returns(uint){
    if(chessCount==225 &&activePlayer==address(0)){
      return 1;
    }else{
      return 2;
    }
    
  }

  function getBoard()public returns(uint[15][15] memory){
    //uint[][] memory gameBorad=new uint[][](15);
    return board;
  }

  function getVictorPlayer() public view returns (address){
    return victorPlayer;
  }
  function getActivePlayer() public view returns (address){
    return activePlayer;
  }
  function getHost() public view returns (address ){
    return hostPlayer;
  }
  function getGuest() public view returns (address ){
    return guestPlayer;
  }


  
  function clear() public{
    require(victorPlayer!=address(0));
    victorPlayer=address(0);
    hostPlayer=address(0);
    guestPlayer=address(0);
    activePlayer=address(0);//
    //payable(msg.sender) .transfer(address(this).balance);
    winningPrice=0;
    delete board;
  }




  // ////////////////////test
  // function get()public view returns(uint){
  //   return storedData;
  // }
  // function set() public {
  //   storedData = storedData+1;
  // }
  
  // function sendToWinner() public {
  //   //require(victorPlayer!=address(0));
  //   require(msg.sender==victorPlayer);
  //   payable(msg.sender).transfer(winningPrice);
  //   winningPrice=0;
  // }
  // function setBoard() public{
  //   board[0][0]=1;
  // }

  // function oneMone(uint row,uint col) public {
    
  //   for(uint i=row-1; i>=0;i--){
  //     if (board[i][col]!= 1){
  //       break;
  //     }
      
  //   }
  
  // }
  ////////////////////////////


}

# Gobang_Web3

This Project is a Gobang board game

We use truffle react box as quick start framework and use Ganache as a testChain for our test account.

## Run Rroject

In order to run the project

first you should check the 'truffle-config' file to modify config for your enviroment

Please also check the client/package to confirm the dependencies you have been installed.

Then you should compile and deploy the contract


### `truffle compile`

### `truffle migrate --reset`


After delpoy, you can get a contract address in terminal, COPY it and PASTE it in APP.js 52 line to replace the contract address. 

Then you can go client folder and run client.

### `cd client`

### `npm run start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Login 2 account in 2 browser

In order to play the game, you should open 2 browser (like Edge and Chrome).

With each browser, you should login different accounts.

### click 'Start Game' and 'join Game'

After login the game, you can first click 'Start Game' with one player and click 'join Game' with another player.

'Start Game' and 'join Game' need 5 eth to pay the contract. After paying, player is in Game.

Be careful, if no one start the game, no one can join the game. So the 'Start Game' first then 'join Game'

### information and rule about the game

The websit would show some information about the game.

After 2 players are all in game, "Not your turn" for the first player would change to  "Your Turn ". Then for player whose web page show "Your Turn" can move the chess.

The rule is like Tic-Tac, but 5 would win.

The transcation need some time, so you need wait some time for page updating. I aslo set a time that 25s refreash the page to get the latest board. 

After someone win, he would get 1 eth and the page in both players would show a winner address.  Now, No one can move the chess and all show 'Not your turn' in the page.

After wining, any player can click clear to reinitial the game.(Also need to click 'Start Game' and 'join Game' to play)







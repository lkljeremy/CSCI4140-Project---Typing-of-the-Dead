<<<<< Typing of the Dead >>>>> 

README
=======================================
Run on local:
$ cd <project repo>
$ npm install
$ node server.js

Run on Heroku:
$ cd <project repo>
$ git init / add / commit
$ heroku create
$ git add .
$ git commit -m "comment"
$ git push heroku master

========================================
How to play:
1. Choose to be Host or Client (For multiplayer game, must have at least and only one host; For single player, choose "Host")
2. Host: choose game difficulties and turn on/off random mode
   Client: wait for Host to start the game
3. Game scene: 
	i. Type on keyboard and press "Space" to fire the text
	ii. "Backspace" to remove the last typed character
	iii. Each hit on Base minus 10 HP, "Kills" counts the number of kills by that client
4. When game over, press "Play Again" for next game

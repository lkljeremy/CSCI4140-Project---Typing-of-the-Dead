Typing of the Dead
==============================

Web game for course project of CSCI4140 spring 2015, CUHK.
Developpd by Jeremy Lo.

Demo page: https://peaceful-fortress-9606.herokuapp.com/

Run on local
============

    $ cd <project repo>
    $ npm install
    $ node server.js


Run on Heroku
=============

	$ cd <project repo>
	$ git init / add / commit
	$ heroku create
	$ git add .
	$ git commit -m "comment"
	$ git push heroku master


How to play
===========

* Choose to be Host or Client 
* For multiplayer game, at least and only one host, all the players should connect to the same session by entering the same session number at the end of URL, e.g. https://peaceful-fortress-9606.herokuapp.com/4140
* For single player, choose "Host"
* Host: choose game difficulties and turn on/off random mode
* Client: wait for Host to start the game
* Game scene: 
	i. Type on keyboard and press "Space" to fire the text; 
	ii. "Backspace" to remove the last typed character; 
	iii. Each hit on Base minus 10 HP, "Kills" counts the number of kills by that client.
* When game over, press "Play Again" for next game

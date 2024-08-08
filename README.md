# Blind Test
Automate the process of playing blind tests.

## What is it ?
The game consists in listening to 10 random seconds of a random song, and you have that much time to guess what the song is.

## Where to play ?
I do not currently host the game on any server (at least not publicly) so if you want to play, you'll have to self-host it.

To self-host, you'll only need to have Node.js and npm installed on your machine.
After having cloned the repo and installed the npm packages, simply move or copy the songs you want available for your blind tests in the `songs` folder. 
Please note that the songs must :
- NOT be in a subfolder
- be `.mp3` files
- contain at least the track name in their metadata

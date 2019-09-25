# Si Ping Pong
We hacked our Ping Pong table! [Read the blog post.](http://sidigital.co/blog/lab-notes-hacking-our-ping-pong-table)

## Technology
- [node.js](http://nodejs.org)
- [socket.io](http://socket.io/)
- [React](http://facebook.github.io/react/)
- [webpack](http://webpack.js.org)
- [trueskill](https://www.microsoft.com/en-us/research/project/trueskill-ranking-system/)

## Configuration
### config.js
copy config.js.example to config.js and adjust it to your needs

### trueskill
copy trueSkill/trueSkill.py.example to trueSkill/trueSkill.py and adjust it to your needs

## Running
Use the enclosed docker-compose setup

## Troubleshooting
### first run: mysql container does not start
since the mysql container relies on 
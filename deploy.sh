#!env bash
APP="nipper"
USER=""
HOST=""
REPO="https://github.com/${USER}/${APP}.git"
DIRECTORY="/var/www/${APP}"

[[ '' == $1 ]] && echo "Please provide version argument: x.x.x" && exit 1
echo "Deploying ${DIRECTORY} on ${HOST} as ${USER}";

ssh $USER@$HOST << EOF
if [ ! -d "$DIRECTORY" ]; then
  git clone $REPO $DIRECTORY
fi

cd $DIRECTORY

pm2 delete $APP

git checkout v$1
yarn install

pm2 start --name $APP index.js
EOF

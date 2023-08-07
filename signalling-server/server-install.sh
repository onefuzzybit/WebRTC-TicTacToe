# this file contains the bash commands that were used to initially install
# software on the signalling server - so that it would have the
# relevant pre-requisites we need for performing its tasks.

# when setting up the instance - enable ip forwarding. This can only be done on instance creation.

# install nodejs
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install nodejs
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install v18.15.0

# typescript
npm install -g typescript

## added the public key of my host machine to ~/.ssh/authorized_keys

## opened the relevant ports in GCP 


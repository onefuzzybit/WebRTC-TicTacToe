# this file contains the bash commands that were used to initially install
# software on the signalling / turn / stun server - so that it would have the
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

## added the public key of my host machine to ~/.ssg/authorized_keys

## opened the relevant ports in GCP 

# Install coturn (turn and stun server)
## first needed to enable sudo on machine by connecting through broswer shell
## and running sudo passwd (and setting the root password)

sudo apt-get install coturn

#update config
sudo vi /etc/etc/turnserver.conf
# use the following config: (not supporting tls at first)
listening-port=3478
#tls-listening-port=5349
fingerprint
lt-cred-mech
realm=yourdomain.com
total-quota=100
stale-nonce=600
#cert=/path/to/your/cert.pem
#pkey=/path/to/your/privkey.pem
#cipher-list="ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384"
no-stdout-log
log-file=/var/log/coturn.log
simple-log

# setup the sqlite 3 db for turn
sudo mkdir -p /var/lib/turn
sudo chown turnserver:turnserver /var/lib/turn
sudo chmod 700 /var/lib/turn
sudo touch /var/lib/turn/turndb
sudo chown turnserver:turnserver /var/lib/turn/turndb
sudo chmod 600 /var/lib/turn/turndb

# set turn user and tell it to load automatically
vi /etc/default/coturn
# write the following config in the file
TURNSERVER_ENABLED=1
TURN_USER=turnserver

# restart turn server
sudo service coturn restart

# add a turn user
sudo turnadmin -a -u turn -p turnpass -r one-fuzzy-bit.com


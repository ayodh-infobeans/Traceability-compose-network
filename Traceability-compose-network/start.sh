



./network.sh up createChannel -ca -c mychannel -s couchdb
cd compose
docker-compose -f compose-mongo.yaml up -d
cd ..
./network.sh deployCC -ccn basic -ccp ./chaincode/ -ccl javascript
 
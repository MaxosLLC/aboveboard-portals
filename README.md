# AboveBoard Broker/Issuer Portal

Build 3

The portal app is now configured to connect to our Heroku staging environment APIs so devs can work on the UI without having to run the entire system with docker-compose.



## Running Locally

1. Clone [base repo](https://github.com/MaxosLLC/registry)
2. `cd portal`
3. `cp .env.example .env`
4. `yarn`
5. `yarn run start-dev`

### Ethereum

To test anything Ethereum related the MetaMask chrome extension should be installed.  There is a private testrpc server running on heroku that can be access by selecting Custom RPC in MetaMask and using `https://aboveboard-testrpc.herokuapp.com/`.


### Accessing the Issuer Portal

By defaul the Broker Portal will be loaded unless `issuer` is found in the URL that the app was accessed on.  In order to access the Issuer Portal, you must make an entry in your hosts file with any URL that contains `issuer` and point it to the IP you are running the app on.


### Login

Login for broker portal should be your email address with password `Ab0veboardtest` and is located [here](https://github.com/MaxosLLC/registry/blob/master/api/data/user.json)

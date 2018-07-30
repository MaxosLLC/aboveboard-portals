# AboveBoard Broker/Issuer Portal

Build 4

The portal app is now configured to connect to our Heroku staging environment APIs so devs can work on the UI without having to run the entire system with docker-compose.


### Logging in with Google / Configuring OAuth 2

In order to login with Google you must access the portals application on a specific URL as this is defined in the provider OAuth settings.  To configure this, add the following domain names to your hosts file:

```
aboveboard-direct-local-development.com
aboveboard-broker-registry-local-development.com
aboveboard-issuer-registry-local-development.com
```

To do this, edit your hosts file with administration access (/etc/hosts or C:/Windows/System32/drivers/etc/hosts) and add the following entries next to the IP you are running `yarn run start-dev` on, for example if you are running it on localhost:

```
127.0.0.1 localhost aboveboard-direct-local-development.com aboveboard-broker-registry-local-development.com aboveboard-issuer-registry-local-development.com
```


## Running Locally

1. Clone [base repo](https://github.com/MaxosLLC/aboveboard-portals)
2. `cd aboveboard-portals`
3. `cp .env.example .env`
4. `yarn`
5. `yarn run start-dev`


### Ethereum

To test anything Ethereum related the MetaMask chrome extension should be installed.  There is a private testrpc server running on heroku that can be access by selecting Custom RPC in MetaMask and using `https://kovan.infura.io/V7nB2kBfEei6IhVFeI7W`.


### Accessing the Issuer Portal

By defaul the Broker Portal will be loaded unless `issuer` is found in the URL that the app was accessed on.  In order to access the Issuer Portal, you must make an entry in your hosts file with any URL that contains `issuer` and point it to the IP you are running the app on.


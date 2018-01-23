# sails-passport

Boilerplate to generate quick pure RESTful API with sailsjs + MySQL + passport and jwt token authentication 

## Available Routes:
* POST /register (with new email & password key value)
* POST /auth/login (with existed email & password key value) -> return token
* GET /auth/validate_token (with key:Authorization & value: 'Bearer `<your valid token>`' in header)
* GET /quote/open (to access random Chuck Norris quote)
* GET /quote/protected (with valid token in header to access protected random Chuck Norris quote) 

## Key Features:
### Version 0.0.1
* Sailsjs web framework with all their features
* Authentification with passportjs (local) and JSON Web Token
* MySQL database connection
* Enable CORS for access from different application
* Password encrypted (with bcrypt)
* Email checking
* Random Chuck Norris Quote! 

## HOW TO:
* Clone this repo and `cd` to your destined folder
* Make sure your MySQL server is running
* Change the value of `mysqlServer` in `/config/connections` to reflect your own MySQL setup conf (make sure to use new dedicated database since it will alter the database, unless you change the config in connections.js )
* run `npm install`
* run `sails lift`

### Error Info:
* if you have `npm install` with `bcrypt` error such as `node-gyp` build error, it is okay, since I already subtitute bcrypt with `bcrypt-nodejs` in the app implementation for a better compability with various OS. However, if you are a perfectionist, just delete `bcrypt` from `package.json` dependency and you all set.

### DISCLAIMER! 
This is as minimal as it can be. Use it as your boilerplate to startup your REST API server, and as your playground to understand sailsjs concept + setup Passport authentification in server.
For Accessing the functionality, you can use postman or better yet, download my other repo [angular-passport](https://github.com/zuhrasofyan/angular-passport).
[MIT License](https://github.com/angular/angular.js/blob/master/LICENSE)

Copyright &copy; 2016 Zuhra Sofyan





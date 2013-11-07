Order At The Counter
===

##Deployment

###Environment variables required:

NODE_ENV

mongooseURL

redisHost

redisPort

STRIPE_TEST_KEY

TWILIO_ACCOUNT_SID

TWILIO_AUTH_TOKEN

TWILIO_NUMBER

PHONE_NUMBER

###Local:
Set your NODE_ENV environment variable to development.

Create a .env file with environment variables on a single line. Example:

TEST_VARIABLE=test

OTHER_VARIABLE=other

###Production:

Set environment variables.

###Installation

Install node.js: http://nodejs.org/

npm install mongod -g

Download and build redis: http://redis.io/download

Within the Web repository, run npm install. This will install all required modules and dependencies for the Web repository.

Ensure that your environment variables are set to the proper ports and URLs defined by your mongod and redis-server instances.

###Run

mongod

redis-server

node app.js

##Routes

###iOS

####Login
Description: Log a user into the application and create a new session for the user.  
URL: http://orderatcounter.herokuapp.com/iOSLogin  
Type: POST  
#####Data Required
email  
password  
#####Example Data
{email: 'chris.amavisca@gmail.com', password: 'TestPassword'} 
#####Success Response
Status Code: 200, sessionId 

####Logout
Description: Log a user out of the application and delete the session.  
URL: http://orderatcounter.herokuapp.com/iOSLogout  
Type: POST  
#####Data Required
email  
sessionId  
#####Example Data
{email: 'chris.amavisca@gmail.com', sessionId: '548905434324'} 
#####Success Response
Status Code: 200  

####Create Order  
Description: Create a new order for the user  
URL: http://orderatcounter.herokuapp.com/iOSCreateOrder  
Type: POST  
#####Data Required
email  
sessionId  
orderNumber  
phoneNumber  
#####Example Data  
{email: 'chris.amavisca@gmail.com', sessionId: '5495340', orderNumber: '132', phoneNumber: '403-312-4324'}  
#####Success Response  
Status Code: 200 

####Fulfill Order  
Description: Fulfill an order and send the text  
URL: http://orderatcounter.herokuapp.com/iOSFulfillOrder  
Type: POST  
#####Data Required
email  
sessionId  
orderNumber  
#####Example Data  
{email: 'chris.amavisca@gmail.com', sessionId: '5495340', orderNumber: '132'}  
#####Success Response  
Status Code: 200 

####Get Orders  
Description: Get the active orders for a user   
URL: http://orderatcounter.herokuapp.com/iOSOrders  
Type: POST  
#####Data Required
email  
sessionId  
#####Example Data  
{email: 'chris.amavisca@gmail.com', sessionId: '5495340'}  
#####Success Response  
Status Code: 200 , orders


###Web

####Create Account
Description: Create a new user account with a username and password.  
URL: http://orderatcounter.herokuapp.com/createAccount  
Type: POST  
#####Data Required
email  
password  
confirmPassword  
businessName  
#####Example Data
{email: 'chris.amavisca@gmail.com, password: 'TestPassword', confirmPassword: 'TestPassword', businessName: 'My Business'}  
#####Success Response
Redirect to '/'  

####Login
Description: Log a user in with email and password  
URL: http://orderatcounter.herokuapp.com/login  
Type: POST  
#####Data Required
email  
password  
#####Example Data
{email: 'chris.amavisca@gmail.com', password: 'TestPassword'}  
#####Success Response
Redirect to '/'  

####Create Order
Description: Create a new order for a user  
URL: http://orderatcounter.herokuapp.com/createOrder  
Type: POST  
#####Data Required  
orderNumber  
phoneNumber  
#####Example Data
{orderNumber: '123', phoneNumber: '132-342-4234'}  
#####Success Response  
Status Code: 200, order

####Remove Order
Description: Remove an order for a user  
URL: http://orderatcounter.herokuapp.com/removeOrder  
Type: POST  
#####Data Required  
orderNumber  
#####Example Data  
{orderNumber: '123'}  
#####Success Response  
Status Code: 200

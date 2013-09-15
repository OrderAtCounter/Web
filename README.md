Order At The Counter
===
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
{email: 'chris.amavisca@gmail.com's, password: 'TestPassword'} 
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

###Web
####Create Account
Description: Create a new user account with a username and password.  
URL: http://orderatcounter.herokuapp.com/createAccount  
Type: POST  
#####Data Required
email  
password  
#####Example Data
{email: 'chris.amavisca@gmail.com', password: 'TestPassword'}  
#####Success Response
Status Code: 200, sessionId
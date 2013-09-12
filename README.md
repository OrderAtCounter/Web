Web
===
##Routes  

###iOS  

####Login  
Description: Log a user into the application and create a new session for the user.  
URL: 'http://orderatcounter.herokuapp.com/iOSLogin' 
Type: 'POST'  
#####Data Required  
username  
password  
#####Example Data 
{username: 'Chris', password: 'TestPassword'} 
####Success Response
Status Code: 200, sessionId 

####Logout  
Description: Log a user out of the application and delete the session.  
URL: 'http://orderatcounter.herokuapp.com/iOSLogout'  
Type: 'POST'  
#####Data Required  
username  
sessionId  
#####Example Data 
{username: 'Chris', sessionId: '548905434324'} 
####Success Response  
Status Code: 200  

###Web
####Create Account
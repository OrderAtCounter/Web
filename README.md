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

####Create Order  
Description: Create a new order for the user  
URL: http://orderatcounter.herokuapp.com/iOSCreateOrder  
Type: POST  
####Data Required
email  
sessionId  
orderNumber  
phoneNumber  
####Example Data  
{email: 'chris.amavisca@gmail.com', sessionId: '5495340', orderNumber: '132', phoneNumber: '403-312-4324'}  
####Success Response  
Status Code: 200  

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
####Data Required
email  
password  
####Example Data
{email: 'chris.amavisca@gmail.com', password: 'TestPassword'}  
####Success Response
Redirect to '/'  

####Create Order
Description: Create a new order for a user  
URL: http://orderatcounter.herokuapp.com/createOrder  
Type: POST  
####Data Required  
orderNumber  
phoneNumber  
####Example Data
{orderNumber: '123', phoneNumber: '132-342-4234'}  
####Success Response  
Status Code: 200, order

####Remove Order
Description: Remove an order for a user  
URL: http://orderatcounter.herokuapp.com/removeOrder  
Type: POST  
####Data Required  
orderNumber  
####Example Data  
{orderNumber: '123'}  
####Success Response  
Status Code: 200
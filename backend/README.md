# Findify: Backend

The findify backend is developed using `Node.js`, `Express.js` and `MongoDB`

## Features of Findify Multi-factor authentication:
- OTPs are only valid for 30 minutes
- OTPs cannot be reused
- Users are blocked for 1 hour after 5 consecutive wrong OTPs
- Minimum 1 min gap enforced between two OTP generation requests from same user

## To start the backend:
1. Create a `.env` file using `.env.example`
   - For `EMAIL_SERVICE_*` configs, refer to the nodemailer guide [here](https://nodemailer.com/usage/using-gmail/) 
2. Start the backend using the commands:
    ```
    npm i
    node index.js
    ```

References:
1. https://medium.com/@anandam00/build-a-secure-authentication-system-with-nodejs-and-mongodb-58accdeb5144
2. https://github.com/sidx8/nodejs-email-auth
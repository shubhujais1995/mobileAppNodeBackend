
const admin = require('firebase-admin');
const serviceAccount = require('../aai-food-doner-firebase-adminsdk-2z5gy-d844c3f67e.json');


const firebaseApp = async () => {

    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
          });
          console.log("firebase App initialized successfull");
    } catch (error) {
        console.log("errfirebase App Error: "+error);
        process.exit(1);
    }
   
}

module.exports = firebaseApp;
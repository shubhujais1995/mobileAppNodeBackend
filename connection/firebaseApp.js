const admin = require("firebase-admin");
const { decryptToString } = require("../security/aai-secure-file.js");

const secureFileName = "./aai-secure-service-account-sdk.json.secure";

const firebaseApp = async () => {
  try {
    const jsonStr = await decryptToString(secureFileName);
    const serviceAccount = JSON.parse(jsonStr);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("firebase App initialized successfull");
  } catch (error) {
    console.log("error firebase App Error: " + error);
    process.exit(1);
  }
};

module.exports = firebaseApp;

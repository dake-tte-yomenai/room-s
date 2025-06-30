import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig={
    apiKey:"AIzaSyDUBF8kOjoZpKT2ti_njaQUyW8fZ87Cqu8",
    authDomain:"color-user.firebaseapp.com",
    projectId:"color-user",
    storageBucket:"color-user.appspot.com",
    messagingSenderId:"506303107535",
    appId:"1:506303107535:web:38cb45ee109a61b3da02ba",
};

const app=initializeApp(firebaseConfig);
const auth=getAuth(app);

export {auth};
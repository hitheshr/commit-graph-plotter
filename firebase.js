import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAlcoadc8w_sRVYgFtEqR4Lm1LakA-PcOo",
  authDomain: "github-tools-24e1b.firebaseapp.com",
  projectId: "github-tools-24e1b",
  storageBucket: "github-tools-24e1b.appspot.com",
  messagingSenderId: "344082575135",
  appId: "1:344082575135:web:9973d6dcf7acb9e6994a2a"
};

firebase.initializeApp(firebaseConfig);

export default firebase;

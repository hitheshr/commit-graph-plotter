// import firebase from 'firebase/app';
// import 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAlcoadc8w_sRVYgFtEqR4Lm1LakA-PcOo",
  authDomain: "github-tools-24e1b.firebaseapp.com",
  projectId: "github-tools-24e1b",
  storageBucket: "github-tools-24e1b.appspot.com",
  messagingSenderId: "344082575135",
  appId: "1:344082575135:web:9973d6dcf7acb9e6994a2a"
};

// firebase.initializeApp(firebaseConfig);

// export default firebase;

// const provider = new firebase.auth.GithubAuthProvider();

// firebase.auth().signInWithPopup(provider).then((result) => {
//   // This gives you a GitHub Access Token.
//   const token = result.credential.accessToken;

//   // The signed-in user info.
//   const user = result.user;

//   // You can now use this token to make authenticated GitHub API requests.
// }).catch((error) => {
//   // Handle errors here.
// });

const app = initializeApp(firebaseConfig);
const auth = getAuth();

export {app, auth};

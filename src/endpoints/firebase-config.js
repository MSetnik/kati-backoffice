// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAGpfQDvK8Mw5DDv942EULZK8-fJPvP-dk',
  authDomain: 'kati---lovac-na-kataloge.firebaseapp.com',
  projectId: 'kati---lovac-na-kataloge',
  storageBucket: 'kati---lovac-na-kataloge.appspot.com',
  messagingSenderId: '1023141717354',
  appId: '1:1023141717354:web:1d4c7686e00120ce19f113',
  measurementId: 'G-S3J4KKE39Z'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export const storage = getStorage(app)
export const firestore = getFirestore(app)

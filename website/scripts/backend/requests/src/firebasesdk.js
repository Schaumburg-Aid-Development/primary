import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyByE1LlIzwAeoBYrW1JTPc3q8K1JvJFRak",
    authDomain: "oppenfnafw.firebaseapp.com",
    databaseURL: "https://oppenfnafw-default-rtdb.firebaseio.com",
    projectId: "oppenfnafw",
    storageBucket: "oppenfnafw.firebasestorage.app",
    messagingSenderId: "767318310403",
    appId: "1:767318310403:web:6f2846cb6252f1a085d836"
};

function initializeFirebase() {
    if (getApps().length) return getApps()[0];
    const app = initializeApp(firebaseConfig);
    globalThis.firebaseApp = app;
    return app;
}

function getDB() {
    return getDatabase(initializeFirebase());
}

const firebase = {
    init: initializeFirebase,
    getApp: () => getApps()[0] || null,
    getDB,
    config: firebaseConfig
};

export { initializeFirebase, getDB, firebase };
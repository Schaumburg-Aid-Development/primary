import { initializeFirebase, getDB } from '../../backend/requests/src/firebasesdk.js';
import { pushMessage } from './globalmessage.module.js';
import { ref, push, onChildAdded, set, limitToLast, query, remove } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js';

const BROADCAST_PATH = 'broadcasts';
const seenRemoteIds = new Set();
let listenerAttached = false;

async function attachListener() {
    if (listenerAttached) return;
    listenerAttached = true;

    initializeFirebase();
    const db = getDB();
    const broadcastRef = ref(db, BROADCAST_PATH);
    const recentRef = query(broadcastRef, limitToLast(20));

    onChildAdded(recentRef, (snapshot) => {
        const data = snapshot.val();
        if (!data || seenRemoteIds.has(snapshot.key)) return;

        const age = Date.now() - (data.sentAt || 0);
        if (age >= (data.duration ?? 5000)) return;

        seenRemoteIds.add(snapshot.key);
        pushMessage(data.username || null, data.text, {
            type: data.type,
            usernameColor: data.usernameColor,
            duration: data.duration
        });
    });
}

async function broadcastMessage(usernameOrText, textOrOptions, maybeOptions) {
    let username = null, text, options = {};

    if (typeof textOrOptions === 'string') {
        username = usernameOrText;
        text = textOrOptions;
        options = maybeOptions || {};
    } else {
        text = usernameOrText;
        options = textOrOptions || {};
    }

    if (!text) throw new Error('Missing message text');

    initializeFirebase();
    const db = getDB();
    const broadcastRef = ref(db, BROADCAST_PATH);
    const newRef = push(broadcastRef);
    const duration = options.duration ?? 5000;

    seenRemoteIds.add(newRef.key);

    await set(newRef, {
        username,
        text,
        type: options.type || 'default',
        usernameColor: options.usernameColor || null,
        duration,
        sentAt: Date.now()
    });

    setTimeout(() => remove(newRef), duration);

    return pushMessage(username, text, options);
}

globalThis.broadcastMessage = broadcastMessage;
attachListener();
export { broadcastMessage, attachListener };
console.log("[Session Module] Loaded")
import { UID } from '../../account/account.module.js';
import { getAccountByUID } from '../../account/storage/accountdata.module.js';

const KEY = 'sa_session';

function read() {
	try {
		const raw = sessionStorage.getItem(KEY);
		return raw ? JSON.parse(raw) : null;
	} catch (e) {
		return null;
	}
}

function write(obj) {
	sessionStorage.setItem(KEY, JSON.stringify(obj));
}

function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function createSessionForCurrentUser() {
	let uid = UID();

	if (!uid) {
		/* auth whatever it is soo annyoing*/
		await wait(300);
		uid = UID();
	}

	if (!uid) throw new Error('No signed in user');
	const acc = await getAccountByUID(uid);
	const session = { uid, email: acc ? acc.email : null, username: acc ? acc.username : null, startedAt: Date.now(), actions: [] };
	write(session);
	console.log('session_started');
	return session;
}

async function createSession(uid) {
	if (!uid) throw new Error('Missing uid');
	const acc = await getAccountByUID(uid);
	const session = { uid, email: acc ? acc.email : null, username: acc ? acc.username : null, startedAt: Date.now(), actions: [] };
	write(session);
	console.log('session_started');
	return session;
}

function endSession() {
	sessionStorage.removeItem(KEY);
	console.log('session_ended');
	return true;
}

function getSession() {
	const s = read();
	console.log(s || null);
	return s || null;
}

function isAuthenticated() {
	return !!read();
}

function performAction(name, payload = null) {
	const s = read();
	if (!s) throw new Error('No active session');
	s.actions = s.actions || [];
	s.actions.push({ name, payload, at: Date.now() });
	write(s);
	console.log('action_saved');
	return true;
}

function getActions() {
	const s = read();
	return (s && s.actions) ? s.actions : [];
}

globalThis.createSessionForCurrentUser = createSessionForCurrentUser;
globalThis.createSession = createSession;
globalThis.endSession = endSession;
globalThis.getSession = getSession;
globalThis.isAuthenticated = isAuthenticated;
globalThis.performAction = performAction;
globalThis.getActions = getActions;

export { createSessionForCurrentUser, createSession, endSession, getSession, isAuthenticated, performAction, getActions };
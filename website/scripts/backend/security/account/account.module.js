console.log("[Account Module]: Loaded")
import { initializeFirebase, firebase } from '../../requests/src/firebasesdk.js';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { createAccount as createAccountFromCreation } from './creation/creation.module.js';
import { getAccountByUID, findAccountByEmail, findAccountByUsername, accountdata as storageAccountData, disableAccount, createAccountData } from './storage/accountdata.module.js';
import { deletion as deletionLoader } from './creation/load/deletion.js';

function ensureAuth() {
	const app = initializeFirebase();
	return getAuth(app);
}

const createAccount = createAccountFromCreation;

async function signIn(email, password) {
	const auth = ensureAuth();
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const uid = userCredential.user && userCredential.user.uid;
		const account = await getAccountByUID(uid);
		if (account && account.disabled) {
			await signOut(auth);
			console.log('Account disabled');
			const err = new Error('Account disabled');
			err.code = 'account/disabled';
			throw err;
		}
		console.log('sign in');
		console.log('[Account Module]: Signed in as', {
			uid,
			email: userCredential.user && userCredential.user.email,
			username: account ? account.username : null
		});
		return userCredential;
	} catch (err) {
		if (err && (err.code === 'auth/wrong-password' || (err.message && err.message.toLowerCase().includes('wrong-password')))) {
			console.log('Incorrect Password');
		} else {
			console.log(err.code || err.message || err);
		}
		throw err;
	}
}

async function signInWithGoogle() {
	const auth = ensureAuth();
	const provider = new GoogleAuthProvider();
	try {
		const userCredential = await signInWithPopup(auth, provider);
		const uid = userCredential.user && userCredential.user.uid;
		const email = userCredential.user && userCredential.user.email;
		const displayName = userCredential.user && userCredential.user.displayName;
		let account = await getAccountByUID(uid);

		/* New Google sign-in with no existing account record.
		   signup() (and createAccount, which wraps it) calls
		   createUserWithEmailAndPassword internally — that's for creating a
		   brand-new Firebase Auth user from a password, which is the wrong
		   operation here: Google sign-in already created the Auth user via
		   signInWithPopup. Passing a null password into that path was the
		   actual cause of the earlier "missing password" error, since
		   Firebase Auth itself requires a real password string, not
		   anything in this app's own code.
		   The correct fix is to skip signup()/createAccount() entirely and
		   write the Firestore-side record directly with createAccountData,
		   using the Google display name as the username per request. */
		if (!account) {
			try {
				const suggestedUsername = displayName || (email ? email.split('@')[0] : null);
				await createAccountData(uid, email, suggestedUsername);
				account = await getAccountByUID(uid);
			} catch (creationErr) {
				console.log('[Account Module]: Failed to auto-create account for Google sign-in', creationErr);
			}
		}

		if (account && account.disabled) {
			await signOut(auth);
			console.log('Account disabled');
			const err = new Error('Account disabled');
			err.code = 'account/disabled';
			throw err;
		}

		console.log('sign in with google');
		console.log('[Account Module]: Signed in as', {
			uid,
			email,
			username: account ? account.username : displayName
		});
		return userCredential;
	} catch (err) {
		if (err && err.code === 'auth/popup-closed-by-user') {
			console.log('Google sign-in popup closed');
		} else if (err && err.code === 'auth/account-exists-with-different-credential') {
			console.log('Account exists with different credential');
		} else {
			console.log(err.code || err.message || err);
		}
		throw err;
	}
}

async function logOut() {
	const auth = ensureAuth();
	try {
		await signOut(auth);
		console.log('[Account Module]: Signed out');
		return true;
	} catch (err) {
		console.log(err.code || err.message || err);
		throw err;
	}
}

function UID() {
	const app = firebase.getApp() || initializeFirebase();
	const auth = getAuth(app);
	const user = auth.currentUser;
	console.log(user ? user.uid : null);
	return user ? user.uid : null;
}

async function accountdata(identifier) {
	if (typeof identifier !== 'string') return null;
	const isEmail = identifier.includes('@');
	if (isEmail) {
		const found = await findAccountByEmail(identifier);
		const data = found ? found.data : null;
		console.log(data);
		return data;
	} else {
		const found = await findAccountByUsername(identifier);
		const data = found ? found.data : null;
		console.log(data);
		return data;
	}
}

async function disableaccount(email) {
	const result = await disableAccount(email);
	const auth = ensureAuth();
	const user = auth.currentUser;
	if (user && user.email === email) await signOut(auth);
	console.log('disabled');
	return result;
}

async function deleteaccount(email) {
	const result = await deletionLoader(email);
	const auth = ensureAuth();
	const user = auth.currentUser;
	if (user && user.email === email) {
		try { await user.delete(); } catch (e) {}
		console.log('deleted');
		return result;
	}
	console.log('deleted (firestore only)');
	return result;
}

globalThis.createAccount = createAccount;
globalThis.signIn = signIn;
globalThis.signInWithGoogle = signInWithGoogle;
globalThis.logOut = logOut;
globalThis.UID = UID;
globalThis.accountdata = accountdata;
globalThis.disableaccount = disableaccount;
globalThis.deleteaccount = deleteaccount;

export { createAccount, signIn, signInWithGoogle, logOut, UID, accountdata, disableaccount, deleteaccount };
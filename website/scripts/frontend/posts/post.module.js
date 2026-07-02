console.log('[Post Module]: Loaded');
import { initializeFirebase, firebase } from '../../backend/requests/src/firebasesdk.js';
import { getFirestore, collection, addDoc, query, where, orderBy, limit, getDocs, getDoc, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { getAccountByUID } from '../../backend/security/account/storage/accountdata.module.js';

const POSTS_COLLECTION = 'posts';

function getDB() {
	const app = initializeFirebase();
	return getFirestore(app);
}

async function createPost({ title, description, category, type }) {
	if (!title || !title.trim()) throw new Error('post/missing-title');
	if (!description || !description.trim()) throw new Error('post/missing-description');
	if (!type || !['request', 'offer'].includes(type)) throw new Error('post/invalid-type');

	const session = (typeof getSession === 'function') ? getSession() : null;
	if (!session || !session.uid) throw new Error('post/not-signed-in');

	let account = null;
	try {
		account = await getAccountByUID(session.uid);
	} catch (e) {
		console.log('[Post Module]: Could not fetch account data', e);
	}

	const post = {
		uid: session.uid,
		username: session.username || (session.email ? session.email.split('@')[0] : 'User'),
		role: account ? (account.role || null) : null,
		type,
		title: title.trim(),
		description: description.trim(),
		category: category || 'general',
		createdAt: new Date()
	};

	const db = getDB();
	const postsRef = collection(db, POSTS_COLLECTION);
	const docRef = await addDoc(postsRef, post);

	console.log('[Post Module]: Post created', docRef.id);
	return { id: docRef.id, ...post };
}

async function getPosts({ type = null, category = null, limit: limitNum = 20 } = {}) {
	const db = getDB();
	const constraints = [orderBy('createdAt', 'desc'), limit(limitNum)];

	const postsQuery = query(
		collection(db, POSTS_COLLECTION),
		...constraints
	);

	const snapshot = await getDocs(postsQuery);
	const posts = [];

	snapshot.forEach(docSnap => {
		const data = docSnap.data();
		if (type && data.type !== type) return;
		if (category && category !== 'all' && data.category !== category) return;
		posts.push({ id: docSnap.id, ...data });
	});

	return posts;
}

async function getPostById(id) {
	if (!id) throw new Error('post/missing-id');
	const db = getDB();
	const docSnap = await getDoc(doc(db, POSTS_COLLECTION, id));
	if (!docSnap.exists()) return null;
	return { id: docSnap.id, ...docSnap.data() };
}

async function deletePost(id) {
	if (!id) throw new Error('post/missing-id');
	const session = (typeof getSession === 'function') ? getSession() : null;
	if (!session || !session.uid) throw new Error('post/not-signed-in');

	const post = await getPostById(id);
	if (!post) throw new Error('post/not-found');
	if (post.uid !== session.uid) throw new Error('post/not-owner');

	const db = getDB();
	await deleteDoc(doc(db, POSTS_COLLECTION, id));
	console.log('[Post Module]: Post deleted', id);
	return true;
}

globalThis.createPost = createPost;
globalThis.getPosts = getPosts;
globalThis.getPostById = getPostById;
globalThis.deletePost = deletePost;

export { createPost, getPosts, getPostById, deletePost };
/* Imports */
/* none required: pure frontend UI module */

/* state */
const active = new Map();
let containerEl = null;
let listenerHook = null;
let nextId = 0;

const KNOWN_TYPES = ['default', 'notification', 'error', 'success', 'debug', 'important'];

function ensureContainer() {
    if (containerEl) return containerEl;
    containerEl = document.createElement('div');
    containerEl.id = 'global-message-root';
    containerEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(containerEl);
    return containerEl;
}

function removeMessage(id) {
    const entry = active.get(id);
    if (!entry) return;

    clearTimeout(entry.timer);
    entry.el.classList.remove('gm-visible');
    active.delete(id);

    setTimeout(() => entry.el.remove(), 240);
}

function pushMessage(username, text, options = {}) {
    if (!text) throw new Error('Missing message text');

    const id = nextId++;
    const duration = options.duration ?? 5000;
    const requestedType = (options.type || 'default').toLowerCase();
    const type = KNOWN_TYPES.includes(requestedType) ? requestedType : 'default';
    const root = ensureContainer();

    const el = document.createElement('div');
    el.className = 'gm-banner';

    if (username) {
        const userEl = document.createElement('span');
        userEl.className = 'gm-username';
        userEl.textContent = username;
        if (options.usernameColor) {
            userEl.style.color = options.usernameColor;
        }
        el.appendChild(userEl);

        const sepEl = document.createElement('span');
        sepEl.className = 'gm-sep';
        sepEl.textContent = ':';
        el.appendChild(sepEl);
    }

    const textEl = document.createElement('span');
    textEl.className = `gm-text gm-type-${type}`;
    textEl.textContent = text;
    el.appendChild(textEl);

    root.appendChild(el);

    requestAnimationFrame(() => el.classList.add('gm-visible'));

    const timer = setTimeout(() => removeMessage(id), duration);
    active.set(id, { el, timer });

    const entry = { id, username: username || null, text, type };
    if (typeof listenerHook === 'function') {
        listenerHook(entry);
    }

    return entry;
}

function notify(usernameOrText, textOrOptions, maybeOptions) {
    if (typeof textOrOptions === 'string') {
        return pushMessage(usernameOrText, textOrOptions, maybeOptions);
    }
    return pushMessage(null, usernameOrText, textOrOptions);
}

function clearAll() {
    for (const id of [...active.keys()]) {
        removeMessage(id);
    }
}

function onMessage(callback) {
    listenerHook = callback;
}

/* global */
globalThis.pushMessage = pushMessage;
globalThis.notify = notify;
globalThis.clearAll = clearAll;

export { pushMessage, notify, clearAll, onMessage };
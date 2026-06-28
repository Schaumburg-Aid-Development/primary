import { pushMessage, notify, clearAll, onMessage } from '../../../frontend/ui/globalmessage.module.js';
import { broadcastMessage, attachListener } from '../../../frontend/ui/globalmessage-sync.module.js';
import { createAccount, signIn, UID, accountdata, disableaccount, deleteaccount } from '../../security/account/account.module.js';
import { setrole, setlevel } from '../../security/roles/roles.module.js';
import { createSessionForCurrentUser, createSession, endSession, getSession, isAuthenticated, performAction, getActions } from '../../security/prevention/session/session.module.js';
import { accessDenied } from '../../security/prevention/access/accessdenied.js';
import { initOnboarding } from '../../../frontend/onboarding/onboarding.module.js';

const primaryCss = new URL('../../../../styles/theme/primary.css', import.meta.url).href;

function loadPrimaryCss() {
  if (typeof document === 'undefined') return null;
  let link = document.querySelector(`link[href="${primaryCss}"]`);
  if (!link) {
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = primaryCss;
    document.head.appendChild(link);
  }
  return link;
}

const globalApi = {
  pushMessage,
  notify,
  clearAll,
  onMessage,
  broadcastMessage,
  attachListener,
  accessDenied,
  createAccount,
  signIn,
  UID,
  accountdata,
  disableaccount,
  deleteaccount,
  setrole,
  setlevel,
  createSessionForCurrentUser,
  createSession,
  endSession,
  getSession,
  isAuthenticated,
  performAction,
  getActions,
  onboarding: initOnboarding || null,
  OnboardingModule: { initOnboarding },
  primaryCss,
  loadPrimaryCss
};

Object.assign(globalThis, globalApi);
globalThis.primaryCss = primaryCss;
globalThis.PrimaryCSS = primaryCss;
globalThis.loadPrimaryCss = loadPrimaryCss;
globalThis.GlobalMessageModule = globalApi;
globalThis.GlobalMessages = globalApi;

export {
  pushMessage,
  notify,
  clearAll,
  onMessage,
  broadcastMessage,
  attachListener,
  accessDenied,
  createAccount,
  signIn,
  UID,
  accountdata,
  disableaccount,
  deleteaccount,
  setrole,
  setlevel,
  createSessionForCurrentUser,
  createSession,
  endSession,
  getSession,
  isAuthenticated,
  performAction,
  getActions
};

export default globalApi;

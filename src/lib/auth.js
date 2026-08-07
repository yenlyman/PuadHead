import {
  EmailAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  linkWithCredential,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth'
import { auth } from './firebase'

const provider = new GoogleAuthProvider()

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
}

// Mobile browsers (in or out of standalone mode) block or otherwise mishandle
// window.open()-based OAuth popups far more often than desktop — redirect is the
// standard, reliable path there. Desktop browser tabs use signInWithPopup instead,
// since redirect depends on Firebase relaying auth state from `authDomain`
// (puadheadd.firebaseapp.com) back to the app's own origin (puadheadd.web.app, a
// different eTLD+1) via storage some desktop browser extensions block, which is what
// caused the original silent-failure bug on desktop Chrome.
function isMobile() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(window.navigator.userAgent)
}

export function signInWithGoogle() {
  return isMobile() || isStandalone() ? signInWithRedirect(auth, provider) : signInWithPopup(auth, provider)
}

// Firebase does NOT merge accounts just because two providers share an email address —
// signing in with Google when that email already has a password account (or vice versa)
// fails with 'auth/account-exists-with-different-credential' by default. We capture the
// Google credential from that error and silently link it the next time the same email
// signs in successfully with a password, so the user ends up on ONE account either way
// instead of two disconnected ones with split data. Call this from every place a Google
// sign-in error surfaces (popup rejects directly; redirect surfaces via getRedirectResult).
let pendingGoogleCredential = null

export function captureLinkableCredential(err) {
  if (err.code === 'auth/account-exists-with-different-credential') {
    pendingGoogleCredential = GoogleAuthProvider.credentialFromError(err)
    return true
  }
  return false
}

async function linkPendingGoogleCredential(user) {
  if (!pendingGoogleCredential) return
  const credential = pendingGoogleCredential
  pendingGoogleCredential = null
  await linkWithCredential(user, credential)
}

// Email+password path — a second sign-in option alongside Google, added because it's
// a plain SDK call with no popup/redirect/third-party-domain relay involved, so it
// works identically on every browser and device. Produces a real request.auth.uid
// same as Google does, so firestore.rules needs no changes to cover it.
export function signUpWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export async function signInWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  await linkPendingGoogleCredential(result.user)
  return result
}

// Reverse direction — already signed in with Google, add a password to the SAME
// account so it's also reachable by email/password from any device. Must be called
// while signed in (e.g. from Settings), not from the login screen.
export function linkPasswordToCurrentUser(email, password) {
  if (!auth.currentUser) return Promise.reject(new Error('not signed in'))
  return linkWithCredential(auth.currentUser, EmailAuthProvider.credential(email, password))
}

export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email)
}

export function signOutUser() {
  return signOut(auth)
}

export function subscribeAuthState(callback) {
  return onAuthStateChanged(auth, callback)
}

// Resolves the pending redirect on the load right after signInWithRedirect sends the
// user back. Left uncaught here on purpose — useAuthStore surfaces failures (e.g. the
// signed-in Google account isn't on the OAuth consent screen's test-user list yet) to
// the LoginPage instead of failing silently.
export function resolveRedirectResult() {
  return getRedirectResult(auth)
}

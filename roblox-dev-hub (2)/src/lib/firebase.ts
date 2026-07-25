import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  increment,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { Asset, Comment, UserProfile } from '../types';
import { SAMPLE_ASSETS } from '../data/sampleAssets';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfigJson) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Database initialization with designated database ID
export const db = getFirestore(app, firebaseConfigJson.firestoreDatabaseId || undefined);

/**
 * Fetch all assets from Firestore or seed if empty.
 */
export async function getAssetsFromFirestore(): Promise<Asset[]> {
  try {
    const assetsRef = collection(db, 'assets');
    const snapshot = await getDocs(assetsRef);

    if (snapshot.empty) {
      return [];
    }

    const assets: Asset[] = [];
    snapshot.forEach((docSnap) => {
      assets.push({ id: docSnap.id, ...(docSnap.data() as Omit<Asset, 'id'>) });
    });

    return assets;
  } catch (err) {
    console.warn('Error fetching Firestore assets:', err);
    return [];
  }
}

/**
 * Seeds initial demo assets to Firestore.
 */
export async function seedAssetsToFirestore() {
  try {
    for (const asset of SAMPLE_ASSETS) {
      const assetRef = doc(db, 'assets', asset.id);
      await setDoc(assetRef, asset, { merge: true });
    }
    console.log('Successfully seeded demo assets to Firestore.');
  } catch (err) {
    console.error('Error seeding assets to Firestore:', err);
  }
}

/**
 * Add a new asset to Firestore.
 */
export async function addAssetToFirestore(assetData: Omit<Asset, 'id'>): Promise<Asset> {
  try {
    const assetsRef = collection(db, 'assets');
    const docRef = await addDoc(assetsRef, assetData);
    return { id: docRef.id, ...assetData };
  } catch (err) {
    console.error('Error adding asset to Firestore:', err);
    const mockId = 'asset-' + Date.now();
    return { id: mockId, ...assetData };
  }
}

/**
 * Increment downloads count for an asset.
 */
export async function incrementAssetDownloads(assetId: string) {
  try {
    const assetRef = doc(db, 'assets', assetId);
    await updateDoc(assetRef, {
      downloads: increment(1),
    });
  } catch (err) {
    console.warn('Could not update downloads in Firestore:', err);
  }
}

/**
 * Fetch comments for a specific asset.
 */
export async function getCommentsFromFirestore(assetID: string): Promise<Comment[]> {
  try {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('assetID', '==', assetID));
    const snapshot = await getDocs(q);

    const comments: Comment[] = [];
    snapshot.forEach((docSnap) => {
      comments.push({ id: docSnap.id, ...(docSnap.data() as Omit<Comment, 'id'>) });
    });

    return comments.length > 0 ? comments : getDefaultComments(assetID);
  } catch (err) {
    return getDefaultComments(assetID);
  }
}

/**
 * Add a comment to Firestore.
 */
export async function addCommentToFirestore(commentData: Omit<Comment, 'id'>): Promise<Comment> {
  try {
    const commentsRef = collection(db, 'comments');
    const docRef = await addDoc(commentsRef, commentData);
    return { id: docRef.id, ...commentData };
  } catch (err) {
    const mockId = 'comment-' + Date.now();
    return { id: mockId, ...commentData };
  }
}

function getDefaultComments(assetID: string): Comment[] {
  return [
    {
      id: 'c-1',
      assetID,
      userId: 'u-1',
      username: 'BloxDev_Sam',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      message: 'Extremely clean code structure! Dragged into Roblox Studio Explorer and ran smoothly without errors.',
      rating: 5,
      date: '2026-06-10',
    },
    {
      id: 'c-2',
      assetID,
      userId: 'u-2',
      username: 'StudioCrafter',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      message: 'Awesome model! The UI transitions are smooth and the setup instructions were super easy to follow.',
      rating: 5,
      date: '2026-06-18',
    },
  ];
}

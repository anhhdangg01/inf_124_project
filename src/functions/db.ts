import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { arrayUnion } from 'firebase/firestore';

const db = getFirestore();

export const saveLikedMovie = async (movieId: string) => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const userRef = doc(db, 'Users', userId);
    
    // Use arrayUnion to add the movieId to the likedMovies array
    await updateDoc(userRef, {
      likedMovies: arrayUnion(movieId)
    });
    
    return true;
  } catch (error) {
    console.error('Error saving liked movie:', error);
    throw error;
  }
};

export const getLikedMovies = async (userId: string) => {
  try {
    const userRef = doc(db, 'Users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return [];
    }
    
    const userData = userDoc.data();
    return userData.likedMovies || [];
  } catch (error) {
    console.error('Error getting liked movies:', error);
    throw error;
  }
};



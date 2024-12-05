The solution involves using Promises or async/await to ensure the asynchronous operation completes before the listener potentially fires again.  We can use a flag or state variable to manage the asynchronous operation's status.

```javascript
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore();

let isFetchingUserData = false; // Flag to track asynchronous operation

onAuthStateChanged(auth, async (user) => {
  if (user && !isFetchingUserData) {
    isFetchingUserData = true; // Set flag before starting asynchronous task
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log('User data:', docSnap.data());
        // Process user data
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      isFetchingUserData = false; // Reset flag after operation completes
    }
  }
});
```
This approach ensures that the `onAuthStateChanged` listener waits for the asynchronous operation to finish before potentially triggering again, preventing the race condition and guaranteeing accurate data processing.
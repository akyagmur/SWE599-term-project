import * as TaskManager from 'expo-task-manager';
import { collection, addDoc, setDoc, serverTimestamp, doc, updateDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { FIRESTORE_DB } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

// Define the task name
const LOCATION_TASK_NAME = 'background-location-task';

// Define the task function
const saveUserLocationTask = async ({ data, error }) => {
    if (error) {
        console.error('Error in saveUserLocationTask:', error);
        return;
    }

    if (data) {
        const { latitude, longitude } = data.locations[0].coords;

        try {
            // Save the user's location to Firestore
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                console.error('User not logged in');
                return;
            }
            const locationRef = collection(FIRESTORE_DB, 'users', user.uid, 'locations');

            // get latest location from locations collection

            const q = query(
                collection(FIRESTORE_DB, 'users', user.uid, 'locations'),
                orderBy('timestamp', 'desc'),
                limit(1)
            );

            const latestLocationSnapshot = await getDocs(q);
            if (!latestLocationSnapshot.empty) {
                const latestLocationDoc = latestLocationSnapshot.docs[0];
                const latestLocationData = latestLocationDoc.data();
                const latestLocation = latestLocationData
                
                
                const latestLocationDate = latestLocation.timestamp.seconds * 1000;
                const currentTimestamp = new Date().getTime();
                const oneHour = 60 * 1000; // 1 hour in milliseconds
                const diff = currentTimestamp - latestLocationDate;
                console.log('diff', diff)
                if (diff > oneHour) {
                    console.log('one minute has passed since last location update, saving new location')
                    await addDoc(locationRef, {
                        latitude,
                        longitude,
                        timestamp: serverTimestamp(),
                    });
                    console.info('Latitude:', latitude, 'Longitude:', longitude);

                    const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
                    await updateDoc(userDoc, {
                        lastLocation: {
                            latitude,
                            longitude,
                            timestamp: serverTimestamp(),
                        },
                    }, { merge: true })
                }
            } else {
                await addDoc(locationRef, {
                    latitude,
                    longitude,
                    timestamp: serverTimestamp(),
                });
                console.info('Latitude:', latitude, 'Longitude:', longitude);

                const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
                await updateDoc(userDoc, {
                    lastLocation: {
                        latitude,
                        longitude,
                        timestamp: serverTimestamp(),
                    },
                }, { merge: true })
            }

        } catch (error) {
            console.error('Error saving user location:', error);
        }
    }
};
TaskManager.defineTask(LOCATION_TASK_NAME, saveUserLocationTask);
export default saveUserLocationTask;
/* const registerBackgroundFetchAsync = async () => {
    return await BackgroundFetch.registerTaskAsync(LOCATION_TASK_NAME, {
        minimumInterval: 60 * 1, // 1 hour
        stopOnTerminate: false,
        startOnBoot: true,
    });
}; */


// Register the task

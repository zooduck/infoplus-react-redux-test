import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore/lite';

import { query, orderBy, startAfter, limit, getCount } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyDftPrZHlyGS_8D6FLhmyyEtbCNEEauB8I",
  authDomain: "infoplus-test.firebaseapp.com",
  projectId: "infoplus-test",
  storageBucket: "infoplus-test.appspot.com",
  messagingSenderId: "614868271667",
  appId: "1:614868271667:web:7234ad6689cf1bbe489946"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const animalCollection = collection(db, 'animal');

let lastVisibleDocument: any;

export async function getTotalNumberOfAnimalsInDatabase() {
  const documentCountSnapshot = await getCount(animalCollection);
  const totalNumberOfAnimalsInDatabase = documentCountSnapshot.data().count;

  return totalNumberOfAnimalsInDatabase;
}

export async function deleteAnimalFromDatabase(docID: string) {
  await deleteDoc(doc(db, 'animal', docID));
}

export async function getAnimalsFromDBWithPagination({ reset = false } = {}) {
  let paginatedQuery;

  const documentCountSnapshot = await getCount(animalCollection);
  const totalNumberOfAnimalsInDatabase = documentCountSnapshot.data().count;

  if (lastVisibleDocument !== undefined && !reset) {
    paginatedQuery = query(animalCollection, orderBy('name'), startAfter(lastVisibleDocument), limit(4));
  } else {
    paginatedQuery = query(animalCollection, orderBy('name'), limit(4));
  }

  const documentSnapshots = await getDocs(paginatedQuery);
  const animals = documentSnapshots.docs.map((doc) => {
    const { id, name, type, description, image_url, selected } = doc.data();

    return {
      docID: doc.id,
      id: id,
      name: name,
      type: type,
      description: description,
      image_url: image_url,
      selected: selected
    };
  });

  if (animals.length) {
    lastVisibleDocument = documentSnapshots.docs[documentSnapshots.docs.length - 1];
  }

  return animals;

  // return {
  //   animals: animals,
  //   totalNumberOfAnimalsInDatabase: totalNumberOfAnimalsInDatabase
  // };
}

export { animalCollection, addDoc, getDocs, db };

// export async function getAnimalsFromDB() {
//   const animalSnapshot = await getDocs(animalCollection);
//   const animals = animalSnapshot.docs.map((doc) => {
//     return doc.data();
//   });

//   return animals;
// }
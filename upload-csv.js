const admin = require('firebase-admin');
const csv = require('csvtojson');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function importContestants() {
  try {
    // Convert CSV to JSON array
    const contestantsArray = await csv().fromFile('contestants.csv');
    
    console.log(`📊 Found ${contestantsArray.length} contestants in CSV`);
    
    // Show first record for verification
    if (contestantsArray.length > 0) {
      console.log('📋 First contestant data:', JSON.stringify(contestantsArray[0], null, 2));
    }

    const batch = db.batch();
    let batchCount = 0;
    const BATCH_LIMIT = 500; // Firestore batch limit

    for (const contestant of contestantsArray) {
      const docRef = db.collection('contestants').doc();
      
      // Clean and prepare data
      const contestantData = {
        ...contestant,
        // Convert numeric fields if they exist
        votes: contestant.votes ? Number(contestant.votes) : 0,
        age: contestant.age ? Number(contestant.age) : null,
        score: contestant.score ? Number(contestant.score) : 0,
        // Add timestamp
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      batch.set(docRef, contestantData);
      batchCount++;

      // Commit batch if we reach the limit
      if (batchCount >= BATCH_LIMIT) {
        console.log(`🔄 Committing batch of ${batchCount} contestants...`);
        await batch.commit();
        batchCount = 0;
      }
    }

    // Commit any remaining documents
    if (batchCount > 0) {
      console.log(`🔄 Committing final batch of ${batchCount} contestants...`);
      await batch.commit();
    }

    console.log(`🎉 Successfully imported ${contestantsArray.length} contestants to Firestore!`);

  } catch (error) {
    console.error('❌ Error importing contestants:', error);
  }
}

importContestants();
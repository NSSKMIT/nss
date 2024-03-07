// netlify/functions/uploadEvent.js
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

exports.handler = async function (event, context) {
    try {
        // Initialize Firebase Admin SDK
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                databaseURL: "YOUR_DATABASE_URL",
            });
        }

        // Access form data using event.body
        const formData = JSON.parse(event.body);

        // Example: Log the form data
        console.log('Received form data:', formData);

        // Store the event data in Firestore
        const db = admin.firestore();
        const eventsCollection = db.collection("events");

        const newEvent = {
            eventNumber: formData.eventNumber,
            eventDescription: formData.eventDescription,
            eventDate: formData.eventDate,
            facultyCount: formData.facultyCount,
            studentCount: formData.studentCount,
            // Add other fields as needed
        };

        const docRef = await eventsCollection.add(newEvent);

        // Example: Respond with a success message
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Event uploaded successfully.',
                eventId: docRef.id,
            }),
        };
    } catch (error) {
        console.error('Error uploading event:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error.' }),
        };
    }
};

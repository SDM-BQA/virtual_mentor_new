require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGO_URI;

async function populateDatabase() {
  let client;

  try {
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in .env file.');
    }

    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db();

    const hashedPassword = await bcrypt.hash('123456', 10);

    // Random Name Generation
    const firstNames = ['Aarav', 'Aditi', 'Aryan', 'Ananya', 'Ishaan', 'Diya', 'Rohan', 'Siya', 'Veer', 'Neha', 'Kabir', 'Aisha', 'Vivaan', 'Priya', 'Arjun', 'Riya', 'Advik', 'Tanvi', 'Reyansh', 'Shruti'];
    const lastNames = ['Sharma', 'Kumar', 'Singh', 'Patel', 'Joshi', 'Choudhary', 'Verma', 'Gupta', 'Khan', 'Reddy', 'Menon', 'Das', 'Roy', 'Mehta', 'Nair', 'Pillai', 'Yadav', 'Shah', 'Rao', 'Dubey'];

    // Mentor Data (Indian Context)
    const mentors = [];
    const mentorFields = ['Painting', 'Dancing', 'Singing', 'Sculpting', 'Theatre', 'Photography', 'Writing', 'Music Composition', 'Graphic Design', 'Film Making'];
    const indianStates = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Uttar Pradesh', 'Rajasthan', 'Kerala', 'Gujarat', 'Punjab', 'West Bengal'];
    const indianCities = ['Mumbai', 'Bengaluru', 'Chennai', 'New Delhi', 'Lucknow', 'Jaipur', 'Kochi', 'Ahmedabad', 'Chandigarh', 'Kolkata'];
    const awardsTypes = ['National Award', 'State Excellence Award', 'Critics Choice Award', 'People\'s Choice Award', 'Young Artist Award'];

    for (let i = 1; i <= 20; i++) {
      const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

      mentors.push({
        firstName: randomFirstName,
        lastName: randomLastName,
        email: `mentor${i}@example.com`,
        mobile: `91${987654320 + i.toString().padStart(2, '0')}`,
        gender: i % 2 === 0 ? 'Female' : 'Male',
        dob: new Date(`198${7 + (i % 8)}-0${(i % 9) + 1}-${i % 28 + 1}`),
        country: 'India',
        state: indianStates[i % indianStates.length],
        city: indianCities[i % indianCities.length],
        password: hashedPassword,
        mentorIn: mentorFields[i % mentorFields.length],
        experience: 5 + (i % 15),
        awards: i % 3 === 0 ? [awardsTypes[i % awardsTypes.length], awardsTypes[(i+1) % awardsTypes.length]] : [],
        instagram: `mentor${i}_insta`,
        linkedin: `mentor${i}_linkedin`,
        twitter: `mentor${i}_twitter`,
        facebook: `mentor${i}_facebook`,
        videoLink: `https://example.com/mentor${i}_video`,
        profilePicture: `uploads/img${i}.jpg`,
        bio: `Experienced mentor in ${mentorFields[i % mentorFields.length]}.`,
      });
    }

    // Mentee Data (Indian Context)
    const mentees = [];
    for (let i = 1; i <= 20; i++) {
      const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

      mentees.push({
        fname: randomFirstName,
        lname: randomLastName,
        email: `mentee${i}@example.com`,
        mobile: `91${876543210 + i.toString().padStart(2, '0')}`,
        gender: i % 2 === 0 ? 'Male' : 'Female',
        dob: new Date(`200${1 + (i % 8)}-0${(i % 9) + 1}-${i % 28 + 1}`),
        password: hashedPassword,
        country: 'India',
        state: indianStates[i % indianStates.length],
        city: indianCities[i % indianCities.length],
        profilePicture: `uploads/img${i}.jpg`,
      });
    }

    // Insert Mentors
    const mentorCollection = db.collection('mentors');
    await mentorCollection.insertMany(mentors);
    console.log('Mentors populated successfully.');

    // Insert Mentees
    const menteeCollection = db.collection('mentees');
    await menteeCollection.insertMany(mentees);
    console.log('Mentees populated successfully.');
  } catch (err) {
    console.error('Error populating database:', err);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

populateDatabase();

// require('dotenv').config();
// const mongoose = require('mongoose');
// const mentors = require('./models/Mentee'); // Replace with your model path

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(async () => {
//     console.log('Connected to MongoDB');
//     const result = await mentors.deleteMany({});
//     console.log(`${result.deletedCount} documents deleted.`);
//     mongoose.disconnect();
//   })
//   .catch((err) => {
//     console.error('Error clearing collection:', err);
//   });
/* eslint-disable */
const fetch = require('node-fetch');

const body = {
  fullName: 'Test Duplicate',
  email: 'banamalikanhar9@gmail.com',
  mobileNumber: '8260672009',
  age: 25,
  occupation: 'Student',
  cityDistrict: 'Test City',
  state: 'Test State',
  preferredAreas: ['Education'],
  availability: 'Weekends',
  motivation: 'Testing the duplicate handling mechanism',
  consent: true
};

async function test() {
  const res = await fetch('http://localhost:3001/api/volunteer-application', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Body:', text);
}

test();

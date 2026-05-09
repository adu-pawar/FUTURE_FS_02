
async function test() {
  try {
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Note Tester',
        email: 'notetester@example.com',
        password: 'password123'
      })
    });
    const regData = await regRes.json();
    const token = regData.token;

    const custRes = await fetch('http://localhost:5000/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Jane Doe',
        email: 'jane@example.com'
      })
    });
    const custData = await custRes.json();
    const customerId = custData._id;

    const noteRes = await fetch(`http://localhost:5000/api/customers/${customerId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        text: 'This is a test note'
      })
    });
    
    const noteData = await noteRes.json();
    console.log('Note Status:', noteRes.status);
    console.log('Note Data:', JSON.stringify(noteData, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }
}

test();

const fetch = require('node-fetch');

async function testShopAPI() {
  try {
    console.log('Testing /shop/products endpoint...');
    const response = await fetch('http://localhost:3000/shop/products');
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('\nTotal products:', data.length);
    
    if (data.length > 0) {
      console.log('\nFirst product:', data[0]);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testShopAPI();

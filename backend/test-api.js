const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const http = require('http');
const app = require('./src/app');
const { connectDB } = require('./src/config/db');

// Start temporary test server
const testServer = http.createServer(app);

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING AUTOMATED REST API TEST SUITE (MR SM STORE)');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, description) => {
    if (condition) {
      console.log(`  ✅ PASS: ${description}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${description}`);
      failed++;
    }
  };

  const PORT = 5055;
  await connectDB();
  await new Promise((resolve) => testServer.listen(PORT, resolve));

  const baseOptions = {
    hostname: '127.0.0.1',
    port: PORT
  };

  try {
    // TC 01: Health Check
    const resHealth = await request({
      ...baseOptions,
      path: '/api/health',
      method: 'GET'
    });
    assert(
      resHealth.status === 200 && resHealth.body.success === true && resHealth.body.status === 'healthy',
      `TC-API-01: Health check returns HTTP 200 and healthy status (DB: ${resHealth.body.database})`
    );

    // TC 02: Categories List
    const resCats = await request({
      ...baseOptions,
      path: '/api/categories',
      method: 'GET'
    });
    assert(
      resCats.status === 200 && Array.isArray(resCats.body.data) && resCats.body.data.length >= 6,
      `TC-API-02: Categories endpoint returns HTTP 200 and >= 6 categories (got ${resCats.body.data?.length})`
    );

    // TC 03: Products List
    const resProducts = await request({
      ...baseOptions,
      path: '/api/products',
      method: 'GET'
    });
    assert(
      resProducts.status === 200 && Array.isArray(resProducts.body.data) && resProducts.body.data.length > 0,
      `TC-API-03: Products endpoint returns HTTP 200 and array of menswear items (got ${resProducts.body.data?.length})`
    );

    // TC 04: Product Filter by Category
    const resFiltered = await request({
      ...baseOptions,
      path: '/api/products?category=formal-shirts',
      method: 'GET'
    });
    const allFormal = resFiltered.body.data?.every((p) => p.category?.slug === 'formal-shirts');
    assert(
      resFiltered.status === 200 && resFiltered.body.data.length > 0 && allFormal,
      `TC-API-04: Products filter by category=formal-shirts returns only formal shirts (got ${resFiltered.body.data?.length})`
    );

    // TC 05: Product Search
    const resSearch = await request({
      ...baseOptions,
      path: '/api/products?search=oxford',
      method: 'GET'
    });
    assert(
      resSearch.status === 200 && resSearch.body.data?.some((p) => p.name.toLowerCase().includes('oxford')),
      `TC-API-05: Product search for "oxford" returns matching items`
    );

    // TC 06: Product Sort (price ascending)
    const resSort = await request({
      ...baseOptions,
      path: '/api/products?sort=price_asc',
      method: 'GET'
    });
    const prices = resSort.body.data?.map((p) => p.price) || [];
    let isSortedAsc = true;
    for (let i = 0; i < prices.length - 1; i++) {
      if (prices[i] > prices[i + 1]) {
        isSortedAsc = false;
        break;
      }
    }
    assert(
      resSort.status === 200 && isSortedAsc && prices.length > 0,
      `TC-API-06: Product sort by price_asc produces monotonically increasing prices (${prices.slice(0, 4).join(', ')}...)`
    );

    // TC 07: Promotional Offers
    const resOffers = await request({
      ...baseOptions,
      path: '/api/offers',
      method: 'GET'
    });
    assert(
      resOffers.status === 200 && Array.isArray(resOffers.body.data) && resOffers.body.data.length > 0,
      `TC-API-07: Offers endpoint returns discounted products (got ${resOffers.body.data?.length})`
    );

    // TC 08: Contact Inquiry Validation Error
    const resContactBad = await request(
      {
        ...baseOptions,
        path: '/api/contact',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      { name: 'A' } // Missing phone & message
    );
    assert(
      resContactBad.status === 400 && resContactBad.body.success === false,
      `TC-API-08: Contact form with missing fields returns HTTP 400 validation error`
    );

    // TC 09: Contact Inquiry Valid Submission
    const resContactGood = await request(
      {
        ...baseOptions,
        path: '/api/contact',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        name: 'Ramesh Kumar',
        phone: '9876543210',
        message: 'Inquiring about Oxford Shirt in XXL at Hanamkonda store.'
      }
    );
    assert(
      resContactGood.status === 201 && resContactGood.body.success === true,
      `TC-API-09: Valid contact inquiry returns HTTP 201 and confirmation message`
    );

    // TC 10: 404 Handler for Unknown Route
    const res404 = await request({
      ...baseOptions,
      path: '/api/unknown-endpoint-xyz',
      method: 'GET'
    });
    assert(
      res404.status === 404 && res404.body.error?.code === 'ENDPOINT_NOT_FOUND',
      `TC-API-10: Unknown endpoint returns HTTP 404 with standard structured error envelope`
    );
  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    testServer.close();
    console.log('\n------------------------------------------------------');
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('------------------------------------------------------\n');
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTestSuite();

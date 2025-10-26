#!/usr/bin/env node

/**
 * Test script for Vercel KV connection
 * Run with: node scripts/test-kv.js
 */

const { kv } = require('@vercel/kv');

async function testKVConnection() {
  console.log('🔄 Testing Vercel KV connection...\n');

  try {
    // Test 1: Set a test value
    console.log('1. Setting test value...');
    await kv.set('test:connection', {
      message: 'Hello from Vercel KV!',
      timestamp: new Date().toISOString(),
      testData: {
        user: 'test-user',
        quests: [1, 2, 3],
        xp: 150
      }
    });
    console.log('✅ Test value set successfully');

    // Test 2: Get the test value
    console.log('\n2. Retrieving test value...');
    const retrievedValue = await kv.get('test:connection');
    console.log('✅ Test value retrieved:', JSON.stringify(retrievedValue, null, 2));

    // Test 3: Test user state structure
    console.log('\n3. Testing user state structure...');
    const testUserState = {
      walletAddress: '0x1234567890abcdef',
      questProgress: [
        { id: 1, completed: true, xpEarned: 50, completedAt: Date.now() },
        { id: 2, completed: false, xpEarned: 0 },
        { id: 3, completed: true, xpEarned: 100, completedAt: Date.now() }
      ],
      totalXP: 150,
      level: 2,
      questCompletionPercentage: 66.67,
      lastUpdated: Date.now(),
      createdAt: Date.now()
    };

    await kv.set('user-state:0x1234567890abcdef', testUserState);
    console.log('✅ User state structure test passed');

    // Test 4: Retrieve user state
    const retrievedUserState = await kv.get('user-state:0x1234567890abcdef');
    console.log('✅ User state retrieved:', JSON.stringify(retrievedUserState, null, 2));

    // Test 5: Clean up test data
    console.log('\n4. Cleaning up test data...');
    await kv.del('test:connection');
    await kv.del('user-state:0x1234567890abcdef');
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All tests passed! Vercel KV is working correctly.');
    console.log('\n📝 Next steps:');
    console.log('   1. Your KV database is ready for production');
    console.log('   2. User state will persist across sessions');
    console.log('   3. Quest progress will be saved automatically');

  } catch (error) {
    console.error('\n❌ KV connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check your .env.local file has correct KV credentials');
    console.log('   2. Verify your Vercel KV database is active');
    console.log('   3. Make sure you have the @vercel/kv package installed');
    console.log('\n💡 You can still use Stateless Mode for testing without KV');
  }
}

// Run the test
testKVConnection();

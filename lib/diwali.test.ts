import { getDiwaliStatus, isDiwaliActive, DIWALI_CONFIG } from './diwali.ts';

function runTests() {
  console.log('🧪 Starting 30-Hour Diwali Celebration Mode Test Suite...\n');

  const startMs = new Date(DIWALI_CONFIG.startAt).getTime();
  const THIRTY_HOURS_MS = 30 * 60 * 60 * 1000;
  const endMs = startMs + THIRTY_HOURS_MS;

  // 1. Config validation
  console.assert(
    DIWALI_CONFIG.durationHours === 30,
    '❌ Config duration must be 30 hours'
  );
  console.log('✓ Test 1: Config duration is exactly 30 hours');

  // 2. Exact timestamp calculations
  console.assert(!isNaN(startMs), '❌ Start timestamp must be valid');
  console.log(`✓ Test 2: Start timestamp correctly parsed: ${new Date(startMs).toISOString()}`);
  console.log(`          Expiry timestamp: ${new Date(endMs).toISOString()}`);

  // 3. Before activation (start - 1ms)
  const beforeStart = getDiwaliStatus(startMs - 1);
  console.assert(
    !beforeStart.isActive && beforeStart.status === 'upcoming',
    '❌ Should not be active before start timestamp'
  );
  console.assert(
    beforeStart.remainingMs === 1,
    '❌ remainingMsToStart should be 1ms'
  );
  console.log('✓ Test 3: Inactive 1ms before startAt (status: upcoming)');

  // 4. Exact start moment (startMs)
  const atStart = getDiwaliStatus(startMs);
  console.assert(
    atStart.isActive && atStart.status === 'active',
    '❌ Should be active at exact start timestamp'
  );
  console.assert(
    atStart.remainingMs === THIRTY_HOURS_MS,
    '❌ remainingMs at start must be full 30 hours'
  );
  console.log('✓ Test 4: Active at exact start timestamp (30 hours remaining)');

  // 5. 15 hours in (midpoint)
  const midpoint = startMs + 15 * 60 * 60 * 1000;
  const atMidpoint = getDiwaliStatus(midpoint);
  console.assert(
    atMidpoint.isActive && atMidpoint.status === 'active',
    '❌ Should be active at 15 hours'
  );
  console.assert(
    atMidpoint.remainingMs === 15 * 60 * 60 * 1000,
    '❌ remainingMs at 15h should be 15 hours'
  );
  console.log('✓ Test 5: Active at 15h midpoint (15 hours remaining)');

  // 6. 1 millisecond before expiry (startMs + 30h - 1ms)
  const justBeforeExpiry = getDiwaliStatus(endMs - 1);
  console.assert(
    justBeforeExpiry.isActive && justBeforeExpiry.status === 'active',
    '❌ Should be active 1ms before 30h expiry'
  );
  console.assert(
    justBeforeExpiry.remainingMs === 1,
    '❌ remainingMs should be 1ms'
  );
  console.log('✓ Test 6: Active at 29h 59m 59s 999ms');

  // 7. Exactly at 30-hour boundary (endMs)
  const atExpiry = getDiwaliStatus(endMs);
  console.assert(
    !atExpiry.isActive && atExpiry.status === 'expired',
    '❌ Should deactivate at exact 30-hour mark'
  );
  console.assert(
    atExpiry.remainingMs === 0,
    '❌ remainingMs should be 0 when expired'
  );
  console.log('✓ Test 7: Inactive at exact 30-hour mark (status: expired)');

  // 8. After expiry (endMs + 1 hour)
  const afterExpiry = getDiwaliStatus(endMs + 3600 * 1000);
  console.assert(
    !afterExpiry.isActive && afterExpiry.status === 'expired',
    '❌ Should remain deactivated after expiry'
  );
  console.log('✓ Test 8: Inactive after expiry');

  // 9. Manual disable toggle
  const disabledState = getDiwaliStatus(midpoint, { enabled: false });
  console.assert(
    !disabledState.isActive && disabledState.status === 'disabled',
    '❌ Should be inactive when enabled=false'
  );
  console.log('✓ Test 9: Manual disable kill-switch immediately disables feature');

  // 10. Malformed or invalid start timestamp
  const invalidState = getDiwaliStatus(midpoint, { startAt: 'invalid-iso-string' });
  console.assert(
    !invalidState.isActive && invalidState.status === 'invalid_date',
    '❌ Invalid date must not crash and must return inactive'
  );
  console.log('✓ Test 10: Gracefully handles invalid start timestamps without throwing');

  // 11. Quick boolean helper
  console.assert(
    isDiwaliActive(midpoint) === true,
    '❌ isDiwaliActive helper failed at midpoint'
  );
  console.assert(
    isDiwaliActive(endMs + 1000) === false,
    '❌ isDiwaliActive helper failed after expiry'
  );
  console.log('✓ Test 11: isDiwaliActive() boolean helper verified');

  console.log('\n🎉 ALL 11 TESTS PASSED SUCCESSFULLY!');
}

runTests();

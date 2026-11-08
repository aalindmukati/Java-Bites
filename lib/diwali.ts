/**
 * Java Bites — 30-Hour Diwali Celebration Configuration
 *
 * Centralized configuration for the temporary Diwali celebration mode.
 *
 * Requirements:
 * 1. Configurable absolute start timestamp (DIWALI_START_AT).
 * 2. Automatically deactivates exactly 30 hours after that timestamp.
 * 3. Master toggle (DIWALI_ENABLED) for manual override.
 * 4. Graceful fallback on invalid dates or disabled state.
 */

// Central configuration constants
export const DIWALI_CONFIG = {
  /**
   * Master toggle: Set to `false` to immediately disable all Diwali features,
   * regardless of the start timestamp.
   * Can also be overridden with process.env.NEXT_PUBLIC_DIWALI_ENABLED="false".
   */
  enabled:
    typeof process !== 'undefined' &&
    process.env.NEXT_PUBLIC_DIWALI_ENABLED !== undefined
      ? process.env.NEXT_PUBLIC_DIWALI_ENABLED === 'true'
      : true,

  /**
   * Absolute ISO 8601 start timestamp for the Diwali campaign.
   * Can be overridden with process.env.NEXT_PUBLIC_DIWALI_START_AT.
   *
   * Example: '2026-11-07T00:00:00+05:30'
   */
  startAt:
    (typeof process !== 'undefined' &&
      process.env.NEXT_PUBLIC_DIWALI_START_AT) ||
    '2026-11-08T10:47:26+05:30',

  /**
   * Exact duration of the campaign in hours.
   */
  durationHours: 30,
} as const;

export type DiwaliCampaignStatus =
  | 'active'
  | 'upcoming'
  | 'expired'
  | 'disabled'
  | 'invalid_date';

export interface DiwaliStatusInfo {
  isActive: boolean;
  status: DiwaliCampaignStatus;
  startMs: number | null;
  endMs: number | null;
  remainingMs: number;
  elapsedMs: number;
  totalDurationMs: number;
}

/**
 * Calculates whether the Diwali celebration is currently active and provides detailed timing.
 *
 * @param customNow Optional Date or timestamp (ms) to test specific moments in time.
 * @param customConfig Optional config overrides for testing boundary conditions.
 */
export function getDiwaliStatus(
  customNow?: Date | number,
  customConfig?: Partial<typeof DIWALI_CONFIG>
): DiwaliStatusInfo {
  const config = { ...DIWALI_CONFIG, ...customConfig };
  const totalDurationMs = config.durationHours * 60 * 60 * 1000;

  // 1. Check if manually disabled
  if (!config.enabled) {
    return {
      isActive: false,
      status: 'disabled',
      startMs: null,
      endMs: null,
      remainingMs: 0,
      elapsedMs: 0,
      totalDurationMs,
    };
  }

  // 2. Parse and validate the start timestamp
  const startMs = new Date(config.startAt).getTime();
  if (isNaN(startMs)) {
    return {
      isActive: false,
      status: 'invalid_date',
      startMs: null,
      endMs: null,
      remainingMs: 0,
      elapsedMs: 0,
      totalDurationMs,
    };
  }

  const endMs = startMs + totalDurationMs;
  const nowMs =
    customNow instanceof Date
      ? customNow.getTime()
      : typeof customNow === 'number'
      ? customNow
      : Date.now();

  // 3. Check upcoming
  if (nowMs < startMs) {
    return {
      isActive: false,
      status: 'upcoming',
      startMs,
      endMs,
      remainingMs: startMs - nowMs,
      elapsedMs: 0,
      totalDurationMs,
    };
  }

  // 4. Check expired (strictly >= endMs)
  if (nowMs >= endMs) {
    return {
      isActive: false,
      status: 'expired',
      startMs,
      endMs,
      remainingMs: 0,
      elapsedMs: nowMs - startMs,
      totalDurationMs,
    };
  }

  // 5. Currently active within the exact 30-hour window
  return {
    isActive: true,
    status: 'active',
    startMs,
    endMs,
    remainingMs: endMs - nowMs,
    elapsedMs: nowMs - startMs,
    totalDurationMs,
  };
}

/**
 * Quick boolean check if Diwali celebration is currently active.
 */
export function isDiwaliActive(customNow?: Date | number): boolean {
  return getDiwaliStatus(customNow).isActive;
}


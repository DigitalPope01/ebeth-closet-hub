// Simple client-side rate limiter to prevent spam
class RateLimiter {
  private attempts: Map<string, { count: number; timestamp: number }> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts = 5, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt) {
      this.attempts.set(key, { count: 1, timestamp: now });
      return true;
    }

    const timePassed = now - attempt.timestamp;

    if (timePassed > this.windowMs) {
      this.attempts.set(key, { count: 1, timestamp: now });
      return true;
    }

    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Create rate limiters for different actions
export const formSubmissionLimiter = new RateLimiter(3, 60000); // 3 attempts per minute
export const searchLimiter = new RateLimiter(10, 60000); // 10 searches per minute
export const addToCartLimiter = new RateLimiter(20, 60000); // 20 cart additions per minute

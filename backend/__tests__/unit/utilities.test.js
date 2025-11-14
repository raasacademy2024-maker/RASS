import slugify from 'slugify';

describe('Utility Functions', () => {
  describe('Slugify', () => {
    test('should convert string to slug', () => {
      const input = 'Hello World';
      const slug = slugify(input, { lower: true });

      expect(slug).toBe('hello-world');
    });

    test('should handle special characters', () => {
      const input = 'JavaScript & React: The Complete Guide!';
      const slug = slugify(input, { lower: true, strict: true });

      expect(slug).not.toContain('&');
      expect(slug).not.toContain(':');
      expect(slug).not.toContain('!');
    });

    test('should handle spaces and hyphens', () => {
      const input = 'Full Stack Web Development';
      const slug = slugify(input, { lower: true });

      expect(slug).toBe('full-stack-web-development');
      expect(slug).not.toContain(' ');
    });

    test('should handle numbers in string', () => {
      const input = 'Node.js 101 Course';
      const slug = slugify(input, { lower: true });

      expect(slug).toContain('101');
    });
  });

  describe('Progress Calculation', () => {
    test('should calculate progress percentage correctly', () => {
      const completed = 5;
      const total = 10;
      const progress = (completed / total) * 100;

      expect(progress).toBe(50);
    });

    test('should handle 100% completion', () => {
      const completed = 10;
      const total = 10;
      const progress = (completed / total) * 100;

      expect(progress).toBe(100);
    });

    test('should handle 0% completion', () => {
      const completed = 0;
      const total = 10;
      const progress = (completed / total) * 100;

      expect(progress).toBe(0);
    });

    test('should round progress to 2 decimal places', () => {
      const completed = 1;
      const total = 3;
      const progress = Math.round((completed / total) * 100 * 100) / 100;

      expect(progress).toBe(33.33);
    });
  });

  describe('Date Calculations', () => {
    test('should calculate course duration in days', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const durationMs = endDate - startDate;
      const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

      expect(durationDays).toBe(30);
    });

    test('should check if date is in past', () => {
      const pastDate = new Date('2020-01-01');
      const now = new Date();
      const isInPast = pastDate < now;

      expect(isInPast).toBe(true);
    });

    test('should check if date is in future', () => {
      const futureDate = new Date('2030-01-01');
      const now = new Date();
      const isInFuture = futureDate > now;

      expect(isInFuture).toBe(true);
    });
  });

  describe('Enrollment Status', () => {
    test('should determine if student is active based on progress', () => {
      const progress = 75;
      const isActive = progress > 0 && progress < 100;

      expect(isActive).toBe(true);
    });

    test('should determine if course is completed', () => {
      const progress = 100;
      const isCompleted = progress === 100;

      expect(isCompleted).toBe(true);
    });

    test('should determine if student has not started', () => {
      const progress = 0;
      const notStarted = progress === 0;

      expect(notStarted).toBe(true);
    });
  });

  describe('Price Formatting', () => {
    test('should format price in INR', () => {
      const price = 999;
      const formatted = `₹${price}`;

      expect(formatted).toBe('₹999');
    });

    test('should format price with commas for large numbers', () => {
      const price = 12999;
      const formatted = `₹${price.toLocaleString('en-IN')}`;

      expect(formatted).toContain('12,999');
    });

    test('should handle free courses', () => {
      const price = 0;
      const displayPrice = price === 0 ? 'Free' : `₹${price}`;

      expect(displayPrice).toBe('Free');
    });
  });
});

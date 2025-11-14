import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

describe('Authentication Logic', () => {
  describe('JWT Token Generation', () => {
    test('should generate valid JWT token', () => {
      const payload = {
        _id: '123456789',
        role: 'student',
      };

      const token = jwt.sign(payload, 'test-secret', { expiresIn: '1h' });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    test('should verify JWT token successfully', () => {
      const payload = {
        _id: '123456789',
        role: 'student',
      };

      const token = jwt.sign(payload, 'test-secret', { expiresIn: '1h' });
      const decoded = jwt.verify(token, 'test-secret');

      expect(decoded._id).toBe(payload._id);
      expect(decoded.role).toBe(payload.role);
    });

    test('should fail to verify token with wrong secret', () => {
      const payload = {
        _id: '123456789',
        role: 'student',
      };

      const token = jwt.sign(payload, 'test-secret', { expiresIn: '1h' });

      expect(() => {
        jwt.verify(token, 'wrong-secret');
      }).toThrow();
    });

    test('should include expiration in token', () => {
      const payload = {
        _id: '123456789',
        role: 'student',
      };

      const token = jwt.sign(payload, 'test-secret', { expiresIn: '1h' });
      const decoded = jwt.verify(token, 'test-secret');

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
    });
  });

  describe('Password Hashing', () => {
    test('should hash password successfully', async () => {
      const password = 'testpassword123';
      const hashedPassword = await bcryptjs.hash(password, 10);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword).toMatch(/^\$2[aby]\$.{56}$/); // bcrypt pattern
    });

    test('should verify correct password', async () => {
      const password = 'testpassword123';
      const hashedPassword = await bcryptjs.hash(password, 10);

      const isMatch = await bcryptjs.compare(password, hashedPassword);

      expect(isMatch).toBe(true);
    });

    test('should reject incorrect password', async () => {
      const password = 'testpassword123';
      const hashedPassword = await bcryptjs.hash(password, 10);

      const isMatch = await bcryptjs.compare('wrongpassword', hashedPassword);

      expect(isMatch).toBe(false);
    });

    test('should generate different hashes for same password', async () => {
      const password = 'testpassword123';
      const hash1 = await bcryptjs.hash(password, 10);
      const hash2 = await bcryptjs.hash(password, 10);

      expect(hash1).not.toBe(hash2);

      // But both should verify against the original password
      expect(await bcryptjs.compare(password, hash1)).toBe(true);
      expect(await bcryptjs.compare(password, hash2)).toBe(true);
    });
  });
});

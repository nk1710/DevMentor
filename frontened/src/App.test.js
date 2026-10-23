test('frontend test environment is configured', () => {
  expect(process.env.NODE_ENV).toBe('test');
});

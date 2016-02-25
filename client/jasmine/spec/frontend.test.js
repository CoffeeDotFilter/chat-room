describe('makeUserName function', function() {
	it('should make a new variable with a username', function() {
		var actual = makeUserName('owen');
		expect(actual).toBe('owen');
	});
});
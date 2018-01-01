/*eslint-disable no-undef */
describe("Global library JSqfd utilities", function() {
	describe("trunc: truncate text to n characters and add horizontal ellipsis character", function() {

		it("Should be nothing as text length 'abc' is less than 10", function() {
			expect(JSqfd.utils.trunc("abc", 10)).toBe("abc");
		});

		it("Should be trunc text abc to a…", function() {
			expect(JSqfd.utils.trunc("abc", 2)).toBe("a…");
		});

	});
	
	describe("removeDuplicate: remove duplicate elements in array", function() {
		it("Should be remove one 'a' element in ['a', 'b', 'c', 'a']", function () {
			expect(JSqfd.utils.removeDuplicates(['a', 'b', 'c', 'a'])).toEqual(['a', 'b', 'c']);
		});
		it("Should be remove nothing element in ['a', 'b', 'c']", function () {
			expect(JSqfd.utils.removeDuplicates(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
		});
	});
	
	describe("arrayObjectIndexOf: indexOf() for array of object", function() {
		it("Search value 'b' in property 'pro' inside array [{'pro': 'a'}, {'pro': 'b'}, {'pro': 'c'}] should be 1", function () {
			expect(JSqfd.utils.arrayObjectIndexOf([{'pro': 'a'}, {'pro': 'b'}, {'pro': 'c'}], 'b', 'pro')).toBe(1);
		});
		it("Search value 'd' in property 'pro' inside array [{'pro': 'a'}, {'pro': 'b'}, {'pro': 'c'}] should be -1", function () {
			expect(JSqfd.utils.arrayObjectIndexOf([{'pro': 'a'}, {'pro': 'b'}, {'pro': 'c'}], 'd', 'pro')).toBe(-1);
		});
	});	
	
});

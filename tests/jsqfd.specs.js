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
		var foo = ['a', 'b', 'c', 'a'];
		var bar = ['a', 'b', 'c'];
		it("Should be remove one 'a' element in ['a', 'b', 'c', 'a']", function() {
			expect(JSqfd.utils.removeDuplicates(foo)).toEqual(bar);
		});
		it("Should be remove nothing element in ['a', 'b', 'c']", function() {
			expect(JSqfd.utils.removeDuplicates(bar)).toEqual(bar);
		});
	});

	describe("arrayObjectIndexOf: indexOf() for array of object", function() {
		var foo = [{
			'pro': 'a'
		}, {
			'pro': 'b'
		}, {
			'pro': 'c'
		}];
		it("Search value 'b' in property 'pro' inside array [{'pro': 'a'}, {'pro': 'b'}, {'pro': 'c'}] should be 1", function() {
			expect(JSqfd.utils.arrayObjectIndexOf(foo, 'b', 'pro')).toBe(1);
		});
		it("Search value 'd' in property 'pro' inside array [{'pro': 'a'}, {'pro': 'b'}, {'pro': 'c'}] should be -1", function() {
			expect(JSqfd.utils.arrayObjectIndexOf(foo, 'd', 'pro')).toBe(-1);
		});
	});

	describe("textlength: length (in pixel) of text", function() {
		it("Length of 'abc' should be 17 pixels for Arial 12pt", function() {
			expect(JSqfd.utils.textlength('abc', 12, 'Arial')).toBe(17);
		});

	});

});

describe('Test Dialog Box', function() {
	var c;
	var myheight = '250',
	    mywidth = '250';

	beforeEach(function() {
		var mysvg = buildSvg();
		c = JSqfd.drawDialogbox(mysvg);
		c.render();
	});

	afterEach(function() {
		d3.selectAll('svg').remove();
	});

	describe('the svg:', function() {
		it('Should be created', function() {
			expect(getSvg()).not.toBeNull();
		});
		it('Should be the right id', function() {
			expect(getSvg().attr('id')).toBe('myDiagBox');
		});

		it('Should have the correct height', function() {
			expect(getSvg().attr('height')).toBe(myheight);
		});

		it('Should have the correct width', function() {
			expect(getSvg().attr('width')).toBe(mywidth);
		});
	});

	function getSvg() {
		return d3.select("#myDiagBox");
	}

	function buildSvg() {
		var svg = d3.select('body').append('svg');
		return svg;
	}

});
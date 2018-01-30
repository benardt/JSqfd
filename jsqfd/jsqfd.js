/*globals d3 */

'use strict';

/**
 * Library for QFD
 */
var JSqfd = (function() {

	var svgContainer;
	var myObj = {};

	var config = {
		spacing: 4,
		texth: 20,
		textw: 220, // size for what.criteria & how.characteristic
		bomh: 100, // size for how.name
		funcw: 100, // size for what.name
		truncdialog: 44
	};

	var constant = {
		sqrt2div2: 0.70710678118,
		text_strong: "\u25C9",
		text_weak: "\u25CE",
		text_cross: '\u00D7', // "\u274C"
		text_crossneg: '\u2297' // "\u274E"
	};

	var color = d3.scaleOrdinal(d3.schemeCategory20);

	/**
	 * string truncation for n characters
	 * 
	 * @param {string} text
	 * @param {number} n
	 * @return {string}
	 */
	var trunc = function(text, n) {
		return text.substr(0, n - 1) + (text.length > n ? "\u2026" : "");
	};

	/** 
	 * remove duplicate element in an array
	 * 
	 * @param {array} myArray
	 */
	var removeDuplicates = function(myArray) {
		return myArray.sort().filter(function(item, pos, ary) {
			return !pos || item !== ary[pos - 1];
		});
	};

	var arrayObjectIndexOf = function(myArray, searchTerm, property) {
		var i;
		var len = myArray.length;
		for (i = 0; i < len; i += 1) {
			if (myArray[i][property] === searchTerm) {
				return i;
			}
		}
		return -1;
	};

	var arrayObjectIndexOf2 = function(myArray, searchTerm1, property1, searchTerm2, property2) {
		var i;
		var len = myArray.length;
		for (i = 0; i < len; i += 1) {
			if (myArray[i][property1] === searchTerm1 && myArray[i][property2] === searchTerm2) {
				return i;
			}
		}
		return -1;
	};

	/**
	 * Calculate length (in pixel) of text
	 * 
	 * @param {string} pText
	 * @param {number} font size (ie 12 for 12pt)
	 * @param {string} style (ie Arial)
	 * @return {number} length of text
	 */
	var textlength = function(pText, pFontSize, pStyle) {
		var lDiv = document.createElement('div');
		var width;

		document.body.appendChild(lDiv);

		if (pStyle !== null) {
			lDiv.style = pStyle;
		}
		lDiv.style.fontSize = String(pFontSize) + "px";
		lDiv.style.position = "absolute";
		lDiv.style.left = -1000;
		lDiv.style.top = -1000;

		lDiv.innerHTML = pText;

		//var lResult = {
		//	width: lDiv.clientWidth,
		//	height: lDiv.clientHeight
		//};
		width = lDiv.clientWidth;
		document.body.removeChild(lDiv);
		lDiv = null;

		//return lResult;
		return width;

	};


	/**
	 * Test if str is JSON format
	 * 
	 * @param {string} str
	 * @return {boolean} true or false
	 */
	function IsJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

	var handleMouseOver = function(d) {

		// .mytexthowselected: black & bold
		d3.select("#" + d.charid)
			.attr("class", "mytexthowselected");
		d3.selectAll("." + d.charid)
			.attr("class", "mytexthowselected");
		d3.selectAll(".corr_" + d.charid)
			.style("fill", "Beige");

		// add and fill Dialog Box if Dialog Box exist
		var tt = d3.select("#groupDialogbox");

		if (typeof tt !== "undefined") {

			tt.append("text").attr("class", "mytextpart textdialog")
				.attr("x", 10 + 2)
				.attr("y", 10 + 10)
				.attr("dy", ".35em")
				.text(trunc("Characteristic: " + d.char, config.truncdialog));

			tt.append("text").attr("class", "mytextpart textdialog")
				.attr("x", 10 + 2)
				.attr("y", 10 + 25)
				.attr("dy", ".35em")
				.text("Id: " + d.charid);

			tt.append("text").attr("class", "mytextpart textdialog")
				.attr("x", 10 + 2)
				.attr("y", 10 + 40)
				.attr("dy", ".35em")
				.text("Criteria: " + d.cri);
		}

	};

	var handleMouseOut = function(d) {

		d3.selectAll(".mytexthowselected")
			.each(function() {
				d3.select(this).attr("class", "mytextpart " + d3.select(this).attr("data-corr"));
			});
		d3.selectAll(".corr_" + d.charid)
			.style("fill", "White");

		d3.selectAll(".textdialog").remove();
	};


	/**
	 * draw Dialog box
	 * 
	 * <p>Check if scg element exists and add rectangle for Dialog box</p>
	 */
	var drawDialogbox = function() {

		var that = {};

		if (typeof svgContainer !== 'undefined') {
			that.render = function() {
				var dialogBox = svgContainer.append("g").attr("id", "groupDialogbox");
				dialogBox.append("rect").attr("class", "mybox classicdesign")
					.attr("id", 'myDiagBox')
					.attr("x", 10)
					.attr("y", 10)
					.attr("rx", 8)
					.attr("ry", 8)
					.attr("width", 250)
					.attr("height", 250)
					.style("stroke-opacity", 0.0);
			};

			that.remove = function() {
				d3.select("#groupDialogbox").remove();
			};

		}
		return that;
	};

	var drawWhat = function(myContainer, myArray, offsety) {
		var i;
		var len = myArray.length;
		var functions = [];

		var tt = d3.select('#groupWhats');
		tt.remove();

		for (i = 0; i < len; i += 1) {
			functions.push(myArray[i].function);
		}
		functions = JSqfd.utils.removeDuplicates(functions);

		var offsetx = 10;
		var myoffsety = offsety + config.bomh + config.textw + config.spacing;
		var mylengthy = config.spacing + config.texth + config.spacing;

		var whats = myContainer.append("svg:g")
		    .attr("id", "groupWhats")
		    .attr('transform', 'translate(' + String(offsetx) + ', ' + String(myoffsety) + ')')
		    .selectAll("g")
			.data(myArray)
			.enter()
			.append('svg:g')
			.attr('transform', function(d) {
				return 'translate(0, ' + String(d.r * mylengthy) + ')';
			});

		// What name function rectangle + text
		whats.append("rect").attr("class", "mybox classicdesign")
			.style("fill", function(d) {
				return color(functions.indexOf(d.function));
			})
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", config.funcw)
			.attr("height", config.texth);

		whats.append("rect").attr("class", "mybox flatdesign")
			.style("fill", function(d) {
				return color(functions.indexOf(d.function));
			})
			.attr("x", 0)
			.attr("y", 0)
			.attr('rx', 5)
			.attr('ry', 5)
			.attr("width", config.funcw)
			.attr("height", config.texth);

		whats.append("text").attr("class", "mytext")
			.attr("x", 2)
			.attr("y", config.texth / 2)
			.attr("dy", ".35em")
			.text(function(d) {
				return d.function;
			});
		// What details rectangle + text
		whats.append("rect").attr("class", "mybox classicdesign")
			.attr("x", config.funcw)
			.attr("y", 0)
			.attr("width", config.textw)
			.attr("height", config.texth);

		whats.append("rect").attr("class", "mybox flatdesign")
			.attr("x", config.funcw)
			.attr("y", 0)
			.attr('rx', 5)
			.attr('ry', 5)
			.attr("width", config.textw)
			.attr("height", config.texth);

		whats.append("text").attr("class", "mytext")
			.attr("x", 2 + config.funcw)
			.attr("y", config.texth / 2)
			.attr("dy", ".35em")
			.text(function(d) {
				return d.name;
			});
		return 0;
	};


	/**
	 * draw Importance data
	 * 
	 * <p>Importance are linked to Hows</p>
	 * 
	 * @param {svg element} myContainer svg object
	 * @param {array} Hows.data
	 * @param {number} number of Whats
	 * 
	 */
	var drawHowsImportance = function(myContainer, myArray, level, offsety) {
		var i, j;
		var myLabel = [];
		var myData = [];

		var tt = d3.select('#groupImportance');
		tt.remove();

		// Create g element with id groupImportance
		var howsImportance = myContainer.append("g").attr("id", "groupImportance");

		var index = arrayObjectIndexOf(myArray[0].others, "importance", "others");

		// Build array with relevant data for Importance
		for (i = 0; i <= myArray.length - 1; i += 1) {
			for (j = 0; j <= myArray[i].others[index].data.length - 1; j += 1) {
				myData.push({
					c: i, // column position
					r: j, // row position
					value: myArray[i].others[index].data[j].value
				});
				// Take all label and clean data after (see Remove duplicates from an array of objects)
				myLabel.push({
					name: myArray[i].others[index].data[j].name,
					r: j
				});
			}
		}

		// Remove duplicates from an array of objects in JavaScript: findIndex() method
		myLabel = myLabel.filter((thing, index, self) =>
			index === self.findIndex((t) => t.name === thing.name && t.r === thing.r)
		);

		// label -----------------------------------------
		var importanceLabel = howsImportance.append('svg:g')
		    .attr("id", "importanceLabel")
		    .attr('transform', 'translate(' + String(10 + config.funcw) + ', ' + String(offsety + config.bomh + config.textw + level * (config.texth + 2 * config.spacing)) + ')');
		    
		var imps = importanceLabel.selectAll('g')
			.data(myLabel)
			.enter()
			.append('svg:g')
			.attr('id', function(d, i) { return 'myid' + i; } )
			.attr("transform", function(d) {
				return 'translate(0,' + String(d.r * (config.texth + 2 * config.spacing)) + ')';
			});

		imps.append("rect").attr("class", "mybox classicdesign")
			.attr("x", 0)
			.attr("y", config.spacing)
			.attr("width", config.textw)
			.attr("height", config.texth);

		imps.append("rect").attr("class", "mybox flatdesign")
			.attr("x", 0)
			.attr("y", config.spacing)
			.attr('rx', 5)
			.attr('ry', 5)
			.attr("width", config.textw)
			.attr("height", config.texth);

		imps.append("text").attr("class", "mytext")
			.attr("x", 2)
			.attr("y", config.texth / 2 + config.spacing)
			.attr("dy", ".35em")
			.style("font-weight", "bold")
			.text(function(d) {
				return d.name;
			});

		// data ------------------------------------
		var importanceData = howsImportance.append('svg:g')
			.attr("id", "importanceData")
			.attr('transform', 'translate(' + String(10 + config.funcw + config.textw) + ', ' + String(offsety + config.bomh + config.textw + level * (config.texth + 2 * config.spacing)) + ')');

		var impsData = importanceData.selectAll('g')
			.data(myData)
			.enter()
			.append('svg:g')
			.attr('id', function(d, i) { return 'myid' + i; } )
			.attr("transform", function(d) {
				return 'translate(' + d.c * (config.texth + 2 * config.spacing) + ', ' + String(d.r * (config.texth + 2 * config.spacing)) + ')';
			});

		impsData.append("rect")
			.attr("class", "mycase classicdesign")
			.attr("x", config.spacing)
			.attr("y", config.spacing)
			.attr("width", config.texth)
			.attr("height", config.texth)
			.on("mouseover", JSqfd.handleMouseOver)
			.on("mouseout", JSqfd.handleMouseOut);
			
		impsData.append("rect")
			.attr("class", "mycase flatdesign")
			.attr("x", config.spacing)
			.attr("y", config.spacing)
			.attr('rx', 5)
			.attr('ry', 5)
			.attr("width", config.texth)
			.attr("height", config.texth)
			.on("mouseover", JSqfd.handleMouseOver)
			.on("mouseout", JSqfd.handleMouseOut);

		impsData.append("text")
			.attr("class", "mytext")
			.attr("x", config.spacing + config.texth / 2)
			.attr("y", config.spacing + config.texth / 2)
			.attr("dy", ".35em")
			.style("text-anchor", "middle")
			.text(function(d) {
				return d.value;
			});

		return 0;
	};

	var drawHow = function(myContainer, myArray, offsety) {
		var bom = [];
		var i;
		var len = myArray.length;

		var offsetx = 10 + config.funcw + config.textw;

		var tt = d3.select('#groupHows');
		tt.remove();

		for (i = 0; i < len; i += 1) {
			bom.push(myArray[i].component);
		}
		bom = JSqfd.utils.removeDuplicates(bom);

		for (i = 0; i <= len - 1; i += 1) {
			myArray[i].dx = config.spacing + myArray[i].c * 2 * config.spacing;
			myArray[i].rx = config.texth * myArray[i].c;
			myArray[i].ry = 0;
			myArray[i].tx = 10 + config.spacing + myArray[i].c * 2 * config.spacing + config.texth * myArray[i].c;
			myArray[i].ty = 0;
		}

		var hows = myContainer.append("g")
		    .attr("id", "groupHows")
		    .attr('transform', 'translate(' + String(offsetx) + ', ' + String(offsety) + ')')
		    .selectAll("g")
			.data(myArray)
			.enter()
			.append('svg:g');

		hows.append("rect").attr("class", "mybox classicdesign")
			.attr("x", function(d) {
				return d.rx;
			})
			.attr("y", config.bomh)
			.attr("width", config.texth)
			.attr("height", config.textw)
			.attr("transform", function(d) {
				return 'translate(' + String(d.dx) + ',0)';
			});

		hows.append("rect").attr("class", "mybox flatdesign")
			.attr("x", function(d) {
				return d.rx;
			})
			.attr("y", config.bomh)
			.attr('rx', 5)
			.attr('ry', 5)
			.attr("width", config.texth)
			.attr("height", config.textw)
			.attr("transform", function(d) {
				return 'translate(' + String(d.dx) + ',0)';
			});

		hows.append("text")
			.attr("class", function(d) {
				return "mytextpart " + d.datacorr;
			})
			.attr("data-corr", function(d) {
				return d.datacorr;
			})
			.attr("id", function(d) {
				return d.id;
			})
			.attr("x", function(d) {
				return d.tx;
			})
			.attr("y", config.bomh)
			.attr("dy", ".35em")
			.attr("writing-mode", 'tb')
			.text(function(d) {
				return d.name;
			});

		hows.append("rect").attr("class", "mybox classicdesign")
			.style("fill", function(d) {
				return color(bom.indexOf(d.component));
			})
			.attr("x", function(d) {
				return d.rx;
			})
			.attr("y", 0)
			.attr("width", config.texth)
			.attr("height", config.bomh)
			.attr("transform", function(d) {
				return 'translate(' + String(d.dx) + ',0)';
			});

		hows.append("rect").attr("class", "mybox flatdesign")
			.style("fill", function(d) {
				return color(bom.indexOf(d.component));
			})
			.attr("x", function(d) {
				return d.rx;
			})
			.attr("y", 0)
			.attr('rx', 5)
			.attr('ry', 5)
			.attr("width", config.texth)
			.attr("height", config.bomh)
			.attr("transform", function(d) {
				return 'translate(' + String(d.dx) + ',0)';
			});

		hows.append("text")
			.attr("class", function(d) {
				return "mytext" + d.part;
			})
			.attr("x", function(d) {
				return d.tx;
			})
			.attr("y", 0)
			.attr("dy", ".35em")
			.attr("writing-mode", 'tb')
			.text(function(d) {
				return d.component;
			});

		return 0;
	};

	/**
	 * draw correlation (big triangle)
	 * 
	 * @param {string} myContainer
	 * @param {array} myArray
	 */
	var drawCorrelation = function(myContainer, myArray) {

		var offsetx = 10 + config.funcw + config.textw;
		var i, mynb;
		mynb = -1;
		var len = myArray.length;
		
		// This for loop determines the numbers of Hows
		for (i =0; i < len; i += 1) {
			if (myArray[i].i >= mynb) {
				mynb = myArray[i].j;
			}
		}
		
		for (i = 0; i < len; i += 1) {
			myArray[i].x = (myArray[i].j - 0.5 * (myArray[i].j - myArray[i].i - 1)) * (config.texth + 2 * config.spacing);
			myArray[i].y = (0.5 * (mynb - myArray[i].j + myArray[i].i)) * (config.texth + 2 * config.spacing);
		}


		var tt = d3.select('#groupCorrelation');
		tt.remove();

		var correlations = myContainer.append("g").attr("id", "groupCorrelation")
			.attr('transform', 'translate(' + offsetx + ', 0)')
		    .selectAll("rect")
			.data(myArray)
			.enter();

		correlations.append("rect")
			.attr("class", function(d) {
				return "mycorrela mylosange corr_" + d.idp + " corr_" + d.idn;
			})
			.attr("x", function(d) {
				return d.x;
			})
			.attr("y", function(d) {
				return d.y;
			})
			.attr("transform", function(d) {
				return "rotate(45 " + d.x + " " + d.y + ")";
			})
			.attr("width", config.texth * constant.sqrt2div2)
			.attr("height", config.texth * constant.sqrt2div2);

		correlations.append("text")
			.attr("class", "mytext")
			.attr("x", function(d) {
				return d.x - JSqfd.utils.textlength(constant.text_cross, myContainer) * 0.5;
			})
			.attr("y", function(d) {
				return d.y + config.texth * 0.5;
			})
			.attr("dy", ".35em")
			.text(function(d) {
				if (d.value !== null) {
					return constant.text_cross;
				}
			});

		return 0;
	};

	var drawRelationship = function(myContainer, myArray, myoffsety) {

		var offsety = myoffsety + config.bomh + config.textw;
		var offsetx = 10 + config.funcw + config.textw;

		// First remove the g element #groupRelationship to clean svg
		var tt = d3.select('#groupRelationship');
		tt.remove();

		// Second create the g element #groupRelationship
		var mainGroup = myContainer.append('svg:g')
			.attr("id", "groupRelationship")
			.attr('transform', 'translate(' + offsetx + ', ' + offsety + ')');
		
		var links = mainGroup.selectAll('g')
			.data(myArray)
			.enter()
			.append('svg:g')
			.attr('id', function(d, i) { return 'myid' + i; } )
			.attr("transform", function(d) {
				return 'translate(' + String(d.c * (config.texth + 2 * config.spacing)) + ',' + String(d.r * (config.texth + 2 * config.spacing)) + ')';
			});

		links.append("rect")
			.attr("class", "mycase classicdesign")
			.attr("x", config.spacing)
			.attr("y", config.spacing)
			.attr("width", config.texth)
			.attr("height", config.texth)
			.on("mouseover", JSqfd.handleMouseOver)
			.on("mouseout", JSqfd.handleMouseOut);
			
		links.append("line")
			.attr("class", "mycross flatdesign")
			.style("stroke", "Gray")
			.attr("x1", 0)
			.attr("y1", config.spacing + config.texth / 2)
			.attr("x2", config.texth + 2 * config.spacing)
			.attr("y2", config.spacing + config.texth / 2 );

		links.append("line")
			.attr("class", "mycross flatdesign")
			.style("stroke", "Gray")
			.attr("x1", config.spacing + config.texth / 2)
			.attr("y1", 0)
			.attr("x2", config.spacing + config.texth / 2)
			.attr("y2", config.texth + 2 * config.spacing);

		links.append("text")
			.attr("class", "mytext")
			.attr("x", config.spacing + config.texth / 2)
			.attr("y", config.spacing + config.texth / 2)
			.attr("dy", ".35em")
			.style("text-anchor", "middle")
			.text(function(d) {
				if (d.value === "strong") {
					return constant.text_strong;
				}
				if (d.value === "weak") {
					return constant.text_weak;
				}
			});

	};


	/**
	 * change theme design layout
	 * 
	 * @param {strind} name of theme
	 */
	var changeTheme = function(mybool) {
		var mytheme;
		var myelemcoll;

		if (mybool === true) {
			mytheme = 'flatdesign';
		} else {
			mytheme = 'classicdesign';
		}

		if (mytheme === 'flatdesign') {
			myelemcoll = d3.selectAll('.classicdesign');
			myelemcoll.style("opacity", 0);
			myelemcoll = d3.selectAll('.flatdesign');
			myelemcoll.style("opacity", 1);
		} else if (mytheme === 'classicdesign') {
			myelemcoll = d3.selectAll('.flatdesign');
			myelemcoll.style("opacity", 0);
			myelemcoll = d3.selectAll('.classicdesign');
			myelemcoll.style("opacity", 1);
		}
	};


	/**
	 * build correlation array
	 * 
	 * <p>
	 * build correlation array for triangle building
	 * losange is located at the middle of how[i] and how[j]
	 * more i and j are far, more losange is high located
	 * i is index of HOW previous
	 * j is index of HOW next
	 * </p>
	 * 
	 * @param {array} myHow
	 * @return {array} myCorr
	 */
	var buildCorrelations = function(myHow, index) {
		var myCorr = [];
		var i, j,
			idprev,
			idnext,
			len;

		len = myHow.length;

		for (i = 0; i <= len - 2; i += 1) {
			for (j = i + 1; j <= len - 1; j += 1) {
				// get id for HOW i and j
				idprev = myHow[i].id;
				idnext = myHow[j].id;

				myCorr.push({
					c: i,
					i: i,
					j: j,
					idp: idprev,
					idn: idnext,
					value: null
				});
				// Correlation exists if
				// line exists inside correlation array (index != -1)
				if (JSqfd.utils.arrayObjectIndexOf2(myObj[index].data, idprev, "source", idnext, "target") !== -1 ||
					JSqfd.utils.arrayObjectIndexOf2(myObj[index].data, idnext, "source", idprev, "target") !== -1) {
					myCorr[myCorr.length - 1].value = 1;
				}
			}
		}

		return myCorr;
	};

	/**
	 * Main function to draw QFD matrix
	 * 
	 * @param {object} myObj (JSON object)
	 * @param {boolean} compact (false or true)
	 */
	var doQFD = function(compact) {
		"use strict";

		var irow;
		var icol;
		var i;
		var len;
		var index;
		var index_cri;
		var index_char;
		var index_cor;
		var index_rel;
		var myHows = [];

		index_cri = 0;
		index_char = 1;
		index_cor = 2;
		index_rel = 3;


		// HOW characteristics -----------------------------------------------------
		var tx = "";
		for (icol = 0; icol <= myObj[index_char].data.length - 1; icol += 1) {
			// all hows linked to current how
			tx = "";
			for (i = 0; i <= myObj[index_char].data.length - 1; i += 1) {
				if (JSqfd.utils.arrayObjectIndexOf2(myObj[index_cor].data, myObj[index_char].data[i].id, "source", myObj[index_char].data[icol].id, "target") !== -1 ||
					JSqfd.utils.arrayObjectIndexOf2(myObj[index_cor].data, myObj[index_char].data[icol].id, "source", myObj[index_char].data[i].id, "target") !== -1) {

					tx += myObj[index_char].data[i].id;
					tx += " ";
				}
			}
			// stock all hows id (linked to current id)
			// inside .datacorr variable
			myObj[index_char].data[icol].datacorr = tx;
		}

		// HOWs ---------------------------------------------------------------
		myHows = JSON.parse(JSON.stringify(myObj[index_char]));

		// remove all HOWS without no relationship
		if (compact) {
			len = myHows.data.length;
			for (i = 0; i < len; i += 1) {
				// find position in array for characteristic and criteria
				irow = JSqfd.utils.arrayObjectIndexOf(myObj[index_rel].data, myHows.data[i].id, "source");
				icol = JSqfd.utils.arrayObjectIndexOf(myObj[index_rel].data, myHows.data[i].id, "target");

				if (irow === -1 && icol === -1) {
					myHows.data.splice(i, 1);
					len = myHows.data.length;
					i -= 1;
				}
			}
		}

		len = myHows.data.length;
		for (icol = 0; icol < len; icol += 1) {
			myHows.data[icol].c = icol;
		}


		// Correlations ------------------------------------------------------------
		var myCorrelations = [];
		myCorrelations = buildCorrelations(myHows.data, index_cor);
		drawCorrelation(svgContainer, myCorrelations);
		var corrlength = d3.select('#groupCorrelation').node().getBBox().height;
		
		// hows
		JSqfd.drawHow(svgContainer, myHows.data, corrlength + config.spacing);
		
		// Whats ------------------------------------------------------
		len = myObj[index_cri].data.length;
		for (irow = 0; irow < len; irow += 1) {
			myObj[index_cri].data[irow].r = irow;
		}
		JSqfd.drawWhat(svgContainer, myObj[index_cri].data, corrlength + config.spacing);

		// Relationships -----------------------------------------------------------
		var myRelationships = [];

		for (irow = 0; irow <= myObj[index_cri].data.length - 1; irow += 1) {
			for (icol = 0; icol <= myHows.data.length - 1; icol += 1) {

				myRelationships.push({
					c: icol,
					r: irow,
					char: myHows.data[icol].name,
					cri: myObj[index_cri].data[irow].name,
					charid: myHows.data[icol].id,
					criid: myObj[index_cri].data[irow].id,
					value: null
				});

			} // end for
		} // end for

		len = myObj[index_rel].data.length;
		for (i = 0; i < len; i += 1) {

			// find position in array for characteristic and criteria
			irow = JSqfd.utils.arrayObjectIndexOf(myObj[index_cri].data, myObj[index_rel].data[i].target, "id");
			icol = JSqfd.utils.arrayObjectIndexOf(myHows.data, myObj[index_rel].data[i].source, "id");

			// find the index inside myLinks[]
			// if no line (index = -1) inside array myLinks then no relationship
			index = JSqfd.utils.arrayObjectIndexOf2(myRelationships, icol, "c", irow, "r");
			if (index !== -1) {
				myRelationships[index].value = myObj[index_rel].data[i].value;
			}
		}

		// draw RELATIONSHIPS ------------------------------------------------------
		JSqfd.drawRelationship(svgContainer, myRelationships, corrlength + config.spacing);

		// draw IMPORTANCE of HOWs
		JSqfd.drawHowsImportance(svgContainer, myHows.data, myObj[index_cri].data.length, corrlength + config.spacing);


		return 0;
	};


	/**
	 * Load a JSON document from server
	 * 
	 * @param {string} url
	 */
	var readfile = function(myurl) {

		var request = new XMLHttpRequest();
		var strTemp;
		request.open('GET', myurl, false); // `false` makes the request synchronous
		request.send(null);
		if (request.status === 200) {
			strTemp = request.responseText;
			if (IsJsonString(strTemp)) {
				myObj = JSON.parse(strTemp);
			} else {
				alert("Error object file!");
			}
		}
		return 0;
	};



	/**
	 * read data from div container id
	 * 
	 * @param {string} container id
	 */
	var read = function(mycontainer) {
		var myText = '';
		if (myObj.length === undefined) {
			myText = document.getElementById(mycontainer).innerHTML;
			if (IsJsonString(myText)) {
				myObj = JSON.parse(myText);
			} else {
				alert("Error object file!");
			}
		}
	};


	/**
	 * Initiate QFD building
	 */
	var init = function(mycontainer, myurl, item) {
		// Add procedure for myurl
		if (myurl === null) {
			read(mycontainer);
		} else {
			readfile(myurl);
		}
		svgContainer = d3.select("#svg1");
		doQFD(item);
		changeTheme(false);
	};

	/**
	 * get data
	 */
	var getData = function() {
		return myObj;
	};

	/**
	 * draw legend
	 * 
	 * @param {string} container
	 * @param {boolean} visible or hidden
	 */
	var drawLegend = function(mycontainer, statusvisible) {

		var svg;
		if (statusvisible === true) {

			svg = d3.select("#" + mycontainer).append("svg")
				.attr("width", 300)
				.attr("height", 100)
				.append("g")
				.attr("class", "legend");

			svg.append('text')
				.attr('class', 'mytext')
				.attr('x', 5)
				.attr('y', 15)
				.attr('font-weight', "bold")
				.text("Legend: ");

			svg.append('text')
				.attr('class', 'mytext')
				.attr('x', 5)
				.attr('y', 15 + 1 * 20)
				.text(" - Correlation: positive " + constant.text_cross + " / negative " + constant.text_crossneg);

			svg.append('text')
				.attr('class', 'mytext')
				.attr('x', 5)
				.attr('y', 15 + 2 * 20)
				.text(" - Relationship: strong " + constant.text_strong + " / weak " + constant.text_weak);
		} else {
			svg = d3.select("#" + mycontainer + " svg");
			svg.remove();
		}
	};

	return {
		drawLegend: drawLegend,
		read: read,
		readfile: readfile,
		getData: getData,
		init: init,
		drawDialogbox: drawDialogbox,
		doQFD: doQFD,
		changeTheme: changeTheme,
		handleMouseOver: handleMouseOver,
		handleMouseOut: handleMouseOut,
		drawHow: drawHow,
		drawHowsImportance: drawHowsImportance,
		drawCorrelation: drawCorrelation,
		drawWhat: drawWhat,
		drawRelationship: drawRelationship,
		utils: {
			arrayObjectIndexOf: arrayObjectIndexOf,
			arrayObjectIndexOf2: arrayObjectIndexOf2,
			removeDuplicates: removeDuplicates,
			trunc: trunc,
			textlength: textlength
		}
	};
})();
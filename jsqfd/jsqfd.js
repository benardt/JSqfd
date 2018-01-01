/**
 * Library for QFD
 */


/*globals d3 */


'use strict';
/**
 * Library for QFD
 */
var JSqfd = (function() {

	var svgContainer;
	var myobj = {};

	var config = {
		texth: 20,
		textw: 220,
		bomh: 100,
		funcw: 100,
		rowoffset: 500,
		truncdialog: 44,
		aliashowsimportance: 'Manufacturing difficulty'
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

	var handleMouseOver = function(d) {

		d3.select("#" + d.charid)
			.attr("class", "mytexthowselected");
		d3.selectAll("." + d.charid)
			.attr("class", "mytexthowselected");
		d3.selectAll(".corr_" + d.charid)
			.style("fill", "Beige");

		var tt = d3.select("#groupDialogbox");

		tt.append("text").attr("class", "mytexthow textdialog")
			.attr("x", 10 + 2)
			.attr("y", 10 + 10)
			.attr("dy", ".35em")
			.text(trunc("Characteristic: " + d.char, config.truncdialog));

		tt.append("text").attr("class", "mytexthow textdialog")
			.attr("x", 10 + 2)
			.attr("y", 10 + 25)
			.attr("dy", ".35em")
			.text("Id: " + d.charid);

		tt.append("text").attr("class", "mytexthow textdialog")
			.attr("x", 10 + 2)
			.attr("y", 10 + 40)
			.attr("dy", ".35em")
			.text("Criteria: " + d.cri);

	};

	var handleMouseOut = function(d) {

		d3.selectAll(".mytexthowselected")
			.each(function() {
				d3.select(this).attr("class", "mytexthow " + d3.select(this).attr("data-corr"));
			});
		d3.selectAll(".corr_" + d.charid)
			.style("fill", "White");

		d3.selectAll(".textdialog").remove();
	};

	var drawDialogbox = function(myContainer) {

		var dialogBox = myContainer.append("g").attr("id", "groupDialogbox");
		dialogBox.append("rect").attr("class", "mybox")
			.attr("x", 10)
			.attr("y", 10)
			.attr("rx", 8)
			.attr("ry", 8)
			.attr("width", 250)
			.attr("height", 250)
			.style("stroke-opacity", 0.0);
	};

	var drawWhat = function(myContainer, myArray) {
		var i;
		var len = myArray.length;
		var functions = [];
		for (i = 0; i < len; i += 1) {
			functions.push(myArray[i].function);
		}
		functions = JSqfd.utils.removeDuplicates(functions);

		var whats = myContainer.append("g").attr("id", "groupWhats").selectAll("rect")
			.data(myArray)
			.enter();
		// What name function rectangle + text
		whats.append("rect").attr("class", "mybox")
			.style("fill", function(d) {
				return color(functions.indexOf(d.function));
			})
			.attr("x", 10)
			.attr("y", function(d) {
				return config.rowoffset + d.r * config.texth;
			})
			.attr("width", config.funcw)
			.attr("height", config.texth);
		whats.append("text").attr("class", "mytext")
			.attr("x", 10 + 2)
			.attr("y", function(d) {
				return config.rowoffset + config.texth / 2 + d.r * config.texth;
			})
			.attr("dy", ".35em")
			.text(function(d) {
				return d.function;
			});
		// What details rectangle + text
		whats.append("rect").attr("class", "mybox")
			.attr("x", 10 + config.funcw)
			.attr("y", function(d) {
				return config.rowoffset + d.r * config.texth;
			})
			.attr("width", config.textw)
			.attr("height", config.texth);
		whats.append("text").attr("class", "mytext")
			.attr("x", 10 + 2 + config.funcw)
			.attr("y", function(d) {
				return config.rowoffset + config.texth / 2 + d.r * config.texth;
			})
			.attr("dy", ".35em")
			.text(function(d) {
				return d.name;
			});
		return 0;
	};

	var drawHowsImportance = function(myContainer, myArray, level) {

		var howsImportanceLabel = myContainer.append("g").attr("id", "groupImportance");

		howsImportanceLabel.append("rect").attr("class", "mybox")
			.attr("x", 10 + config.funcw)
			.attr("y", config.rowoffset + level * config.texth)
			.attr("width", config.textw)
			.attr("height", config.texth);

		howsImportanceLabel.append("text").attr("class", "mytext")
			.attr("x", 10 + 2 + config.funcw)
			.attr("y", config.rowoffset + config.texth / 2 + level * config.texth)
			.attr("dy", ".35em")
			.style("font-weight", "bold")
			.text(config.aliashowsimportance);

		var howsImportance = myContainer.append("g").attr("id", "groupImportance").selectAll("rect")
			.data(myArray)
			.enter();

		howsImportance.append("rect")
			.attr("class", "mycase")
			.attr("x", function(d) {
				return 10 + config.funcw + config.textw + config.texth * d.c;
			})
			.attr("y", config.rowoffset + config.texth * level)
			.attr("width", config.texth)
			.attr("height", config.texth)
			.on("mouseover", JSqfd.handleMouseOver)
			.on("mouseout", JSqfd.handleMouseOut);

		howsImportance.append("text")
			.attr("class", "mytext")
			.attr("x", function(d) {
				return 10 + config.funcw + config.textw + config.texth * d.c + config.texth / 2;
			})
			.attr("y", config.rowoffset + config.texth / 2 + config.texth * level)
			.attr("dy", ".35em")
			.style("text-anchor", "middle")
			.text(function(d) {
				return d.importance;
			});

		return 0;
	};

	var drawHow = function(myContainer, myArray) {
		var bom = [];
		var i;
		var len = myArray.length;
		for (i = 0; i < len; i += 1) {
			bom.push(myArray[i].component);
		}
		bom = JSqfd.utils.removeDuplicates(bom);

		var hows = myContainer.append("g").attr("id", "groupHows").selectAll("rect")
			.data(myArray)
			.enter();
		hows.append("rect").attr("class", "mybox")
			.attr("x", function(d) {
				return 10 + config.funcw + config.textw + config.texth * d.c;
			})
			.attr("y", config.rowoffset - config.textw)
			.attr("width", config.texth)
			.attr("height", config.textw);
		hows.append("text").attr("class", function(d) {
				return "mytexthow " + d.datacorr;
			}) // space is important
			.attr("data-corr", function(d) {
				return d.datacorr;
			})
			.attr("id", function(d) {
				return d.id;
			})
			.attr("x", function(d) {
				return 10 + config.funcw + config.textw + config.texth * d.c;
			})
			.attr("y", config.rowoffset - config.textw)
			.attr("dy", ".35em")
			.attr("transform", function(d) {
				return "rotate(270 " + (10 + config.funcw + config.textw + config.texth * d.c) + " " + (config.rowoffset - config.textw) + ") translate(" + (0 - config.textw + 2) + " 10)";
			})
			.text(function(d) {
				return d.name;
			});
		hows.append("rect").attr("class", "mybox")
			.style("fill", function(d) {
				return color(bom.indexOf(d.component));
			})
			.attr("x", function(d) {
				return 10 + config.funcw + config.textw + config.texth * d.c;
			})
			.attr("y", config.rowoffset - config.textw - config.bomh)
			.attr("width", config.texth)
			.attr("height", config.bomh);
		hows.append("text")
			.attr("class", function(d) {
				var myVar = "";
				if (d.part === "assy") {
					myVar = "mytextassy";
				} else {
					myVar = "mytexthow";
				}
				return myVar;
			})
			.attr("x", function(d) {
				return 10 + config.funcw + config.textw + config.texth * d.c;
			})
			.attr("y", config.rowoffset - config.textw - config.bomh)
			.attr("dy", ".35em")
			.attr("transform", function(d) {
				return "rotate(270 " + (10 + config.funcw + config.textw + config.texth * d.c) + " " + (config.rowoffset - config.textw - config.bomh) + ") translate(" + (0 - config.bomh + 2) + " 10)";
			})
			.text(function(d) {
				return d.component;
			});
		return 0;
	};


	var drawCorrelation = function(myContainer, myArray) {

		var correlations = myContainer.append("g").selectAll("rect")
			.data(myArray)
			.enter();

		correlations.append("rect")
			.attr("class", function(d) {
				return "mylosange corr_" + d.idp + " corr_" + d.idn;
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
			.attr("width", config.texth * 0.70711)
			.attr("height", config.texth * 0.70711);


		var dummychar = svgContainer.append("text")
			.attr("class", "mytext")
			.attr("x", 0)
			.attr("y", 0)
			.text(JSqfd.constant.text_cross);
		// compute length of text to automatize the center position of text
		var tlength = dummychar.node().getComputedTextLength();
		dummychar.attr("style", "display: none;");

		correlations.append("text")
			.attr("class", "mytext")
			.attr("x", function(d) {
				return d.x - tlength * 0.5;
			})
			.attr("y", function(d) {
				return d.y + config.texth * 0.5;
			})
			.attr("dy", ".35em")
			.text(function(d) {
				if (d.value !== null) {
					return JSqfd.constant.text_cross;
				}
			});

		return 0;
	};

	var drawRelationship = function(myContainer, myArray) {

		var links = myContainer.append("g").attr("id", "groupRelationship").selectAll("rect")
			.data(myArray)
			.enter();

		links.append("rect")
			.attr("class", "mycase")
			.attr("x", function(d) {
				return 10 + config.funcw + config.textw + config.texth * d.c;
			})
			.attr("y", function(d) {
				return config.rowoffset + config.texth * d.r;
			})
			.attr("width", config.texth)
			.attr("height", config.texth)
			.on("mouseover", JSqfd.handleMouseOver)
			.on("mouseout", JSqfd.handleMouseOut);

		links.append("text")
			.attr("class", "mytext")
			.attr("x", function(d) {
				return 10 + config.funcw + config.textw + config.texth * d.c + config.texth / 2;
			})
			.attr("y", function(d) {
				return config.rowoffset + config.texth / 2 + config.texth * d.r;
			})
			.attr("dy", ".35em")
			.style("text-anchor", "middle")
			.text(function(d) {
				if (d.value === "strong") {
					return JSqfd.constant.text_strong;
				}
				if (d.value === "weak") {
					return JSqfd.constant.text_weak;
				}
			});
	};

	/**
	 * Main function to draw QFD matrix
	 * 
	 * @param {object} myObj (JSON object)
	 * @param {boolean} compact (false or true)
	 */
	var doQFD = function(myObj, compact) {
		"use strict";

		var irow;
		var icol;
		var i;
		var j;
		var len;
		var index;
		var index_cri;
		var index_char;
		var index_cor;
		var index_rel;
		var tmpHows = [];
		var idprev;
		var idnext;

		index_cri = 0;
		index_char = 1;
		index_cor = 2;
		index_rel = 3;

		// draw WHAT criteria ------------------------------------------------------
		len = myObj[index_cri].data.length;
		for (irow = 0; irow < len; irow += 1) {
			myObj[index_cri].data[irow].r = irow;
		}
		JSqfd.drawWhat(svgContainer, myObj[index_cri].data);

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

		// Draw HOWs ---------------------------------------------------------------
		tmpHows = JSON.parse(JSON.stringify(myObj[index_char]));

		// remove all HOWS without any relationship
		if (compact) {
			len = tmpHows.data.length;
			for (i = 0; i < len; i += 1) {
				// find position in array for characteristic and criteria
				irow = JSqfd.utils.arrayObjectIndexOf(myObj[index_rel].data, tmpHows.data[i].id, "source");
				icol = JSqfd.utils.arrayObjectIndexOf(myObj[index_rel].data, tmpHows.data[i].id, "target");

				if (irow === -1 && icol === -1) {
					tmpHows.data.splice(i, 1);
					len = tmpHows.data.length;
					i -= 1;
				}
			}
		}

		len = tmpHows.data.length;
		for (icol = 0; icol < len; icol += 1) {
			tmpHows.data[icol].c = icol;
		}

		JSqfd.drawHow(svgContainer, tmpHows.data);

		// build correlation array for triangle building----------------------------
		// i is index of HOW previous
		// j is index of HOW next

		var myCorrelations = [];
		len = tmpHows.data.length;

		for (i = 0; i <= len - 2; i += 1) {
			for (j = i + 1; j <= len - 1; j += 1) {
				// get id for HOW i and j
				idprev = tmpHows.data[i].id;
				idnext = tmpHows.data[j].id;

				myCorrelations.push({
					i: i,
					j: j,
					idp: idprev,
					idn: idnext,
					value: null
				});
				// Correlation exists if
				// line exists inside correlation array (index != -1)
				if (JSqfd.utils.arrayObjectIndexOf2(myObj[index_cor].data, idprev, "source", idnext, "target") !== -1 ||
					JSqfd.utils.arrayObjectIndexOf2(myObj[index_cor].data, idnext, "source", idprev, "target") !== -1) {
					myCorrelations[myCorrelations.length - 1].value = 1;
				}
			}
		}

		len = myCorrelations.length;
		for (i = 0; i < len; i += 1) {
			myCorrelations[i].x = 10 + config.funcw + config.textw + myCorrelations[i].j * config.texth - 0.5 * (myCorrelations[i].j - myCorrelations[i].i - 1) * config.texth;
			myCorrelations[i].y = config.rowoffset - config.bomh - config.textw - 0.5 * (myCorrelations[i].j - myCorrelations[i].i + 1) * config.texth;
		}

		drawCorrelation(svgContainer, myCorrelations);

		// Relationships -----------------------------------------------------------
		var myLinks = [];

		for (irow = 0; irow <= myObj[index_cri].data.length - 1; irow += 1) {
			for (icol = 0; icol <= tmpHows.data.length - 1; icol += 1) {

				myLinks.push({
					c: icol,
					r: irow,
					char: tmpHows.data[icol].name,
					cri: myObj[index_cri].data[irow].name,
					charid: tmpHows.data[icol].id,
					criid: myObj[index_cri].data[irow].id,
					value: null
				});

			} // end for
		} // end for

		len = myObj[index_rel].data.length;
		for (i = 0; i < len; i += 1) {

			// find position in array for characteristic and criteria
			irow = JSqfd.utils.arrayObjectIndexOf(myObj[index_cri].data, myObj[index_rel].data[i].target, "id");
			icol = JSqfd.utils.arrayObjectIndexOf(tmpHows.data, myObj[index_rel].data[i].source, "id");

			// find the index inside myLinks[]
			// if no line (index = -1) inside array myLinks then no relationship
			index = JSqfd.utils.arrayObjectIndexOf2(myLinks, icol, "c", irow, "r");
			if (index !== -1) {
				myLinks[index].value = myObj[index_rel].data[i].value;
			}
		}

		// draw RELATIONSHIPS ------------------------------------------------------
		JSqfd.drawRelationship(svgContainer, myLinks);

		// draw IMPORTANCE of HOWs
		JSqfd.drawHowsImportance(svgContainer, tmpHows.data, myObj[index_cri].data.length);

		return 0;
	};

	/**
	 * Initiate QFD building
	 */
	var init = function(mycontainer, myurl, item) {
		var myText = '';
		if (myobj.length === undefined) {
			svgContainer = d3.select("#svg1");
			myText = document.getElementById(mycontainer).innerHTML;
			myobj = JSON.parse(myText);
		}

		svgContainer.selectAll("*").remove();
		if (item.checked === true) {
			doQFD(myobj, true);
			drawDialogbox(svgContainer);
		} else {
			doQFD(myobj, false);
			drawDialogbox(svgContainer);
		}
		// Nothing: just to avoid eslint warning due to myurl not used
		// need to be coded
		myText = myurl;
	};

	var drawTreegrid = function() {

		// specify options
		var options = {
			"width": "800px",
			"height": "400px"
		};

		// Instantiate our treegrid object.
		var container = document.getElementById("mytreegrid");
		// The class name of the TreeGrid is links.TreeGrid
		var treegrid = new links.TreeGrid(container, options);
		var mydata = new links.DataTable(myobj);

		// Draw our treegrid with the created data and options 
		treegrid.draw(mydata);
	};

	return {
		init: init,
		drawTreegrid: drawTreegrid,
		drawDialogbox: drawDialogbox,
		doQFD: doQFD,
		handleMouseOver: handleMouseOver,
		handleMouseOut: handleMouseOut,
		drawHow: drawHow,
		drawHowsImportance: drawHowsImportance,
		drawCorrelation: drawCorrelation,
		drawWhat: drawWhat,
		drawRelationship: drawRelationship,
		constant: {
			text_strong: "\u25C9",
			text_weak: "\u25CE",
			text_cross: "\u274C"
		},
		utils: {
			arrayObjectIndexOf: arrayObjectIndexOf,
			arrayObjectIndexOf2: arrayObjectIndexOf2,
			removeDuplicates: removeDuplicates,
			trunc: trunc
		}
	};
})();
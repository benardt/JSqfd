# JSqfd
QFD (Quality Function deployement) drawing from JSON file

## Screenshots

![Global view](./misc/VueGlobale.png)

## Description

Javascript library to draw QFD (Quality function deployement). QFD are also called House of Quality.

For more details about QFD follow: https://en.wikipedia.org/wiki/Quality_function_deployment

## Features

* Reduce matrix by hidding rows and columns with no relationship
* Highlight data on mouse over

## Usage

### API reference

* JSqfd.init(mycontainer, myurl, item)
  * _mycontainer_: {string} id for div in html file
  * _myurl_: {string} not yet coded
  * _item_: {boolean} true or false to reduce or not QFD matrix

### Code example

Add JS libraries and style sheets links inside HEAD tag:
```html
<head>
	<script src="https://d3js.org/d3.v4.min.js" charset="utf-8"></script>
	<script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
	<script src="http://almende.github.io/chap-links-library/js/treegrid/treegrid.js"></script>
	<link rel="stylesheet" type="text/css" href="http://almende.github.io/chap-links-library/js/treegrid/treegrid.css">
	<link rel="stylesheet" type="text/css" href="./jsqfd/jsqfd.css">
	<script src="./jsqfd/jsqfd.js"></script>
</head>
```

### JSON file description

```json
[
{ "object": "what", "data": [ { "id":"r001", "name":"text", "function":"text", "weight":number}, ...]},
{ "object": "how", "data": [ { "id":"c001", "name":"text", "component":"text", "part":"part", "value": "", "importance":"number"}, ...]},
{ "object": "correlation", "data": [ { "id":"001", "source":"c001", "target":"c002" }, ...]},
{ "object": "relationship", "data": [ { "id":"l001", "source":"c002", "target":"r001", "value":"strong"}, ...]}
]
```

For relationship 'value' can be only _strong_ or _weak_.


## Dependencies

* d3 (https://github.com/d3/d3)
* treegrid (https://github.com/almende/chap-links-library/tree/master/js/src/treegrid)
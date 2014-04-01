"use strict";

var _objs_arr = [];
var _obj = {};
var _tmpStr = '';
var _delimiter = ':';
var _endTag = "<br/>";
var _mappings = {};

exports.config = function(opts){
	if( opts.hasOwnProperty('delimiter') ) 	_delimiter = opts.delimiter;
	if( opts.hasOwnProperty('endTag') ) 	_endTag = opts.endTag;  
	if( opts.hasOwnProperty('mappings') ) 	_mappings = opts.mappings;
}

exports.parse = function(str, cb){

	if( typeof str !== 'string' || !str.length ) return;

	var delimiter = _delimiter;

	var substr = str.trim();
	
	if( !substr.length ) return;

	var endTagIdx = substr.indexOf(_endTag);
	
	var slicedStr = _tmpStr + substr;

	var segments_arr = slicedStr.split( delimiter );

	segments_arr.forEach(function(seg){

		Object.keys(_mappings).forEach(function(key){

			var el = _mappings[key];
			if( seg.indexOf(el.tag) != -1 ){
				
				var startIdx =  slicedStr.indexOf(el.tag);
				if( startIdx == -1 ) return;

				var delimiterIdx = slicedStr.indexOf( _delimiter, startIdx);
				if( delimiterIdx == -1 ) return;

				var endIdx = delimiterIdx + (_delimiter.length );

				var s_left = slicedStr.substring(0, startIdx);  
				var s_right = slicedStr.substring(endIdx);
				slicedStr = s_left + s_right;

				var content = seg.replace(el.tag, "");
				var str = el.transform(content);
				_obj[key] = str;	

				return;
			}

		});

	});

	_tmpStr = slicedStr;

	if( endTagIdx >= 0 ){

		if(  !_isEmptyObject(_obj) ){
			_objs_arr.push(_obj);
		}

		if( typeof cb == 'function' ) cb( _obj );

		_obj = {};
		_tmpStr = '';	
	}

}

exports.getItems = function(){
	return _objs_arr;
}

exports.getItemAt = function(idx){
	idx = Math.abs(idx);
	if(!isNaN(idx) && idx < _objs_arr.length ){
		return _objs_arr[idx];
	}
	return null;
}

exports.clear = function(){
	_objs_arr.length = 0;
}

function _isEmptyObject( obj ){
	return (Object.getOwnPropertyNames(obj).length === 0);
}
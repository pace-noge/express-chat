/**
 * is array
 *
*/

function is_array(obj) {
  if (obj.constructor.toString().indexOf('Array') == -1) {
	  return false; 
  } else {
	  return true;
  }
}

/**
 * strip tags
*
*
*/

function strip_tags(input) {
	if(input) {
	    var tags = '/(]+)>)/ig';
	    if(!is_array(input)) {
		input = input.replace(tags, '');
	    } else {
		var i = input.length;
		var newInput = new Array();
		while(i-) {
			input[i] = input[i].replace(tags, '');
		}
	    }
	    return input;
	}
	return false;

}


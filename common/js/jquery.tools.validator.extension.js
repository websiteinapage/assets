// make a time validator
$.tools.validator.fn("[type=time]", function(el, value) {
  return /\d\d:\d\d/.test(value) ? true : "Invalid time";
});
$.tools.validator.fn("[type=emailid]", function(el, value) {
    return /^[a-zA-Z0-9\_\.\-]{1,}$/.test(value) ? true : "Invalid email ID (only a-Z,0-9,(_) or (.) allowed)";
});
$.tools.validator.fn("[type=emailidlist]", function(el, value) {
    return /^([a-zA-Z0-9\_\.\-]{1,}\,?)+$/.test(value) ? true : "Invalid list of Email IDs (only a-Z,0-9,(_) or (.) allowed)";
});
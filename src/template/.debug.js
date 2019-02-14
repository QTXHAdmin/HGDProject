/*! <DEBUG:undefined> */
function anonymous($data,$filename) {'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,course=$data.course,val=$data.val,index=$data.index,$escape=$utils.$escape,$value=$data.$value,$index=$data.$index,$out='';$each(course,function(val,index){
$out+='\r\n<p>\r\n  ';
$out+=$escape(val.id);
$out+='-';
$out+=$escape(val.course_name);
$out+='-';
$out+=$escape(val.author);
$out+='-';
$out+=$escape(val.college);
$out+='-';
$out+=$escape(val.category_Id);
$out+='\r\n</p>\r\n';
$each($data,function($value,$index){
return new String($out);}
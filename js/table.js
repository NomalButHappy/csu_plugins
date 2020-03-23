$(function(){
	$.getJSON("data/table.json", function(json) {
		console.log(json); // this will show the info it in firebug console
	});
	var str=[{name:"zy",age:111,sex:0,pass:1},{name:"zay",age:112},{name:"zby",age:113},{name:"zcy",age:114}];
	obj=eval(str);
	  var ht = '';
	  for(var i=0;i<obj.length;i++){
	    ht = ht+'<tr>';
	    ht = ht + '<td>' + obj[i].name + '</td>';
	    ht = ht + '<td>' + obj[i].age + '</td>';
	    ht = ht + '<td>' + obj[i].sex + '</td>';
	    ht = ht + '<td>' + obj[i].pass + '</td>';
	    ht = ht+'</tr>';
	  }
	  $('#tb').append(ht);
})
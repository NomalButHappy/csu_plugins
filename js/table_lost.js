$(function(){
	var str=[
	{Mon:"计算机图形学", Tue:"机器学习" , Wed:"", Thu:"上个吉儿课", Fri:"", Sat:"", Sun:""},
	{Mon:"计算机图形学", Tue:"机器学习" , Wed:"", Thu:"上个吉儿课", Fri:"", Sat:"", Sun:""},
	{Mon:"计算机图形学", Tue:"机器学习" , Wed:"", Thu:"上个吉儿课", Fri:"", Sat:"", Sun:""},
	{Mon:"计算机图形学", Tue:"机器学习" , Wed:"", Thu:"上个吉儿课", Fri:"", Sat:"", Sun:""},
	{Mon:"计算机图形学", Tue:"机器学习" , Wed:"", Thu:"上个吉儿课", Fri:"", Sat:"", Sun:""}
	];
	obj=eval(str);
	  var ht = '<thead><tr><th>Table table</th><th>Mon.</th><th>Tue.</th><th>Wed.</th><th>Thu.</th><th>Fri.</th><th>Sat.</th><th>Sun.</th></tr></thead><tbody>';
	  for(var i=0;i<obj.length;i++){
	    ht = ht+'<tr>';
		ht = ht + '<td>' + String(2*i+1) + '~' + String(2*i + 2) + '</td>';
	    ht = ht + '<td>' + obj[i].Mon + '</td>';
	    ht = ht + '<td>' + obj[i].Tue + '</td>';
	    ht = ht + '<td>' + obj[i].Wed + '</td>';
	    ht = ht + '<td>' + obj[i].Thu + '</td>';
		ht = ht + '<td>' + obj[i].Fri + '</td>';
		ht = ht + '<td>' + obj[i].Sat + '</td>';
		ht = ht + '<td>' + obj[i].Sun + '</td>';
	    ht = ht+'</tr>';
	  }
	  ht = ht + '</tbody>'
	  $('#tb').append(ht);
})
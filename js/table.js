$(function(){
	if ( typeof(localStorage.temp) == "undefined" ){
		console.log("没有");
		str = [["","","","","","",""],
		["","","","","","",""],
		["","","","","","",""],
		["","","","","","",""],
		["","","","","","",""],
		["","","","","","",""],
		];
		
		localStorage.setItem("temp",str);
		console.log(localStorage.getItem("temp"));
	} else {
		console.log("有");
		console.log(localStorage.getItem("temp"));
	}
	
	
	
	var obj = localStorage.getItem("temp").split(",");
	console.log(obj);
	  var ht = '<thead><tr><th>Table table</th><th>Mon.</th><th>Tue.</th><th>Wed.</th><th>Thu.</th><th>Fri.</th><th>Sat.</th><th>Sun.</th></tr></thead><tbody>';
	  for(var i = 0 ; i < 6 ; i++){
	    ht = ht+'<tr>';
		ht = ht + '<td>' + String(2*i+1) + '~' + String(2*i + 2) + '</td>';
		for(var j = 0 ; j < 7 ; j++)
		{
			ht = ht + '<td>' + obj[7*i+j]+ '</td>';
		}
	    ht = ht+'</tr>';
	  }
	  ht = ht + '</tbody>'
	  $('#tb').append(ht);
})
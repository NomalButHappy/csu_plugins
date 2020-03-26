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
			ht = ht + '<td class="table-td">' + obj[7*i+j]+ '</td>';
		}
		ht = ht+'</tr>';
	}
	ht = ht + '</tbody>'
	$('#tablecellsselection').append(ht);
	
	$('#tablecellsselection tr').on('dblclick','.table-td',function(){
		
		var index = $('#tablecellsselection tr td').index(this);
		console.log(index);
		
        var oldVal = $(this).text();
        var input = "<input type='text' id='tmpId' value='" + oldVal + "' >";
        $(this).text('');
        $(this).append(input);
		
		
		
        $('#tmpId').focus();
        $('#tmpId').blur(function(){
            if($(this).val() != ''){
                oldVal = $(this).val();
            }
            //closest：是从当前元素开始，沿Dom树向上遍历直到找到已应用选择器的一个匹配为止。
            $(this).closest('td').text(oldVal);
			obj[index - Math.ceil(index / 8)] = oldVal;
			console.log(obj);
			
			window.localStorage.removeItem("temp");
			localStorage.setItem("temp",obj);
        });
    });
})

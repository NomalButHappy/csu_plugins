layui.use(['layer', 'form', 'jquery'], function(){
    var layer = layui.layer,form = layui.form, $=layui.$;
    
    item_block=`<div class="layui-form-item">
    <label class="layui-form-label">{name}</label>
        <div class="layui-input-block">
            {item}
        </div>
    </div>`;
    submit_block=`<div class="layui-form-item">
    <div class="layui-input-block">
      <button class="layui-btn" lay-submit lay-filter="set">立即提交</button>
    </div>
</div>`;
    blocks={'switch':'<input type="checkbox" name="{name}" lay-skin="switch" lay-text="开启|关闭">'};
    
    items = [{'name':'通知监听','type':'switch','val':false},{'name':'桌面通知','type':'switch','val':true},{'name':'搜索提示','type':'switch','val':true}];
    form_val = {};
    form_doc = $('.layui-form');
    items.forEach(function(i){
        form_val[i['name']]=i['val'];
        //form_doc.append(item_block.format({'item':blocks[i['type']]}).format({'name':i['name']}));
    });
    // 读取保存的配置数据
	/*async function asyncload()
	{
		console.log(form_val);
		a = await bg.load_options(form_val);
		for(i in a){form_val[i]=a[i];}
		console.log(form_val);
		for(i in form_val)
		{
			if(form_val[i]=="on")
				form_val[i]=true;
			else if(form_val[i]=="off")
				form_val[i]=false;
		}
		console.log(form_val);
		form.val("main",form_val);
		form_doc.append(submit_block);
	}
	asyncload();*/
	
	bg.load_options(form_val);
    chrome.storage.sync.get(form_val, function(items) {
        form_val = items;
		for(i in form_val)
		{
			if(form_val[i]=="on")
				form_val[i]=true;
			else if(form_val[i]=="off")
				form_val[i]=false;
		}
		console.log(form_val);
		form.val("main",form_val);
		form_doc.append(submit_block);
	});
    
    form.on('submit(set)', function(data){
        res = form.val("main");
        for(i in form_val)
        {
            if(!(i in res))
                res[i] = false;
            else if(res[i]=="on") res[i]=true;
        }
        bg.save_options(res, function() {
            layer.msg("保存成功");
        });
    });
});
var form_val;
var bg = chrome.extension.getBackgroundPage();
// 扩展 String.format 功能
// 来源： https://www.jianshu.com/p/b957760c897c
String.prototype.format = function(args) {
	 var result = this;
	 if (arguments.length > 0) {
		 if (arguments.length == 1 && typeof (args) == "object") {
			 for (var key in args) {
				 if(args[key]!=undefined){
					 var reg = new RegExp("({" + key + "})", "g");
					 result = result.replace(reg, args[key]);
				 }
			 }
		 }
		 else {
			 for (var i = 0; i < arguments.length; i++) {
				 if (arguments[i] != undefined) {
					 var reg= new RegExp("({)" + i + "(})", "g");
					 result = result.replace(reg, arguments[i]);
				 }
			 }
		 }
	 }
	 return result;
 }

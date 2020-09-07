// omnibox
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
	var href = '';
	if(!text) 
		suggest([
		{content:'校内通知',description:'访问我的校内通知'}
		]);
	else
	{
		sgmsgs=[];
		NotifyServer.messages.forEach((item,index,array)=>{
			if(item.message>text||item.title>text)
				sgmsgs.push({content:item.url,description:item.title+': '+item.message});
		});
		suggest(sgmsgs);
	}
});

// 当用户接收关键字建议时触发
chrome.omnibox.onInputEntered.addListener((text) => {
    if(!text) return;
	herf = '';
	if(text=='校内通知') herf = 'popup.html';
	else herf=text;
	openUrlNewTab(herf);
});

// 新标签打开某个链接
function openUrlNewTab(url)
{
	chrome.tabs.create({url: url});
}

//发送文本通知
function notify(title, message, iconurl)
{
	if(!iconurl)
		iconurl = icon;
    chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: icon,
        title: title,
        message: message,
    });
}

//发送图片通知
function notify_img(title, message, imageurl, iconurl)
{
	if(!iconurl)
		iconurl = icon;
	chrome.notifications.create(null, {
		type: 'image',
		iconUrl: icon,
		title: title,
		message: message,
		imageUrl: imageurl,
	});
}

//发送一组通知
function notify_many(title, items, iconurl)
{
	if(!iconurl)
		iconurl = icon;
	chrome.notifications.create(null, {
		type: 'list',
		iconUrl: iconurl,
		title: title,
		message: '',
		items: items,
	});
}
chrome.notifications.onClicked.addListener(function(notificationId, byUser){
	openUrlNewTab('popup.html');
});
 
 //读取设置数据
 async function load_options(val)
 {
	await chrome.storage.sync.get(val, function(items){
		options = items;
		for(i in options)
		{
			if(options[i]=="on")
				options[i]=true;
			else if(options[i]=="off")
				options[i]=false;
		}
		console.log(options);
	});
	return options;
 }
 
 //保存设置数据
 function save_options(val, callback)
 {
	options = val;
		for(i in options)
		{
			if(options[i]=="on")
				options[i]=true;
			else if(options[i]=="off")
				options[i]=false;
		}
	chrome.storage.sync.set(val, callback);
 }

//服务器
//获得通知
function getMessages()
{
	//为其他页面提供的获取信息的接口
	return NotifyServer.messages;
}

function message(title, msg, time, url, imgurl)
{
	//消息类
	this.title = title;
	this.message = msg;
	this.time = time;
	this.url = url;
	if(imgurl)
		this.imgurl = imgurl;
}

//服务器类
var NotifyServer = new Object();
NotifyServer.start = function(interval){
	// 参数为每次监听时间间隔（频率）
	// 开始监听后， 定时循环对每个保存路径进行访问， 当发现未收录的通知时收录并发送通知
	// 此外，监听刚开始时理论上会进行一大波通知收录，届时会用到多条消息获取
	// 每次监听后都会更新最近更新时间。获取通知时只会获取在上次更新时间后出现的通知
	// 最初开始监听获得七天以内的消息
	this.listener = setInterval(chrome.storage.sync.get({lasttime: new Date(new Date()-86400000*7)}, function(items){
		lasttime = items['lasttime'];
		getmessages = [];
		//获取的同时检查消息是否有重复
		function check(messages){
			//过滤掉重复的消息并返回新的消息列表
			res = [];
			messages.forEach((item,index,array)=>{
				for(i=0;i<NotifyServer.messages.length;i++)
				{
					msgi=NotifyServer.messages[i];
					if(msgi.time<item.time)
						break;
					if(item.time==msgi.time&&item.message==msgi.message&&item.title==msgi.time)
						return;
				}
				res.push(item);
			});
			return res;
		}
		//整理未重复消息，按种类播送
		//暂不支持图片消息
		//同步执行异步操作效率很差，后面需要优化
		for(i in this.targets)
		{
			i.get(lasttime,function(tarmsgs){
				tarmsgs=check(tarmsgs);
				getmessages.push.apply(getmessages,tarmsgs);
			});
		}
		getmessages.sort(function(a,b){if(a.time>b.time) return 1; else return 0;}); //对消息按时间进行排序
		if(getmessages.length>1)
		{
			title = "您有多条消息";
			notify_many(title, getmessages);
		}
		else if(getmessages.length==1)
			notify(getmessages[0]);
		NotifyServer.messages.unshift.apply(NotifyServer.messages,getmessages);
		chrome.storage.sync.set({lasttime:new Date()},function(){console.log('Catch messages at: '+lasttime.toString())}); //更新时间
	}), interval);
	return this.listener;
};

NotifyServer.stop = function(){
	clearInterval(this.listener);
	this.listener = null;
};
NotifyServer.targets=[];

var target={
	name:'', //自定义名称
	tag:'',  //通知来源，如"中南大学信息学院"之类， 因为对不同通知的获取程序需要分别设计，因此要加以区分
	url:'',  //通知路径，监听将对具体路径内的消息列表进行监听
	get:function(lasttime){},  //获取通知的具体方法，需要具体实现。该方法的返回值需要包括是否有新通知，每个新通知的标题以及可能的图片等
					           //参数为上次获取时间。返回一个message列表，message内容见上
	/* 用户名和密码，因为部分路径需要登陆才能获取。然而直接保存用户名和密码的方式对于用户可能并不安全，以及现在的许多登陆模式需要验证，因此该方案仅做保留
	id='';
	passwd=''
	*/
	newtag:function(tag, getf){
		//用于产生一条新的监听类型
		res = this;
		res.tag = tag;
		res.get = getf;
		return res;
	},
	create:function(name, url){
	    // 用来产生一条待监听的路径
		res = this; 
		res.name = name;
		res.url = url; 
		return res;
	},
};
alltags = {}; //tag名为键，值为对应的target对象
//撰写爬取程序
alltags['中南大学新闻网']=target.newtag('中南大学新闻网',function(lasttime,callback){
	
});
alltags['中南大学计算机院']=target.newtag('中南大学计算机院',async function(lasttime,callback){
	if(!check_url(this.url))
		return;
	await $.get(url,function(data){
		dd=parseDom(data.responseText);
		remsg = [];
		name = this.name;
		dd.find('.download:first ul li').each(function(){
			msg = new message(title=name,msg=$(this).children('a').text(),time=new Date($(this).children('span').text()),url=$(this).children('a').attr('href'));
			if(new Date(msg.time)>lasttime)
				remsg.push(msg);
		});
		callback(remsg);
	});
});

//设置等待爬取链接
function settargets(tarlist,callback)
{
	targets = [];
	for(tar in tarlist)
	{
		targets.push(alltags[tar.tag].create(tar.name,tar.url));
	}
	NotifyServer.targets = targets;
	if(callback)
		callback();
}

//解析dom字符串
function parseDom(arg) {
　　 var objE = document.createElement("div");
　　 objE.innerHTML = arg;
　　 return $(objE);
};

/*部分测试
function clock()
{
    var d=new Date();
    var t=d.toLocaleTimeString();
    notify("Clock work", t);
}
var work = setInterval(clock,3000);
//test_items = [{title: 'test1', message: 'tttttttt'}, {title: 'test2', message: 'adaeafae'}, {title: 'test3', message: 'adxxxx'}];
//notify_img('测试图片', '一段测试内容', icon);
//notify_many("ayaya",test_items);
*/


var options;  //配置信息
function check_url(str){
	// 检查字符串是否是一个url
	part=/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/i;
	if(part.exec(str))
		return true;
	else
		return false;
};
var icon = 'img/icon.png';  //插件哦
NotifyServer.messages=[];  //储存通知
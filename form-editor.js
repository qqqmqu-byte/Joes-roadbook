// form-editor.js — 可视化表单编辑器（配合 index.html 内联的 rbCurData / rbSave）
// 用 tab 切换 JSON / 表单 两种编辑模式；表单保存时写入 localStorage 并 reload。
function rbSwitchTab(tab){
  var jv=document.getElementById('rbJsonView'), fv=document.getElementById('rbFormView');
  var tj=document.getElementById('tabJson'), tf=document.getElementById('tabForm');
  if(jv) jv.style.display = tab==='json'?'block':'none';
  if(fv) fv.style.display = tab==='form'?'block':'none';
  if(tj){tj.style.background=tab==='json'?'#D97757':'#F5F1EA';tj.style.color=tab==='json'?'#fff':'#6B6B6B';}
  if(tf){tf.style.background=tab==='form'?'#D97757':'#F5F1EA';tf.style.color=tab==='form'?'#fff':'#6B6B6B';}
  if(tab==='form') buildForm();
}
function esc(s){return (s==null?'':String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function toLocal(s){if(!s)return '';var m=(''+s).match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);return m?m[1]+'T'+m[2]:'';}
function fromLocal(s){if(!s)return '';return s+':00+08:00';}
// styles
function inp(){return 'width:100%;border:1px solid #E8DFD3;border-radius:10px;padding:8px;font-size:12px;color:#4A4A4A;box-sizing:border-box';}
function tx(){return 'width:100%;border:1px solid #E8DFD3;border-radius:10px;padding:8px;font-size:12px;color:#4A4A4A;box-sizing:border-box;resize:vertical;min-height:48px';}
function lbl(){return 'font-size:11px;font-weight:700;color:#1A1A1A;margin-bottom:3px';}
function mini(){return 'font-size:11px;color:#4A4A4A;margin-bottom:4px';}
function field(n,c){return '<div style="margin-bottom:8px"><div style="'+lbl()+'">'+n+'</div>'+c+'</div>';}
function h4(){return 'font-size:14px;font-weight:800;color:#1A1A1A;margin:14px 0 8px;border-left:3px solid #D97757;padding-left:8px';}
function card(){return 'background:#FAFAF7;border:1px solid #EDE7DD;border-radius:14px;padding:12px;margin-bottom:10px';}
function subcard(){return 'background:#fff;border:1px solid #F0E9DF;border-radius:10px;padding:8px;margin:6px 0';}
function sub(){return 'font-size:11px;font-weight:700;color:#A8472A;margin:6px 0 4px';}
function btnAdd(){return 'width:100%;padding:10px;margin:6px 0;border:1px dashed #D9B79E;border-radius:12px;background:#FFF7F1;color:#C25A3A;font-size:12px;font-weight:700;cursor:pointer';}
function btnAddSm(){return 'width:100%;padding:7px;margin:4px 0;border:1px dashed #D9B79E;border-radius:10px;background:#FFF7F1;color:#C25A3A;font-size:11px;cursor:pointer';}
function btnDel(){return 'border:none;background:#FBEAE3;color:#C25A3A;font-size:11px;padding:3px 8px;border-radius:8px;cursor:pointer';}
function btnSave(){return 'width:100%;padding:13px;margin-top:10px;border:none;border-radius:14px;background:linear-gradient(135deg,#D97757,#C25A3A);color:#fff;font-size:14px;font-weight:800;cursor:pointer';}

var _fd=null;
function buildForm(){
  try{ _fd = rbCurData(); }
  catch(e){ _fd = JSON.parse(JSON.stringify(window.ROADBOOK)); }
  var html='';
  html+='<div style="margin-bottom:6px">';
  html+=field('出发时间 tripStart','<input id="f_tripStart" type="datetime-local" value="'+toLocal(_fd.tripStart)+'" style="'+inp()+'">');
  html+=field('结束时间 tripEnd','<input id="f_tripEnd" type="datetime-local" value="'+toLocal(_fd.tripEnd)+'" style="'+inp()+'">');
  html+='</div>';
  html+='<h4 style="'+h4()+'">📅 每日行程</h4><div id="f_days"></div><button onclick="addDay()" style="'+btnAdd()+'">+ 添加一天</button>';
  html+='<h4 style="'+h4()+'">🍜 餐厅美食</h4><div id="f_rest"></div><button onclick="addRest()" style="'+btnAdd()+'">+ 添加餐厅</button>';
  html+='<h4 style="'+h4()+'">💰 预算</h4><div id="f_budget"></div><button onclick="addBudget()" style="'+btnAdd()+'">+ 添加预算项</button>';
  html+='<h4 style="'+h4()+'">🎒 装备清单</h4><div id="f_gear"></div><button onclick="addGear()" style="'+btnAdd()+'">+ 添加装备</button>';
  html+='<h4 style="'+h4()+'">🛡 安全贴士</h4><div id="f_tips"></div><button onclick="addTip()" style="'+btnAdd()+'">+ 添加贴士组</button>';
  html+='<button onclick="collectForm()" style="'+btnSave()+'">✓ 保存并生成路书</button>';
  html+='<p id="rbFormMsg" style="font-size:10px;color:#C25A3A;margin-top:8px;min-height:14px"></p>';
  var fv=document.getElementById('rbFormView');
  if(fv) fv.innerHTML=html;
  renderDays();renderRest();renderBudget();renderGear();renderTips();
}
function renderDays(){
  var html='';
  (_fd.days||[]).forEach(function(day,di){
    html+='<div style="'+card()+'">';
    html+='<div style="display:flex;justify-content:space-between;align-items:center"><b style="'+lbl()+'">第 '+(day.day||(di+1))+' 天</b><button onclick="delDay('+di+')" style="'+btnDel()+'">删除</button></div>';
    html+=field('日期','<input value="'+esc(day.date)+'" onchange="_fd.days['+di+'].date=this.value" style="'+inp()+'">');
    html+=field('标题','<input value="'+esc(day.title)+'" onchange="_fd.days['+di+'].title=this.value" style="'+inp()+'">');
    html+=field('图标','<input value="'+esc(day.icon)+'" onchange="_fd.days['+di+'].icon=this.value" style="'+inp()+'">');
    html+=field('海拔','<input value="'+esc(day.alt)+'" onchange="_fd.days['+di+'].alt=this.value" style="'+inp()+'">');
    html+=field('车程','<input value="'+esc(day.drive)+'" onchange="_fd.days['+di+'].drive=this.value" style="'+inp()+'">');
    html+=field('强度','<input value="'+esc(day.intensity)+'" onchange="_fd.days['+di+'].intensity=this.value" style="'+inp()+'">');
    html+=field('住宿','<input value="'+esc(day.stay)+'" onchange="_fd.days['+di+'].stay=this.value" style="'+inp()+'">');
    html+=field('住宿价','<input value="'+esc(day.stayPrice)+'" onchange="_fd.days['+di+'].stayPrice=this.value" style="'+inp()+'">');
    html+=field('贴士','<textarea onchange="_fd.days['+di+'].tip=this.value" style="'+tx()+'">'+esc(day.tip)+'</textarea>');
    html+='<div style="'+sub()+'">行程条目</div>';
    (day.items||[]).forEach(function(it,ii){
      html+='<div style="'+subcard()+'">';
      html+='<div style="'+mini()+'">'+esc(it.t||'')+' '+esc(it.p||'')+' <button onclick="delItem('+di+','+ii+')" style="'+btnDel()+'">✕</button></div>';
      html+=field('时间','<input value="'+esc(it.t)+'" onchange="_fd.days['+di+'].items['+ii+'].t=this.value" style="'+inp()+'">');
      html+=field('内容','<input value="'+esc(it.p)+'" onchange="_fd.days['+di+'].items['+ii+'].p=this.value" style="'+inp()+'">');
      html+=field('图标','<input value="'+esc(it.tr)+'" onchange="_fd.days['+di+'].items['+ii+'].tr=this.value" style="'+inp()+'">');
      html+=field('标签','<input value="'+esc(it.tag)+'" onchange="_fd.days['+di+'].items['+ii+'].tag=this.value" style="'+inp()+'">');
      html+=field('描述','<textarea onchange="_fd.days['+di+'].items['+ii+'].d=this.value" style="'+tx()+'">'+esc(it.d)+'</textarea>');
      html+='</div>';
    });
    html+='<button onclick="addItem('+di+')" style="'+btnAddSm()+'">+ 添加行程条目</button>';
    html+='</div>';
  });
  var el=document.getElementById('f_days'); if(el) el.innerHTML=html;
}
function renderRest(){
  var html='';
  (_fd.restaurants||[]).forEach(function(r,i){
    html+='<div style="'+card()+'">';
    html+='<div style="display:flex;justify-content:space-between"><b style="'+lbl()+'">餐厅 '+(i+1)+'</b><button onclick="delRest('+i+')" style="'+btnDel()+'">删除</button></div>';
    html+=field('名称','<input value="'+esc(r.n)+'" onchange="_fd.restaurants['+i+'].n=this.value" style="'+inp()+'">');
    html+=field('城市','<input value="'+esc(r.city)+'" onchange="_fd.restaurants['+i+'].city=this.value" style="'+inp()+'">');
    html+=field('分类','<input value="'+esc(r.cat)+'" onchange="_fd.restaurants['+i+'].cat=this.value" style="'+inp()+'">');
    html+=field('价格','<input value="'+esc(r.price)+'" onchange="_fd.restaurants['+i+'].price=this.value" style="'+inp()+'">');
    html+=field('位置','<input value="'+esc(r.loc)+'" onchange="_fd.restaurants['+i+'].loc=this.value" style="'+inp()+'">');
    html+=field('地址','<input value="'+esc(r.addr)+'" onchange="_fd.restaurants['+i+'].addr=this.value" style="'+inp()+'">');
    html+=field('一句话','<input value="'+esc(r.desc)+'" onchange="_fd.restaurants['+i+'].desc=this.value" style="'+inp()+'">');
    html+=field('详情','<textarea onchange="_fd.restaurants['+i+'].intro=this.value" style="'+tx()+'">'+esc(r.intro)+'</textarea>');
    html+=field('招牌菜(逗号分隔)','<input value="'+esc((r.dishes||[]).join(','))+'" onchange="_fd.restaurants['+i+'].dishes=this.value.split(\',\').map(function(s){return s.trim();}).filter(Boolean)" style="'+inp()+'">');
    html+='</div>';
  });
  var el=document.getElementById('f_rest'); if(el) el.innerHTML=html;
}
function renderBudget(){
  var html='';
  (_fd.budget||[]).forEach(function(b,i){
    html+='<div style="'+card()+'">';
    html+='<div style="display:flex;justify-content:space-between"><b style="'+lbl()+'">预算 '+(i+1)+'</b><button onclick="delBudget('+i+')" style="'+btnDel()+'">删除</button></div>';
    html+=field('项目','<input value="'+esc(b.n)+'" onchange="_fd.budget['+i+'].n=this.value" style="'+inp()+'">');
    html+=field('金额','<input value="'+esc(b.v)+'" onchange="_fd.budget['+i+'].v=this.value" style="'+inp()+'">');
    html+=field('备注','<input value="'+esc(b.note)+'" onchange="_fd.budget['+i+'].note=this.value" style="'+inp()+'">');
    html+='<label style="font-size:11px;color:#4A4A4A"><input type="checkbox" '+(b.real?'checked':'')+' onchange="_fd.budget['+i+'].real=this.checked"> 真实花费</label>';
    html+='</div>';
  });
  var el=document.getElementById('f_budget'); if(el) el.innerHTML=html;
}
function renderGear(){
  var html='';
  (_fd.gear||[]).forEach(function(g,i){
    html+='<div style="'+card()+'">';
    html+='<div style="display:flex;justify-content:space-between"><b style="'+lbl()+'">装备 '+(i+1)+'</b><button onclick="delGear('+i+')" style="'+btnDel()+'">删除</button></div>';
    html+=field('分类','<input value="'+esc(g.cat)+'" onchange="_fd.gear['+i+'].cat=this.value" style="'+inp()+'">');
    html+=field('说明','<textarea onchange="_fd.gear['+i+'].desc=this.value" style="'+tx()+'">'+esc(g.desc)+'</textarea>');
    html+='</div>';
  });
  var el=document.getElementById('f_gear'); if(el) el.innerHTML=html;
}
function renderTips(){
  var html='';
  (_fd.travelTips||[]).forEach(function(t,i){
    html+='<div style="'+card()+'">';
    html+='<div style="display:flex;justify-content:space-between"><b style="'+lbl()+'">贴士组 '+(i+1)+'</b><button onclick="delTip('+i+')" style="'+btnDel()+'">删除</button></div>';
    html+=field('组标题','<input value="'+esc(t.title)+'" onchange="_fd.travelTips['+i+'].title=this.value" style="'+inp()+'">');
    html+=field('条目(每行一条)','<textarea onchange="_fd.travelTips['+i+'].items=this.value.split(\'\\n\').map(function(s){return s.trim();}).filter(Boolean)" style="'+tx()+'">'+esc((t.items||[]).join('\n'))+'</textarea>');
    html+='</div>';
  });
  var el=document.getElementById('f_tips'); if(el) el.innerHTML=html;
}
// add / del
function addDay(){_fd.days.push({day:(_fd.days.length+1),date:'',title:'新的一天',icon:'📍',alt:'',drive:'0km',intensity:'★☆☆☆☆',stay:'',stayPrice:'',tip:'',items:[]});renderDays();}
function delDay(i){_fd.days.splice(i,1);_fd.days.forEach(function(d,idx){d.day=idx+1;});renderDays();}
function addItem(di){_fd.days[di].items.push({t:'',p:'',tr:'',tag:'',d:''});renderDays();}
function delItem(di,ii){_fd.days[di].items.splice(ii,1);renderDays();}
function addRest(){_fd.restaurants.push({n:'',city:'',cat:'',price:'',loc:'',desc:'',addr:'',intro:'',dishes:[]});renderRest();}
function delRest(i){_fd.restaurants.splice(i,1);renderRest();}
function addBudget(){_fd.budget.push({n:'',v:'',real:false,note:''});renderBudget();}
function delBudget(i){_fd.budget.splice(i,1);renderBudget();}
function addGear(){_fd.gear.push({cat:'',desc:''});renderGear();}
function delGear(i){_fd.gear.splice(i,1);renderGear();}
function addTip(){_fd.travelTips.push({title:'',items:['']});renderTips();}
function delTip(i){_fd.travelTips.splice(i,1);renderTips();}
function collectForm(){
  try{
    _fd.tripStart=fromLocal(document.getElementById('f_tripStart').value);
    _fd.tripEnd=fromLocal(document.getElementById('f_tripEnd').value);
    var merged=Object.assign({},window.ROADBOOK,_fd);
    rbSave(merged);
  }catch(e){
    var m=document.getElementById('rbFormMsg'); if(m) m.textContent='保存失败：'+e.message;
  }
}

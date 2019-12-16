var thisRef = this;
thisRef.voiceData = {};


window.onerror = function(msg, url, line, col, error) {
    var errmsg = "file:" + url + "<br>line:" + line + " " + msg;
    l2dError(errmsg);
}

function main()
{
    this.platform = window.navigator.platform.toLowerCase();
    
    this.live2DMgr = new LAppLive2DManager();

    this.isDrawStart = false;
    
    this.gl = null;
    this.canvas = null;
    
    this.dragMgr = null; /*new L2DTargetPoint();*/ 
    this.viewMatrix = null; /*new L2DViewMatrix();*/
    this.projMatrix = null; /*new L2DMatrix44()*/
    this.deviceToScreen = null; /*new L2DMatrix44();*/
    this.modelMatrix = null;
    
    this.drag = false; 
    this.oldLen = 0;    
    
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    
    this.isModelShown = false;

    this.hold = false;

    this.charData = CharData;

    this.analyser = null;

    this.lastTime = 0;
    this.isDuo = false;

    //this.voiceData = {};

    this.test = "OwO";

    
    
    initModelSelection(this.charData[LAppDefine.CHAR_MODEL]);
    initL2dCanvas("glcanvas");    
    soundAnalyser();
    
    init();
}

function initModelSelection(data)
{
    while (document.getElementById("select_expression").firstChild) {
        document.getElementById("select_expression").removeChild(document.getElementById("select_expression").firstChild);
    }
    while (document.getElementById("select_motion").firstChild) {
        document.getElementById("select_motion").removeChild(document.getElementById("select_motion").firstChild);
    }
    for (var key in data.SKIN){
        var opt = document.createElement("option");
        opt.text = key;
        var temp = "";
        if (data.SKIN[key].split(",").length > 0) {
            for (var k in data.SKIN[key].split(",")) {
                if (k == 0)
                    temp += data.ID+""+data.SKIN[key].split(",")[k];
                else
                    temp += "," + data.ID+""+data.SKIN[key].split(",")[k];
            }
            opt.value = temp;
        } else 
            opt.value = data.ID+""+data.SKIN[key];
        document.getElementById("select_model").appendChild(opt);
    }
    document.getElementById("select_model").value.split(",").length > 1 ? this.isDuo = true : isDuo = false;
    
}

function chg_model()
{
    clearTimeout(this.motionTimeout);
    if (typeof this.audio !== 'undefined')
        this.audio.pause();
    changeModel();
}

function initL2dCanvas(canvasId)
{
    
    this.canvas = document.getElementById(canvasId);
    
    
    if(this.canvas.addEventListener) {
        this.canvas.addEventListener("mousewheel", mouseEvent, false);
        this.canvas.addEventListener("click", mouseEvent, false);
        
        this.canvas.addEventListener("mousedown", mouseEvent, false);
        this.canvas.addEventListener("mousemove", mouseEvent, false);
        
        this.canvas.addEventListener("mouseup", mouseEvent, false);
        this.canvas.addEventListener("mouseout", mouseEvent, false);
        this.canvas.addEventListener("contextmenu", mouseEvent, false);
        
        
        this.canvas.addEventListener("touchstart", touchEvent, false);
        this.canvas.addEventListener("touchend", touchEvent, false);
        this.canvas.addEventListener("touchmove", touchEvent, false);
        
    }

    document.getElementById("btnReset").addEventListener("click", function(e) {
        init();
    }, false);
    document.getElementById("btnBg").addEventListener("click", function(e) {
        initBgSelector();
    }, false);
    $("#btnCharacter").click(() => { 
        clearTimeout(this.motionTimeout);
        if (typeof this.audio !== 'undefined')
            this.audio.pause();
        loadCharList() 
    });
    $("#select_motion").change(() => {
        clearTimeout(this.motionTimeout);
        if (typeof this.audio !== 'undefined')
            this.audio.pause();
        thisRef.live2DMgr.changeMotion(0, $("#select_motion").val());
    });
    window.onresize = (event) => {
        if (event === void 0) { event = null; }
        if (document.getElementById("darken") != null){
            document.getElementById("darken").top = window.pageYOffset + "px";
            document.getElementById("selector").top = (window.pageYOffset + (window.innerHeight * 0.05)) + "px";
        }
        resize();
    };
    $(document).ready(() => {
        resize();
    });
       
}


function init()
{    

    
    var width = this.canvas.width;
    var height = this.canvas.height;
    
    this.dragMgr = new L2DTargetPoint();

    
    var ratio = height / width;
    var left = LAppDefine.VIEW_LOGICAL_LEFT;
    var right = LAppDefine.VIEW_LOGICAL_RIGHT;
    var bottom = -ratio;
    var top = ratio;

    this.viewMatrix = new L2DViewMatrix();

    
    this.viewMatrix.setScreenRect(left, right, bottom, top);
    
    
    this.viewMatrix.setMaxScreenRect(LAppDefine.VIEW_LOGICAL_MAX_LEFT,
                                     LAppDefine.VIEW_LOGICAL_MAX_RIGHT,
                                     LAppDefine.VIEW_LOGICAL_MAX_BOTTOM,
                                     LAppDefine.VIEW_LOGICAL_MAX_TOP); 

    this.viewMatrix.setMaxScale(LAppDefine.VIEW_MAX_SCALE);
    this.viewMatrix.setMinScale(LAppDefine.VIEW_MIN_SCALE);

    this.projMatrix = new L2DMatrix44();
    this.projMatrix.multScale(1, (width / height));

    this.modelMatrix = [];
    this.modelMatrix.push(new L2DModelMatrix());
    this.modelMatrix.push(new L2DModelMatrix()); 
 
    
    this.deviceToScreen = new L2DMatrix44();
    this.deviceToScreen.multTranslate(-width / 2.0, -height / 2.0);
    this.deviceToScreen.multScale(2 / width, -2 / width);
    
    
    
    this.gl = getWebGLContext();
    if (!this.gl) {
        l2dError("Failed to create WebGL context.");
        return;
    }
    
    Live2D.setGL(this.gl);

    
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);

    changeModel();
    
    startDraw();
    modelScaling(0.6, 0, 0);
}


function startDraw() {
    if(!this.isDrawStart) {
        this.isDrawStart = true;
        (function tick() {
                draw(); 

                var requestAnimationFrame = 
                    window.requestAnimationFrame || 
                    window.mozRequestAnimationFrame ||
                    window.webkitRequestAnimationFrame || 
                    window.msRequestAnimationFrame;

                
                requestAnimationFrame(tick ,this.canvas);   
        })();
    }
}


function draw()
{
    // l2dLog("--> draw()");
    //console.log(this.live2DMgr.models);

    for (var i = 0; i < this.live2DMgr.numModels(); i++)
    {
        //if (i == 1)
            //continue;

        var model = this.live2DMgr.getModel(i);

        if (model.modelSetting == null) return;

        var index = model.matrixNumber;

        Util.MatrixStack[index].reset();
        Util.MatrixStack[index].loadIdentity();
        
        this.dragMgr.update(); 
        this.live2DMgr.setDrag(i, this.dragMgr.getX(), this.dragMgr.getY());
        
        
        //this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        Util.MatrixStack[index].multMatrix(projMatrix.getArray());
        Util.MatrixStack[index].multMatrix(viewMatrix.getArray());
        Util.MatrixStack[index].multMatrix(modelMatrix[index].getArray());
        Util.MatrixStack[index].push();

        if(model == null) return;

        if (model.initialized && !model.updating)
        {
            model.update();
            model.draw(this.gl);

            if (!this.isModelShown && i == this.live2DMgr.numModels()-1) {
                this.isModelShown = !this.isModelShown;
                document.getElementById("select_model").removeAttribute("disabled");
            }
        }

        Util.MatrixStack[index].pop();

    }
    
    
}

function chg_expr() {
    clearTimeout(this.motionTimeout);
    if (typeof this.audio !== 'undefined')
        this.audio.pause();
    this.live2DMgr.changeExpressionById(0, document.getElementById("select_expression").selectedIndex);
}

function changeModel()
{
    while (document.getElementById("select_expression").firstChild) {
        document.getElementById("select_expression").removeChild(document.getElementById("select_expression").firstChild);
    }
    while (document.getElementById("select_motion").firstChild) {
        document.getElementById("select_motion").removeChild(document.getElementById("select_motion").firstChild);
    }
    document.getElementById("select_model").value.split(",").length > 1 ? this.isDuo = true : isDuo = false;
    this.activeVoice = 0;
    if (this.isDuo){
        this.modelMatrix[0].setPosition(LAppDefine.DUAL_MODEL_POSITION_X[0], LAppDefine.MODEL_POSITION_Y); 
        this.modelMatrix[1].setPosition(LAppDefine.DUAL_MODEL_POSITION_X[1], LAppDefine.MODEL_POSITION_Y);
        document.getElementById("select_model").setAttribute("disabled","disabled");
        $("#select_voice").prop("disabled", true);
        this.isModelShown = false;
        
        this.live2DMgr.reloadFlg = true;
        this.live2DMgr.count++;    

        this.live2DMgr.changeModel(this.gl, document.getElementById("select_model").value.split(","));
        this.live2DMgr.getExpressions(0, loadExpressionSelector);
        this.live2DMgr.getMotions(0, loadMotionSelector);
        loadVoice(document.getElementById("select_model").value.split(",")[0]);
        return;
    }

    this.modelMatrix[0].setPosition(LAppDefine.MODEL_POSITION_X, LAppDefine.MODEL_POSITION_Y); 
    document.getElementById("select_model").setAttribute("disabled","disabled");
    $("#select_voice").prop("disabled", true);
    this.isModelShown = false;
    
    this.live2DMgr.reloadFlg = true;
    this.live2DMgr.count++;    

    this.live2DMgr.changeModel(this.gl, document.getElementById("select_model").value);
    this.live2DMgr.getExpressions(0, loadExpressionSelector);
    this.live2DMgr.getMotions(0, loadMotionSelector);
    loadVoice($("#select_model").val());
}

function loadExpressionSelector(expressions){
    for (var j in expressions) {
        var opt = document.createElement("option");
        opt.text = j;
        opt.value = j;
        document.getElementById("select_expression").appendChild(opt);
    }
}

function loadMotionSelector(motions){
    for (var i in motions) {
        var opt = document.createElement("option");
        opt.text = i;
        opt.value = i;
        document.getElementById("select_motion").appendChild(opt);
    }
}




function modelScaling(scale, x, y)
{   
    var isMaxScale = thisRef.viewMatrix.isMaxScale();
    var isMinScale = thisRef.viewMatrix.isMinScale();
    
    thisRef.viewMatrix.adjustScale(x, y, scale);

    
    if (!isMaxScale)
    {
        if (thisRef.viewMatrix.isMaxScale())
        {
            thisRef.live2DMgr.maxScaleEvent();
        }
    }
    
    if (!isMinScale)
    {
        if (thisRef.viewMatrix.isMinScale())
        {
            thisRef.live2DMgr.minScaleEvent();
        }
    }
}



function modelTurnHead(event)
{
    thisRef.drag = true;
    
    var rect = event.target.getBoundingClientRect();
    
    var sx = transformScreenX(event.clientX - rect.left);
    var sy = transformScreenY(event.clientY - rect.top);
    var vx = transformViewX(event.clientX - rect.left);
    var vy = transformViewY(event.clientY - rect.top);
    
    if (LAppDefine.DEBUG_MOUSE_LOG)
        l2dLog("onMouseDown device( x:" + event.clientX + " y:" + event.clientY + " ) view( x:" + vx + " y:" + vy + ")");

    thisRef.lastMouseX = sx;
    thisRef.lastMouseY = sy;

    thisRef.dragMgr.setPoint(vx, vy); 
    
    
    thisRef.live2DMgr.tapEvent(vx, vy);
}

function setHold(event)
{
    thisRef.hold = true;
    
    var rect = event.target.getBoundingClientRect();
    
    var sx = transformScreenX(event.clientX - rect.left);
    var sy = transformScreenY(event.clientY - rect.top);
    
    thisRef.lastMouseX = sx;
    thisRef.lastMouseY = sy;
}

function dragPosition(event)
{
    var rect = event.target.getBoundingClientRect();
    
    var sx = transformScreenX(event.clientX - rect.left);
    var sy = transformScreenY(event.clientY - rect.top);


    if (thisRef.hold){
        if (!this.isDuo)
            thisRef.modelMatrix[0].setPosition((sx - thisRef.lastMouseX) + thisRef.modelMatrix[0].tr[12], (sy - thisRef.lastMouseY) + thisRef.modelMatrix[0].tr[13]);

        thisRef.lastMouseX = sx;
        thisRef.lastMouseY = sy;
    }
}



function followPointer(event)
{    
    var rect = event.target.getBoundingClientRect();

    var sx = transformScreenX(event.clientX - rect.left);
    var sy = transformScreenY(event.clientY - rect.top);
    var vx = transformViewX(event.clientX - rect.left);
    var vy = transformViewY(event.clientY - rect.top);
    
    if (LAppDefine.DEBUG_MOUSE_LOG)
        l2dLog("onMouseMove device( x:" + event.clientX + " y:" + event.clientY + " ) view( x:" + vx + " y:" + vy + ")");

    if (thisRef.drag)
    {
        thisRef.lastMouseX = sx;
        thisRef.lastMouseY = sy;

        thisRef.dragMgr.setPoint(vx, vy); 
    }
}



function lookFront()
{   
    if (thisRef.drag)
    {
        thisRef.drag = false;
    }

    thisRef.dragMgr.setPoint(0, 0);
}


function mouseEvent(e)
{
    e.preventDefault();
    
    if (e.type == "mousewheel") {

        if (e.clientX < 0 || thisRef.canvas.clientWidth < e.clientX || 
        e.clientY < 0 || thisRef.canvas.clientHeight < e.clientY)
        {
            return;
        }
        
        if (e.wheelDelta > 0) modelScaling(1.1, 0, 0); 
        else modelScaling(0.9, 0, 0); 

        
    } else if (e.type == "mousedown") {

        
        if("button" in e && e.button == 2){
            setHold(e);
            return;
        }
        
        modelTurnHead(e);
        
    } else if (e.type == "mousemove") {
        
        dragPosition(e);

        followPointer(e);
        
    } else if (e.type == "mouseup") {
        
        
        if("button" in e && e.button == 2){
            if (thisRef.hold)
                thisRef.hold = false;
            return;
        }
        
        lookFront();
        
    } else if (e.type == "mouseout") {
        
        lookFront();
        
    } else if (e.type == "contextmenu") {
        
        //changeModel();
    }

}


function touchEvent(e)
{
    e.preventDefault();
    
    var touch = e.touches[0];
    
    if (e.type == "touchstart") {
        if (e.touches.length == 1) modelTurnHead(touch);
        // onClick(touch);
        
    } else if (e.type == "touchmove") {
        followPointer(touch);
        
        if (e.touches.length == 2) {
            var touch1 = e.touches[0];
            var touch2 = e.touches[1];
            
            var len = Math.pow(touch1.pageX - touch2.pageX, 2) + Math.pow(touch1.pageY - touch2.pageY, 2);
            if (thisRef.oldLen - len < 0) modelScaling(1.025, 0, 0); 
            else modelScaling(0.975, 0, 0); 
            
            thisRef.oldLen = len;
        }
        
    } else if (e.type == "touchend") {
        lookFront();
    }
}




function transformViewX(deviceX)
{
    var screenX = this.deviceToScreen.transformX(deviceX); 
    return viewMatrix.invertTransformX(screenX); 
}


function transformViewY(deviceY)
{
    var screenY = this.deviceToScreen.transformY(deviceY); 
    return viewMatrix.invertTransformY(screenY); 
}


function transformScreenX(deviceX)
{
    return this.deviceToScreen.transformX(deviceX);
}


function transformScreenY(deviceY)
{
    return this.deviceToScreen.transformY(deviceY);
}



function getWebGLContext()
{
    var NAMES = [ "webgl" , "experimental-webgl" , "webkit-3d" , "moz-webgl"];

    for( var i = 0; i < NAMES.length; i++ ){
        try{
            var ctx = this.canvas.getContext(NAMES[i], {premultipliedAlpha : true});
            if(ctx) return ctx;
        }
        catch(e){}
    }
    return null;
};



function l2dLog(msg) {
    if(!LAppDefine.DEBUG_LOG) return;
    
    var myconsole = document.getElementById("myconsole");
    myconsole.innerHTML = myconsole.innerHTML + "<br>" + msg;
    
    console.log(msg);
}



function l2dError(msg)
{
    if(!LAppDefine.DEBUG_LOG) return;
    
    l2dLog( "<span style='color:red'>" + msg + "</span>");
    
    console.error(msg);
};

function initBgSelector()
{
    var div = document.createElement('div');
    div.className = "darken";
    div.id = "darken";
    div.style.top = window.pageYOffset + "px";
    div.addEventListener("click", function(e) {
            document.body.removeChild(document.getElementById("selector"));
            document.body.removeChild(document.getElementById("darken"));
            document.body.style.overflow = "auto";
        }, false);
    document.body.appendChild(div);
    document.body.style.overflow = "hidden";
    var selector = document.createElement('div');
    selector.id = "selector";
    selector.className = "selector";
    selector.style.top = (window.pageYOffset + (window.innerHeight * 0.05)) + "px" ;
    document.body.appendChild(selector);
    for (var i = 0; i < BackgroundList.length; i++){
        var img = document.createElement('div');
        img.className = "thumbbutton";
        img.style.backgroundImage = "url(https://media.nuke.moe/magireco/assets/bg/static/"+BackgroundList[i].FILE+")";
        img.style.backgroundSize = "120px 90px";
        img.id = BackgroundList[i].FILE;
        img.addEventListener("click", function(e) {
            document.getElementById("back_ground").style.backgroundImage = "url(https://media.nuke.moe/magireco/assets/bg/static/"+this.id+")";
            document.body.removeChild(document.getElementById("selector"));
            document.body.removeChild(document.getElementById("darken"));
            document.body.style.overflow = "auto";
    }, false);
        document.getElementById("selector").appendChild(img);
    }
}

function loadCharList() {
    $(document.body).append($("<div></div>")
            .attr("id","darken")
            .addClass("darken")
            .css("top", window.pageYOffset + "px")
            .click(function(){
                $('#selector').remove();
                $('#darken').remove();
                $(document.body).css("overflow", "auto");
                thisRef.charData = CharData;
            }))
        .append($("<div></div>")
            .attr("id","selector")
            .addClass("selector")
            .css("top", (window.pageYOffset + (window.innerHeight * 0.05)) + "px"))
        .css("overflow", "hidden");
        $("#selector").append($("<div></div>")
                .attr("id","searchContainer")
                .addClass("searchContainer")
                .css({"padding" : "15px"})
                .append($("<input>")
                    .attr("id","searchField")
                    .addClass("form-control")
                    .css({"display" : "inline-block", "width" : "50%"})
                    .on("keyup", function(){
                        var key = event.keyCode || event.charCode;
                        search(key);
                    })))
            .append($("<div></div>")
                .attr("id","resultContainer")
                .addClass("resultContainer"));
            loadResults(this.charData);
}

function loadResults (data){
    $("#resultContainer").empty();
    for (var value in data){
        $("#resultContainer").append($("<div></div>")
            .addClass("megucaIcon")
            .attr("id","meguca_"+value)
            .css("background", "url(https://media.nuke.moe/magireco/assets/icon/"+data[value].ICON+")")
            .css("background-size", "130px 144px")
            .mouseover(function(){
                $(this).css("background-size", "105%");
            })
            .mouseout(function(){
                $(this).css("background-size", "100%");
            })
            .click(function(){
                $("#select_model").empty();
                initModelSelection(data[$(this).attr("id").slice(7)]);
                changeModel();
                $('#selector').remove();
                $('#darken').remove();
                $(document.body).css("overflow", "auto");
                thisRef.charData = CharData;
            }));     
    }
}

function search (key) {
    if (key != null){
        if (key == 8 || key == 46)
            this.charData = CharData;
    }
    var data = {};
    var r = new RegExp($("#searchField").val().toLowerCase().trim());
    for (var value in this.charData){
        if (r.test(this.charData[value].NAME.toLowerCase()))
            data[value] = this.charData[value];
    }
    //console.log(CharData);
    this.charData = data;
    loadResults(this.charData);
}

function loadVoice(id){
    loadJSON(id, "https://media.nuke.moe/magireco/assets/json/"+id+".json", (response) => {
        if (response == "Error"){
            if (id%100 != 0){
                loadVoice(id - id%100);
                return;
            } else {
                return;
            }
        }
        var voiceJson = JSON.parse(response);
        var options = "";
        for (var x in voiceJson.story){
            if (voiceJson.story[x][0].chara[0].voice == null) continue;
            var value = Util.classifyLines(voiceJson.story[x][0].chara[0].voice.slice(-2));
            //console.log(value);
            options += '<option value="'+x+'">'+value+'</option>';
        }
        $("#select_voice").html(options).prop("disabled", false);
        thisRef.voiceData = voiceJson;
    });
}

function reloadVoiceJson(id){
    loadJSON(id, "https://media.nuke.moe/magireco/assets/json/"+id+".json", (response) => {
        if (response == "Error"){
            if (id%100 != 0){
                reloadVoiceJson(id - id%100);
                return;
            }
            return;
        }
        var voiceJson = JSON.parse(response);
        thisRef.voiceData = voiceJson;
    });
}

function loadJSON(id, path, callback) {
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          } else if (xobj.status == "404"){
            console.log(id + " not loaded.");
            callback("Error");
          }
    };
    xobj.send(null);  
}

function loadAudio(id, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", "https://media.nuke.moe/magireco/assets/voices/"+id+"_hca.ogg", true);
    request.responseType = "blob";    
    request.onload = function() {
      if (request.status == 200) {
        callback(request.response);
        //var audio = new Audio(URL.createObjectURL(this.response));
        //audio.load();
        //audio.play();
      } else if (request.status == 404){
        console.log(id + " audio not loaded.");
        callback("Error");
      }
    }
    request.send();
}

function chg_voice(){
    clearTimeout(this.motionTimeout);
    if (typeof this.audio !== 'undefined')
        this.audio.pause();
    if ($("#select_model").val().split(",").length > 1)
        reloadVoiceJson($("#select_model").val().split(",")[0]);
    else
        reloadVoiceJson($("#select_model").val());
    var q = thisRef.voiceData.story[$("#select_voice").val()];
    $("#select_voice").prop("disabled", true);
    loadAudio(q[0].chara[0].voice, (response) => {
        if (response == "Error"){ 
            $("#select_voice").prop("disabled", false);
            return;
        }        
        $("#select_voice").prop("disabled", false);
        this.audio = new Audio(URL.createObjectURL(response));
        this.audio.load();
        this.audio.play();
        var context = new AudioContext();
        this.analyser = context.createAnalyser();
        var source = context.createMediaElementSource(this.audio);
        source.connect(this.analyser);
        this.analyser.connect(context.destination);
        this.analyser.fftSize = 1024;
        motionSequence(q, this);
    });   
}

function soundAnalyser(){
    window.requestAnimationFrame(soundAnalyser);
    if (this.analyser == null)
        return;
    var freqArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(freqArray);
    var rms = 0;
    for (var i in freqArray){
        if (i > 256 && i <= 384)
            rms += freqArray[i] * freqArray[i];
        
    }
    rms /= 128;
    rms = Math.sqrt(rms);
    //console.log(rms/70);
    live2DMgr.setLipSync(this.activeVoice, rms / 70);
}

function motionSequence(q, thisRef){
    var motion = this;
    motion.q = q;
    if (motion.q.length == 0){
        //console.log("end");
        $(".subtitle").html("");
        repositionSubtitles();
        return;
    }
    //console.log(q[0].autoTurnFirst);
    //console.log(live2DMgr.getModel(0).modelSetting.getMotionArrayId(LAppDefine.MOTION_GROUP_IDLE, q[0].chara[0].motion));
    //thisRef.activeVoice = motion.q[0].chara[0].id;
    for (var x in motion.q[0].chara){
        if (motion.q[0].chara[x].lipSynch != null) {
            if (motion.q[0].chara[x].lipSynch == 1)
                thisRef.activeVoice = motion.q[0].chara[x].id;
        }
        var id = motion.q[0].chara[x].id;
        if (live2DMgr.getModel(id) == null)
            id = live2DMgr.getModel(0).modelSetting.ID;
        live2DMgr.changeMotion(id, live2DMgr.getModel(id).modelSetting.getMotionArrayId(LAppDefine.MOTION_GROUP_IDLE, motion.q[0].chara[x].motion));
        if (motion.q[0].chara[x].face != null)
            live2DMgr.changeExpression(id, motion.q[0].chara[x].face);
        if (motion.q[0].chara[x].textHome != null){
            $(".subtitle").html("<b>" + motion.q[0].chara[x].textHome.replace(/\n/g,'<br/>') + "</b>");
            repositionSubtitles();
        }
    }
    
    this.motionTimeout = setTimeout(() => {
        motion.q.shift();
        motionSequence(motion.q, thisRef);
    }, motion.q[0].autoTurnFirst * 1000);
}

function resize(){
    var height = Math.max( document.body.scrollHeight, document.body.offsetHeight, 
                           document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );   
        $("#footer").css("top",height - $("#footer").height() - 20);
    if (document.documentElement.clientWidth < 1024) {
        $("#back_ground").css("width", document.documentElement.clientWidth * 0.9)
            .css("height", document.documentElement.clientWidth * 0.9 * (3 / 4));
        $("#glcanvas").css("width", document.documentElement.clientWidth * 0.9)
            .css("height", document.documentElement.clientWidth * 0.9 * (3 / 4));
    } else {
        $("#back_ground").css("width", 1024)
            .css("height", 768);
        $("#glcanvas").css("width", 1024)
        .css("height", 768);
    }
    repositionSubtitles();
}

function repositionSubtitles(){
    var left = ($("#glcanvas").width()/2) - ($(".subtitle").width()/2);
    var bottom = ($("#glcanvas").height() * 0.05);
    $(".subtitle").css("left", left + "px")
        .css("bottom", bottom + "px");
}

function LAppLive2DManager()
{
    // console.log("--> LAppLive2DManager()");
    
    
    this.models = [];  
    this.modelList = [];
    this.preloadCallback = function(){};
    
    
    this.count = -1;
    this.reloadFlg = false; 
    
    Live2D.init();
    Live2DFramework.setPlatformManager(new PlatformManager);
    
}

LAppLive2DManager.prototype.createModel = function()
{
    
    
    var model = new LAppModel();
    this.models.push(model);
    return model;
};

LAppLive2DManager.prototype.AddFixedPreload = function(model, pos, gl, callback, thisRef2)
{
    if (this.reloadFlg)
    {
        
        this.reloadFlg = false;

        var shiftL2D = function (model, thisRef) {
            pos.pop();
            if (pos.length == 0){
                callback(thisRef2);
                return;
            }
            thisRef.models[pos[pos.length-1]].load(gl, model[pos.length-1].modelSetting.ID, this, thisRef);            
        };

        //this.models[pos] = model;
        if (pos.constructor === Array){
            var key = [];
            for (var i in pos){
                key.push(model[i].modelSetting.ID);
                this.models[pos[i]].setMatrixNumber(pos[i]);
                    if (Util.MatrixStack[pos[i]] == null)
                        Util.MatrixStack.push(MatrixStack);
            }
            this.models[pos[pos.length-1]].load(gl, key[pos.length-1], shiftL2D, this);
        } else {
            this.models[pos].load(gl, model.modelSetting.ID);
            this.models[pos].setMatrixNumber(pos);
                if (Util.MatrixStack[pos] == null)
                    Util.MatrixStack.push(MatrixStack);
        }

    }
}

LAppLive2DManager.prototype.changeModel = function(gl, key)
{
    // console.log("--> LAppLive2DManager.update(gl)");
    
    if (this.reloadFlg)
    {
        
        this.reloadFlg = false;
        this.modelNumeral = 0;

        var shiftL2D = function (model, thisRef) {
            key.shift();
            thisRef.modelNumeral++;
            thisRef.models[thisRef.modelNumeral].load(gl, key[0], this, thisRef)            
        };

        var thisRef = this;
        for (var x = this.models.length-1; x >= 0 ; --x)
            this.releaseModel(x, gl);
        
        if (key.constructor === Array){
            for (var i in key){
                this.createModel();
                this.models[i].setMatrixNumber(i);
                if (Util.MatrixStack[i] == null)
                    Util.MatrixStack.push(MatrixStack);
            }
            this.models[0].load(gl, key[0], shiftL2D, this);
        } else {
            this.createModel();
            this.models[0].load(gl, key);
            this.models[0].setMatrixNumber(0);
            if (Util.MatrixStack[0] == null)
                Util.MatrixStack.push(MatrixStack);
        }

    }
};

LAppLive2DManager.prototype.changeToPreloadedModel = function(model)
{
    if (this.reloadFlg)
    {
        
        this.reloadFlg = false;

        var thisRef = this;
        this.releaseModel(1, gl);
        this.releaseModel(0, gl);
        
        this.createModel();
        this.models[0] = model;
    }
};


LAppLive2DManager.prototype.preloadModel = function (gl, key, callback, thisRef)
{
    var model = new LAppModel();
    model.load(gl, key, callback, thisRef);
    //return model;
};



LAppLive2DManager.prototype.getModel = function(no)
{
    // console.log("--> LAppLive2DManager.getModel(" + no + ")");
    
    //if (no >= this.models.length) return null;
    
    if (no / 100000 > 1) 
        return this.getModelByID(no);
    else
        return this.models[no];
    
};

LAppLive2DManager.prototype.getModelByID = function (ID)
{
    for (var x in this.models){
        if (this.models[x].modelSetting != null && this.models[x].modelSetting.ID == ID)
            return this.models[x];
    }
};


LAppLive2DManager.prototype.releaseModel = function(no, gl)
{
    // console.log("--> LAppLive2DManager.releaseModel(" + no + ")");
    if (this.models.length <= no) return;

    this.models[no].release(gl);
    
    delete this.models[no];
    this.models.splice(no, 1);
};



LAppLive2DManager.prototype.numModels = function()
{
    return this.models.length;
};



LAppLive2DManager.prototype.setDrag = function(model, x, y)
{
        this.models[model].setDrag(x, y);
}



LAppLive2DManager.prototype.maxScaleEvent = function()
{
    if (LAppDefine.DEBUG_LOG)
        console.log("Max scale event.");
    for (var i = 0; i < this.models.length; i++)
    {
        this.models[i].startRandomMotion(LAppDefine.MOTION_GROUP_PINCH_IN,
                                         LAppDefine.PRIORITY_NORMAL);
    }
}



LAppLive2DManager.prototype.minScaleEvent = function()
{
    if (LAppDefine.DEBUG_LOG)
        console.log("Min scale event.");
    for (var i = 0; i < this.models.length; i++)
    {
        this.models[i].startRandomMotion(LAppDefine.MOTION_GROUP_PINCH_OUT,
                                         LAppDefine.PRIORITY_NORMAL);
    }
}



LAppLive2DManager.prototype.tapEvent = function(x, y)
{    
    if (LAppDefine.DEBUG_LOG)
        console.log("tapEvent view x:" + x + " y:" + y);

	
    for (var i = 0; i < this.models.length; i++)
    {
		//this.models[i].setRandomExpression(); // modified

        if (this.models[i].hitTest(LAppDefine.HIT_AREA_HEAD, x, y))
        {
            
            if (LAppDefine.DEBUG_LOG)
                console.log("Tap face.");

            this.models[i].setRandomExpression();
        }
        else if (this.models[i].hitTest(LAppDefine.HIT_AREA_BODY, x, y))
        {
            
            if (LAppDefine.DEBUG_LOG)
                console.log("Tap body." + " models[" + i + "]");

            this.models[i].startRandomMotion(LAppDefine.MOTION_GROUP_TAP_BODY,
                                             LAppDefine.PRIORITY_NORMAL);
        }
    }

    return true;
};

LAppLive2DManager.prototype.getExpressions = function (model, callback)
{
    if (model / 100000 > 1) 
        this.getModelByID(model).getExpressions(callback);
    else
        return this.models[model].getExpressions(callback);
}

LAppLive2DManager.prototype.changeExpressionById = function(model, id)
{
    if (model / 100000 > 1) 
        this.getModelByID(model).setExpressionById(id);
    else
        this.models[model].setExpressionById(id);
}

LAppLive2DManager.prototype.changeExpression = function(model, name)
{
    if (model / 100000 > 1) 
        this.getModelByID(model).setExpression(name);
    else
        this.models[model].setExpression(name);
}

LAppLive2DManager.prototype.changeMotion = function(model, no)
{
    if (model / 100000 > 1) 
        this.getModelByID(model).startMotion(no, LAppDefine.PRIORITY_FORCE);
    else
        this.models[model].startMotion(no, LAppDefine.PRIORITY_FORCE);        
}

LAppLive2DManager.prototype.getMotions = function (model, callback){
    if (model / 100000 > 1) 
        this.getModelByID(model).getMotions(callback);
    else
        return this.models[model].getMotions(callback);
}

LAppLive2DManager.prototype.setLipSync = function(model, value)
{
    if (model / 100000 > 1) 
        this.getModelByID(model).setLipSync(value);
    else
        this.models[model].setLipSync(value);
}

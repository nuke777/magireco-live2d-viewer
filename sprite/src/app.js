

var SpriteLayer = cc.Layer.extend({
    sprite:null,
    ctor:function (resource) {
        //////////////////////////////
        // 1. super init first
        this._super();

        var size = cc.winSize;
     
        var bgLayer = new cc.LayerColor(cc.color(0, 255, 0, 255));
        this.addChild(bgLayer, 0);

        ccs.armatureDataManager.addArmatureFileInfo(resource);

        name = resource.replace(base_url, "").replace(".ExportJson","");
        var armature = new ccs.Armature(name);
        armature.getAnimation().playWithIndex(0);
        armature.scale = 1;
        armature.x = size.width / 2;
        armature.y = (size.height / 2) - 150;
        this.addChild(armature);

        var stringAnimations = "";
        for (var i in armature.getAnimation()._animationData.movementNames){
            if (armature.getAnimation()._animationData.movementNames[i] == "wait")
                stringAnimations += "<option value=\"" + i + "\" selected>" + armature.getAnimation()._animationData.movementNames[i] + "</option>";
            else
                stringAnimations += "<option value=\"" + i + "\">" + armature.getAnimation()._animationData.movementNames[i] + "</option>";
        }
        $("#select_animation").html(stringAnimations);
        $("#select_animation").change(function(){
            armature.getAnimation().playWithIndex($("#select_animation").val());
        }).trigger("change");

        return true;
    }
});

var SpriteScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new SpriteLayer(window.resources[0]);
        this.addChild(layer);
    }
});


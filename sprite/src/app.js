

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

        var name = resource.replace(base_url, "").replace(".ExportJson","");
        var scale = 1;
        var offset = 150;

        if (name.slice(-4) == "_m_r" || name.slice(-4) == "_d_r"){
            scale = 0.5;
            offset = 0;
        }

        var armature = new ccs.Armature(name);
        armature.getAnimation().playWithIndex(0);
        armature.scale = scale;
        armature.x = size.width / 2;
        armature.y = (size.height / 2) - offset;
        this.addChild(armature);

        var stringAnimations = "";
        for (var i in armature.getAnimation()._animationData.movementNames){
            if (armature.getAnimation()._animationData.movementNames[i] == "wait" ||
                armature.getAnimation()._animationData.movementNames[i] == "action_in")
                stringAnimations += "<option value=\"" + i + "\" selected>" + armature.getAnimation()._animationData.movementNames[i] + "</option>";
            else
                stringAnimations += "<option value=\"" + i + "\">" + armature.getAnimation()._animationData.movementNames[i] + "</option>";
        }
        $("#select_animation").html(stringAnimations);
        $("#select_animation").off("change").on("change", function(){
            armature.getAnimation().playWithIndex($("#select_animation").val());
        });

        return true;
    },
    onEnter: function(){
        $("#select_animation").trigger("change");
    }
});

var SpriteScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new SpriteLayer(window.resources[0]);
        this.addChild(layer);
    }
});


function OnChangeCharacter(){
    var darken = $("<div></div>");
    var selector = $("<div></div>");
    var searchContainer = $("<div></div>");
    var resultContainer = $("<div></div>");
    var searchField = $("<input>");

    $(document.body).append(darken);
    $(document.body).append(selector);
    selector.append(searchContainer);
    selector.append(resultContainer);
    searchContainer.append(searchField);

    darken.attr("id","darken");
    darken.addClass("darken");
    darken.css("top", window.pageYOffset + "px");
    darken.click(function(){
        $('#selector').remove();
        $('#darken').remove();
        $(document.body).css("overflow", "auto");
    });

    selector.attr("id","selector");
    selector.addClass("selector");
    selector.css("top", (window.pageYOffset + (window.innerHeight * 0.05)) + "px");

    searchContainer.attr("id","searchContainer");
    searchContainer.addClass("searchContainer");
    searchContainer.css({"padding" : "15px", "text-align" : "center"});

    resultContainer.attr("id","resultContainer");
    resultContainer.addClass("resultContainer");

    searchField.attr("id","searchField");
    searchField.addClass("form-control");
    searchField.css({"display" : "inline-block", "width" : "50%"});
    searchField.on("keyup", function(){
        var key = event.keyCode || event.charCode;
        //search(key);
    });

    LoadResults(CharData);

}

function LoadResults (data){
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
                $("#select_sprite").empty();
                LoadSpriteSelection(data[$(this).attr("id").slice(7)]);                
                ChangeSprite();
                $('#selector').remove();
                $('#darken').remove();
                $(document.body).css("overflow", "auto");
                $("#display_name").html("<b>" + data[$(this).attr("id").slice(7)].NAME + "</b>");
            }));     
    }
}

function LoadSpriteSelection (data){
    var stringSprites = "";
    for (var key in data.SKIN){
        if (key == "Regular")
            stringSprites += "<option value=\"" + data.SKIN[key] + "\" selected>" + key + "</option>";
        else
            stringSprites += "<option value=\"" + data.SKIN[key] + "\">" + key + "</option>";
    }
    $("#select_sprite").html(stringSprites);
    //$("#select_Sprite").val($("#select_sprite option").filter(function () { return $(this).html() == "Regular"; }).val()).change();
    $("#select_sprite").change(function(){
        ChangeSprite();
    });
}

function ChangeSprite(){
    cc.game.onStart = function(){
        if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
            document.body.removeChild(document.getElementById("cocosLoading"));

        // Pass true to enable retina display, disabled by default to improve performance
        cc.view.enableRetina(false);
        // Adjust viewport meta
        cc.view.adjustViewPort(true);
        // Setup the resolution policy and design resolution size
        cc.view.setDesignResolutionSize(800, 450);
        // The game will be resized when browser size change
        //cc.view.resizeWithBrowserSize(true);
        //load resources
        ResourceList();
        cc.LoaderScene.preload(window.resources, function () {
            cc.director.runScene(new SpriteScene());
        }, this);
    };
    cc.game.run();
}

function ResourceList(){
    var resource_id = $("#select_sprite").val();
    window.resources = [base_url + "mini_" + resource_id + ".ExportJson",
        base_url + "mini_" + resource_id + "0.plist",
        base_url + "mini_" + resource_id + "0.png"];
}
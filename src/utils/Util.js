var Util = {
    MatrixStack : [],
    classifyLines : function (text){
        switch (text){
            case "01":
                text = "Self Introduction 1";
                break;
            case "02":
                text = "Self Introduction 2";
                break;  
            case "03":
                text = "Story Chapter End 1";
                break;   
            case "04":
                text = "Story Chapter End 2";
                break;   
            case "05":
                text = "Story Chapter End 3";
                break;   
            case "06":
                text = "Story Select 1";
                break;   
            case "07":
                text = "Story Select 2";
                break;   
            case "08":
                text = "Story Select 3";
                break;   
            case "09":
                text = "Story Select 4";
                break;    
            case "10":
                text = "Story Select 5";
                break;    
            case "11":
                text = "Story Select 6";
                break;    
            case "12":
                text = "Unused 1";
                break;     
            case "13":
                text = "Strengthening Complete";
                break;      
            case "14":
                text = "Strengthening Max";
                break;      
            case "15":
                text = "Episode Lvl Up";
                break;      
            case "16":
                text = "Magical Release 1";
                break;      
            case "17":
                text = "Magical Release 2";
                break;      
            case "18":
                text = "Magical Release 3";
                break;      
            case "19":
                text = "Magia Lvl Up";
                break;      
            case "20":
                text = "Awaken 1";
                break;      
            case "21":
                text = "Awaken 2";
                break;      
            case "22":
                text = "Awaken 3";
                break;      
            case "23":
                text = "Unused 2";
                break;      
            case "24":
                text = "Login (First login)";
                break;      
            case "25":
                text = "Login (Morning)";
                break;      
            case "26":
                text = "Login (Noon)";
                break;      
            case "27":
                text = "Login (Evening)";
                break;      
            case "28":
                text = "Login (Night)";
                break;      
            case "29":
                text = "Login (Other)";
                break;      
            case "30":
                text = "Login (AP full)";
                break;      
            case "31":
                text = "Login (BP full)";
                break;      
            case "32":
                text = "Unused 3";
                break;      
            case "33":
                text = "Tap 1";
                break;      
            case "34":
                text = "Tap 2";
                break;      
            case "35":
                text = "Tap 3";
                break;      
            case "36":
                text = "Tap 4";
                break;      
            case "37":
                text = "Tap 5";
                break;      
            case "38":
                text = "Tap 6";
                break;      
            case "39":
                text = "Tap 7";
                break;      
            case "40":
                text = "Tap 8";
                break;      
            case "41":
                text = "Tap 9";
                break;      
            case "42":
                text = "Battle Start";
                break;      
            case "43":
                text = "Battle Victory 1";
                break;      
            case "44":
                text = "Battle Victory 2";
                break;      
            case "45":
                text = "Battle Victory 3";
                break;      
            case "46":
                text = "Unused 5";
                break;      
            case "47":
                text = "Disc Select 1";
                break;      
            case "48":
                text = "Disc Select 2";
                break;      
            case "49":
                text = "Disc Select 3";
                break;      
            case "50":
                text = "Disc Select 4";
                break;      
            case "51":
                text = "Targeting Ally With Connect Disc Select";
                break;      
            case "52":
                text = "Targeted By Connect Disc Select From Ally";
                break;      
            case "53":
                text = "Attack 1";
                break;      
            case "54":
                text = "Attack 2";
                break;      
            case "55":
                text = "Attack 3";
                break;      
            case "56":
                text = "Attack 4";
                break;      
            case "57":
                text = "Attack 5";
                break;      
            case "58":
                text = "Attack 6";
                break;      
            case "59":
                text = "Attack 7";
                break;      
            case "60":
                text = "Attack 8";
                break;      
            case "61":
                text = "Attack 9";
                break;      
            case "62":
                text = "Attack 10";
                break;      
            case "63":
                text = "Magia 1";
                break;      
            case "64":
                text = "Magia 2";
                break;      
            case "65":
                text = "Magia 3";
                break;      
            case "66":
                text = "Magia 4";
                break;      
            case "67":
                text = "Doppel";
                break;      
            case "68":
                text = "Giving Connect Attack To Ally";
                break;      
            case "69":
                text = "Connect Attack Given From Ally";
                break;      
            case "70":
                text = "Actives on Self";
                break;      
            case "71":
                text = "Actives on Allies";
                break;      
            case "72":
                text = "Actives on Enemies";
                break;      
            case "73":
                text = "Taking Damage";
                break;      
            case "74":
                text = "Taking Damage While At Critical Health";
                break;      
            case "75":
                text = "Dying";
                break; 
        }
        return text;
    },
    classifyScenario : function(str) {
        switch (str) {
            case "prologue":
                str = "scenario_0";
                break;
            case "main":
                str = "scenario_1";
                break;
            case "another":
                str = "scenario_2";
                break;
            case "mss":
                str = "scenario_3";
                break;
            case "mirrors":
                str = "scenario_4";
                break;
            case "event":
                str = "scenario_5";
                break;
            case "special":
                str = "scenario_6";
                break;
        }
        return str;
    }
};
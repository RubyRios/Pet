/* Petricity code */
var code = "";
/* The socket object */
var socket = null;
/* The ID of the serial extension */
var bluetoothExtensionId = "lnfbhobkpcdfibfpjgmnopacfiabahkc";

/* For Petricity code evaluation */
var evaluateCode = function evaluateCode() {
    eval(code);
};

/* For sening commands to the Petricity */
var sendCommands = function(commands) {
    /* Call to the bluetooth extension */
    chrome.runtime.sendMessage(bluetoothExtensionId, {action: "commands", commands: commands},
    function(response) {
        if (!response.success) alert("fail");
    });
};

/* When code has changed */
var onCodeChanged = function onCodeChanged() {
    var temp = Blockly.Sumorobot.workspaceToCode();
    /* When the code didn't change */ 
    if (code === temp) return;
    /* Replace functions with commands */
    temp = temp.replace(/left\(\)/g, "sendCommands('a')");
    temp = temp.replace(/stop\(\)/g, "sendCommands('x')");
    temp = temp.replace(/right\(\)/g, "sendCommands('d')");
    temp = temp.replace(/forward\(\)/g, "sendCommands('w')");
    temp = temp.replace(/backward\(\)/g, "sendCommands('s')");
    /* Remember the code */
    code = temp;
    /* Evaluate the new code */
    evaluateCode();
};

/* Load example code snippets */
var showExample = function showExample(exampleXML) {
    Blockly.mainWorkspace.clear();
    var xml = Blockly.Xml.textToDom(exampleXML);
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
};

/* Send the code */
var sendCode = function sendCode() {
    $("#upload").attr("disabled", "disabled");
    $("#upload").html("Uploading...");
    socket.emit("save-petricity-code", Blockly.Sumorobot.workspaceToCode());
    /* Call to the bluetooth extension */
    chrome.runtime.sendMessage(bluetoothExtensionId, {action: "upload", code: Blockly.Sumorobot.workspaceToCode()},
    function(response) {
        if (!response.success) alert("fail");
    });
};

/* Get a users code */
var getCode = function getCode(user) {
    socket.emit("load-petricity-code", user);
};

/* Show the code */
var showCode = function showCode() {
    alert(Blockly.Sumorobot.workspaceToCode());
};

/* When DOM has been loaded */
window.onload = function() {
    /* Initialize blockly */
    Blockly.inject(document.getElementById('blockly-div'), {
        trashcan: true,
        path: "/js/blockly/",
        toolbox: document.getElementById('toolbox')
    });
    Blockly.addChangeListener(onCodeChanged);

    /* Initialize sockets */
    socket = io.connect();

    /*socket.on("receive-sensor-data", function(data) {
        var values = data.split(",");
        for (var index = 0; index < 5; index++) {
            sensorValues[index] = parseInt(values[index]);
        }
        $("#upload").html(sensorValues.toString());
    });*/

    setTimeout(function() {
        setInterval(function() {
            //socket.emit("query-sensor-data");
            evaluateCode();
        }, 200);
    }, 3000);
};

/* When keydown on document */
$(document).keydown(function(e) {
    var tag = e.target.tagName.toLowerCase();
    /* Check the key code */
    switch(e.which) {
        case 38:
            if (tag != 'input' && tag != 'textarea') /* UP */;
            break;
        case 40:
            if (tag != 'input' && tag != 'textarea') /* DOWN */;
            break;
        case 37:
            if (tag != 'input' && tag != 'textarea') /* LEFT */;
            break;
        case 39:
            if (tag != 'input' && tag != 'textarea') /* RIGHT */;
            break;
        case 69:
            if (tag != 'input' && tag != 'textarea') /* E */;
            break;
        case 76:
            if (tag != 'input' && tag != 'textarea') /* L */;
            break;
        case 85:
            if (tag != 'input' && tag != 'textarea') sendCode();
            break;
    }
});

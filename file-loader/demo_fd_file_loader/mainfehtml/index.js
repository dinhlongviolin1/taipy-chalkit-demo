// Utility method
const updateElementById = (id, value) => {
    const element = document.getElementById(id);
    if (element) {
        element.innerHTML = value;
    } else {
        console.error(`Element with ID '${id}' not found.`);
    }
};

const updateInputById = (id, value) => {
    const element = document.getElementById(id);
    if (element) {
        element.value = value;
    } else {
        console.error(`Element with ID '${id}' not found.`);
    }
};

// Taipy App on init
const onInit = (app) => {
    console.log("onAppInit", app.getDataTree());
    const variableData = app.getDataTree();
    for (const context in variableData) {
        for (const variable in variableData[context]) {
            const value = variableData[context][variable].value;
            const varName = `${context}.${variable}`;
            console.log(varName);
            if (!document.getElementById(varName)) {
                continue;
            }
            updateElementById(varName, value);
            updateInputById(`${varName}-textarea`, value);
        }
    }
    const filePath = window.taipyApp.getPageMetadata()["file_path"];
    updateElementById("file_path", filePath);
};

// Taipy App on variable change
const onChange = (app, varName, value) => {
    console.log("onAppChange", varName, value);
    const [variable, context] = app.getName(varName);
    const appVarName = `${context}.${variable}`;
    console.log(appVarName)
    updateElementById(appVarName, value);
    updateInputById(`${appVarName}-textarea`, value);
};

// Taipy App on notify
const onNotify = (app, type, message) => {
    console.log("onAppNotify", type, message);
    // Do what you want with the message
    alert(message);
}

const init = () => {
    // Init taipy app
    window.taipyApp = TaipyGuiBase.createApp(onInit);
    window.taipyApp.onChange = onChange;
    window.taipyApp.onNotify = onNotify;

    // Load File Event
    const loadFile = (event) => {
        const filePath = window.taipyApp.getPageMetadata()["file_path"];
        console.log("loading file")
        console.log(filePath)
        window.taipyApp.trigger("load_file", "action1", { file_path: filePath });
        console.log("sent")
    };

    const btnLoadFile = document.getElementById("loadfile");
    btnLoadFile.addEventListener("click", loadFile);

    // Save File Event
    const saveFile = (event) => {
        const data = document.getElementById("demo_fd_file_loader.mainpage.json_data-textarea").value;
        const filePath = window.taipyApp.getPageMetadata()["file_path"];
        window.taipyApp.trigger("save_file", "action1", { data: data, file_path: filePath });
    };
    const btnSaveFile = document.getElementById("savefile");
    btnSaveFile.addEventListener("click", saveFile);
};

init();

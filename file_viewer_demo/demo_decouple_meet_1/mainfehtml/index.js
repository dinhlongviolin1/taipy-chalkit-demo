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
};

// Taipy App on variable change
const onChange = (app, varName, value) => {
    if (varName.includes("has_file_saved") && value == true) {
        alert("File has been saved");
        window.taipyApp.update(varName, false);
    }
    console.log("onAppChange", varName, value);
    const [variable, context] = app.getName(varName);
    const appVarName = `${context}.${variable}`;
    updateElementById(appVarName, value);
    updateInputById(`${appVarName}-textarea`, value);
};

const init = () => {
    // Init taipy app
    window.taipyApp = TaipyGuiBase.createApp(onInit);
    window.taipyApp.onChange = onChange;

    // Load File Event
    const loadFile = (event) => {
        window.taipyApp.trigger("load_file", "action1");
    };

    const btnLoadFile = document.getElementById("loadfile");
    btnLoadFile.addEventListener("click", loadFile);

    // Save File Event
    const saveFile = (event) => {
        const data = document.getElementById("demo_decouple_meet_1.mainpage.json_data-textarea").value;
        window.taipyApp.trigger("save_file", "action1", { data: data });
    };
    const btnSaveFile = document.getElementById("savefile");
    btnSaveFile.addEventListener("click", saveFile);

    // Save as New File Event
    const saveNewFile = (event) => {
        let fileName = "config.xprjson";
        let fileContent = document.getElementById("demo_decouple_meet_1.mainpage.json_data-textarea").value;
        let file = new Blob([fileContent], { type: "text/plain" });
        url = window.URL || window.webkitURL;
        const fileDownloadAnchor = document.getElementById("filedownload");
        fileDownloadAnchor.setAttribute("href", window.URL.createObjectURL(file));
        fileDownloadAnchor.setAttribute("download", fileName);
        fileDownloadAnchor.click();
    };
    const btnSaveNewFile = document.getElementById("savenewfile");
    btnSaveNewFile.addEventListener("click", saveNewFile);

    // Select a file (does not create new file)
    const fileSelect = (event) => {
        event.stopPropagation();
        event.preventDefault();
        const files = event.target.files;
        if (files?.length) {
            const file = files[0];
            window.taipyApp.trigger("select_file", "action1", { file_name: file.name });
        }
    }
    const btnSelectFile = document.getElementById("fileselect");
    btnSelectFile.addEventListener("change", fileSelect);

    // Upload a file (create a temporary file)
    const printProgressUpload = (progress) => {
        console.log(progress);
    };
    const uploadFile = (event) => {
        event.stopPropagation();
        event.preventDefault();
        const files = event.target.files;
        const encodedVarName = window.taipyApp.getEncodedName("file_name", "demo_decouple_meet_1.mainpage");
        console.log(files, encodedVarName);
        if (files?.length) {
            window.taipyApp.upload(encodedVarName, files, printProgressUpload).then(
                (value) => {
                    console.log("upload successful", value);
                },
                (reason) => {
                    console.log("upload failed", reason);
                }
            );
        }
        // window.taipyApp.uploadFile()
    };
    const btnUploadFile = document.getElementById("fileupload");
    btnUploadFile.addEventListener("change", uploadFile);
};

init();

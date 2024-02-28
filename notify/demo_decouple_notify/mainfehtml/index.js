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

};

// Taipy App on variable change
const onChange = (app, varName, value) => {

};

const onNotify = (app, type, message) => {
    console.log("onAppNotify", type, message);
    updateInputById("display", `Message type: ${type}\nMessage: ${message}`);
    // Do what you want with the message
    // alert(`Message type: ${type}\nMessage: ${message}`);
}
const init = () => {
    console.log("initing")
    // Init taipy app
    window.taipyApp = TaipyGuiBase.createApp(onInit);
    window.taipyApp.onChange = onChange;
    window.taipyApp.onNotify = onNotify;

    const trigger1 = (event) => {
        window.taipyApp.trigger("notify_1", "btn1");
    };

    const btn1 = document.getElementById("btn1");
    btn1.addEventListener("click", trigger1);

    const trigger2 = (event) => {
        window.taipyApp.trigger("notify_2", "btn2");
    };

    const btn2 = document.getElementById("btn2");
    btn2.addEventListener("click", trigger2);
};

init();

import inspect
import os
import pathlib
import typing as t
from os import sep

from flask import send_file, send_from_directory

from taipy.gui.custom import Page, ResourceHandler
from taipy.gui.gui_actions import notify

json_data = ""


def load_file(state, name, payload):
    if "file_path" not in payload:
        notify(state, notification_type="E", message="Error while loading file")
        return
    file_path = payload.get("file_path", None)
    if not pathlib.Path(file_path).is_file():
        print("Invalid file path in load_file()")
        notify(state, notification_type="E", message="Error while loading file")
        return
    state.json_data = pathlib.Path(file_path).read_text()
    notify(state, message="File has been loaded")


def save_file(state, name, payload):
    if "data" not in payload:
        notify(state, notification_type="E", message="Error while saving file")
        return
    if "file_path" not in payload:
        notify(state, notification_type="E", message="Error while saving file")
        return
    file_path = payload.get("file_path", None)
    if not pathlib.Path(file_path).is_file():
        print("Invalid file path in load_file()")
        notify(state, notification_type="E", message="Error while saving file")
        return
    with open(file_path, "w") as f:
        f.write(payload["data"])
    notify(state, message="File has been saved")


class PureHTMLResourceHandler(ResourceHandler):
    id = "htmlresource"

    def get_resources(self, path: str, taipy_resource_path: str) -> t.Any:
        root_dir = f"{str(pathlib.Path(__file__).resolve().parent)}{sep}mainfehtml"
        if not path or path == "index.html" or "." not in path:
            return send_from_directory(root_dir, "index.html")
        # Check to see if the file exists
        if pathlib.Path(f"{root_dir}{sep}{path}").is_file():
            return send_from_directory(root_dir, path)
        if "taipy-gui-base.js" in path:
            return send_file(f"{taipy_resource_path}{sep}{os.path.basename(path)}")
        return ("File not found", 404)


class ExtenedPage(Page):
    def __init__(self, file_path: str):
        root_path = f"{str(pathlib.Path(inspect.stack()[1].filename).parent.resolve())}{sep}"
        super().__init__(resource_handler=PureHTMLResourceHandler(), metadata={"file_path": root_path + file_path})


page = ExtenedPage("config.xprjson")

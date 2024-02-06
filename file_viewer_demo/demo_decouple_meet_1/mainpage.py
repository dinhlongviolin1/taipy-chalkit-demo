from os import sep
import os
import typing as t
import pathlib

from flask import send_file, send_from_directory
from taipy.gui.custom import Page, ResourceHandler

base_path = f"{pathlib.Path(__file__).parent.resolve()}{os.sep}"
file_name = f"{base_path}config1.xprjson"
json_data = ""
has_file_saved = False


def load_file(state):
    state.json_data = pathlib.Path(state.file_name).read_text()


def save_file(state, name, payload):
    if "data" not in payload:
        return
    with open(state.file_name, "w") as f:
        f.write(payload["data"])
    state.has_file_saved = True


# file should only be within base path
def select_file(state, name, payload):
    if "file_name" not in payload:
        return
    potential_file_path = f"{base_path}{payload['file_name']}"
    if os.path.exists(potential_file_path):
        state.file_name = potential_file_path


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


page = Page(PureHTMLResourceHandler())

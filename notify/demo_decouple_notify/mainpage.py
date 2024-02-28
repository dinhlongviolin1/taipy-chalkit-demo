from os import sep
import os
import typing as t
import pathlib

from flask import send_file, send_from_directory
from taipy.gui.custom import Page, ResourceHandler
from taipy.gui.gui_actions import notify

def notify_1(state):
    notify(state, "Info", "Notify 1: Hello world!")

def notify_2(state):
    notify(state, "Blocking", "Notify 2: blocking")

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

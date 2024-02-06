import os
import pathlib
from taipy.gui import Gui
from demo_decouple_meet_1.mainpage import page as main_page

upload_folder = f"{pathlib.Path(__file__).parent.resolve()}{os.sep}demo_decouple_meet_1"

gui = Gui()
gui.add_page("main_page", main_page)

gui.run(run_browser=False, upload_folder=upload_folder)
# gui.run(run_browser=False)

from taipy.gui import Gui
from demo_fd_file_loader.mainpage import page as main_page

gui = Gui()
gui.add_page("main_page", main_page)

gui.run(run_browser=False)

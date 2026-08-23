"""Convert the licensed Neue Montreal TTFs into self-hosted WOFF2.

Source folder: C:/Users/User/Downloads/NEUE MONTREAL
Run:           python scripts/convert-fonts.py
"""
import pathlib
from fontTools.ttLib import TTFont

SRC = pathlib.Path("C:/Users/User/Downloads/NEUE MONTREAL")
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "fonts"
OUT.mkdir(parents=True, exist_ok=True)

FACES = [
    ("NeueMontreal-Regular.ttf", "NeueMontreal-Regular.woff2"),
    ("NeueMontreal-Medium.ttf", "NeueMontreal-Medium.woff2"),
    ("NeueMontreal-Bold.ttf", "NeueMontreal-Bold.woff2"),
]

for src_name, out_name in FACES:
    font = TTFont(str(SRC / src_name))
    font.flavor = "woff2"
    font.save(str(OUT / out_name))
    size_kb = (OUT / out_name).stat().st_size / 1024
    print("%-28s -> %-28s %6.1f KB" % (src_name, out_name, size_kb))

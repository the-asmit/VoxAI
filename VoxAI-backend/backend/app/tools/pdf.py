import asyncio
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from pathlib import Path


def _generate_pdf_sync(text: str, file_path: str):
    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4

    y = height - 50
    for line in text.split("\n"):
        c.drawString(50, y, line)
        y -= 15
        if y < 50:
            c.showPage()
            y = height - 50

    c.save()


async def generate_pdf_async(text: str, filename: str) -> str:
    output_dir = Path("generated")
    output_dir.mkdir(exist_ok=True)

    file_path = output_dir / filename

    await asyncio.to_thread(
        _generate_pdf_sync,
        text,
        str(file_path)
    )

    return str(file_path)

import os
from PIL import Image, ImageDraw, ImageFont

def generate_icon(size, filename):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Yellow background rounded rect
    # rx = 20 for size 100 -> radius is 20% of size
    radius = int(size * 0.2)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill="#ffcc00")
    
    # Try to load a font
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
    ]
    font = None
    font_size = int(size * 0.68)
    for path in font_paths:
        if os.path.exists(path):
            try:
                font = ImageFont.truetype(path, font_size)
                break
            except Exception:
                pass
    
    if font:
        # In Pillow, we can use anchor="mm" to center the text exactly.
        # Let's adjust slightly since the letter "Y" is visual-heavy on top.
        # SVG had text at x="52" y="72" (viewBox 100) -> 52% horizontally, 72% vertically baseline.
        # Let's place anchor middle at 52% horizontal and 50% vertical.
        draw.text((size * 0.51, size * 0.49), "Y", fill="#000000", font=font, anchor="mm")
    else:
        # Fallback to drawing a clean bold vector Y shape if font is not found
        w = int(size * 0.12)
        # Draw left branch
        draw.line([(size * 0.26, size * 0.22), (size * 0.50, size * 0.52)], fill="#000000", width=w)
        # Draw right branch
        draw.line([(size * 0.74, size * 0.22), (size * 0.50, size * 0.52)], fill="#000000", width=w)
        # Draw stem
        draw.line([(size * 0.50, size * 0.50), (size * 0.50, size * 0.78)], fill="#000000", width=w)
        # Cap connections cleanly
        draw.ellipse([(size * 0.50 - w/2, size * 0.50 - w/2), (size * 0.50 + w/2, size * 0.50 + w/2)], fill="#000000")
        
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    img.save(filename, 'PNG')

generate_icon(192, "icons/icon-192.png")
generate_icon(512, "icons/icon-512.png")
print("Icons generated successfully!")

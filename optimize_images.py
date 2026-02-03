from PIL import Image
import os
import glob

def optimize_images(directory, quality=80, max_width=1600):
    extensions = ['*.jpg', '*.jpeg', '*.png']
    files = []
    for ext in extensions:
        files.extend(glob.glob(os.path.join(directory, ext)))
    
    print(f"Found {len(files)} images in {directory}")

    for file_path in files:
        try:
            filename = os.path.basename(file_path)
            name, ext = os.path.splitext(filename)
            new_filename = f"{name}.webp"
            new_file_path = os.path.join(directory, new_filename)
            
            # Skip if webp already exists (unless we want to force overwrite, but safer to skip/report)
            if os.path.exists(new_file_path):
                 print(f"Skipping {filename}, {new_filename} already exists.")
                 # content check could be here but for now simple check
                 continue

            with Image.open(file_path) as img:
                # Resize if too large
                if img.width > max_width:
                    ratio = max_width / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                    print(f"Resized {filename} to {max_width}px width")
                
                img.save(new_file_path, 'WEBP', quality=quality)
                print(f"Converted {filename} -> {new_filename}")
                
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

# Optimize main images directory
optimize_images(r'd:\Portfolio\static\images')

# Optimize certificates directory
optimize_images(r'd:\Portfolio\static\certificates', max_width=1200)

print("Optimization complete.")

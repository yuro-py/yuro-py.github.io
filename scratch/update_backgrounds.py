import os
import glob
import json

def main():
    # Find all webm files in the backgrounds/ directory
    bg_dir = "backgrounds"
    webm_files = glob.glob(os.path.join(bg_dir, "*.webm"))
    
    # Normalize paths to use relative forward slashes
    bg_list = [os.path.relpath(f).replace("\\", "/") for f in webm_files]
    bg_list.sort()
    
    # Generate the JS file content
    js_content = f"""// Automatically generated background lists.
// This file is updated automatically before each commit.
window.BACKGROUNDS = {json.dumps(bg_list, indent=2)};
"""
    
    # Save the file
    js_path = os.path.join("js", "backgrounds-list.js")
    os.makedirs(os.path.dirname(js_path), exist_ok=True)
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js_content)
        
    print(f"Successfully generated {js_path} with {len(bg_list)} backgrounds.")

if __name__ == "__main__":
    main()

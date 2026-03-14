import os
import wget
import requests

MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
os.makedirs(MODEL_DIR, exist_ok=True)

# GitHub Release URL base with the correct tag v1.0
EF_URL_DEFAULT = 'https://github.com/ChelbiAhmed99/CardioVision/releases/download/v1.0/r2plus1d_18_32_2_pretrained.pt'
SEG_URL_DEFAULT = 'https://github.com/ChelbiAhmed99/CardioVision/releases/download/v1.0/deeplabv3_resnet50_random.pt'

MODELS = {
    'r2plus1d_18_32_2_pretrained.pt': os.getenv('EF_MODEL_URL', EF_URL_DEFAULT),
    'deeplabv3_resnet50_random.pt': os.getenv('SEG_MODEL_URL', SEG_URL_DEFAULT)
}

def download_models():
    """Downloads required AI models from GitHub Releases if not already present."""
    for model_name, url in MODELS.items():
        path = os.path.join(MODEL_DIR, model_name)
        if not os.path.exists(path):
            print(f"Downloading {model_name} from {url}...")
            try:
                wget.download(url, path)
                print(f"\nSuccessfully downloaded {model_name}")
            except Exception as e:
                print(f"Error downloading {model_name} with wget: {e}")
                print("Attempting download with requests...")
                try:
                    response = requests.get(url, stream=True)
                    response.raise_for_status()
                    with open(path, 'wb') as f:
                        for chunk in response.iter_content(chunk_size=8192):
                            f.write(chunk)
                    print(f"Successfully downloaded {model_name} using requests")
                except Exception as req_e:
                    print(f"CRITICAL ERROR: Failed to download {model_name}: {req_e}")
        else:
            print(f"Model {model_name} already exists at {path}")

if __name__ == "__main__":
    download_models()

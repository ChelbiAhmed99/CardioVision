import os
import wget

MODEL_DIR = 'models'
os.makedirs(MODEL_DIR, exist_ok=True)

EF_MODEL_URL = 'https://github.com/douyang/EchoNetDynamic/releases/download/v1.0.0/r2plus1d_18_32_2_pretrained.pt'
EF_MODEL_PATH = os.path.join(MODEL_DIR, 'r2plus1d_18_32_2_pretrained.pt')

def download_models():
    if not os.path.exists(EF_MODEL_PATH):
        print(f"Downloading EF Model to {EF_MODEL_PATH}...")
        wget.download(EF_MODEL_URL, EF_MODEL_PATH)
        print("\nDownloaded EF Model successfully.")
    else:
        print(f"EF Model already exists at {EF_MODEL_PATH}")

    seg_model_path = os.path.join(MODEL_DIR, 'DeeplabV3 Resnet101 Best.pt')
    if not os.path.exists(seg_model_path):
        print(f"\nWARNING: Segmentation model missing at {seg_model_path}.")
        print("This appears to be a fine-tuned model that is missing from the repository.")
        print("Please place the 'DeeplabV3 Resnet101 Best.pt' file in the 'models/' directory.")
        print("This file is required to fully run the backend without FileNotFoundError.")

if __name__ == "__main__":
    download_models()

import numpy as np
import cv2
import sys
import os

# Mocking parts of app.py to test the algorithms
def calculate_simpson_volume(mask):
    if np.sum(mask) == 0:
        return 0.0
    
    y_idx, x_idx = np.where(mask > 0)
    coords = np.column_stack((x_idx, y_idx))
    mean = np.mean(coords, axis=0).astype(np.float32)
    coords_centered = coords - mean
    cov = np.cov(coords_centered, rowvar=False)
    evals, evecs = np.linalg.eigh(cov)
    
    idx = np.argsort(evals)[::-1]
    evecs = evecs[:, idx]
    
    long_axis = evecs[:, 0]
    angle = np.arctan2(long_axis[1], long_axis[0])
    
    center = (int(mean[0]), int(mean[1]))
    rot_mat = cv2.getRotationMatrix2D(center, np.degrees(angle) - 90, 1.0)
    h, w = mask.shape
    rotated_mask = cv2.warpAffine(mask, rot_mat, (w, h), flags=cv2.INTER_NEAREST)
    
    y_rot, x_rot = np.where(rotated_mask > 0)
    if len(y_rot) == 0: return 0.0
    
    y_min, y_max = np.min(y_rot), np.max(y_rot)
    height = y_max - y_min
    num_disks = 20
    disk_height = height / num_disks
    
    volume = 0.0
    for i in range(num_disks):
        y_start = int(y_min + i * disk_height)
        y_end = int(y_min + (i + 1) * disk_height)
        row_mask = rotated_mask[y_start:y_end, :]
        if np.sum(row_mask) == 0: continue
        
        row_widths = np.sum(row_mask > 0, axis=1)
        diameter = np.mean(row_widths)
        
        disk_area = np.pi * (diameter / 2)**2
        volume += disk_area * disk_height
        
    return volume

def test_simpson_pca():
    print("Testing Simpson's PCA rotation invariant volume...")
    # Create an ellipse (mask) at 0 degrees
    mask0 = np.zeros((200, 200), dtype=np.uint8)
    cv2.ellipse(mask0, (100, 100), (30, 70), 0, 0, 360, 255, -1)
    vol0 = calculate_simpson_volume(mask0)
    
    # Create the same ellipse rotated 45 degrees
    mask45 = np.zeros((200, 200), dtype=np.uint8)
    cv2.ellipse(mask45, (100, 100), (30, 70), 45, 0, 360, 255, -1)
    vol45 = calculate_simpson_volume(mask45)
    
    diff = abs(vol0 - vol45) / vol0
    print(f"Volume 0 deg: {vol0:.2f}")
    print(f"Volume 45 deg: {vol45:.2f}")
    print(f"Relative difference: {diff:.4f}")
    
    assert diff < 0.05, "Volume should be rotation invariant within 5%"
    print("PCA Rotation Invariance Test Passed!")

if __name__ == "__main__":
    try:
        test_simpson_pca()
        print("\nAll backend precision tests passed successfully.")
    except Exception as e:
        print(f"Test failed: {e}")
        sys.exit(1)

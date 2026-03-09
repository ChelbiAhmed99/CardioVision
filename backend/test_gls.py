import numpy as np
import cv2

def calculate_gls(y_out):
    """
    Calculates Global Longitudinal Strain (GLS) from segmentation masks.
    y_out shape: (frames, 1, height, width)
    """
    masks = (y_out[:, 0, :, :] > 0).astype(np.uint8)
    lengths = []
    for mask in masks:
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            lengths.append(0)
            continue
        cnt = max(contours, key=cv2.contourArea)
        # Perimeter as a proxy for contour length in apical view
        length = cv2.arcLength(cnt, True)
        lengths.append(length)
    
    lengths = np.array(lengths)
    if len(lengths) > 3:
        lengths = np.convolve(lengths, np.ones(3)/3, mode='same')
    
    id_ed = np.argmax(lengths)
    l_ed = lengths[id_ed]
    
    if l_ed == 0:
        return 0.0
    
    # Peak negative strain
    gls = (np.min(lengths) - l_ed) / l_ed * 100
    return float(gls)

def test_calculate_gls():
    # Create a dummy sequence of masks (decreasing and then increasing length)
    # Shape: (frames, channels, height, width)
    frames = 10
    height, width = 112, 112
    y_out = np.zeros((frames, 1, height, width), dtype=np.uint8)
    
    # Frame 0: Circle with radius 20 (ED)
    cv2.circle(y_out[0, 0], (56, 56), 20, 1, -1)
    
    # Frame 5: Circle with radius 15 (ES)
    cv2.circle(y_out[5, 0], (56, 56), 15, 1, -1)
    
    # Calculate GLS
    # ED Perimeter approx: 2 * pi * 20 = 125.6
    # ES Perimeter approx: 2 * pi * 15 = 94.2
    # GLS approx: (94.2 - 125.6) / 125.6 * 100 = -25%
    
    # Fill in intermediate frames for smoothing
    for i in range(1, 5):
        r = int(20 - (5 * i / 5))
        cv2.circle(y_out[i, 0], (56, 56), r, 1, -1)
    for i in range(6, 10):
        r = int(15 + (5 * (i-5) / 5))
        cv2.circle(y_out[i, 0], (56, 56), r, 1, -1)
        
    gls = calculate_gls(y_out)
    print(f"Calculated GLS: {gls:.2f}%")
    
    # Check if GLS is in a reasonable range for this dummy test
    assert gls < 0, "GLS should be negative"
    assert -30 < gls < -20, f"Expected GLS around -25%, got {gls}%"
    print("Test passed!")

if __name__ == "__main__":
    test_calculate_gls()

# CardioVision: AI-Powered Echocardiography Analysis

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

CardioVision is a cutting-edge, clinical-grade platform for automated echocardiography analysis. By leveraging advanced computer vision and deep learning, CardioVision provides precise measurements of key cardiac metrics, empowering clinicians with faster, more accurate diagnostic insights.

---

## Key Features

-   **Automated Cardiac Metrics**: Instant calculation of Ejection Fraction (EF), Simpson's Volume, and Global Longitudinal Strain (GLS).
-   **Clinical Precision**: Implements PCA-based long axis detection and 17-segment regional strain analysis for high-fidelity measurements.
-   **Dynamic Visualization**: Interactive dashboards with real-time analysis overlays (masks, strain maps, and Bull's-eye plots).
-   **Unified Patient Management**: Securely manage patient history, video uploads, and diagnostic reports in one place.
-   **Admin Control Center**: Comprehensive panel for site settings, audit logging, and growth analytics.
-   **Scalable Architecture**: Dual-service backend design (Express/Node.js + Flask/Python) for efficient orchestration.

---

## Tech Stack

### Frontend
-   **Framework**: React 18 with TypeScript
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS
-   **State Management**: Zustand
-   **Icons**: Lucide React
-   **Routing**: React Router DOM

### Backend & AI
-   **Orchestration API**: Node.js & Express
-   **Database**: SQLite (via Sequelize)
-   **AI Service**: Python & Flask
-   **Deep Learning**: PyTorch, Torchvision
-   **Computer Vision**: OpenCV, Scikit-image
-   **Data Processing**: NumPy, Pandas


## Getting Started

### Prerequisites
-   [Node.js](https://nodejs.org/) (v18+)
-   [Python 3.9+](https://www.python.org/)
-   [FFmpeg](https://ffmpeg.org/) (for video processing)

### Quick Start (Local Development)

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/ChelbiAhmed99/CardioVision
    cd CardioVision
    ```

2.  **Environment Setup**:
    Create a `.env` file in the root directory based on `.env.example`. Ensure `FLASK_API_URL` is set to `http://localhost:8080`.

3.  **Install Dependencies**:
    ```bash
    # Root & Backend
    npm install
    
    # Frontend
    cd frontend && npm install && cd ..
    
    # Python AI Backend
    # (Recommended to use a virtual environment)
    python -m venv venv
    source venv/bin/activate  # Linux/macOS
    pip install -r backend/requirements.txt
    ```

4.  **Run Services**:
    You need to run three separate services:
    
    - **Orchestration Server**: `npm run server` (Root)
    - **AI Engine**: `python backend/app.py`
    - **Frontend Dashboard**: `cd frontend && npm run dev`

The application will be available at `http://localhost:5173`.

---

## Project Structure

```text
CardioVision/
├── backend/               # Orchestration API (Express) & AI Service (Flask)
├── frontend/              # Web Dashboard (React + Vite + TS)
├── Model Training and Development/ # Scripts for model research & fine-tuning
├── growth_resources/      # Waitlist & marketing assets
├── imgs/                  # Project media and screenshots
└── cardiovision.sqlite    # Local SQLite database
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


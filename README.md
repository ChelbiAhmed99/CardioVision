# CardioVision: AI-Powered Echocardiography Analysis

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

CardioVision is a cutting-edge, clinical-grade platform for automated echocardiography analysis. By leveraging advanced computer vision and deep learning, CardioVision provides precise measurements of key cardiac metrics, empowering clinicians with faster, more accurate diagnostic insights.

---

## Key Features

-   **Automated Cardiac Metrics**: Instant calculation of Ejection Fraction (EF), Simpson's Volume, and Global Longitudinal Strain (GLS).
-   **Clinical Precision**: Implements PCA-based long axis detection and 17-segment regional strain analysis for high-fidelity measurements.
-   **Dynamic Visualization**: Interactive dashboards with real-time analysis overlays (masks, strain maps, and Bull's-eye plots).
-   **Unified Patient Management**: Securely manage patient history, video uploads, and diagnostic reports in one place.
-   **Admin Control Center**: Comprehensive panel for site settings, audit logging, and growth analytics.
-   **Scalable Architecture**: Dual-service backend design (Express/Node.js + Flask/Python) orchestrated via Docker.

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


## Getting StartedI confirm that I want to delete the project reliable-energy

### Prerequisites
-   [Docker](https://www.docker.com/get-started)
-   [Docker Compose](https://docs.docker.com/compose/install/)
-   [Node.js](https://nodejs.org/) (for local development)
-   [Python 3.9+](https://www.python.org/) (for local AI service)

### Quick Start with Docker

The easiest way to run CardioVision is using Docker Compose:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/ChelbiAhmed99/CardioVision.
    cd CardioVision
    ```

2.  **Environment Setup**:
    Create a `.env` file in the `Web Development` directory based on `.env.example`.

3.  **Run with Docker Compose**:
    ```bash
    cd "Web Development"
    docker-compose up --build
    ```

The application will be available at `http://localhost:3000`.

---

## Project Structure

```text
CardioVision/
├── Web Development/
│   ├── frontend/          # React + Vite + TS
│   ├── backend/           # Express (Orchestration) + Flask (AI)
│   ├── docker-compose.yml # Docker orchestration
│   └── Dockerfile         # Frontend/Express Dockerfile
├── Model Training/        # Scripts for model development
├── growth_resources/      # Waitlist & marketing assets
└── imgs/                  # Project media and screenshots
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


# Boxing Fight Predictor

A React + TypeScript frontend predicting boxing match outcomes using a PyTorch neural network served via a FastAPI backend. Designed to demonstrate ML integration, client-server communication, and rapid frontend development.

![Boxing Predictor Demo](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Boxing+Predictor+Demo)

## Features

- **PyTorch Neural Network**: Lightweight model served through FastAPI
- **Real-time Predictions**: Frontend calls API whenever fighter stats change
- **Fighter Database**: Pre-loaded with popular boxer archetypes
- **Modern UI**: Glassmorphic design with animated progress bars
- **TypeScript + React**: Full type safety and reactive state management
- **API Integration Ready**: Easily extend to fetch real fighters from external sources

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python), PyTorch
- **Deployment**: Vercel (frontend), any Python-friendly hosting for backend
- **Communication**: REST API with JSON payloads

## Getting Started

### Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate    # Windows

# Install dependencies
pip install -r requirements.txt

# Train or load model
python train_model.py


# Start FastAPI server
uvicorn app:app --reload
```

### Frontend
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

Frontend runs on http://localhost:3000

Backend API runs on http://localhost:8000

## Architecture 
Frontend (React + TypeScript)
        ↓ REST API
Backend (FastAPI + PyTorch)
        ↓ Model
Model Weights (fight_model.pth)



## Code Structure
```bash
frontend/
├── components/
│   └── FightPredictor.tsx   # Main UI and API integration
├── types/
│   └── Fighter.ts           # TypeScript interfaces
└── utils/
    └── normalization.ts     # Input feature normalization

backend/
├── app.py                   # FastAPI server and endpoints
├── model.py                 # PyTorch FighterNet architecture
└── fight_model.pth          # Pretrained model weights

```
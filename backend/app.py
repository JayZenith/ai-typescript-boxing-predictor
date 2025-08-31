from fastapi import FastAPI

#Import BaseModel for validating incoming JSON reqs 
from pydantic import BaseModel

# NN ops 
import torch

#Import custom nn model class 
from model import FighterNet

# Import middleware to handle cross-origin requests (React frontend on another port)
from fastapi.middleware.cors import CORSMiddleware

# app is main server and endpoints are attached to this object
app = FastAPI()

# instance of nn
model = FighterNet()

# laod trained weights from file into model
# 'fight_model.pth' contains the trained parameters from train.py
model.load_state_dict(torch.load("fight_model.pth"))

# Put the model in evaluation mode (important for inference)
# This disables things like dropout, batchnorm updates etc.
model.eval()


# Add middleware to handle CORS (Cross-Origin Resource Sharing)
# This allows your React frontend (different port) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # temporarily allow all for dev
    allow_credentials=True,
    allow_methods=["*"], # allow all HTTP methods: GET, POST, etc.
    allow_headers=["*"], # allow all headers
)

# Define the structure of the expected JSON request using Pydantic
class FighterInput(BaseModel):
    features: list[float]  # 14 numbers (normalized)

@app.post("/predict")
def predict(fighter: FighterInput):
    with torch.no_grad(): #disables gradient computation (saves memory)
        #model expects batch of inputs, even if one fighter pair
        # dtype=... ensures numbers in correct floating-point format 
        x = torch.tensor([fighter.features], dtype=torch.float32)
        # Run the model to get the probability of fighter A winning
        prob = model(x).item()  # .item() converts single-element tensor to Python float
        # model(x) -> passes input through all layers of FighterNet
        # Output between 0-1 bc sigmoid 
        
    return {"fighterA": prob * 100, "fighterB": (1 - prob) * 100}

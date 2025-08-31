import torch
import torch.optim as optim
from model import FighterNet

# synthetic training data
X = torch.rand(500, 14)  # 14 normalized fighter stats
y = torch.randint(0, 2, (500, 1)).float()

model = FighterNet()
criterion = torch.nn.BCELoss()
optimizer = optim.Adam(model.parameters(), lr=0.01)

for epoch in range(50):
    optimizer.zero_grad()
    outputs = model(X)
    loss = criterion(outputs, y)
    loss.backward()
    optimizer.step()
    if (epoch+1) % 10 == 0:
        print(f"Epoch {epoch+1}, Loss: {loss.item():.4f}")

torch.save(model.state_dict(), "fight_model.pth")
print("✅ Model trained and saved")

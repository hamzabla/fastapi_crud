from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"], # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model
class Item(BaseModel):
    name: str
    description: str
    price: float

# In-memory storage
items: Dict[int, Item] = {}
id_counter = 0

# Create
@app.post("/items/")
def create_item(item: Item):
    global id_counter
    id_counter += 1
    items[id_counter] = item
    return {"id": id_counter, **item.dict() }

# Read All
@app.get("/items/")
def get_all_items():
    return [{"id": item_id, **item.dict()} for item_id, item in items.items()]

#Update
@app.put("/items/{item_id}")
def update_item(item_id: int, updated_item: Item):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    items[item_id] = updated_item
    return updated_item

# Read One
@app.get("/items/{item_id}")
def get_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"id": item_id, 
            "name": items[item_id].name,
            "description": items[item_id].description,  
            "price": items[item_id].price
            }

@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    del items[item_id]
    return {"message": "Item deleted"}


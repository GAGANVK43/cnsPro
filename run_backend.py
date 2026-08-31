import uvicorn

if __name__ == "__main__":
    print("Starting UPI Payment Security Visualizer Backend API...")
    print("Server running on http://127.0.0.1:8000")
    print("API Documentation available at http://127.0.0.1:8000/docs")
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)

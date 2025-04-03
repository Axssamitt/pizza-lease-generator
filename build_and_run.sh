
#!/bin/bash

# Build the Vite app
echo "Building the React app with Vite..."
npm run build

# Run the Gradio server
echo "Starting the Gradio server..."
python gradio_app.py


import gradio as gr
import json
import os
import webbrowser
import http.server
import socketserver
import threading

# Path to the JSON file with contracts
CONTRACTS_FILE = "contratos_pizzas.json"

# Function to load contracts from file
def load_contracts():
    if os.path.exists(CONTRACTS_FILE):
        try:
            with open(CONTRACTS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading contracts: {e}")
            return []
    return []

# Function to save contracts to file
def save_contracts(contracts):
    try:
        with open(CONTRACTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(contracts, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Error saving contracts: {e}")
        return False

# Function to serve the React app
def serve_react_app(port=8000):
    Handler = http.server.SimpleHTTPRequestHandler
    
    class CustomHandler(Handler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory="dist", **kwargs)
    
    with socketserver.TCPServer(("", port), CustomHandler) as httpd:
        print(f"Serving React app at port {port}")
        httpd.serve_forever()

# Start a background thread to serve the React app
def start_react_server():
    thread = threading.Thread(target=serve_react_app)
    thread.daemon = True
    thread.start()
    return "http://localhost:8000"

# Gradio interface for managing contracts
def create_interface():
    with gr.Blocks(title="Julio's Pizza House - Gerenciador de Contratos") as interface:
        gr.Markdown("# Julio's Pizza House - Gerenciador de Contratos")
        
        with gr.Tab("Visualizar Aplicativo"):
            app_url = start_react_server()
            gr.Markdown(f"""
            ### Aplicativo da Web
            
            O aplicativo está sendo executado localmente em: [http://localhost:8000]({app_url})
            
            Clique no link acima ou abra o endereço no seu navegador para acessar o aplicativo completo.
            """)
            
            open_button = gr.Button("Abrir Aplicativo no Navegador")
            
            def open_browser():
                webbrowser.open(app_url)
                return "Aplicativo aberto no navegador!"
                
            open_button.click(fn=open_browser, outputs=gr.Textbox(label="Status"))
        
        with gr.Tab("Gerenciar Contratos"):
            refresh_button = gr.Button("Atualizar Lista de Contratos")
            contracts_json = gr.JSON(label="Contratos")
            
            def refresh_contracts():
                contracts = load_contracts()
                return contracts
                
            refresh_button.click(fn=refresh_contracts, outputs=contracts_json)
            
            # Initialize with contracts
            contracts = load_contracts()
            if contracts:
                contracts_json.value = contracts
    
    return interface

# Main function
if __name__ == "__main__":
    print("Iniciando a aplicação Julio's Pizza House com Gradio...")
    interface = create_interface()
    interface.launch(share=True)  # share=True enables external access

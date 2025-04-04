
#!/bin/bash

echo "=== Iniciando instalação do Gerador de Contratos Julio's Pizza House ==="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Git não está instalado. Por favor, instale o Git primeiro."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "NPM não está instalado. Por favor, instale o Node.js e NPM primeiro."
    exit 1
fi

# Clone the repository
echo "Baixando o repositório do Git..."
git clone https://github.com/seu-usuario/Axssamit/jphcontract.git
cd jphcontract

# Install dependencies
echo "Instalando dependências..."
npm install

# Build the application
echo "Compilando a aplicação..."
npm run build

# Start the application
echo "Iniciando a aplicação..."
npm run preview

# Get the local IP address
if command -v hostname &> /dev/null; then
    IP=$(hostname -I | awk '{print $1}')
    echo ""
    echo "=== Instalação concluída! ==="
    echo "A aplicação está rodando em:"
    echo "- Local: http://localhost:4173"
    if [ ! -z "$IP" ]; then
        echo "- Rede: http://$IP:4173"
    fi
else
    echo ""
    echo "=== Instalação concluída! ==="
    echo "A aplicação está rodando em http://localhost:4173"
fi

echo "Pressione Ctrl+C para encerrar quando terminar de usar."

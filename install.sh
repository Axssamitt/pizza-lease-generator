
#!/bin/bash

echo "=== Iniciando instalação do Gerador de Contratos Julio's Pizza House ==="
echo ""

# Create directory
echo "Criando diretório..."
mkdir -p julio_pizza_house
cd julio_pizza_house

# Download files
echo "Baixando arquivos..."
curl -O https://raw.githubusercontent.com/Axssamit/jphcontract/main/index.html
curl -O https://raw.githubusercontent.com/Axssamit/jphcontract/main/styles.css
curl -O https://raw.githubusercontent.com/Axssamit/jphcontract/main/script.js

echo ""
echo "=== Instalação concluída! ==="
echo ""
echo "Abra o arquivo index.html no seu navegador para usar o aplicativo."
echo "Os contratos serão salvos automaticamente no seu navegador."
echo ""
echo "Para abrir o aplicativo, digite:"
echo "   $ open index.html   # (macOS)"
echo "   $ xdg-open index.html   # (Linux)"
echo "   # No Windows, simplesmente clique duas vezes no arquivo index.html"

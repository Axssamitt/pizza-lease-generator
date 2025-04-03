
# Julio's Pizza House - Gerenciador de Contratos com Gradio

Este projeto utiliza o Gradio para fornecer acesso externo à aplicação React do Gerador de Contratos da Julio's Pizza House.

## Requisitos

- Node.js e npm (para o frontend React)
- Python 3.7+ (para o servidor Gradio)

## Instalação

1. Instale as dependências do Python:
   ```
   pip install -r requirements.txt
   ```

2. As dependências do frontend já estão configuradas no package.json.

## Executando a aplicação

1. Torne o script de construção executável:
   ```
   chmod +x build_and_run.sh
   ```

2. Execute o script para construir o frontend e iniciar o servidor Gradio:
   ```
   ./build_and_run.sh
   ```

3. A aplicação estará disponível em:
   - Interface local: http://localhost:7860
   - Interface Gradio (acesso externo): O link será exibido no terminal

## Funcionalidades

- Acesso ao aplicativo React completo através do Gradio
- Contratos armazenados em um único arquivo JSON (contratos_pizzas.json)
- Acesso externo através do link fornecido pelo Gradio
- Visualização e gerenciamento de contratos

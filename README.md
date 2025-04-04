
# Julio's Pizza House - Gerador de Contratos

Uma aplicação web simples para gerar contratos de eventos de pizza para a Julio's Pizza House.

## Funcionalidades

- Criação de contratos personalizados para eventos
- Geração de recibos
- Histórico de contratos salvos automaticamente no navegador
- Exportação e importação de contratos em formato JSON

## Requisitos

- Apenas um navegador web moderno (Chrome, Firefox, Edge, Safari)
- Não requer Node.js, npm ou qualquer outra instalação

## Instalação

### Método 1: Baixar diretamente

1. Baixe os arquivos:
   - [index.html](https://raw.githubusercontent.com/Axssamit/jphcontract/main/index.html)
   - [styles.css](https://raw.githubusercontent.com/Axssamit/jphcontract/main/styles.css)
   - [script.js](https://raw.githubusercontent.com/Axssamit/jphcontract/main/script.js)

2. Salve todos os arquivos na mesma pasta

3. Abra o arquivo `index.html` no seu navegador

### Método 2: Script de Instalação (Linux/macOS)

No Linux ou macOS, execute:

```bash
curl -o install.sh https://raw.githubusercontent.com/Axssamit/jphcontract/main/install.sh
chmod +x install.sh
./install.sh
```

## Uso

1. Preencha o formulário com os dados do cliente e do evento
2. O contrato e o recibo serão gerados automaticamente
3. Use os botões para imprimir o contrato ou o recibo
4. Clique em "Salvar Contrato" para adicionar o contrato ao histórico
5. Acesse o histórico clicando em "Ver Histórico de Contratos"

## Armazenamento de Dados

- Os contratos são salvos automaticamente no armazenamento local do navegador (localStorage)
- Nenhum dado é enviado para servidores externos
- Faça backup regularmente usando a função "Exportar Contratos"

## Personalização

Se precisar personalizar o aplicativo:

1. Edite o arquivo `styles.css` para alterar a aparência
2. Modifique o arquivo `script.js` para alterar a funcionalidade
3. Atualize o arquivo `index.html` para mudar a estrutura

## Suporte

Para suporte ou dúvidas, entre em contato com o desenvolvedor.


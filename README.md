# Vinted Favoritos Ordenados

Uma extensão para o navegador que permite ordenar os resultados do Vinted com base na quantidade de favoritos que cada item recebeu.

## Funcionalidades

- **Ordenar Página Atual**: Reorganiza os itens da página atual com base no número de favoritos (do maior para o menor)
- **Ordenar Todas as Páginas**: Coleta itens de todas as páginas de resultados e os apresenta ordenados por número de favoritos
- **Visualização Personalizada**: Exibe os resultados em um layout limpo e organizado, destacando o número de favoritos
- **Feedback Visual**: Mostra o progresso da coleta e mensagens de status durante o processo

## Instalação

### Google Chrome / Microsoft Edge

1. Faça o download do arquivo ZIP e extraia-o em uma pasta no seu computador
2. Abra o navegador e acesse `chrome://extensions/` (Chrome) ou `edge://extensions/` (Edge)
3. Ative o "Modo do desenvolvedor" no canto superior direito
4. Clique em "Carregar sem compactação" e selecione a pasta onde você extraiu os arquivos
5. A extensão será instalada e aparecerá na barra de ferramentas do navegador

### Mozilla Firefox

1. Faça o download do arquivo ZIP e extraia-o em uma pasta no seu computador
2. Abra o Firefox e acesse `about:debugging#/runtime/this-firefox`
3. Clique em "Carregar extensão temporária"
4. Navegue até a pasta onde você extraiu os arquivos e selecione o arquivo `manifest.json`
5. A extensão será instalada temporariamente (será removida quando você fechar o Firefox)

## Como Usar

1. Acesse o site [Vinted Portugal](https://www.vinted.pt/)
2. Faça uma busca por qualquer termo (ex: "nike", "zara", etc.)
3. Na página de resultados, você verá dois novos botões:
   - **Ordenar Esta Página**: Reorganiza apenas os itens visíveis na página atual
   - **Ordenar Todas as Páginas**: Coleta e ordena itens de todas as páginas de resultados

### Ordenar Página Atual

- Clique em "Ordenar Esta Página"
- Os itens serão instantaneamente reorganizados com base no número de favoritos
- Não há necessidade de esperar ou navegar entre páginas

### Ordenar Todas as Páginas

- Clique em "Ordenar Todas as Páginas"
- A extensão começará a coletar itens da página atual
- Em seguida, navegará automaticamente para as próximas páginas
- Uma barra de progresso no topo da página mostrará o status da coleta
- Quando a coleta for concluída, todos os itens serão exibidos em uma nova visualização, ordenados por número de favoritos
- Para voltar à visualização original, clique no botão "Voltar à visualização original"

## Observações

- A coleta de todas as páginas pode levar algum tempo, dependendo do número de resultados
- Se você fechar a página durante a coleta, o processo será interrompido
- A extensão funciona apenas no domínio `vinted.pt`
- Os dados coletados são armazenados apenas localmente no seu navegador

## Solução de Problemas

Se a extensão não funcionar corretamente:

1. Verifique se você está no site correto (vinted.pt)
2. Certifique-se de que está em uma página de resultados de busca ou catálogo
3. Tente recarregar a página
4. Se o problema persistir, reinstale a extensão

## Privacidade

Esta extensão:
- Não coleta dados pessoais
- Não envia informações para servidores externos
- Funciona completamente offline, após a instalação
- Armazena temporariamente apenas os dados dos itens para ordenação

## Desenvolvimento

Esta extensão foi desenvolvida usando JavaScript puro e APIs padrão de extensões de navegador. O código-fonte está organizado da seguinte forma:

- `manifest.json`: Configuração da extensão
- `content.js`: Script principal que executa no contexto da página
- `styles.css`: Estilos para os elementos adicionados pela extensão
- `icon16.png`, `icon48.png`, `icon128.png`: Ícones da extensão

## Limitações Conhecidas

- A extensão pode parar de funcionar se o Vinted alterar significativamente a estrutura do seu site
- Em buscas com muitas páginas, o processo de coleta pode ser demorado
- A extensão não mantém o estado entre sessões do navegador (exceto durante coletas em andamento)

## Licença

Esta extensão é fornecida como está, sem garantias. Você pode usá-la e modificá-la livremente para uso pessoal.

/**
 * Vinted Favoritos Ordenados
 * 
 * Este script adiciona funcionalidade para ordenar os resultados do Vinted
 * com base na quantidade de favoritos que cada item recebeu.
 */

// Variáveis globais
let allItems = [];
let currentPage = 1;
let isCollecting = false;
let totalPages = 0;
let originalContent = '';
let extensionEnabled = true; // Default to enabled

// Check if extension is enabled
function checkExtensionEnabled(callback) {
  chrome.storage.local.get(['extensionEnabled'], function(result) {
    extensionEnabled = result.extensionEnabled !== false; // Default to true
    if (callback) callback(extensionEnabled);
  });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'toggleExtension') {
    extensionEnabled = request.enabled;
    
    if (extensionEnabled) {
      // Re-add buttons if extension is enabled
      setTimeout(addSortButtons, 500);
    } else {
      // Remove buttons if extension is disabled
      removeSortButtons();
    }
    
    sendResponse({status: 'success'});
  }
});

// Function to remove sort buttons
function removeSortButtons() {
  const buttons = document.querySelectorAll('.vinted-sort-button');
  buttons.forEach(button => button.remove());
}

// Aguardar o carregamento completo da página
window.addEventListener('load', function() {
  // Check if extension is enabled first
  checkExtensionEnabled(function(isEnabled) {
    if (!isEnabled) {
      console.log('Vinted Favoritos Ordenados: Extensão desativada');
      return;
    }
    
    // Verificar se estamos em uma página de resultados de busca ou catálogo
    if (window.location.href.includes('/catalog')) {
      console.log('Vinted Favoritos Ordenados: Página de catálogo detectada');
      
      // Adicionar botão para ordenar por favoritos
      setTimeout(addSortButtons, 1500); // Aumentado para garantir carregamento completo
      
      // Verificar se estamos continuando uma coleta anterior
      try {
        chrome.storage.local.get(['vintedItems', 'currentPage', 'isCollecting'], (data) => {
          if (data.isCollecting) {
            allItems = data.vintedItems || [];
            currentPage = data.currentPage || 1;
            
            // Continuar coleta
            showMessage(`Continuando coleta da página ${currentPage}...`);
            setTimeout(collectAllPages, 2000); // Aguardar carregamento da página
          }
        });
      } catch (error) {
        console.error('Erro ao acessar storage:', error);
      }
    }
  });
});

/**
 * Adiciona botões para ordenar por favoritos
 */
function addSortButtons() {
  try {
    // Check if extension is enabled
    if (!extensionEnabled) {
      return;
    }
    
    // Verificar se os botões já existem para evitar duplicação
    if (document.querySelector('.vinted-sort-button')) {
      return;
    }
    
    // Encontrar o container de filtros/ordenação - múltiplas estratégias
    let sortContainer = document.querySelector('button[data-testid*="sorting"]')?.parentElement;
    
    if (!sortContainer) {
      // Tentar encontrar pelo texto do botão
      const buttons = Array.from(document.querySelectorAll('button'));
      const sortButton = buttons.find(btn => 
        btn.textContent.includes('Ordenar por') || 
        btn.textContent.includes('Sort by')
      );
      
      if (sortButton) {
        sortContainer = sortButton.parentElement;
      }
    }
    
    // Última tentativa - procurar por elementos de filtro
    if (!sortContainer) {
      sortContainer = document.querySelector('.u-flexbox.u-justify-content-flex-start.u-overflow-x-auto');
    }
    
    if (sortContainer) {
      // Criar botão para ordenar página atual
      const sortCurrentButton = document.createElement('button');
      sortCurrentButton.textContent = 'Ordenar Esta Página';
      sortCurrentButton.className = 'vinted-sort-button';
      sortCurrentButton.style.cssText = 'padding: 8px 16px; margin: 8px; background-color: #09B1BA; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background-color 0.3s;';
      sortCurrentButton.addEventListener('click', sortCurrentPage);
      
      // Criar botão para ordenar todas as páginas
      const sortAllButton = document.createElement('button');
      sortAllButton.textContent = 'Ordenar Todas as Páginas';
      sortAllButton.className = 'vinted-sort-button';
      sortAllButton.style.cssText = 'padding: 8px 16px; margin: 8px; background-color: #09B1BA; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background-color 0.3s;';
      sortAllButton.addEventListener('click', () => {
        if (!isCollecting) {
          isCollecting = true;
          allItems = [];
          currentPage = 1;
          
          // Salvar estado
          try {
            chrome.storage.local.set({
              'isCollecting': true,
              'vintedItems': allItems,
              'currentPage': currentPage
            });
          } catch (error) {
            console.error('Erro ao salvar estado:', error);
          }
          
          // Iniciar coleta
          estimateTotalPages();
          collectAllPages();
        }
      });
      
      // Adicionar botões ao container
      sortContainer.appendChild(sortCurrentButton);
      sortContainer.appendChild(sortAllButton);
      
      console.log('Vinted Favoritos Ordenados: Botões adicionados');
    } else {
      console.warn('Vinted Favoritos Ordenados: Container de ordenação não encontrado');
      
      // Criar container flutuante como fallback
      const floatingContainer = document.createElement('div');
      floatingContainer.style.cssText = 'position: fixed; top: 70px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
      
      const sortCurrentButton = document.createElement('button');
      sortCurrentButton.textContent = 'Ordenar Esta Página';
      sortCurrentButton.className = 'vinted-sort-button';
      sortCurrentButton.style.cssText = 'padding: 8px 16px; background-color: #09B1BA; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background-color 0.3s;';
      sortCurrentButton.addEventListener('click', sortCurrentPage);
      
      const sortAllButton = document.createElement('button');
      sortAllButton.textContent = 'Ordenar Todas as Páginas';
      sortAllButton.className = 'vinted-sort-button';
      sortAllButton.style.cssText = 'padding: 8px 16px; background-color: #09B1BA; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background-color 0.3s;';
      sortAllButton.addEventListener('click', () => {
        if (!isCollecting) {
          isCollecting = true;
          allItems = [];
          currentPage = 1;
          
          // Iniciar coleta
          estimateTotalPages();
          collectAllPages();
        }
      });
      
      floatingContainer.appendChild(sortCurrentButton);
      floatingContainer.appendChild(sortAllButton);
      document.body.appendChild(floatingContainer);
      
      console.log('Vinted Favoritos Ordenados: Botões flutuantes adicionados');
    }
  } catch (error) {
    console.error('Erro ao adicionar botões:', error);
  }
}

/**
 * Estima o número total de páginas
 */
function estimateTotalPages() {
  try {
    const paginationText = document.querySelector('.web_ui__Pagination__info')?.textContent;
    if (paginationText) {
      const match = paginationText.match(/de\s+(\d+)/);
      if (match && match[1]) {
        const totalItems = parseInt(match[1], 10);
        totalPages = Math.ceil(totalItems / 96); // Aproximadamente 96 itens por página
        console.log(`Vinted Favoritos Ordenados: Estimativa de ${totalPages} páginas`);
      }
    } else {
      // Tentar encontrar pelos botões de paginação
      const paginationButtons = document.querySelectorAll('.web_ui__Pagination__button');
      if (paginationButtons.length > 0) {
        const lastButton = paginationButtons[paginationButtons.length - 2]; // O último é "Próxima"
        if (lastButton && lastButton.textContent) {
          totalPages = parseInt(lastButton.textContent.trim(), 10) || 5;
        } else {
          totalPages = 5; // Valor padrão se não conseguir determinar
        }
      } else {
        totalPages = 1; // Apenas uma página
      }
    }
    
    // Adicionar barra de progresso
    const progressBar = document.createElement('div');
    progressBar.className = 'vinted-progress';
    progressBar.style.cssText = 'position: fixed; top: 0; left: 0; height: 4px; background-color: #09B1BA; z-index: 10000; transition: width 0.3s;';
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);
  } catch (error) {
    console.error('Erro ao estimar páginas:', error);
    totalPages = 5; // Valor padrão em caso de erro
  }
}

/**
 * Atualiza a barra de progresso
 */
function updateProgressBar() {
  try {
    if (totalPages > 0) {
      const progress = (currentPage / totalPages) * 100;
      const progressBar = document.querySelector('.vinted-progress');
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
    }
  } catch (error) {
    console.error('Erro ao atualizar barra de progresso:', error);
  }
}

/**
 * Ordena apenas a página atual por número de favoritos
 */
function sortCurrentPage() {
  try {
    showMessage('Ordenando itens da página atual...');
    
    // Selecionar o container de resultados - múltiplas estratégias
    let resultsContainer = document.querySelector('.feed-grid') || 
                          document.querySelector('[data-testid="item-catalog-items"]');
    
    // Tentar outras estratégias se não encontrar
    if (!resultsContainer) {
      // Procurar por grid de itens
      resultsContainer = document.querySelector('.web_ui__ItemsGrid__container');
    }
    
    if (!resultsContainer) {
      // Última tentativa - procurar por qualquer container com muitos itens filhos
      const possibleContainers = Array.from(document.querySelectorAll('div')).filter(div => 
        div.children.length > 10 && 
        Array.from(div.children).some(child => 
          child.querySelector('button[data-testid*="favourite"]')
        )
      );
      
      if (possibleContainers.length > 0) {
        // Usar o container com mais itens
        resultsContainer = possibleContainers.reduce((a, b) => 
          a.children.length > b.children.length ? a : b
        );
      }
    }
    
    if (!resultsContainer) {
      showMessage('Container de resultados não encontrado', true);
      return;
    }
    
    // Obter todos os itens de produto
    const productItems = Array.from(resultsContainer.children);
    
    // Extrair informações de favoritos para cada item
    const itemsWithFavorites = productItems.map(item => {
      try {
        // Encontrar o botão de favoritos - múltiplas estratégias
        let favoriteButton = item.querySelector('button[data-testid*="product-item-id"][data-testid*="favourite"]');
        
        if (!favoriteButton) {
          favoriteButton = item.querySelector('button[data-testid*="favourite"]');
        }
        
        if (!favoriteButton) {
          favoriteButton = item.querySelector('button[aria-label*="favorit"]');
        }
        
        // Extrair o número de favoritos
        let favoriteCount = 0;
        if (favoriteButton) {
          // Encontrar o span com o número
          const favoriteSpan = favoriteButton.querySelector('span.web_ui__Text__text') || 
                              favoriteButton.querySelector('span:not([class*="Icon"])');
          
          if (favoriteSpan && favoriteSpan.textContent.trim()) {
            favoriteCount = parseInt(favoriteSpan.textContent.trim(), 10) || 0;
          }
        }
        
        return {
          element: item,
          favorites: favoriteCount
        };
      } catch (error) {
        console.error('Erro ao processar item:', error);
        return {
          element: item,
          favorites: 0
        };
      }
    });
    
    // Ordenar itens por número de favoritos (decrescente)
    itemsWithFavorites.sort((a, b) => b.favorites - a.favorites);
    
    // Reordenar os elementos no DOM
    itemsWithFavorites.forEach(item => {
      resultsContainer.appendChild(item.element);
    });
    
    // Mostrar mensagem de confirmação
    showMessage(`${itemsWithFavorites.length} itens ordenados por favoritos!`);
  } catch (error) {
    console.error('Erro ao ordenar página atual:', error);
    showMessage('Erro ao ordenar: ' + error.message, true);
  }
}

/**
 * Coleta itens da página atual
 */
function collectCurrentPage() {
  try {
    // Selecionar todos os itens de produto - múltiplas estratégias
    let items = Array.from(document.querySelectorAll('[data-testid*="product-item"]'));
    
    if (items.length === 0) {
      // Tentar encontrar itens pelo container
      const container = document.querySelector('.feed-grid') || 
                        document.querySelector('[data-testid="item-catalog-items"]') ||
                        document.querySelector('.web_ui__ItemsGrid__container');
      
      if (container) {
        items = Array.from(container.children);
      }
    }
    
    if (items.length === 0) {
      // Última tentativa - procurar por elementos que parecem ser itens
      items = Array.from(document.querySelectorAll('div')).filter(div => 
        div.querySelector('button[data-testid*="favourite"]') || 
        div.querySelector('a[href*="/items/"]')
      );
    }
    
    const pageItems = items.map(item => {
      try {
        // Extrair dados do item - múltiplas estratégias
        let link = item.querySelector('a[href*="/items/"]');
        let href = '';
        let title = '';
        
        if (link) {
          href = link.getAttribute('href') || '';
          title = link.getAttribute('title') || link.textContent || '';
        }
        
        // Extrair favoritos - múltiplas estratégias
        let favoriteButton = item.querySelector('button[data-testid*="product-item-id"][data-testid*="favourite"]');
        
        if (!favoriteButton) {
          favoriteButton = item.querySelector('button[data-testid*="favourite"]');
        }
        
        if (!favoriteButton) {
          favoriteButton = item.querySelector('button[aria-label*="favorit"]');
        }
        
        let favoriteCount = 0;
        
        if (favoriteButton) {
          const favoriteSpan = favoriteButton.querySelector('span.web_ui__Text__text') || 
                              favoriteButton.querySelector('span:not([class*="Icon"])');
          
          if (favoriteSpan && favoriteSpan.textContent.trim()) {
            favoriteCount = parseInt(favoriteSpan.textContent.trim(), 10) || 0;
          }
        }
        
        // Extrair imagem - múltiplas estratégias
        let img = item.querySelector('img');
        let imgSrc = '';
        
        if (img) {
          imgSrc = img.getAttribute('src') || '';
        } else {
          // Tentar encontrar div de background com estilo
          const imgDiv = item.querySelector('div[style*="background-image"]');
          if (imgDiv) {
            const style = imgDiv.getAttribute('style') || '';
            const match = style.match(/url\(['"]?(.*?)['"]?\)/);
            if (match && match[1]) {
              imgSrc = match[1];
            }
          }
        }
        
        // Extrair preço - múltiplas estratégias
        let priceElement = item.querySelector('.web_ui__Text__subtitle') || 
                          item.querySelector('[data-testid*="price"]');
        
        if (!priceElement) {
          // Procurar por elementos que parecem conter preço (€)
          const elements = Array.from(item.querySelectorAll('div, span'));
          priceElement = elements.find(el => 
            el.textContent.includes('€') || 
            el.textContent.match(/\d+,\d+/)
          );
        }
        
        const price = priceElement ? priceElement.textContent.trim() : '';
        
        return {
          title,
          href,
          imgSrc,
          price,
          favoriteCount
        };
      } catch (error) {
        console.error('Erro ao extrair dados do item:', error);
        return null;
      }
    }).filter(item => item !== null);
    
    return pageItems;
  } catch (error) {
    console.error('Erro ao coletar página atual:', error);
    return [];
  }
}

/**
 * Coleta itens de todas as páginas
 */
function collectAllPages() {
  try {
    // Atualizar barra de progresso
    updateProgressBar();
    
    // Coletar itens da página atual
    const currentItems = collectCurrentPage();
    allItems = [...allItems, ...currentItems];
    
    showMessage(`Coletados ${allItems.length} itens (Página ${currentPage}/${totalPages || '?'})...`);
    
    // Salvar itens coletados até agora
    try {
      chrome.storage.local.set({
        'vintedItems': allItems,
        'currentPage': currentPage + 1,
        'isCollecting': true
      });
    } catch (error) {
      console.error('Erro ao salvar estado:', error);
    }
    
    // Verificar se há próxima página - múltiplas estratégias
    let nextButton = document.querySelector('a[rel="next"]') || 
                    document.querySelector('button[aria-label="Próxima página"]') ||
                    document.querySelector('.web_ui__Pagination__button--next');
    
    if (!nextButton) {
      // Procurar por botões de paginação
      const paginationButtons = Array.from(document.querySelectorAll('.web_ui__Pagination__button'));
      const currentPageButton = paginationButtons.find(btn => 
        btn.getAttribute('aria-current') === 'true' || 
        btn.classList.contains('web_ui__Pagination__button--active')
      );
      
      if (currentPageButton) {
        const currentIndex = paginationButtons.indexOf(currentPageButton);
        if (currentIndex >= 0 && currentIndex < paginationButtons.length - 1) {
          nextButton = paginationButtons[currentIndex + 1];
        }
      }
    }
    
    if (!nextButton) {
      // Última tentativa - procurar por texto "Próxima" ou seta
      const buttons = Array.from(document.querySelectorAll('button'));
      nextButton = buttons.find(btn => 
        btn.textContent.includes('Próxima') || 
        btn.textContent.includes('Next') ||
        btn.innerHTML.includes('→') ||
        btn.innerHTML.includes('&rarr;')
      );
    }
    
    if (nextButton && currentPage < (totalPages || 100)) { // Limite de segurança
      // Incrementar página atual
      currentPage++;
      
      // Clicar no botão de próxima página
      nextButton.click();
      
      // Aguardar carregamento da próxima página
      setTimeout(collectAllPages, 2500); // Aumentado para garantir carregamento
    } else {
      // Finalizar coleta e mostrar resultados
      finishCollection();
    }
  } catch (error) {
    console.error('Erro ao coletar páginas:', error);
    showMessage('Erro ao coletar páginas: ' + error.message, true);
    
    // Limpar estado de coleta
    try {
      chrome.storage.local.set({
        'isCollecting': false
      });
    } catch (error) {
      console.error('Erro ao limpar estado:', error);
    }
    
    isCollecting = false;
  }
}

/**
 * Finaliza a coleta e mostra os resultados
 */
function finishCollection() {
  try {
    // Limpar estado de coleta
    chrome.storage.local.set({
      'isCollecting': false
    });
    
    isCollecting = false;
    
    // Ordenar todos os itens por favoritos
    allItems.sort((a, b) => b.favoriteCount - a.favoriteCount);
    
    // Salvar conteúdo original
    const mainContent = document.querySelector('main') || document.body;
    originalContent = mainContent.innerHTML;
    
    // Criar nova visualização
    showResults(mainContent);
  } catch (error) {
    console.error('Erro ao finalizar coleta:', error);
    showMessage('Erro ao finalizar: ' + error.message, true);
  }
}

/**
 * Mostra os resultados ordenados
 */
function showResults(container) {
  try {
    // Limpar container
    container.innerHTML = '';
    
    // Criar cabeçalho
    const header = document.createElement('div');
    header.style.cssText = 'padding: 20px; display: flex; justify-content: space-between; align-items: center;';
    
    // Adicionar título
    const title = document.createElement('h1');
    title.textContent = `${allItems.length} itens ordenados por favoritos`;
    title.style.cssText = 'margin: 0; font-size: 24px;';
    
    // Adicionar botão para voltar
    const backButton = document.createElement('button');
    backButton.textContent = 'Voltar à visualização original';
    backButton.style.cssText = 'padding: 8px 16px; margin: 20px; background-color: #09B1BA; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;';
    backButton.addEventListener('click', () => {
      container.innerHTML = originalContent;
      setTimeout(addSortButtons, 1500);
    });
    
    header.appendChild(title);
    header.appendChild(backButton);
    container.appendChild(header);
    
    // Criar grid de resultados
    const resultsGrid = document.createElement('div');
    resultsGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; padding: 20px;';
    
    // Adicionar itens ordenados
    allItems.forEach(item => {
      const itemCard = document.createElement('div');
      itemCard.style.cssText = 'border: 1px solid #eee; border-radius: 8px; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;';
      
      // Verificar se href começa com / para URL completa
      const itemHref = item.href.startsWith('/') ? `https://www.vinted.pt${item.href}` : item.href;
      
      itemCard.innerHTML = `
        <a href="${itemHref}" target="_blank" style="text-decoration: none; color: inherit;">
          <div style="position: relative;">
            <img src="${item.imgSrc}" style="width: 100%; height: 250px; object-fit: cover;">
            <div style="position: absolute; top: 10px; right: 10px; background-color: rgba(255,255,255,0.9); border-radius: 20px; padding: 5px 10px;">
              <span style="color: #09B1BA; font-weight: bold; display: flex; align-items: center;">❤️ ${item.favoriteCount}</span>
            </div>
          </div>
          <div style="padding: 10px;">
            <div style="font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</div>
            <div style="margin-top: 8px; font-weight: bold; color: #09B1BA;">${item.price}</div>
          </div>
        </a>
      `;
      
      // Adicionar hover effect
      itemCard.addEventListener('mouseenter', () => {
        itemCard.style.transform = 'translateY(-5px)';
        itemCard.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
      });
      
      itemCard.addEventListener('mouseleave', () => {
        itemCard.style.transform = '';
        itemCard.style.boxShadow = '';
      });
      
      resultsGrid.appendChild(itemCard);
    });
    
    container.appendChild(resultsGrid);
    
    // Remover barra de progresso
    const progressBar = document.querySelector('.vinted-progress');
    if (progressBar) {
      progressBar.remove();
    }
    
    // Mostrar mensagem de conclusão
    showMessage('Ordenação concluída!');
  } catch (error) {
    console.error('Erro ao mostrar resultados:', error);
    showMessage('Erro ao mostrar resultados: ' + error.message, true);
  }
}

/**
 * Mostra uma mensagem temporária
 */
function showMessage(text, isError = false) {
  try {
    // Remover mensagem anterior se existir
    const existingMessage = document.querySelector('.vinted-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Criar nova mensagem
    const message = document.createElement('div');
    message.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background-color: #09B1BA; color: white; padding: 10px 20px; border-radius: 4px; z-index: 9999; box-shadow: 0 2px 10px rgba(0,0,0,0.2);';
    message.textContent = text;
    
    if (isError) {
      message.style.backgroundColor = '#e74c3c';
    }
    
    document.body.appendChild(message);
    
    // Remover mensagem após 3 segundos
    setTimeout(() => {
      message.remove();
    }, 3000);
  } catch (error) {
    console.error('Erro ao mostrar mensagem:', error);
  }
}

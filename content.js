/**
 * Vinted Favorites Sorted
 * 
 * This script adds fu      console.log('Vinted Favorites Sorted: Catalog page detected');
      
      // Add button to sort by favorites
      setTimeout(addSortButtons, 1500); // Increased to ensure complete loading
      
      // Check if we are continuing a previous collection
      try {
        chrome.storage.local.get(['vintedItems', 'currentPage', 'isCollecting'], (data) => {
          if (data.isCollecting) {
            allItems = data.vintedItems || [];
            currentPage = data.currentPage || 1;
            
            // Continue collection
            showMessage(`Continuing collection from page ${currentPage}...`);
            setTimeout(collectAllPages, 2000); // Wait for page loading
          }
        });
      } catch (error) {
        console.error('Error accessing storage:', error);
      }Vinted results
 * based on the number of favorites each item has received.
 */

// Global variables
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

// Wait for complete page loading
window.addEventListener('load', function() {
  // Check if extension is enabled first
  checkExtensionEnabled(function(isEnabled) {
    if (!isEnabled) {
      console.log('Vinted Favorites Sorted: Extension disabled');
      return;
    }
    
    // Check if we are on a search results or catalog page
    if (window.location.href.includes('/catalog')) {
      console.log('Vinted Favorites Sorted: Catalog page detected');
      
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
 * Adds buttons to sort by favorites
 */
function addSortButtons() {
  try {    
    // Check if extension is enabled
    if (!extensionEnabled) {
      return;
    }
    
    // Check if buttons already exist to avoid duplication
    if (document.querySelector('.vinted-sort-button')) {
      return;
    }
    
    // Find the filter/sort container - multiple strategies
    let sortContainer = document.querySelector('button[data-testid*="sorting"]')?.parentElement;
    
    if (!sortContainer) {
      // Try to find by button text
      const buttons = Array.from(document.querySelectorAll('button'));
      const sortButton = buttons.find(btn => 
        btn.textContent.includes('Sort by') || 
        btn.textContent.includes('Sort by')
      );
      
      if (sortButton) {
        sortContainer = sortButton.parentElement;
      }
    }
    
    // Last attempt - look for filter elements
    if (!sortContainer) {
      sortContainer = document.querySelector('.u-flexbox.u-justify-content-flex-start.u-overflow-x-auto');
    }
    
    if (sortContainer) {
      // Create button to sort current page
      const sortCurrentButton = document.createElement('button');
      sortCurrentButton.textContent = 'Sort This Page';
      sortCurrentButton.className = 'vinted-sort-button';
      sortCurrentButton.style.cssText = 'padding: 8px 16px; margin: 8px; background-color: #09B1BA; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background-color 0.3s;';
      sortCurrentButton.addEventListener('click', sortCurrentPage);
      
      // Create button to sort all pages
      const sortAllButton = document.createElement('button');
      sortAllButton.textContent = 'Sort All Pages';
      sortAllButton.className = 'vinted-sort-button';
      sortAllButton.style.cssText = 'padding: 8px 16px; margin: 8px; background-color: #09B1BA; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background-color 0.3s;';
      sortAllButton.addEventListener('click', () => {
        if (!isCollecting) {
          isCollecting = true;
          allItems = [];
          currentPage = 1;
          
          // Save state
          try {
            chrome.storage.local.set({
              'isCollecting': true,
              'vintedItems': allItems,
              'currentPage': currentPage
            });
          } catch (error) {
            console.error('Error saving state:', error);
          }
          
          // Start collection
          estimateTotalPages();
          collectAllPages();
        }
      });
      
      // Add buttons to container
      sortContainer.appendChild(sortCurrentButton);
      sortContainer.appendChild(sortAllButton);
      
      console.log('Vinted Favorites Sorted: Buttons added');
    } else {
      console.warn('Vinted Favorites Sorted: Sort container not found');
      
      // Create floating container as fallback
      const floatingContainer = document.createElement('div');
      floatingContainer.style.cssText = 'position: fixed; top: 70px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
      
      const sortCurrentButton = document.createElement('button');
      sortCurrentButton.textContent = 'Sort This Page';
      sortCurrentButton.className = 'vinted-sort-button';
      sortCurrentButton.style.cssText = 'padding: 8px 16px; background-color: #09B1BA; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background-color 0.3s;';
      sortCurrentButton.addEventListener('click', sortCurrentPage);
      
      const sortAllButton = document.createElement('button');
      sortAllButton.textContent = 'Sort All Pages';
      sortAllButton.className = 'vinted-sort-button';
      sortAllButton.style.cssText = 'padding: 8px 16px; background-color: #09B1BA; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background-color 0.3s;';
      sortAllButton.addEventListener('click', () => {
        if (!isCollecting) {
          isCollecting = true;
          allItems = [];
          currentPage = 1;
          
          // Start collection
          estimateTotalPages();
          collectAllPages();
        }
      });
      
      floatingContainer.appendChild(sortCurrentButton);
      floatingContainer.appendChild(sortAllButton);
      document.body.appendChild(floatingContainer);
      
      console.log('Vinted Favorites Sorted: Floating buttons added');
    }
  } catch (error) {
    console.error('Error adding buttons:', error);
  }
}

/**
 * Estimates the total number of pages
 */
function estimateTotalPages() {
  try {
    const paginationText = document.querySelector('.web_ui__Pagination__info')?.textContent;
    if (paginationText) {
      const match = paginationText.match(/de\s+(\d+)/);
      if (match && match[1]) {
        const totalItems = parseInt(match[1], 10);
        totalPages = Math.ceil(totalItems / 96); // Approximately 96 items per page
        console.log(`Vinted Favorites Sorted: Estimated ${totalPages} pages`);
      }
    } else {
      // Try to find by pagination buttons
      const paginationButtons = document.querySelectorAll('.web_ui__Pagination__button');
      if (paginationButtons.length > 0) {
        const lastButton = paginationButtons[paginationButtons.length - 2]; // The last one is "Next"
        if (lastButton && lastButton.textContent) {
          totalPages = parseInt(lastButton.textContent.trim(), 10) || 5;
        } else {
          totalPages = 5; // Default value if can't determine
        }
      } else {
        totalPages = 1; // Only one page
      }
    }
    
    // Add progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'vinted-progress';
    progressBar.style.cssText = 'position: fixed; top: 0; left: 0; height: 4px; background-color: #09B1BA; z-index: 10000; transition: width 0.3s;';
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);
  } catch (error) {
    console.error('Error estimating pages:', error);
    totalPages = 5; // Default value in case of error
  }
}

/**
 * Updates the progress bar
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
    console.error('Error updating progress bar:', error);
  }
}

/**
 * Sorts only the current page by number of favorites
 */
function sortCurrentPage() {
  try {
    showMessage('Sorting current page items...');
    
    // Select the results container - multiple strategies
    let resultsContainer = document.querySelector('.feed-grid') || 
                          document.querySelector('[data-testid="item-catalog-items"]');
    
    // Try other strategies if not found
    if (!resultsContainer) {
      // Look for items grid
      resultsContainer = document.querySelector('.web_ui__ItemsGrid__container');
    }
    
    if (!resultsContainer) {
      // Last attempt - look for any container with many child items
      const possibleContainers = Array.from(document.querySelectorAll('div')).filter(div => 
        div.children.length > 10 && 
        Array.from(div.children).some(child => 
          child.querySelector('button[data-testid*="favourite"]')
        )
      );
      
      if (possibleContainers.length > 0) {
        // Use the container with most items
        resultsContainer = possibleContainers.reduce((a, b) => 
          a.children.length > b.children.length ? a : b
        );
      }
    }
    
    if (!resultsContainer) {
      showMessage('Results container not found', true);
      return;
    }
    
    // Get all product items
    const productItems = Array.from(resultsContainer.children);
    
    // Extract favorites information for each item
    const itemsWithFavorites = productItems.map(item => {
      try {
        // Find the favorites button - multiple strategies
        let favoriteButton = item.querySelector('button[data-testid*="product-item-id"][data-testid*="favourite"]');
        
        if (!favoriteButton) {
          favoriteButton = item.querySelector('button[data-testid*="favourite"]');
        }
        
        if (!favoriteButton) {
          favoriteButton = item.querySelector('button[aria-label*="favorit"]');
        }
        
        // Extract the number of favorites
        let favoriteCount = 0;
        if (favoriteButton) {
          // Find the span with the number
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
        console.error('Error processing item:', error);
        return {
          element: item,
          favorites: 0
        };
      }
    });
    
    // Sort items by number of favorites (descending)
    itemsWithFavorites.sort((a, b) => b.favorites - a.favorites);
    
    // Reorder elements in the DOM
    itemsWithFavorites.forEach(item => {
      resultsContainer.appendChild(item.element);
    });
    
    // Show confirmation message
    showMessage(`${itemsWithFavorites.length} items sorted by favorites!`);
  } catch (error) {
    console.error('Error sorting current page:', error);
    showMessage('Error sorting: ' + error.message, true);
  }
}

/**
 * Collects items from the current page
 */
function collectCurrentPage() {
  try {
    // Select all product items - multiple strategies
    let items = Array.from(document.querySelectorAll('[data-testid*="product-item"]'));
    
    if (items.length === 0) {
      // Try to find items by container
      const container = document.querySelector('.feed-grid') || 
                        document.querySelector('[data-testid="item-catalog-items"]') ||
                        document.querySelector('.web_ui__ItemsGrid__container');
      
      if (container) {
        items = Array.from(container.children);
      }
    }
    
    if (items.length === 0) {
      // Last attempt - look for elements that seem to be items
      items = Array.from(document.querySelectorAll('div')).filter(div => 
        div.querySelector('button[data-testid*="favourite"]') || 
        div.querySelector('a[href*="/items/"]')
      );
    }
    
    const pageItems = items.map(item => {
      try {
        // Extract item data - multiple strategies
        let link = item.querySelector('a[href*="/items/"]');
        let href = '';
        let title = '';
        
        if (link) {
          href = link.getAttribute('href') || '';
          title = link.getAttribute('title') || link.textContent || '';
        }
        
        // Extract favorites - multiple strategies
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
        
        // Extract image - multiple strategies
        let img = item.querySelector('img');
        let imgSrc = '';
        
        if (img) {
          imgSrc = img.getAttribute('src') || '';
        } else {
          // Try to find background div with style
          const imgDiv = item.querySelector('div[style*="background-image"]');
          if (imgDiv) {
            const style = imgDiv.getAttribute('style') || '';
            const match = style.match(/url\(['"]?(.*?)['"]?\)/);
            if (match && match[1]) {
              imgSrc = match[1];
            }
          }
        }
        
        // Extract price - multiple strategies
        let priceElement = item.querySelector('.web_ui__Text__subtitle') || 
                          item.querySelector('[data-testid*="price"]');
        
        if (!priceElement) {
          // Look for elements that seem to contain price (€)
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
        console.error('Error extracting item data:', error);
        return null;
      }
    }).filter(item => item !== null);
    
    return pageItems;
  } catch (error) {
    console.error('Error collecting current page:', error);
    return [];
  }
}

/**
 * Collects items from all pages
 */
function collectAllPages() {
  try {
    // Update progress bar
    updateProgressBar();
    
    // Collect items from current page
    const currentItems = collectCurrentPage();
    allItems = [...allItems, ...currentItems];
    
    showMessage(`Collected ${allItems.length} items (Page ${currentPage}/${totalPages || '?'})...`);
    
    // Save collected items so far
    try {
      chrome.storage.local.set({
        'vintedItems': allItems,
        'currentPage': currentPage + 1,
        'isCollecting': true
      });
    } catch (error) {
      console.error('Error saving state:', error);
    }
    
    // Check if there's a next page - multiple strategies
    let nextButton = document.querySelector('a[rel="next"]') || 
                    document.querySelector('button[aria-label="Next page"]') ||
                    document.querySelector('.web_ui__Pagination__button--next');
    
    if (!nextButton) {
      // Look for pagination buttons
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
      // Last attempt - look for "Next" text or arrow
      const buttons = Array.from(document.querySelectorAll('button'));
      nextButton = buttons.find(btn => 
        btn.textContent.includes('Next') || 
        btn.textContent.includes('Next') ||
        btn.innerHTML.includes('→') ||
        btn.innerHTML.includes('&rarr;')
      );
    }
    
    if (nextButton && currentPage < (totalPages || 100)) { // Safety limit
      // Increment current page
      currentPage++;
      
      // Click next page button
      nextButton.click();
      
      // Wait for next page loading
      setTimeout(collectAllPages, 2500); // Increased to ensure loading
    } else {
      // Finish collection and show results
      finishCollection();
    }
  } catch (error) {
    console.error('Error collecting pages:', error);
    showMessage('Error collecting pages: ' + error.message, true);
    
    // Clear collection state
    try {
      chrome.storage.local.set({
        'isCollecting': false
      });
    } catch (error) {
      console.error('Error clearing state:', error);
    }
    
    isCollecting = false;
  }
}

/**
 * Finishes collection and shows results
 */
function finishCollection() {
  try {
    // Clear collection state
    chrome.storage.local.set({
      'isCollecting': false
    });
    
    isCollecting = false;
    
    // Sort all items by favorites
    allItems.sort((a, b) => b.favoriteCount - a.favoriteCount);
    
    // Save original content
    const mainContent = document.querySelector('main') || document.body;
    originalContent = mainContent.innerHTML;
    
    // Create new view
    showResults(mainContent);
  } catch (error) {
    console.error('Error finishing collection:', error);
    showMessage('Error finishing: ' + error.message, true);
  }
}

/**
 * Shows the sorted results
 */
function showResults(container) {
  try {
    // Clear container
    container.innerHTML = '';
    
    // Create header
    const header = document.createElement('div');
    header.style.cssText = 'padding: 20px; display: flex; justify-content: space-between; align-items: center;';
    
    // Add title
    const title = document.createElement('h1');
    title.textContent = `${allItems.length} items sorted by favorites`;
    title.style.cssText = 'margin: 0; font-size: 24px;';
    
    // Add back button
    const backButton = document.createElement('button');
    backButton.textContent = 'Return to original view';
    backButton.style.cssText = 'padding: 8px 16px; margin: 20px; background-color: #09B1BA; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;';
    backButton.addEventListener('click', () => {
      container.innerHTML = originalContent;
      setTimeout(addSortButtons, 1500);
    });
    
    header.appendChild(title);
    header.appendChild(backButton);
    container.appendChild(header);
    
    // Create results grid
    const resultsGrid = document.createElement('div');
    resultsGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; padding: 20px;';
    
    // Add sorted items
    allItems.forEach(item => {
      const itemCard = document.createElement('div');
      itemCard.style.cssText = 'border: 1px solid #eee; border-radius: 8px; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;';
      
      // Check if href starts with / for complete URL
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
      
      // Add hover effect
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
    
    // Remove progress bar
    const progressBar = document.querySelector('.vinted-progress');
    if (progressBar) {
      progressBar.remove();
    }
    
    // Show completion message
    showMessage('Sorting completed!');
  } catch (error) {
    console.error('Error showing results:', error);
    showMessage('Error showing results: ' + error.message, true);
  }
}

/**
 * Shows a temporary message
 */
function showMessage(text, isError = false) {
  try {
    // Remove previous message if it exists
    const existingMessage = document.querySelector('.vinted-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create new message
    const message = document.createElement('div');
    message.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background-color: #09B1BA; color: white; padding: 10px 20px; border-radius: 4px; z-index: 9999; box-shadow: 0 2px 10px rgba(0,0,0,0.2);';
    message.textContent = text;
    
    if (isError) {
      message.style.backgroundColor = '#e74c3c';
    }
    
    document.body.appendChild(message);
    
    // Remove message after 3 seconds
    setTimeout(() => {
      message.remove();
    }, 3000);
  } catch (error) {
    console.error('Error showing message:', error);
  }
}

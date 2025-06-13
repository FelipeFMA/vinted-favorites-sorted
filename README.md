# 🛍️ Vinted Favorites Sorted 🌟

A browser extension that allows you to sort Vinted results based on the number of favorites each item has received. This is a Manifest V3 extension.

## ✨ Features

- **Activation Control**: Click the extension icon to open a menu where you can enable/disable the extension 🎛️
- **Modern Interface**: Popup menu with modern and intuitive design 🎨
- **Sort Current Page**: Reorganizes items on the current page based on the number of favorites (from highest to lowest) 📄➡️📄
- **Sort All Pages**: Collects items from all result pages and presents them sorted by number of favorites 📚➡️📖
- **Custom View**: Displays results in a clean and organized layout, highlighting the number of favorites ✨
- **Visual Feedback**: Shows collection progress and status messages during the process 📊

## 💡 Motivation

This project was developed as a paid commission for a client who requested this specific functionality. It is now open source! 💖

## 🛠️ Installation

This extension works on any Chromium-based browser (like Google Chrome, Microsoft Edge, Brave, etc.).

1. Download the ZIP file and extract it to a folder on your computer 📁
2. Open your browser and go to `chrome://extensions/` (or the equivalent for your browser)
3. Enable "Developer mode" in the top right corner 🧑‍💻
4. Click "Load unpacked" and select the folder where you extracted the files 🚀
5. The extension will be installed and appear in the browser toolbar 🎉

## 🚀 How to Use

1. Go to [Vinted Portugal](https://www.vinted.pt/) 🇵🇹
2. Click the extension icon in the toolbar to open the popup menu 🖱️
3. Make sure the extension is enabled (green toggle) ✅
4. Search for any term (e.g., "nike", "zara", etc.) 🔎
5. On the results page, you will see two new buttons:
    - **Sort This Page**: Reorganizes only the visible items on the current page
    - **Sort All Pages**: Collects and sorts items from all result pages

### Extension Control

- **Enable/Disable**: Use the toggle in the popup menu to enable or disable the extension 🟢/🔴
- **Visual Status**: The menu shows the current status of the extension (active/inactive) 🚦
- **Quick Control**: When disabled, sorting buttons will not appear on pages 🚫

### Sort Current Page

- Click "Sort This Page"
- Items will be instantly reorganized based on the number of favorites
- No need to wait or navigate between pages 💨

### Sort All Pages

- Click "Sort All Pages"
- The extension will start collecting items from the current page ⏳
- Then it will automatically navigate to the next pages ➡️
- A progress bar at the top of the page will show the collection status 📈
- When collection is complete, all items will be displayed in a new view, sorted by number of favorites 🏆
- To return to the original view, click the "Return to original view" button ↩️

## ⚙️ How It Works (Technically)

The extension injects a content script (`content.js`) into Vinted pages. This script:
1.  **Observes DOM Changes**: It watches for new items loading on the page.
2.  **Extracts Data**: For each item, it extracts the product information, including the number of favorites.
3.  **Adds Buttons**: It adds the "Sort This Page" and "Sort All Pages" buttons to the Vinted interface.
4.  **Handles Sorting**:
    *   **Sort This Page**: It directly manipulates the DOM to reorder the currently visible items.
    *   **Sort All Pages**: It programmatically navigates through all pagination links, collecting item data from each page. Once all data is collected, it renders a new view with the sorted items.
5.  **Manages State**: The popup (`popup.html`, `popup.js`, `popup.css`) allows users to enable or disable the extension. This state is communicated to the content script.

## 📝 Notes

- Collecting all pages may take some time, depending on the number of results 🕒
- If you close the page during collection, the process will be interrupted 🛑
- The extension only works on the `vinted.pt` domain 🌍
- Collected data is stored only locally in your browser 💻

## 🤔 Troubleshooting

If the extension doesn't work correctly:

1. Check if you are on the correct site (vinted.pt) ✅
2. Make sure you are on a search results or catalog page 🧐
3. Try reloading the page 🔄
4. If the problem persists, reinstall the extension 🛠️

## 🔒 Privacy

This extension:
- Does not collect personal data 🙅‍♂️
- Does not send information to external servers 🚫📡
- Works completely offline after installation 🌐➡️💻
- Temporarily stores only item data for sorting 💾

## 🧑‍💻 Development

This extension was developed using pure JavaScript and standard browser extension APIs (Manifest V3). The source code is open source and organized as follows:

- `manifest.json`: Extension configuration (Manifest V3)
- `content.js`: Main script that runs in the page context
- `popup.js`: Handles the logic for the popup menu
- `popup.html`: Structure of the popup menu
- `popup.css`: Styles for the popup menu
- `styles.css`: Styles for elements added by the extension to the page
- `icons/`: Directory containing `icon16.png`, `icon48.png`, `icon128.png` for the extension.

## ⚠️ Known Limitations

- The extension may stop working if Vinted significantly changes its site structure 🧱
- In searches with many pages, the collection process can be time-consuming ⏳
- The extension does not maintain state between browser sessions (except during ongoing collections) 🧠❌

---


## Please consider donating
Bitcoin:
`bc1qnkq7hf6r53fg73jh3awfsn6ydeh87u5cf8hs3g`

![bitcoin](https://github.com/user-attachments/assets/9aaf40c6-6bdb-4480-8bdd-05b9023613d9)

Ko-fi:
https://ko-fi.com/felipefma

Paypal:
felipefmavelar@gmail.com

Brazilian Pix:
felipefmavelar@gmail.com

---


## 📜 License

This project is licensed under the GNU General Public License v3.0 (GPLv3). You can find the license [here](LICENSE).

This extension is provided as is, without warranties. You can use and modify it freely for personal use. Feel free to contribute! 🤝

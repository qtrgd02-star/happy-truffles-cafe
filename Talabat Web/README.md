# Talabat Menu Sync

Automatically sync your website menu with the latest Talabat menu.

## How to Use

1. **Save Talabat page as HTML:**
   - Go to https://www.talabat.com/qatar/restaurant/793686/happy-truffles-cafe?aid=1754
   - Right-click → Save As... → Save as `Happy Truffles Cafe menu.html`
   - Save it in the **"Talabat Web"** folder (same folder as this README)

2. **Run the sync:**
   - Double-click `sync-talabat.bat`
   - The script will:
     - Extract menu items from the Talabat HTML
     - Compare with your website menu
     - Update prices and descriptions
     - Add any missing items
   - A report will be generated and shown

## Files

- `sync-talabat.bat` - Main sync tool (double-click to run)
- `Talabat Web/` - Put your saved Talabat HTML files here
- `scripts/extract-talabat-menu.js` - Extracts menu from HTML
- `scripts/compare-menu.js` - Compares local vs Talabat menu
- `scripts/add-missing-talabat-items.js` - Updates website menu
- `scripts/talabat-menu.json` - Extracted Talabat data
- `scripts/menu-comparison-report.md` - Comparison report

## Requirements

- Node.js must be installed
- Run from the project root directory

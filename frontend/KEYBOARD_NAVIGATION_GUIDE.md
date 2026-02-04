# POS Keyboard Navigation Guide

## Overview
This guide documents all keyboard shortcuts and navigation features for the fast keyboard-only POS system. These shortcuts are designed to match the speed and efficiency of your old Java desktop POS application.

---

## Main POS Workflow Shortcuts

### **Action Shortcuts** (Global)

| Shortcut | Action | Description |
|----------|--------|-------------|
| **F12** or **Ctrl+H** | Hold Sale | Pause current sale and save items (resume with Ctrl+Shift+R) |
| **Delete** or **Ctrl+L** | Clear Cart | Clear all items from cart (with confirmation) |
| **F9** or **Ctrl+Enter** | Complete Sale | Process the sale and show receipt |
| **Ctrl+Shift+R** | Recall Held Sale | Open held sales list to resume a previous sale |
| **Ctrl+F** | Focus Search | Jump to product search input |
| **Ctrl+C** | Select Customer | Open customer selection dialog |

---

## Product Search (Left Panel)

### **Search & Selection**

| Shortcut | Action | Description |
|----------|--------|-------------|
| **Type Text** | Search | Search by product name, SKU, barcode, generic name, or manufacturer |
| **↓ Arrow Down** | Next Result | Move to next product in search results |
| **↑ Arrow Up** | Previous Result | Move to previous product in search results |
| **Enter** | Select Product | Add selected product to cart |
| **Escape** | Close Search | Close search results and clear search |
| **Ctrl+B** | Batch Selection | Open batch selector for products with multiple batches |

### **Auto-Features**
- **Auto-Select on Barcode**: If barcode scan matches exactly, product is added automatically
- **Search Scoring**: Results are ranked by match type (barcode > SKU > name > generic > description)
- **Priority by Stock**: Products with available stock are prioritized

---

## Shopping Cart (Left Panel, Below Search)

### **Cart Navigation & Selection**

| Shortcut | Action | Description |
|----------|--------|-------------|
| **↓ Arrow Down** | Next Item | Select next item in cart (highlights it) |
| **↑ Arrow Up** | Previous Item | Select previous item in cart |
| **+** (Plus Key) | Increase Qty | Increase quantity of selected item by 1 |
| **-** (Minus Key) | Decrease Qty | Decrease quantity of selected item by 1 (or remove if qty=1) |
| **Delete** | Remove Item | Remove selected item from cart completely |
| **Enter** | Focus Discount | Move focus to discount input for selected item |
| **Click Item** | Select Item | Click to manually select an item |

### **Visual Feedback**
- **Selected Item**: Highlighted with blue ring and light blue background
- **Cart Status**: Shows `↑↓ Select | +/- Adjust Qty | Delete Remove | Enter Discount`
- **Auto-Select**: First item in cart is automatically selected when items are added

---

## Payment Methods (Right Panel)

### **Payment Method Selection**

| Shortcut | Action | Description |
|----------|--------|-------------|
| **← Arrow Left** | Previous Method | Switch to previous payment method (cycles through) |
| **→ Arrow Right** | Next Method | Switch to next payment method (cycles through) |
| **Ctrl+1** | Select Cash | Quick select Cash payment method |
| **Ctrl+2** | Select Card | Quick select Card payment method |
| **Ctrl+3** | Select UPI | Quick select UPI/QR payment method |
| **Click Button** | Select Method | Click to manually select payment method |

### **Payment Method Details**
- **Cash**: Enter amount tendered, shows automatic change calculation
- **Card**: Enter last 4 digits of card
- **UPI**: Enter UPI reference number
- **Visual Indicator**: Selected payment method is highlighted

---

## Totals & Checkout (Right Panel)

### **Discount & Checkout**

| Shortcut | Action | Description |
|----------|--------|-------------|
| **Tab** (in Discount) | Next Field | Move to next discount input |
| **Enter** (in Discount) | Confirm | Apply discount and move to next field |
| **F9** or **Ctrl+Enter** | Complete Sale | Process sale (only enabled when valid) |

### **Complete Sale Requirements**
- ✓ Cart must not be empty
- ✓ Branch must be selected
- ✓ For Cash: Amount tendered must be ≥ Grand Total
- ✓ All items must have valid product IDs

---

## Dialogs & Confirmations

### **Customer Selection Dialog**

| Shortcut | Action | Description |
|----------|--------|-------------|
| **Type Text** | Search Customers | Search by name or phone number |
| **↓ Arrow Down** | Next Customer | Move to next customer in results |
| **↑ Arrow Up** | Previous Customer | Move to previous customer |
| **Enter** | Select Customer | Select highlighted customer |
| **Escape** | Cancel | Close dialog without selecting |
| **Tab** | Next Option | Move to "Walk-in Customer" button |

---

### **Receipt Dialog** (After Sale Completes)

| Shortcut | Action | Description |
|----------|--------|-------------|
| **Ctrl+P** | Print | Print the thermal receipt to default printer |
| **Tab** | Next Button | Move between "Print Receipt" and "New Sale" |
| **Enter** | Action | Activate focused button |
| **Escape** | Blocked | Prevented - must choose an action |

### **Print Confirmation Dialog**

| Shortcut | Action | Description |
|----------|--------|-------------|
| **Tab** | Next Button | Toggle between "Skip Print" and "Print Receipt" |
| **Enter** | Action | Activate focused button (confirms print or skip) |
| **Escape** | Blocked | Prevented - must choose an action |
| **Ctrl+P** | Print | Print receipt directly |

---

## Focus Management

### **Visual Indicators**
- **Blue Ring**: `focus-visible:ring-2 ring-blue-500` - Element has keyboard focus
- **Highlighted**: Blue background on selected cart items or dialog options
- **Underline**: Active form inputs show focus outline

### **Focus Flow (Tab Order)**
1. **Product Search** (auto-focused on page load)
2. **Cart Items** (arrow key navigation)
3. **Customer Button** (Tab key)
4. **Payment Methods** (Tab key)
5. **Discount Input** (Tab key)
6. **Amount/Reference Input** (Tab key)
7. **Action Buttons** (Tab key)

---

## Advanced Features

### **Batch Selection (FEFO - First Expiry, First Out)**
For products with multiple batches:
1. Product search returns product with available batches
2. Press **Ctrl+B** or **Enter** on search result
3. Batch selector dialog opens
4. Use **Tab** to navigate between batches
5. Press **Enter** to confirm batch
6. Product is added to cart with selected batch

### **Held Sales Recall**
1. Press **Ctrl+Shift+R** to open held sales list
2. Use **↓↑** to navigate through held sales
3. Click **Resume** to restore sale to cart
4. Or click **Delete** to discard held sale

### **Quantity Input (Direct Entry)**
- Click quantity field in cart item
- Type number directly (e.g., "5")
- Press **Enter** or **Tab** to confirm
- Or use **+/-** keys for incremental changes

---

## Accessibility Standards

### **Keyboard-Only Support**
✓ All functions accessible without mouse
✓ Tab order follows logical workflow
✓ Focus indicators clearly visible
✓ Screen reader announcements for key actions

### **Error Handling**
- **Out of Stock**: Toast notification + voice announcement
- **Invalid Payment**: Toast + prevents checkout
- **Missing Branch**: Alert bar at top + prevents sale

### **Announcements**
Actions announce to screen readers:
- "Selected item 1 of 5"
- "Cart cleared"
- "Sale held. Press Ctrl+Shift+R to resume"
- "Processing sale..."

---

## Performance Tips

### **Speed Optimization**
1. **Barcode Scanning**: Type full barcode for instant auto-add (no need to press Enter)
2. **Quantity Entry**: Use **+/-** keys instead of clicking buttons for speed
3. **Payment Methods**: Use **Ctrl+1/2/3** for fastest selection
4. **Quick Clear**: Press **Delete** then **Enter** to quickly empty cart
5. **Item Removal**: With item selected, press **-** then it removes if qty=1, or just **Delete**

### **Navigation Flow (Fastest Path)**
```
Ctrl+F (Search)
    ↓ Search for product
    ↓ Enter (add to cart)
    ↓↓ Select quantity
    +- Adjust quantity
    ↓ Ctrl+C (Select customer, optional)
    → Navigate payment method
    ↓ Enter amount tendered
    F9 (Complete sale)
    ↓ Tab to Print/New Sale
    Tab+Enter (Print or skip)
```

---

## Troubleshooting

### **Shortcuts Not Working**
- ✓ Ensure input field is not focused (some shortcuts are ignored in inputs)
- ✓ Check that focus is on POS page (not another tab/dialog)
- ✓ Verify Caps Lock is not on (affects some shortcuts)

### **Focus Stuck in Input**
- Press **Escape** to exit input and return to normal navigation
- Or **Tab** to move to next field

### **Dialog Won't Close**
- Some dialogs (Print Confirmation) require explicit action (Enter key)
- Not all dialogs can be closed with Escape
- Click the button action to proceed

---

## Quick Reference Card

```
MAIN ACTIONS           PRODUCT SEARCH         CART
F12/Ctrl+H  Hold       ↓↑         Navigate    ↓↑      Navigate
Delete/Ctrl+L Clear    Enter      Select      +/-     Qty
F9/Ctrl+Enter Complete Type       Search      Delete  Remove

PAYMENT                DIALOGS                SPECIAL
←→          Method     Tab        Navigate    Ctrl+B  Batches
Ctrl+1/2/3  Quick      Enter      Select      Ctrl+F  Search
            Select     Escape     Close       Ctrl+C  Customer
```

---

## Summary

The POS keyboard navigation system provides:
- ✓ **Complete keyboard-only operation** for all sales functions
- ✓ **Fast shortcuts** matching your old Java POS experience
- ✓ **Clear visual feedback** with focus indicators
- ✓ **Accessibility support** with screen reader announcements
- ✓ **Efficiency** through quick selection shortcuts (F9, Ctrl+1, +/-)
- ✓ **Error prevention** with visual and audio confirmations

Master these shortcuts for maximum POS efficiency!

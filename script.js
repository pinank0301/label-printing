// Function to update price based on selected item
function updatePrice() {
    const itemSelect = document.getElementById('itemSelect');
    const priceInput = document.getElementById('price');
    const selectedItem = itemSelect.options[itemSelect.selectedIndex];
    const price = selectedItem.getAttribute('data-price');

    priceInput.value = price ? `₹${price}` : '';
}

// Function to add a new item
function addItem(event) {
    event.preventDefault();
    const itemName = document.getElementById('addItemName').value;
    const itemPrice = document.getElementById('addItemPrice').value;

    if (itemName && itemPrice) {
        const itemSelect = document.getElementById('itemSelect');
        const editItemSelect = document.getElementById('editItemSelect');
        const removeItemSelect = document.getElementById('removeItemSelect');

        // Create new option
        const newOption = document.createElement('option');
        const itemId = itemName.toLowerCase().replace(/\s+/g, '');
        newOption.value = itemId;
        newOption.setAttribute('data-price', itemPrice);
        newOption.textContent = itemName;

        // Append new option to both selects
        itemSelect.appendChild(newOption);
        const newEditOption = newOption.cloneNode(true);
        editItemSelect.appendChild(newEditOption);
        const newRemoveOption = newOption.cloneNode(true);
        removeItemSelect.appendChild(newRemoveOption);

        // Clear input fields
        document.getElementById('addItemForm').reset();

        // Save added item to localStorage
        saveItemToLocalStorage(itemId, itemName, itemPrice);
    }
}

// Function to save item to localStorage
function saveItemToLocalStorage(itemId, itemName, itemPrice) {
    let items = JSON.parse(localStorage.getItem('items')) || {};
    items[itemId] = { name: itemName, price: itemPrice };
    localStorage.setItem('items', JSON.stringify(items));
}

// Function to fill edit form with selected item's details
function fillEditForm() {
    const editItemSelect = document.getElementById('editItemSelect');
    const selectedItem = editItemSelect.options[editItemSelect.selectedIndex];

    if (selectedItem) {
        const itemId = selectedItem.value;
        const items = JSON.parse(localStorage.getItem('items')) || {};
        const selectedItemDetails = items[itemId];

        if (selectedItemDetails) {
            document.getElementById('editItemName').value = selectedItemDetails.name;
            document.getElementById('editItemPrice').value = selectedItemDetails.price;
        }
    }
}

// Function to edit an existing item
function editItem(event) {
    event.preventDefault();
    const editItemSelect = document.getElementById('editItemSelect');
    const itemSelect = document.getElementById('itemSelect');
    const removeItemSelect = document.getElementById('removeItemSelect');
    const selectedItemValue = editItemSelect.value;

    const newItemName = document.getElementById('editItemName').value;
    const newItemPrice = document.getElementById('editItemPrice').value;

    if (selectedItemValue && newItemName && newItemPrice) {
        // Update item in all selects
        Array.from(itemSelect.options).forEach(option => {
            if (option.value === selectedItemValue) {
                option.textContent = newItemName;
                option.setAttribute('data-price', newItemPrice);
            }
        });
        Array.from(editItemSelect.options).forEach(option => {
            if (option.value === selectedItemValue) {
                option.textContent = newItemName;
                option.setAttribute('data-price', newItemPrice);
            }
        });
        Array.from(removeItemSelect.options).forEach(option => {
            if (option.value === selectedItemValue) {
                option.textContent = newItemName;
                option.setAttribute('data-price', newItemPrice);
            }
        });

        // Update item in localStorage
        updateItemInLocalStorage(selectedItemValue, newItemName, newItemPrice);

        // Clear edit form
        document.getElementById('editItemForm').reset();
        editItemSelect.value = '';
    }
}

// Function to update item in localStorage
function updateItemInLocalStorage(itemId, itemName, itemPrice) {
    let items = JSON.parse(localStorage.getItem('items')) || {};
    items[itemId] = { name: itemName, price: itemPrice };
    localStorage.setItem('items', JSON.stringify(items));
}

// Function to remove an item
function removeItem(event) {
    event.preventDefault();
    const removeItemSelect = document.getElementById('removeItemSelect');
    const itemSelect = document.getElementById('itemSelect');
    const editItemSelect = document.getElementById('editItemSelect');
    const selectedItemValue = removeItemSelect.value;

    if (selectedItemValue) {
        // Remove item from all selects
        Array.from(itemSelect.options).forEach(option => {
            if (option.value === selectedItemValue) {
                itemSelect.remove(option.index);
            }
        });
        Array.from(editItemSelect.options).forEach(option => {
            if (option.value === selectedItemValue) {
                editItemSelect.remove(option.index);
            }
        });
        Array.from(removeItemSelect.options).forEach(option => {
            if (option.value === selectedItemValue) {
                removeItemSelect.remove(option.index);
            }
        });

        // Remove item from localStorage
        removeItemFromLocalStorage(selectedItemValue);

        // Clear remove form
        document.getElementById('removeItemForm').reset();
    }
}

// Function to remove item from localStorage
function removeItemFromLocalStorage(itemId) {
    let items = JSON.parse(localStorage.getItem('items')) || {};
    delete items[itemId];
    localStorage.setItem('items', JSON.stringify(items));
}

// Function to load items from localStorage on page load
function loadItemsFromLocalStorage() {
    const items = JSON.parse(localStorage.getItem('items')) || {};

    // Populate itemSelect, editItemSelect, and removeItemSelect with items from localStorage
    const itemSelect = document.getElementById('itemSelect');
    const editItemSelect = document.getElementById('editItemSelect');
    const removeItemSelect = document.getElementById('removeItemSelect');

    Object.keys(items).forEach(itemId => {
        const itemDetails = items[itemId];

        // Add item to itemSelect
        const newOption = document.createElement('option');
        newOption.value = itemId;
        newOption.setAttribute('data-price', itemDetails.price);
        newOption.textContent = itemDetails.name;
        itemSelect.appendChild(newOption);

        // Add item to editItemSelect
        const newEditOption = newOption.cloneNode(true);
        editItemSelect.appendChild(newEditOption);

        // Add item to removeItemSelect
        const newRemoveOption = newOption.cloneNode(true);
        removeItemSelect.appendChild(newRemoveOption);
    });
}

// Function to show label preview
function showLabelPreview(event) {
    event.preventDefault();
    const itemSelect = document.getElementById('itemSelect');
    const priceInput = document.getElementById('price');
    const quantityInput = document.getElementById('quantity');
    const selectedItem = itemSelect.options[itemSelect.selectedIndex];

    if (selectedItem && selectedItem.value) {
        const labelItemName = document.getElementById('labelItemName');
        const labelItemDetails = document.getElementById('labelItemDetails');
        const labelItemQuantity = document.getElementById('labelItemQuantity');

        labelItemName.textContent = selectedItem.textContent;
        labelItemDetails.textContent = `MRP: ${priceInput.value} | Quantity: ${quantityInput.value}`;
        labelItemQuantity.textContent = '';

        const labelModal = document.getElementById('labelModal');
        labelModal.style.display = 'block';
    }
}

// Function to close label preview modal
function closeLabelPreview() {
    const labelModal = document.getElementById('labelModal');
    labelModal.style.display = 'none';
}

// Function to print label
function printLabel() {
    const itemSelect = document.getElementById('itemSelect');
    const priceInput = document.getElementById('price');
    const quantityInput = document.getElementById('quantity');
    const selectedItem = itemSelect.options[itemSelect.selectedIndex];
    const itemName = selectedItem.textContent;
    const price = priceInput.value;
    const quantity = quantityInput.value;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Label Preview</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                }
                .label {
                    border: 1px solid #ccc;
                    padding: 20px;
                    margin: 20px;
                    width: calc(33.33% - 40px);
                }
                h2 {
                    margin-bottom: 10px;
                }
                p {
                    margin: 5px 0;
                }
            </style>
        </head>
        <body>
            <div class="label">
                <h1>Shri Ambica Enterprise</h1>
                <h2> ${itemName}</h2>
                <p>MRP: ${price}</p>
                <p>Quantity: ${quantity}</p>
                <p>GST NO:123456789</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Function to print multiple labels
function printMultipleLabels() {
    const numberOfLabels = parseInt(document.getElementById('numberOfLabels').value);

    if (numberOfLabels > 0) {
        let labelsHTML = '';

        // Generate HTML for multiple labels
        for (let i = 0; i < numberOfLabels; i++) {
            const itemSelect = document.getElementById('itemSelect');
            const priceInput = document.getElementById('price');
            const quantityInput = document.getElementById('quantity');
            const selectedItem = itemSelect.options[itemSelect.selectedIndex];
            const itemName = selectedItem.textContent;
            const price = priceInput.value;
            const quantity = quantityInput.value;

            labelsHTML += `
                <div class="label">
                    <h1>Shri Ambica Enterprise</h1>
                    <p>Item Name: ${itemName}</p>
                    <p>MRP: ${price}</p>
                    <p>Quantity: ${quantity}</p>
                </div>
            `;
        }

        // Open a new window and write all labels HTML
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Label Preview</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                    .label {
                        border: 1px solid #ccc;
                        padding: 20px;
                        margin: 20px;
                        width: calc(33.33% - 40px); /* Three labels per row */
                        box-sizing: border-box; /* Ensure padding and border are included in width */
                    }
                    h1 {
                        font-size: 20px;
                        margin-bottom: 10px;
                    }
                    p {
                        margin: 5px 0;
                    }
                </style>
            </head>
            <body>
                ${labelsHTML}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

// Event listener for page load
document.addEventListener('DOMContentLoaded', () => {
    // Load items from localStorage on page load
    loadItemsFromLocalStorage();
});

// Event listener for adding items
document.getElementById('addItemForm').addEventListener('submit', addItem);

// Event listener for updating edit form
document.getElementById('editItemSelect').addEventListener('change', fillEditForm);

// Event listener for editing items
document.getElementById('editItemForm').addEventListener('submit', editItem);

// Event listener for removing items
document.getElementById('removeItemForm').addEventListener('submit', removeItem);

// Event listener for showing label preview
document.getElementById('labelForm').addEventListener('submit', showLabelPreview);

// Event listener for closing label preview modal
document.getElementById('closeLabelModal').addEventListener('click', closeLabelPreview);

// Event listener for printing label
document.getElementById('printLabelBtn').addEventListener('click', printLabel);

// Event listener for printing multiple labels
document.getElementById('printMultipleLabelsBtn').addEventListener('click', printMultipleLabels);

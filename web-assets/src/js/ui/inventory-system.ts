/**
 * Inventory System UI Component
 */

import { InventoryData, InventoryItem } from '../../types/game-types';

export class InventorySystem {
    private items: InventoryItem[] = [];
    private selectedItem: { item: InventoryItem; index: number } | null = null;
    private elements: {
        modal?: HTMLElement;
        grid?: HTMLElement;
        closeBtn?: HTMLElement;
    } = {};
    
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
    }
    
    private initializeElements(): void {
        this.elements.modal = document.getElementById('inventory-modal') as HTMLElement | undefined;
        this.elements.grid = document.getElementById('inventory-grid') as HTMLElement | undefined;
        this.elements.closeBtn = document.getElementById('inventory-close') as HTMLButtonElement | undefined;
    }
    
    private setupEventListeners(): void {
        if (this.elements.closeBtn) {
            this.elements.closeBtn.addEventListener('click', () => {
                this.hide();
            });
        }
        
        if (this.elements.modal) {
            this.elements.modal.addEventListener('click', (event: MouseEvent) => {
                if (event.target === this.elements.modal) {
                    this.hide();
                }
            });
        }
    }
    
    show(): void {
        if (this.elements.modal) {
            this.elements.modal.style.display = 'block';
        }
    }
    
    hide(): void {
        if (this.elements.modal) {
            this.elements.modal.style.display = 'none';
        }
    }
    
    toggle(): void {
        if (this.isVisible()) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    private isVisible(): boolean {
        return !!(this.elements.modal && this.elements.modal.style.display === 'block');
    }
    
    update(inventoryData: InventoryData): void {
        this.items = inventoryData.items || [];
        this.renderItems();
    }
    
    private renderItems(): void {
        if (!this.elements.grid) return;
        
        this.elements.grid!.innerHTML = '';
        
        if (this.items.length === 0) {
            this.elements.grid!.innerHTML = '<div class="empty-inventory">No items</div>';
            return;
        }
        
        this.items.forEach((item, index) => {
            const itemElement = this.createItemElement(item, index);
            this.elements.grid?.appendChild(itemElement);
        });
    }
    
    private createItemElement(item: InventoryItem, index: number): HTMLElement {
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        itemElement.innerHTML = `
            <div class="item-icon">${this.getItemIcon(item)}</div>
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">${item.quantity}</div>
            </div>
        `;
        
        itemElement.addEventListener('click', () => {
            this.selectItem(item, index);
        });
        
        itemElement.addEventListener('contextmenu', (event: MouseEvent) => {
            event.preventDefault();
            this.showItemContextMenu(item, index, event);
        });
        
        return itemElement;
    }
    
    private getItemIcon(item: InventoryItem): string {
        const iconMap: Record<string, string> = {
            weapon: '⚔️',
            armor: '🛡️',
            potion: '🧪',
            scroll: '📜',
            gem: '💎',
            herb: '🌿',
            book: '📚',
            key: '🗝️',
            coin: '💰',
            default: '📦'
        };
        
        return iconMap[item.type] || iconMap.default;
    }
    
    private selectItem(item: InventoryItem, index: number): void {
        this.selectedItem = { item, index };
        this.showItemDetails(item);
    }
    
    private showItemDetails(item: InventoryItem): void {
        const detailsModal = document.createElement('div');
        detailsModal.className = 'item-details-modal';
        detailsModal.innerHTML = `
            <div class="item-details-content">
                <div class="item-details-header">
                    <h3>${item.name}</h3>
                    <button class="close-details">&times;</button>
                </div>
                <div class="item-details-body">
                    <p>${item.description || 'No description available'}</p>
                    <p><strong>Type:</strong> ${item.type}</p>
                    <p><strong>Rarity:</strong> ${item.rarity}</p>
                    <p><strong>Quantity:</strong> ${item.quantity}</p>
                    <p><strong>Weight:</strong> ${item.weight}</p>
                    ${item.stats ? this.renderItemStats(item.stats) : ''}
                </div>
                <div class="item-details-actions">
                    <button class="use-item-btn">Use</button>
                    <button class="equip-item-btn">Equip</button>
                    <button class="drop-item-btn">Drop</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(detailsModal);
        
        // Event listeners
        detailsModal.querySelector('.close-details')?.addEventListener('click', () => {
            detailsModal.remove();
        });
        
        detailsModal.querySelector('.use-item-btn')?.addEventListener('click', () => {
            this.useItem(item);
            detailsModal.remove();
        });
        
        detailsModal.querySelector('.equip-item-btn')?.addEventListener('click', () => {
            this.equipItem(item);
            detailsModal.remove();
        });
        
        detailsModal.querySelector('.drop-item-btn')?.addEventListener('click', () => {
            this.dropItem(item);
            detailsModal.remove();
        });
    }
    
    private renderItemStats(stats: Record<string, number>): string {
        return Object.entries(stats)
            .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
            .join('');
    }
    
    private showItemContextMenu(item: InventoryItem, index: number, event: MouseEvent): void {
        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        contextMenu.style.left = `${event.clientX}px`;
        contextMenu.style.top = `${event.clientY}px`;
        
        contextMenu.innerHTML = `
            <div class="context-menu-item" data-action="use">Use</div>
            <div class="context-menu-item" data-action="equip">Equip</div>
            <div class="context-menu-item" data-action="drop">Drop</div>
        `;
        
        document.body.appendChild(contextMenu);
        
        // Close context menu when clicking elsewhere
        const closeContextMenu = () => {
            contextMenu.remove();
            document.removeEventListener('click', closeContextMenu);
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeContextMenu);
        }, 0);
        
        // Handle context menu actions
        contextMenu.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('context-menu-item')) {
                const action = target.dataset.action;
                if (action) {
                    this.handleItemAction(item, action);
                }
                closeContextMenu();
            }
        });
    }
    
    private handleItemAction(item: InventoryItem, action: string): void {
        switch (action) {
            case 'use':
                this.useItem(item);
                break;
            case 'equip':
                this.equipItem(item);
                break;
            case 'drop':
                this.dropItem(item);
                break;
        }
    }
    
    private useItem(item: InventoryItem): void {
        console.log('Using item:', item.name);
        
        // Notify Unity
        if (window.gameUI && window.gameUI.unityBridge) {
            window.gameUI.unityBridge.useItem(item.id);
        }
        
        // Show notification
        if (window.gameUI && window.gameUI.uiManager) {
            window.gameUI.uiManager.showSuccess(`Used ${item.name}`);
        }
    }
    
    private equipItem(item: InventoryItem): void {
        console.log('Equipping item:', item.name);
        
        // Notify Unity
        if (window.gameUI && window.gameUI.unityBridge) {
            window.gameUI.unityBridge.equipItem(item.id, 'main');
        }
        
        // Show notification
        if (window.gameUI && window.gameUI.uiManager) {
            window.gameUI.uiManager.showSuccess(`Equipped ${item.name}`);
        }
    }
    
    private dropItem(item: InventoryItem): void {
        console.log('Dropping item:', item.name);
        
        // Remove from inventory
        this.items = this.items.filter(i => i.id !== item.id);
        this.renderItems();
        
        // Notify Unity
        if (window.gameUI && window.gameUI.unityBridge) {
            window.gameUI.unityBridge.sendToUnity('DropItem', item.id);
        }
        
        // Show notification
        if (window.gameUI && window.gameUI.uiManager) {
            window.gameUI.uiManager.showSuccess(`Dropped ${item.name}`);
        }
    }
    
    addItem(item: InventoryItem): void {
        const existingItem = this.items.find(i => i.id === item.id);
        
        if (existingItem && existingItem.stackable) {
            existingItem.quantity += item.quantity;
        } else {
            this.items.push(item);
        }
        
        this.renderItems();
    }
    
    removeItem(itemId: string, quantity: number = 1): void {
        const itemIndex = this.items.findIndex(i => i.id === itemId);
        
        if (itemIndex !== -1) {
            const item = this.items[itemIndex];
            
            if (item.quantity > quantity) {
                item.quantity -= quantity;
            } else {
                this.items.splice(itemIndex, 1);
            }
            
            this.renderItems();
        }
    }
    
    getInventoryData(): InventoryData {
        this.elements.grid!.innerHTML = `
            <div class="inventory-stats">
                <p>Items: ${this.items.length}</p>
                <p>Total Weight: ${this.calculateTotalWeight()}</p>
            </div>
        `;
        
        return {
            items: this.items,
            maxSlots: 50,
            totalWeight: this.calculateTotalWeight(),
            maxWeight: 1000
        };
    }
    
    private calculateTotalWeight(): number {
        return this.items.reduce((total, item) => {
            return total + (item.weight * item.quantity);
        }, 0);
    }
    
    searchItems(query: string): void {
        if (!query.trim()) {
            this.renderItems();
            return;
        }
        
        const filteredItems = this.items.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.type.toLowerCase().includes(query.toLowerCase())
        );
        
        this.renderFilteredItems(filteredItems);
    }
    
    private renderFilteredItems(items: InventoryItem[]): void {
        if (!this.elements.grid) return;
        
        this.elements.grid!.innerHTML = '';
        
        if (items.length === 0) {
            this.elements.grid!.innerHTML = '<div class="empty-inventory">No items found</div>';
            return;
        }
        
        items.forEach((item, index) => {
            const itemElement = this.createItemElement(item, index);
            this.elements.grid?.appendChild(itemElement);
        });
    }
}
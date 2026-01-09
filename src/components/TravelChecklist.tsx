import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, ListChecks } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
  category: string;
}

const PRESET_ITEMS = [
  { text: 'Passport/ID Card', category: 'documents' },
  { text: 'Travel Tickets/Bookings', category: 'documents' },
  { text: 'Hotel Confirmations', category: 'documents' },
  { text: 'Travel Insurance', category: 'documents' },
  { text: 'Clothes', category: 'essentials' },
  { text: 'Toiletries', category: 'essentials' },
  { text: 'Medications', category: 'health' },
  { text: 'First Aid Kit', category: 'health' },
  { text: 'Phone Charger', category: 'electronics' },
  { text: 'Power Bank', category: 'electronics' },
  { text: 'Camera', category: 'electronics' },
  { text: 'Sunscreen', category: 'health' },
  { text: 'Sunglasses', category: 'accessories' },
  { text: 'Hat/Cap', category: 'accessories' },
  { text: 'Cash & Cards', category: 'money' },
];

export function TravelChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('essentials');

  useEffect(() => {
    const saved = localStorage.getItem('checklist');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  const saveItems = (updatedItems: ChecklistItem[]) => {
    setItems(updatedItems);
    localStorage.setItem('checklist', JSON.stringify(updatedItems));
  };

  const handleAddItem = () => {
    if (!newItemText.trim()) {
      alert('Please enter an item');
      return;
    }

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText,
      isCompleted: false,
      category: selectedCategory
    };

    saveItems([...items, newItem]);
    setNewItemText('');
  };

  const handleToggleItem = (id: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    saveItems(updatedItems);
  };

  const handleDeleteItem = (id: string) => {
    saveItems(items.filter(item => item.id !== id));
  };

  const handleLoadPresets = () => {
    const presetItems: ChecklistItem[] = PRESET_ITEMS.map((preset, index) => ({
      id: `preset-${index}`,
      text: preset.text,
      isCompleted: false,
      category: preset.category
    }));
    saveItems([...items, ...presetItems]);
  };

  const completedCount = items.filter(item => item.isCompleted).length;
  const totalCount = items.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const categories = [
    { value: 'documents', label: '📄 Documents', color: 'blue' },
    { value: 'essentials', label: '🎒 Essentials', color: 'green' },
    { value: 'health', label: '💊 Health', color: 'red' },
    { value: 'electronics', label: '🔌 Electronics', color: 'purple' },
    { value: 'accessories', label: '👒 Accessories', color: 'yellow' },
    { value: 'money', label: '💰 Money', color: 'orange' },
    { value: 'other', label: '📦 Other', color: 'gray' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl p-6">
        <h2 className="text-2xl mb-4 flex items-center gap-3">
          <ListChecks className="w-8 h-8" />
          Travel Checklist
        </h2>
        <div className="bg-white bg-opacity-20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span>Packing Progress</span>
            <span className="text-xl">{completedCount}/{totalCount}</span>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-sm text-green-100 mt-2">{completionPercentage.toFixed(0)}% Complete</p>
        </div>
      </div>

      {/* Add Item Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-gray-900 mb-4">Add New Item</h3>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            placeholder="What do you need to pack?"
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-600"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-600"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <button
            onClick={handleAddItem}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>

        {items.length === 0 && (
          <div className="mt-4">
            <button
              onClick={handleLoadPresets}
              className="w-full bg-blue-50 text-blue-900 py-3 rounded-xl hover:bg-blue-100 transition-colors border-2 border-blue-200"
            >
              Load Pre-made Checklist (15 items)
            </button>
          </div>
        )}
      </div>

      {/* Checklist Items by Category */}
      {categories.map(category => {
        const categoryItems = items.filter(item => item.category === category.value);
        if (categoryItems.length === 0) return null;

        const categoryCompleted = categoryItems.filter(item => item.isCompleted).length;

        return (
          <div key={category.value} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 flex items-center gap-2">
                {category.label}
              </h3>
              <span className="text-sm text-gray-600">
                {categoryCompleted}/{categoryItems.length} packed
              </span>
            </div>

            <div className="space-y-2">
              {categoryItems.map(item => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                    item.isCompleted 
                      ? 'bg-green-50 border-2 border-green-200' 
                      : 'bg-gray-50 border-2 border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => handleToggleItem(item.id)}
                      className="flex-shrink-0"
                    >
                      {item.isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    <span className={`${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {item.text}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {items.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <ListChecks className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No items in your checklist yet</h3>
          <p className="text-gray-600">Start adding items or load the pre-made checklist</p>
        </div>
      )}
    </div>
  );
}

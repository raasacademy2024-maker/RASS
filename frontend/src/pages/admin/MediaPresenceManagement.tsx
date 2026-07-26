import React, { useState, useEffect } from 'react';
import { mediaPresenceAPI } from '../../services/api';
import { Trash2, Edit, Plus, Save, X, ArrowUp, ArrowDown, AlertCircle, CheckCircle, Eye, Link as LinkIcon, Image, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { resolveImageUrl, isGoogleDriveUrl } from "../../utils/imageUrl";

interface MediaItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  journalLink: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error';
  message: string;
}

const MediaPresenceManagement: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<MediaItem>>({
    title: '',
    description: '',
    imageUrl: '',
    journalLink: '',
    order: 0,
    isActive: true
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Simple notification system
  const showNotification = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 3000);
  };

  // Fetch all media items
  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      const response = await mediaPresenceAPI.getAllMediaItems();
      setMediaItems(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching media items:', error);
      showNotification('error', 'Failed to load media items');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaItems();
  }, []);

  // Add new media item
  const handleAddItem = async () => {
    try {
      if (!newItem.title || !newItem.description || !newItem.imageUrl || !newItem.journalLink) {
        return showNotification('error', 'Please fill all required fields');
      }

      console.log('Creating media item with data:', newItem);
      const response = await mediaPresenceAPI.createMediaItem(newItem);
      console.log('Media item created successfully:', response);
      showNotification('success', 'Media item added successfully');
      setNewItem({
        title: '',
        description: '',
        imageUrl: '',
        journalLink: '',
        order: 0,
        isActive: true
      });
      setShowAddForm(false);
      fetchMediaItems();
    } catch (error: any) {
      console.error('Error adding media item:', error);
      showNotification('error', 'Failed to add media item');
    }
  };

  // Update media item
  const handleUpdateItem = async () => {
    try {
      if (!editingItem) return;
      
      await mediaPresenceAPI.updateMediaItem(editingItem._id, editingItem);
      showNotification('success', 'Media item updated successfully');
      setEditingItem(null);
      fetchMediaItems();
    } catch (error: any) {
      console.error('Error updating media item:', error);
      showNotification('error', 'Failed to update media item');
    }
  };

  // Delete media item
  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this media item?')) return;
    
    try {
      await mediaPresenceAPI.deleteMediaItem(id);
      showNotification('success', 'Media item deleted successfully');
      fetchMediaItems();
    } catch (error: any) {
      console.error('Error deleting media item:', error);
      showNotification('error', 'Failed to delete media item');
    }
  };

  // Change item order
  const handleChangeOrder = async (id: string, direction: 'up' | 'down') => {
    const itemIndex = mediaItems.findIndex(item => item._id === id);
    if (
      (direction === 'up' && itemIndex === 0) || 
      (direction === 'down' && itemIndex === mediaItems.length - 1)
    ) {
      return;
    }

    const swapIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    const currentItem = mediaItems[itemIndex];
    const swapItem = mediaItems[swapIndex];

    try {
      await Promise.all([
        mediaPresenceAPI.updateMediaItem(currentItem._id, { order: swapItem.order }),
        mediaPresenceAPI.updateMediaItem(swapItem._id, { order: currentItem.order })
      ]);
      
      fetchMediaItems();
    } catch (error: any) {
      console.error('Error changing order:', error);
      showNotification('error', 'Failed to change order');
    }
  };

  // Toggle item active status
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await mediaPresenceAPI.updateMediaItem(id, { isActive: !currentStatus });
      showNotification('success', `Media item ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchMediaItems();
    } catch (error: any) {
      console.error('Error toggling status:', error);
      showNotification('error', 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Notification display */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`px-4 py-3 rounded-md shadow-lg flex items-center ${
              notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Media Presence Management</h1>
          <p className="mt-2 text-gray-600">Manage media mentions and press coverage</p>
        </div>

        {/* Add New Item Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            {showAddForm ? <X className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
            {showAddForm ? 'Cancel' : 'Add New Media Item'}
          </button>
        </div>

        {/* Add new media item form - Card Layout */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Media Item</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Media title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <input
                  type="number"
                  value={newItem.order || 0}
                  onChange={(e) => setNewItem({ ...newItem, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
                <input
                  type="text"
                  value={newItem.imageUrl}
                  onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {newItem.imageUrl && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                  <div className="border border-gray-300 rounded-lg p-4">
                    <img
                      src={resolveImageUrl(newItem.imageUrl, 800)}
                      alt="Preview"
                      className="max-w-full max-h-64 object-contain rounded-lg mx-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/200x150?text=Image+Not+Found';
                      }}
                    />
                    {isGoogleDriveUrl(newItem.imageUrl) && (
                      <p className="mt-2 text-xs text-gray-500 text-center">
                        Google Drive link detected &mdash; make sure the file is shared as
                        &ldquo;Anyone with the link&rdquo; or it won&apos;t load.
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Journal Link *</label>
                <input
                  type="text"
                  value={newItem.journalLink}
                  onChange={(e) => setNewItem({ ...newItem, journalLink: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://example.com/article"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={4}
                  placeholder="Brief description of the media mention"
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newItem.isActive}
                    onChange={(e) => setNewItem({ ...newItem, isActive: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    id="isActive"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">Active</label>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleAddItem}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <Save className="h-5 w-5 mr-2" />
                Save Media Item
              </button>
            </div>
          </div>
        )}

        {/* Media items list - Card Layout for Mobile, Table for Desktop */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Media Items ({mediaItems.length})</h2>
          </div>

          {mediaItems.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No media items</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new media item.</p>
            </div>
          ) : (
            <>
              {/* Mobile view - Card layout */}
              <div className="md:hidden">
                <div className="px-4 py-4 space-y-4">
                  {mediaItems.map((item) => (
                    <div key={item._id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                      {editingItem && editingItem._id === item._id ? (
                        // Edit mode for mobile
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                            <input
                              type="text"
                              value={editingItem.title}
                              onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="Title"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Image URL</label>
                            <input
                              type="text"
                              value={editingItem.imageUrl}
                              onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="Image URL"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Journal Link</label>
                            <input
                              type="text"
                              value={editingItem.journalLink}
                              onChange={(e) => setEditingItem({ ...editingItem, journalLink: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="Journal Link"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={editingItem.description}
                              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              rows={3}
                              placeholder="Description"
                            />
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editingItem.isActive}
                              onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              id={`active-${item._id}`}
                            />
                            <label htmlFor={`active-${item._id}`} className="ml-2 block text-sm text-gray-700">Active</label>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={handleUpdateItem}
                              className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="inline-flex items-center px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View mode for mobile
                        <>
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <Image className="h-5 w-5 text-indigo-600" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                <div className="text-xs text-gray-500">Order: {item.order}</div>
                              </div>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex justify-center">
                              <img 
                                src={resolveImageUrl(item.imageUrl, 400)}
                                alt={item.title}
                                className="h-24 w-auto object-contain rounded"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://placehold.co/80x60?text=No+Image';
                                }}
                              />
                            </div>
                            <div className="mt-2 text-xs text-gray-600 line-clamp-2">
                              {item.description}
                            </div>
                          </div>
                          
                          <div className="mt-3 flex justify-between">
                            <a 
                              href={item.journalLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-indigo-600 hover:text-indigo-900 text-sm"
                            >
                              <LinkIcon className="h-4 w-4 mr-1" />
                              View Article
                            </a>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleToggleActive(item._id, item.isActive)}
                                className={`p-1 rounded-full ${
                                  item.isActive 
                                    ? 'text-gray-600 hover:bg-gray-100' 
                                    : 'text-green-600 hover:bg-green-100'
                                }`}
                                title={item.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {item.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => setEditingItem(item)}
                                className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item._id)}
                                className="p-1 rounded-full text-red-600 hover:bg-red-100"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="mt-2 flex justify-center space-x-2">
                            <button
                              onClick={() => handleChangeOrder(item._id, 'up')}
                              disabled={mediaItems.indexOf(item) === 0}
                              className={`p-1 rounded ${
                                mediaItems.indexOf(item) === 0 
                                  ? 'text-gray-300 cursor-not-allowed' 
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                              title="Move Up"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleChangeOrder(item._id, 'down')}
                              disabled={mediaItems.indexOf(item) === mediaItems.length - 1}
                              className={`p-1 rounded ${
                                mediaItems.indexOf(item) === mediaItems.length - 1 
                                  ? 'text-gray-300 cursor-not-allowed' 
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                              title="Move Down"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Desktop view - Table layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mediaItems.map((item) => (
                      <tr key={item._id} className={!item.isActive ? 'bg-gray-50' : ''}>
                        {editingItem && editingItem._id === item._id ? (
                          // Edit mode for desktop
                          <>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={editingItem.imageUrl}
                                onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Image URL"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={editingItem.title}
                                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Title"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <textarea
                                value={editingItem.description}
                                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                rows={2}
                                placeholder="Description"
                              />
                              <input
                                type="text"
                                value={editingItem.journalLink}
                                onChange={(e) => setEditingItem({ ...editingItem, journalLink: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-2"
                                placeholder="Journal Link"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={editingItem.isActive}
                                  onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span className="ml-2">Active</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="number"
                                value={editingItem.order || 0}
                                onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 0 })}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={handleUpdateItem}
                                  className="text-green-600 hover:text-green-900 p-1"
                                >
                                  <Save className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="text-gray-600 hover:text-gray-900 p-1"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          // View mode for desktop
                          <>
                            <td className="px-6 py-4">
                              <img 
                                src={resolveImageUrl(item.imageUrl, 400)}
                                alt={item.title}
                                className="h-12 w-auto object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://placehold.co/50x50?text=Error';
                                }}
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{item.title}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 line-clamp-2">{item.description}</div>
                              <a 
                                href={item.journalLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm flex items-center mt-1"
                              >
                                <LinkIcon className="h-4 w-4 mr-1" />
                                View Article
                              </a>
                            </td>
                            <td className="px-6 py-4">
                              <span 
                                className={`px-2.5 py-0.5 text-xs rounded-full ${
                                  item.isActive 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {item.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{item.order}</td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleToggleActive(item._id, item.isActive)}
                                  className={`${
                                    item.isActive ? 'text-gray-600 hover:text-gray-900' : 'text-green-600 hover:text-green-900'
                                  } p-1 rounded-full hover:bg-gray-100`}
                                  title={item.isActive ? 'Deactivate' : 'Activate'}
                                >
                                  {item.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                  onClick={() => setEditingItem(item)}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                                  title="Edit"
                                >
                                  <Edit className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item._id)}
                                  className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                                  title="Delete"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleChangeOrder(item._id, 'up')}
                                  disabled={mediaItems.indexOf(item) === 0}
                                  className={`p-1 rounded-full hover:bg-gray-100 ${
                                    mediaItems.indexOf(item) === 0 
                                      ? 'text-gray-300 cursor-not-allowed' 
                                      : 'text-gray-600 hover:text-gray-900'
                                  }`}
                                  title="Move Up"
                                >
                                  <ArrowUp className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleChangeOrder(item._id, 'down')}
                                  disabled={mediaItems.indexOf(item) === mediaItems.length - 1}
                                  className={`p-1 rounded-full hover:bg-gray-100 ${
                                    mediaItems.indexOf(item) === mediaItems.length - 1 
                                      ? 'text-gray-300 cursor-not-allowed' 
                                      : 'text-gray-600 hover:text-gray-900'
                                  }`}
                                  title="Move Down"
                                >
                                  <ArrowDown className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MediaPresenceManagement;
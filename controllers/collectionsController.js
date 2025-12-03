import supabase from '../config/supabase.js';

const collectionsController = {
  // Create new collection
  createCollection: async (req, res) => {
    try {
      const { name, description } = req.body;
      const { user_id } = req.user; // Get from auth middleware

      const { data, error } = await supabase
        .from('collections')
        .insert([{ user_id, name, description }])
        .select();

      if (error) throw error;
      res.json({ success: true, data: data[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get user's collections
  getCollections: async (req, res) => {
    try {
      const { user_id } = req.user;

      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          collection_items (*)
        `)
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get single collection
  getCollection: async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id } = req.user;

      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          collection_items (*)
        `)
        .eq('id', id)
        .eq('user_id', user_id)
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Update collection
  updateCollection: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const { user_id } = req.user;

      const { data, error } = await supabase
        .from('collections')
        .update({ name, description, updated_at: new Date() })
        .eq('id', id)
        .eq('user_id', user_id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Delete collection
  deleteCollection: async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id } = req.user;

      // First delete collection items
      const { error: itemsError } = await supabase
        .from('collection_items')
        .delete()
        .eq('collection_id', id);

      if (itemsError) throw itemsError;

      // Then delete collection
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id)
        .eq('user_id', user_id);

      if (error) throw error;

      res.json({
        success: true,
        message: 'Collection deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Add request to collection
  addToCollection: async (req, res) => {
    try {
      const { collection_id, name, url, method, headers, body } = req.body;
      const { user_id } = req.user;

      // Verify collection belongs to user
      const { data: collection, error: collectionError } = await supabase
        .from('collections')
        .select('id')
        .eq('id', collection_id)
        .eq('user_id', user_id)
        .single();

      if (collectionError) throw new Error('Collection not found or access denied');

      const { data, error } = await supabase
        .from('collection_items')
        .insert([
          {
            collection_id,
            name,
            url,
            method,
            headers,
            body
          }
        ])
        .select();

      if (error) throw error;

      res.json({
        success: true,
        data: data[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Update collection item
  updateCollectionItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, url, method, headers, body } = req.body;
      const { user_id } = req.user;

      // Verify user owns this item
      const { data: item, error: itemError } = await supabase
        .from('collection_items')
        .select(`
          *,
          collections!inner(user_id)
        `)
        .eq('id', id)
        .eq('collections.user_id', user_id)
        .single();

      if (itemError) throw new Error('Item not found or access denied');

      const { data, error } = await supabase
        .from('collection_items')
        .update({ name, url, method, headers, body, updated_at: new Date() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Delete collection item
  deleteCollectionItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id } = req.user;

      // Verify user owns this item
      const { data: item, error: itemError } = await supabase
        .from('collection_items')
        .select(`
          *,
          collections!inner(user_id)
        `)
        .eq('id', id)
        .eq('collections.user_id', user_id)
        .single();

      if (itemError) throw new Error('Item not found or access denied');

      const { error } = await supabase
        .from('collection_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.json({
        success: true,
        message: 'Item deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

export default collectionsController;
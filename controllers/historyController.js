import supabase from '../config/supabase.js';

const historyController = {
  
  // Save request to history - remove user_id from body
saveToHistory: async (req, res) => {
  try {
    const { url, method, headers, body, response_status, response_data } = req.body;
    const { user_id } = req.user; // Get from auth middleware

    const { data, error } = await supabase
      .from('request_history')
      .insert([{ user_id, url, method, headers, body, response_status, response_data }])
      .select();

    if (error) throw error;
    res.json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
},

  // Get user's request history
  getHistory: async (req, res) => {
    try {
      const { user_id } = req.user;
      const { limit = 50 } = req.query;

      const { data, error } = await supabase
        .from('request_history')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .limit(parseInt(limit));

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

  // Delete from history
  deleteFromHistory: async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id } = req.user;

      const { error } = await supabase
        .from('request_history')
        .delete()
        .eq('id', id)
        .eq('user_id', user_id);

      if (error) throw error;

      res.json({
        success: true,
        message: 'History item deleted'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Clear all history
  clearHistory: async (req, res) => {
    try {
      const { user_id } = req.user;

      const { error } = await supabase
        .from('request_history')
        .delete()
        .eq('user_id', user_id);

      if (error) throw error;

      res.json({
        success: true,
        message: 'History cleared successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

export default historyController;
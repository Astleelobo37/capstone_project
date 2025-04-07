const chatController = {
  async handleMessage(req, res) {
    try {
      const { message } = req.body;

      // Simple response logic - you can replace this with a more sophisticated AI model
      let response = "I'm sorry, I don't understand that. Could you please rephrase your question?";
      
      // Example responses for common queries
      if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
        response = "Hello! How can I help you today?";
      } else if (message.toLowerCase().includes('mask') && message.toLowerCase().includes('recommend')) {
        response = "I can help you find the right mask based on your needs. Could you tell me more about your symptoms or requirements?";
      } else if (message.toLowerCase().includes('stock') || message.toLowerCase().includes('available')) {
        response = "You can check the current stock of masks in the Dashboard or Other Masks sections. Each mask card shows the available quantity.";
      } else if (message.toLowerCase().includes('order') || message.toLowerCase().includes('purchase')) {
        response = "To place an order, add items to your cart and proceed to checkout. You can find your cart in the top navigation bar.";
      } else if (message.toLowerCase().includes('help')) {
        response = "I can help you with:\n- Finding the right mask\n- Checking stock availability\n- Placing orders\n- General questions about COPD and respiratory care\n\nWhat would you like to know?";
      }

      res.json({ success: true, response });
    } catch (err) {
      console.error('Error in chat controller:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to process chat message' 
      });
    }
  }
};

module.exports = chatController; 
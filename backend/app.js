const chatRoutes = require('./routes/chatRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/masks', maskRoutes);
app.use('/api/test-results', testResultRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes); 
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create masks table
CREATE TABLE IF NOT EXISTS masks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  maskType VARCHAR(255) NOT NULL,
  description TEXT,
  imageUrl VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial mask data
INSERT INTO masks (maskType, description, imageUrl, price, stock) VALUES
('ResMed AirFit P10', 'Nasal pillow mask for GOLD 1-2 COPD patients. Ultra-lightweight design with minimal headgear.', 'https://www.resmed.com/content/dam/resmed/global/en/consumer/products/masks/airfit-p10/airfit-p10-mask-hero.png', 229.99, 15),
('ResMed N30i AirTouch', 'Nasal cradle mask for GOLD 2-3 COPD patients. Features memory foam cushion for enhanced comfort.', 'https://www.resmed.com/content/dam/resmed/global/en/consumer/products/masks/n30i/n30i-mask-hero.png', 209.99, 12),
('ResMed F30i', 'Full face mask for GOLD 3-4 COPD patients. Features a unique forehead support and soft silicone cushion for enhanced comfort.', 'https://www.resmed.com/content/dam/resmed/global/en/consumer/products/masks/f30i/f30i-mask-hero.png', 189.99, 8),
('ResMed F20 AirTouch', 'Full face mask for GOLD 4 COPD patients. Advanced seal technology with a flexible frame for better fit and comfort.', 'https://www.resmed.com/content/dam/resmed/global/en/consumer/products/masks/f20-airtouch/f20-airtouch-mask-hero.png', 249.99, 5),
('ResMed N20', 'Nasal mask for GOLD 1-2 COPD patients. Ultra-soft nasal cushion with minimal contact points.', 'https://www.resmed.com/content/dam/resmed/global/en/consumer/products/masks/n20/n20-mask-hero.png', 179.99, 20),
('ResMed P30i', 'Nasal pillow mask for GOLD 2-3 COPD patients. Lightweight design with minimal headgear.', 'https://www.resmed.com/content/dam/resmed/global/en/consumer/products/masks/p30i/p30i-mask-hero.png', 169.99, 18),
('ResMed Mirage FX', 'Nasal mask for GOLD 3-4 COPD patients. Features a unique forehead support and soft silicone cushion.', 'https://www.resmed.com/content/dam/resmed/global/en/consumer/products/masks/mirage-fx/mirage-fx-mask-hero.png', 189.99, 10),
('ResMed Mirage Quattro FX', 'Full face mask for GOLD 1-2 COPD patients. Designed for mouth breathers with a comfortable seal.', 'https://www.resmed.com/content/dam/resmed/global/en/consumer/products/masks/mirage-quattro-fx/mirage-quattro-fx-mask-hero.png', 159.99, 15),
('ResMed AirFit F20', 'Full face mask for GOLD 2-3 COPD patients. Features a unique forehead support and soft silicone cushion.', 'https://www.resmed.com/content/dam/resmed/global/en/consumer/products/masks/airfit-f20/airfit-f20-mask-hero.png', 219.99, 12),
('ResMed AirFit N20', 'Nasal mask for GOLD 3-4 COPD patients. Advanced seal technology with a flexible frame.', 'https://www.resmed.com/content/dam/resmed/global/en/consumer/products/masks/airfit-n20/airfit-n20-mask-hero.png', 199.99, 8),
('ResMed AirFit P30i', 'Nasal pillow mask for GOLD 4 COPD patients. Features a unique forehead support and soft silicone cushion.', 'https://www.resmed.com/content/dam/resmed/global/en/consumer/products/masks/airfit-p30i/airfit-p30i-mask-hero.png', 209.99, 6),
('ResMed AirFit F30', 'Full face mask for GOLD 4 COPD patients. Advanced seal technology with a flexible frame.', 'https://www.resmed.com/content/dam/resmed/global/en/consumer/products/masks/airfit-f30/airfit-f30-mask-hero.png', 239.99, 4); 
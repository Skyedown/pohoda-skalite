# Pizza Pohoda - Pizza Ordering Website

A modern pizza ordering application built with React, TypeScript, and Node.js.

## Features

- 🍕 Interactive pizza menu with customization options
- 🛒 Shopping cart with real-time updates
- 📱 Fully responsive design (desktop, tablet, mobile)
- 📧 Email order confirmations via SendGrid
- 🔒 Input sanitization and security measures
- 🎨 Modern UI with smooth animations
- 📦 Easy deployment with Docker

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- React Router for navigation
- GSAP for animations
- LESS for styling

### Backend
- Node.js with Express
- SendGrid for email delivery
- Input sanitization with express-validator and sanitize-html
- RESTful API architecture

## Quick Start (Development)

### Prerequisites
- Node.js 20 or higher
- npm or yarn

### Frontend Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Development

```bash
# Navigate to API directory
cd api

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Start production server
npm start
```

## Docker Deployment

For production deployment on Ubuntu server using Docker:

📖 **[Read the complete Docker setup guide](DOCKER_SETUP.md)**

### Quick Docker Start

1. Install Docker and Docker Compose
2. Create `api/.env` file with your configuration
3. Run:

```bash
docker-compose up -d --build
```

The application will be available at:
- Frontend: http://localhost
- API: http://localhost:3001

## Environment Variables

### API (.env)

```env
NODE_ENV=production
PORT=3001
SENDGRID_API_KEY=your_api_key
SENDGRID_FROM_EMAIL=noreply@pizzapohoda.sk
RESTAURANT_EMAIL=restaurant@example.com
```

See `api/.env.example` for a template.

## Project Structure

```
pizza-pohoda-c/
├── src/                      # Frontend source code
│   ├── components/          # Reusable React components
│   ├── context/             # React context providers
│   ├── data/                # Static data (menu items)
│   ├── hooks/               # Custom React hooks
│   ├── sections/            # Page sections (Header, Footer)
│   ├── styles/              # Global styles and variables
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── views/               # Page views (PizzaMain, PizzaCart)
├── api/                     # Backend API
│   ├── utils/               # API utilities (sanitization)
│   ├── server.js            # Express server
│   └── .env                 # Environment variables
├── public/                  # Static assets
│   ├── robots.txt          # SEO configuration
│   └── sitemap.xml         # Sitemap for search engines
├── Dockerfile              # Frontend Docker configuration
├── docker-compose.yml      # Multi-container orchestration
├── nginx.conf              # Nginx configuration
└── DOCKER_SETUP.md         # Deployment guide
```

## Features Overview

### Menu System
- Pizza, burger, and drink categories
- Size selection (small, medium, large)
- Extra toppings with dynamic pricing
- Real-time price calculations

### Shopping Cart
- Add/remove items
- Quantity adjustments
- Persistent cart state
- Order summary with totals

### Order Management
- Customer information form
- Payment method selection (cash/card)
- Email confirmations to customer and restaurant
- Input validation and sanitization

### SEO & Performance
- Meta tags for social media sharing
- Structured data (JSON-LD)
- Static sitemap and robots.txt
- Optimized assets and caching
- Nginx gzip compression

## Security Features

- Client-side input sanitization
- Server-side validation with express-validator
- HTML escaping to prevent XSS
- CORS configuration
- Security headers via Nginx
- No sensitive data exposure

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Private project for Pizza Pohoda.

## Contact

For support or questions, contact the development team.

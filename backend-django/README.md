# RIMAE Django Backend API

Complete Django backend with MVVM architecture for PostgreSQL database.

## Quick Start

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure database
# Edit settings.py with your PostgreSQL credentials

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver 8000
```

## Project Structure (MVVM Architecture)

```
rimae_backend/
├── manage.py
├── requirements.txt
├── rimae/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── api/
│   ├── __init__.py
│   ├── urls.py                 # All API routes
│   ├── models/                 # Models (M)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── address.py
│   │   └── fragrance.py
│   ├── viewmodels/             # ViewModels/Serializers (VM)
│   │   ├── __init__.py
│   │   ├── user_serializer.py
│   │   ├── product_serializer.py
│   │   ├── order_serializer.py
│   │   ├── address_serializer.py
│   │   └── fragrance_serializer.py
│   └── views/                  # Views (V)
│       ├── __init__.py
│       ├── auth_views.py
│       ├── product_views.py
│       ├── order_views.py
│       ├── address_views.py
│       ├── admin_views.py
│       └── fragrance_views.py
└── media/                      # Uploaded images
```

## Frontend Integration

Update your frontend to use the Django API base URL:

```typescript
// src/lib/api.ts
export const API_BASE_URL = 'http://localhost:8000/api/v1';
```

## CORS Configuration

The backend is configured to accept requests from:
- http://localhost:5173 (Vite dev)
- https://rimae.lovable.app (Production)

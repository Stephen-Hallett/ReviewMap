# ReviewMap FastAPI Backend

FastAPI backend for ReviewMap application, migrated from Node.js/Express.

## Features

- ✅ FastAPI with async support
- ✅ Azure Table Storage integration
- ✅ Pydantic validation
- ✅ CORS enabled
- ✅ Clean architecture (API/Router/Schema/Utils)
- ✅ Type hints throughout

## Project Structure

```
backend_fastapi/
├── app/
│   ├── __init__.py           # FastAPI app initialization
│   ├── config.py             # Application settings
│   ├── API/                  # Business logic controllers
│   │   ├── categories.py
│   │   └── locations.py
│   ├── router/               # FastAPI route handlers
│   │   ├── categories.py
│   │   └── locations.py
│   ├── schemas/              # Pydantic models
│   │   ├── category.py
│   │   └── location.py
│   └── utils/
│       └── db.py             # Azure Table Storage utilities
├── main.py                   # Application entry point
├── pyproject.toml            # Dependencies
└── .env                      # Environment variables
```

## Setup

### Prerequisites

- Python 3.13+
- [uv](https://github.com/astral-sh/uv) package manager

### Installation

1. Install dependencies with uv:
   ```bash
   cd backend_fastapi
   uv sync
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your Azure Table Storage connection string:
   ```
   AZURE_TABLE_CONNECTION=your_connection_string_here
   ```

## Running the Server

### Development (with auto-reload)

```bash
uv run fastapi dev main.py
```

Server will start at: http://localhost:8080

### Production

```bash
uv run python main.py
```

## API Endpoints

### Health Check
- `GET /` - Returns server status

### Categories
- `GET /category` - Get all categories (supports query filters)
- `POST /category` - Create or update a category

### Locations
- `GET /location` - Get all locations (supports query filters)
- `POST /location` - Create or update a location

### Query Filters

All GET endpoints support filtering via query parameters:

```bash
# Get categories by name
GET /category?partitionKey=Coffee

# Get locations by category
GET /location?partitionKey=Coffee

# Multiple filters
GET /location?partitionKey=Coffee&Name=Best%20Coffee%20Shop
```

## API Documentation

Interactive API docs available at:
- Swagger UI: http://localhost:8080/docs
- ReDoc: http://localhost:8080/redoc

## Migration from Express

This FastAPI backend replaces the Node.js/Express backend with:

1. **Type Safety**: Pydantic schemas with validation
2. **Async Support**: FastAPI async handlers
3. **Better Docs**: Auto-generated OpenAPI documentation
4. **Modern Python**: Using latest Python features and uv package manager
5. **Clean Architecture**: Separation of concerns (API/Router/Schema/Utils)

### Endpoint Compatibility

All endpoints maintain compatibility with the Express version:

| Express | FastAPI | Status |
|---------|---------|--------|
| `GET /` | `GET /` | ✅ |
| `GET /category` | `GET /category` | ✅ |
| `POST /category` | `POST /category` | ✅ |
| `GET /location` | `GET /location` | ✅ |
| `POST /location` | `POST /location` | ✅ |

## Development

### Adding a New Endpoint

1. Create schema in `app/schemas/`
2. Create controller in `app/API/`
3. Create router in `app/router/`
4. Mount router in `app/__init__.py`

### Running Tests

```bash
uv run pytest
```

## Environment Variables

- `AZURE_STORAGE_CONNECTION` - Azure Storage Account connection string (required)
- `DEBUG` - Enable debug mode (default: False)

## License

MIT

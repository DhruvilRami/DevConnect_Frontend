from app import app
from models import create_indexes
import os

if __name__ == '__main__':
    # Create database indexes on startup
    create_indexes()
    
    # Get port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    
    # Run the application
    app.run(
        debug=True,
        host='0.0.0.0',
        port=port
    )
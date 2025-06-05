from flask import Flask, jsonify
from flask_cors import CORS
import datetime
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/', methods=['GET'])
def welcome():
    return jsonify({'message': 'Welcome to the backend!'})

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({
        'message': 'Hello from the Python backend!',
        'timestamp': datetime.datetime.utcnow().isoformat() + 'Z'
    })

if __name__ == '__main__':
    # Port is set by Render's environment variable.
    # Defaulting to 8080 for local development if PORT is not set.
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))

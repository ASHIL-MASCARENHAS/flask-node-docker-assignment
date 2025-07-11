from flask import Flask, request, jsonify
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "Flask Backend is running!"

@app.route('/process', methods=['POST'])
def process_data():
    if request.is_json:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')

        print(f"Received data from frontend:")
        print(f"  Name: {name}")
        print(f"  Email: {email}")

        response_data = {
            "status": "success",
            "received_data": {
                "name": name,
                "email": email
            },
            "processed_message": f"Hello {name}, your message was received and processed!"
        }
        return jsonify(response_data), 200
    else:
        print("Received non-JSON request.")
        return jsonify({"status": "error", "message": "Request must be JSON"}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
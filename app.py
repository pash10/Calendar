from flask import Flask, jsonify, request
import json

app = Flask(__name__)
events_file = 'events.json'

@app.route('/events', methods=['GET', 'POST'])
def handle_events():
    if request.method == 'POST':
        event = request.json
        try:
            with open(events_file, 'r+') as file:
                file_data = json.load(file)
                file_data.append(event)
                file.seek(0)
                json.dump(file_data, file, indent=4)
            return jsonify({"message": "Event added successfully"}), 200
        except Exception as e:
            return jsonify({"message": str(e)}), 500
    else:
        try:
            with open(events_file, 'r') as file:
                file_data = json.load(file)
            return jsonify(file_data), 200
        except Exception as e:
            return jsonify({"message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

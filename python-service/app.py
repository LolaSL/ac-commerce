from flask import Flask, render_template, request, redirect, url_for, send_from_directory
import os

app = Flask(__name__)

# Directory to store annotated files
ANNOTATED_UPLOAD_FOLDER = 'annotated_uploads'
app.config['ANNOTATED_UPLOAD_FOLDER'] = ANNOTATED_UPLOAD_FOLDER

# Make sure the annotated uploads directory exists
if not os.path.exists(ANNOTATED_UPLOAD_FOLDER):
    os.makedirs(ANNOTATED_UPLOAD_FOLDER)

@app.route('/')
def home():
    return "Welcome to the Python Service API!"

# Upload route
@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        filename = file.filename
        file.save(os.path.join(app.config['ANNOTATED_UPLOAD_FOLDER'], filename))
        return redirect(url_for('uploaded_file', filename=filename))  # Redirect to the annotated file
    return render_template('upload.html')

# Route to serve annotated files
@app.route('/annotated_uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['ANNOTATED_UPLOAD_FOLDER'], filename)


@app.route('/success')
def success():
    return 'File uploaded successfully!'


if __name__ == '__main__':
    app.run(debug=True)

# Backend Updates Required

## New Features Implemented in Frontend

The following features have been added to the frontend and require corresponding backend implementation:

### 1. Resume Upload (`/apply` endpoint)
**Frontend Changes:**
- Apply.jsx now sends FormData with file upload
- Accepts PDF files (max 5MB)
- File field name: `resume`

**Backend Requirements:**
```python
from werkzeug.utils import secure_filename
import os

UPLOAD_FOLDER = 'uploads/resumes'
ALLOWED_EXTENSIONS = {'pdf'}

@app.route('/apply', methods=['POST'])
def apply():
    # Check if file is in request
    if 'resume' in request.files:
        file = request.files['resume']
        if file and allowed_file(file.filename):
            filename = secure_filename(f"{applicant_id}_{job_id}_{file.filename}")
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            # Save filepath to database
            resume_path = filepath
    
    # Continue with normal application logic
    # Add resume_path to application record
```

### 2. Withdraw Application (`DELETE /applications/<id>`)
**Frontend Changes:**
- MyApplications.jsx calls `withdrawApplication(applicationId)`
- Uses DELETE method

**Backend Requirements:**
```python
@app.route('/applications/<int:application_id>', methods=['DELETE'])
def withdraw_application(application_id):
    application = Application.query.get_or_404(application_id)
    
    # Optional: Only allow applicant to withdraw their own application
    # if application.applicant_id != request.user_id:
    #     return jsonify({"error": "Unauthorized"}), 403
    
    db.session.delete(application)
    db.session.commit()
    
    return jsonify({"message": "Application withdrawn successfully"}), 200
```

### 3. Export Candidates to CSV (`GET /export-candidates/<employer_id>`)
**Frontend Changes:**
- CandidateList.jsx calls `exportCandidatesToCSV(employerId)`
- Downloads CSV file automatically

**Backend Requirements:**
```python
import csv
from io import StringIO
from flask import make_response

@app.route('/export-candidates/<int:employer_id>', methods=['GET'])
def export_candidates(employer_id):
    # Get all applications for employer's jobs
    applications = db.session.query(Application, Job).join(
        Job, Application.job_id == Job.id
    ).filter(Job.employer_id == employer_id).all()
    
    # Create CSV
    output = StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow([
        'Application ID', 'Job Title', 'Candidate Name', 'Email', 
        'Phone', 'Education', 'Experience', 'Skills', 'Status', 
        'Applied Date', 'Resume'
    ])
    
    # Data rows
    for app, job in applications:
        writer.writerow([
            app.id,
            job.title,
            app.full_name,
            app.email,
            app.phone,
            app.education,
            app.experience,
            app.skills,
            app.status or 'Pending',
            app.created_at.strftime('%Y-%m-%d') if hasattr(app, 'created_at') else '',
            app.resume_path if hasattr(app, 'resume_path') else ''
        ])
    
    # Create response
    output.seek(0)
    response = make_response(output.getvalue())
    response.headers['Content-Type'] = 'text/csv'
    response.headers['Content-Disposition'] = 'attachment; filename=candidates.csv'
    
    return response
```

### 4. Database Schema Updates
**Add to Application model:**
```python
class Application(db.Model):
    # ... existing fields ...
    resume_path = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='Pending')  # Pending, Accepted, Rejected
```

### 5. Create Uploads Directory
```bash
mkdir -p uploads/resumes
```

Add to `.gitignore`:
```
uploads/
```

### 6. Update requirements.txt (already done)
All required packages are already in `requirements.txt`:
- Flask-Mail for email notifications (ready for future use)
- Werkzeug for file uploads
- SQLAlchemy for database

## Migration Script

Run this after updating your models:

```python
# migration.py
from app import db, app

with app.app_context():
    # Add columns if they don't exist
    from sqlalchemy import inspect
    inspector = inspect(db.engine)
    
    columns = [col['name'] for col in inspector.get_columns('application')]
    
    if 'resume_path' not in columns:
        db.engine.execute('ALTER TABLE application ADD COLUMN resume_path VARCHAR(500)')
    
    if 'created_at' not in columns:
        db.engine.execute('ALTER TABLE application ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP')
    
    if 'status' not in columns:
        db.engine.execute('ALTER TABLE application ADD COLUMN status VARCHAR(20) DEFAULT "Pending"')
    
    print("Migration completed!")
```

## Testing Checklist

- [ ] Resume upload works and saves to `uploads/resumes/`
- [ ] Resume path is saved to database
- [ ] Withdraw application removes record from database
- [ ] CSV export includes all candidate data
- [ ] CSV download works in browser
- [ ] File size validation (5MB max)
- [ ] File type validation (PDF only)
- [ ] Resume files are secure (using secure_filename)
- [ ] Uploads directory has proper permissions

## Security Considerations

1. **File Upload Security:**
   - Validate file type on server side
   - Use `secure_filename()` to prevent directory traversal
   - Limit file size (5MB)
   - Store files outside web root if possible
   - Scan for malware in production

2. **Authorization:**
   - Verify user can only withdraw their own applications
   - Verify employer can only export their own candidates
   - Add JWT authentication (future enhancement)

3. **CSV Export:**
   - Verify employer_id owns the jobs
   - Sanitize data to prevent CSV injection
   - Rate limit export requests

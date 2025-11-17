# 🚨 Backend Implementation Required

## Error You're Seeing

```
127.0.0.1:5000/export-candidates/8:1 Failed to load resource: 
the server responded with a status of 404 (NOT FOUND)
```

**This means the backend endpoint doesn't exist yet!**

---

## ✅ Quick Fix - Add This to Your Flask App

### Step 1: Find your Flask `app.py` file

Look for the file where you have `@app.route('/jobs')` and other routes.

### Step 2: Add the CSV Export Endpoint

Copy and paste this code into your `app.py`:

```python
import csv
from io import StringIO
from flask import make_response

@app.route('/export-candidates/<int:employer_id>', methods=['GET'])
def export_candidates(employer_id):
    """Export all candidates for an employer's jobs to CSV"""
    try:
        # Get all applications for this employer's jobs
        # Adjust the query based on your database structure
        
        # Example with SQLAlchemy (if you're using it):
        applications = db.session.query(Application, Job).join(
            Job, Application.job_id == Job.id
        ).filter(Job.employer_id == employer_id).all()
        
        # Create CSV in memory
        output = StringIO()
        writer = csv.writer(output)
        
        # Write header row
        writer.writerow([
            'Application ID',
            'Job Title',
            'Candidate Name',
            'Email',
            'Phone',
            'Education',
            'Experience',
            'Skills',
            'Status',
            'Applied Date'
        ])
        
        # Write data rows
        for app, job in applications:
            writer.writerow([
                app.id,
                job.title,
                app.full_name,
                app.email,
                app.phone,
                app.education or '',
                app.experience or '',
                app.skills or '',
                getattr(app, 'status', 'Pending'),
                app.created_at.strftime('%Y-%m-%d') if hasattr(app, 'created_at') else ''
            ])
        
        # Create the response
        output.seek(0)
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = 'attachment; filename=candidates.csv'
        
        return response
        
    except Exception as e:
        print(f"Export error: {e}")
        return jsonify({"error": str(e)}), 500
```

### Step 3: Make Sure Imports Are at the Top

At the top of your `app.py`, make sure you have:

```python
import csv
from io import StringIO
from flask import Flask, jsonify, make_response  # Add make_response
```

### Step 4: Restart Your Flask Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
python app.py
```

---

## 🔧 Alternative: Simple Version (If You Don't Have SQLAlchemy)

If you're using raw SQL or a different database setup:

```python
@app.route('/export-candidates/<int:employer_id>', methods=['GET'])
def export_candidates(employer_id):
    """Export candidates to CSV"""
    try:
        # Get applications using your database method
        # Example with raw SQL:
        conn = get_db_connection()  # Your database connection
        cursor = conn.cursor()
        
        query = """
            SELECT 
                a.id, j.title, a.full_name, a.email, a.phone,
                a.education, a.experience, a.skills
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            WHERE j.employer_id = ?
        """
        
        cursor.execute(query, (employer_id,))
        applications = cursor.fetchall()
        
        # Create CSV
        output = StringIO()
        writer = csv.writer(output)
        
        # Header
        writer.writerow(['Application ID', 'Job Title', 'Name', 'Email', 
                        'Phone', 'Education', 'Experience', 'Skills'])
        
        # Data
        for app in applications:
            writer.writerow(app)
        
        # Response
        output.seek(0)
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = 'attachment; filename=candidates.csv'
        
        return response
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
```

---

## 📋 What This Endpoint Does

1. **Receives**: GET request to `/export-candidates/<employer_id>`
2. **Queries**: All applications for that employer's jobs
3. **Creates**: CSV file in memory (doesn't save to disk)
4. **Returns**: CSV file with proper headers for download

---

## 🧪 Test It

After implementing, test by:

1. **Open your app in browser**
2. **Go to Dashboard** (as an employer with applications)
3. **Click "📊 Export to CSV"**
4. **Should download**: `candidates.csv` file

---

## ⚠️ If You Still Get 404

Check these:

1. **Is Flask running?** Check terminal for errors
2. **Correct route?** Should be `/export-candidates/<int:employer_id>`
3. **CORS enabled?** Make sure CORS allows this route
4. **Restart server?** Always restart after code changes

---

## 🎯 Full Backend TODO List

See `BACKEND_UPDATES.md` for all 3 endpoints needed:

1. ✅ **CSV Export** (this one) - `/export-candidates/<employer_id>`
2. ❌ **Resume Upload** - Update `/apply` to accept files
3. ❌ **Withdraw Application** - `DELETE /applications/<id>`

---

## 💡 Need Help?

If you're not sure about your database structure, show me:
- Your `app.py` file
- Your database models
- How you're currently fetching applications

I can provide a more specific solution!

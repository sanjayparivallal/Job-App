"""
Flask Backend - CSV Export Endpoint

Add this to your Flask app.py file
"""

from flask import Flask, jsonify, make_response
import csv
from io import StringIO

# Add this route to your app.py

@app.route('/export-candidates/<int:employer_id>', methods=['GET'])
def export_candidates(employer_id):
    """Export all candidates for an employer's jobs to CSV"""
    try:
        # Query all applications for employer's jobs
        # Adjust based on your database schema
        query = """
            SELECT 
                a.id as application_id,
                j.title as job_title,
                a.full_name,
                a.email,
                a.phone,
                a.education,
                a.experience,
                a.skills,
                COALESCE(a.status, 'Pending') as status,
                a.created_at,
                a.resume_path
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            WHERE j.employer_id = ?
            ORDER BY a.created_at DESC
        """
        
        # Example using SQLAlchemy (adjust to your setup)
        from sqlalchemy import text
        result = db.session.execute(text(query), {'employer_id': employer_id})
        applications = result.fetchall()
        
        # Create CSV in memory
        output = StringIO()
        writer = csv.writer(output)
        
        # Header row
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
            'Applied Date',
            'Resume'
        ])
        
        # Data rows
        for app in applications:
            writer.writerow([
                app.application_id,
                app.job_title,
                app.full_name,
                app.email,
                app.phone,
                app.education or '',
                app.experience or '',
                app.skills or '',
                app.status,
                app.created_at.strftime('%Y-%m-%d %H:%M:%S') if app.created_at else '',
                app.resume_path or ''
            ])
        
        # Create response
        output.seek(0)
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = 'attachment; filename=candidates.csv'
        
        return response
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Alternative: If using Flask-SQLAlchemy with models

@app.route('/export-candidates/<int:employer_id>', methods=['GET'])
def export_candidates_with_models(employer_id):
    """Export using SQLAlchemy models"""
    try:
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
        
        # Data
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
                app.created_at.strftime('%Y-%m-%d %H:%M:%S') if hasattr(app, 'created_at') and app.created_at else '',
                getattr(app, 'resume_path', '')
            ])
        
        # Response
        output.seek(0)
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = 'attachment; filename=candidates.csv'
        
        return response
        
    except Exception as e:
        print(f"Export error: {e}")  # Debug logging
        return jsonify({"error": str(e)}), 500


# Don't forget to import at the top of your app.py:
# import csv
# from io import StringIO
# from flask import make_response

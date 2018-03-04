from flask import Flask
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_sqlalchemy import SQLAlchemy

from .models import Dataset, Datapoint, init

# Flask and Flask-SQLAlchemy initialization here

app = Flask(__name__)

# Create dummy secrey key so we can use sessions
app.config['SECRET_KEY'] = '123456790'

# Create in-memory database
app.config['DATABASE_FILE'] = 'sample_db.sqlite'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + app.config['DATABASE_FILE']
app.config['SQLALCHEMY_ECHO'] = True
db = SQLAlchemy(app)

init(db.engine)

# DB
admin = Admin(app, name='gender-index', template_mode='bootstrap3')

# Add administrative views here
admin.add_view(ModelView(Datapoint, db.session))
admin.add_view(ModelView(Dataset, db.session))

app.run()

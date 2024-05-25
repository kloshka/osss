from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField, BooleanField
from wtforms.validators import data_required, ValidationError, email, equal_to
import sqlalchemy as sa
from app import db
from app.models import User


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[data_required()])
    password = PasswordField('Password', validators=[data_required()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')
    

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[data_required()])
    email = StringField('Email', validators=[data_required(), email()])
    password = PasswordField('Password', validators=[data_required()])
    password2 = PasswordField(
        'Repeat Password', validators=[data_required(), equal_to('password')])
    submit = SubmitField('Register')

    def validate_username(self, username):
        user = db.session.scalar(sa.select(User).where(User.username == username.data))
        if user is not None:
            raise ValidationError('Please use a different username.')
    
    def validate_email(self, email):
        user = db.session.scalar(sa.select(User).where(User.email == email.data))
        if user is not None:
            raise ValidationError('Please use a different email address.')
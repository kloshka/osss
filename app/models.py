from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone
from typing import Optional
import sqlalchemy as sa
import sqlalchemy.orm as so
from app import db, login
from flask_login import UserMixin


class User(UserMixin, db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    username: so.Mapped[str] = so.mapped_column(sa.String(64), index=True, unique=True)
    email: so.Mapped[str] = so.mapped_column(sa.String(120), index=True, unique=True)
    password_hash: so.Mapped[Optional[str]] = so.mapped_column(sa.String(256))
    posts: so.WriteOnlyMapped['Post'] = so.relationship(back_populates='author')
    favorites: so.WriteOnlyMapped['FavoriteMovie'] = so.relationship(back_populates='author')
    preference: so.WriteOnlyMapped['UserPreference'] = so.relationship(back_populates='author')
    rate: so.WriteOnlyMapped['RateMovie'] = so.relationship(back_populates='author')

    def __repr__(self):
        return '<User {}>'.format(self.username)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    

@login.user_loader
def load_user(id):
    return db.session.get(User, int(id))


class Post(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    body: so.Mapped[str] = so.mapped_column(sa.String(140))
    timestamp: so.Mapped[datetime] = so.mapped_column(index=True, default=lambda: datetime.now(timezone.utc))
    user_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(User.id), index=True)
    author: so.Mapped['User'] = so.relationship(back_populates='posts')

    def __repr__(self):
        return '<Post {}>'.format(self.body)
    

class FavoriteMovie(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    kp_id: so.Mapped[int] = so.mapped_column(sa.Integer, nullable=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(120), nullable=True)
    description: so.Mapped[str] = so.mapped_column(sa.String(140), nullable=True)
    shortDescription: so.Mapped[str] = so.mapped_column(sa.String(140), nullable=True)
    kp_rating: so.Mapped[float] = so.mapped_column(sa.Float, nullable=True)
    imdb_rating: so.Mapped[float] = so.mapped_column(sa.Float, nullable=True)
    ageRating: so.Mapped[int] = so.mapped_column(sa.Integer, nullable=True)
    posterUrl: so.Mapped[str] = so.mapped_column(sa.String(140), nullable=True)
    posterPreviewUrl: so.Mapped[str] = so.mapped_column(sa.String(140), nullable=True)
    genres: so.Mapped[str] = so.mapped_column(sa.String(140), nullable=True)
    countries: so.Mapped[str] = so.mapped_column(sa.String(140), nullable=True)
    releaseStart: so.Mapped[int] = so.mapped_column(sa.Integer, nullable=True)
    releaseEnd: so.Mapped[int] = so.mapped_column(sa.Integer, nullable=True)
    user_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(User.id), index=True)
    author: so.Mapped['User'] = so.relationship(back_populates='favorites')


class UserPreference(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    user_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(User.id), index=True)
    genres: so.Mapped[str] = so.mapped_column(sa.String(500), nullable=True)
    countries: so.Mapped[str] = so.mapped_column(sa.String(500), nullable=True)
    releaseYearsStart: so.Mapped[str] = so.mapped_column(sa.String(500), nullable=True)
    preferences_chosen: so.Mapped[bool] = so.mapped_column(sa.Boolean(500), default=False)
    author: so.Mapped['User'] = so.relationship(back_populates='preference')


class RateMovie(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[int] = so.mapped_column(sa.Integer, nullable=True)
    rating: so.Mapped[int] = so.mapped_column(sa.Integer, nullable=True)
    user_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(User.id), index=True)
    author: so.Mapped['User'] = so.relationship(back_populates='rate')

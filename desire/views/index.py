"""Project Desire index view."""
import flask
import desire


@desire.app.route('/')
def show_index():
    """Display / route."""
    return 'placeholder text :)'

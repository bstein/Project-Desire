from flask import Flask

app = Flask(__name__) # pylint: disable=invalid-name

# import desire.api  # noqa: E402  pylint: disable=wrong-import-position
import desire.views  # noqa: E402  pylint: disable=wrong-import-position

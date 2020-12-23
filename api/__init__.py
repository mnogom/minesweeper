from flask import Flask
from flask import request
import json

from api.class_minesweeper import MineSweeper

app = Flask(__name__)


@app.route('/status')
def check_status():
    return 'on air!'


@app.route('/gmf')
def get_mine_field():
    x0 = int(request.args.get('x'))
    y0 = int(request.args.get('y'))
    w = int(request.args.get('w'))
    h = int(request.args.get('h'))
    m = int(request.args.get('m'))

    the_game = MineSweeper(h, w, m, y0, x0)

    return json.dumps({'field': the_game.field,
                       'touched': [the_game.y0, the_game.x0],
                       'mines': the_game.count_mine,
                       'size': [the_game.field_height, the_game.field_width],
                       })

    # --- pretty answer
    # field_string = ''
    #
    # for row in the_game.field:
    #     field_string = field_string + ' '.join(row) + '<br>'
    #
    # return field_string
    # ---


if __name__ == '__main__':
    app.run()

# http://127.0.0.1:5000/gmf?x=10&y=10&w=16&h=16&m=10

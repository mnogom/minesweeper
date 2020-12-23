import numpy as np
import collections
import random


class MineSweeper:
    def __init__(self, height, width, n_mines, y0, x0):
        self.field_height = height
        self.field_width = width
        self.count_mine = n_mines
        self.x0 = x0
        self.y0 = y0

        self._generateEmptyField()
        self._initFirstTouch()
        self._generateMinesField()
        self._generateNumberField()

        self.field = [list(row) for row in self.field]

    # --- --- MAIN FUNCTIONS

    # --- GENERATE EMPTY FIELD

    def _generateEmptyField(self):
        # --- generate empty field
        self.field = np.full((self.field_height, self.field_width), '·')

    # --- INIT FIRST TOUCH

    def _initFirstTouch(self):
        # --- generate around first touch
        self.touched_area = self._getRoundAreaCoords(self.field_height, self.field_width,
                                                     self.y0, self.x0, '1d')

    # --- GENERATE MINES FIELD

    def _generateMinesField(self):
        # --- line coord of mine
        cells_num = self.field_width * self.field_height
        # - range without first touch area
        range_mines = list(set(range(cells_num)) - set(self.touched_area))

        mine_line = random.sample(range_mines, self.count_mine)

        # --- 1d to 2d
        for point in mine_line:
            (y, x) = self._1to2(point, self.field_width)
            self.field[y, x] = '*'

    # --- GENERATE MINES FIELD

    def _generateNumberField(self):
        for y in range(self.field_height):
            for x in range(self.field_width):
                if self.field[y, x] != '*':
                    p_area = self._getRoundAreaCoords(self.field_height, self.field_width,
                                                      y, x, '2d')

                    field_area = [self.field[p] for p in p_area]

                    c = collections.Counter(field_area)['*']
                    self.field[y, x] = c

    # --- --- HELPERS

    # --- RESHAPE 1D TO 2D
    @staticmethod
    def _1to2(l, width):
        return (l // width, l % width)

    # --- RESHAPE 2D TO 1D
    @staticmethod
    def _2to1(y, x, width):
        return x + width * y;

    # --- GET ROUND AREA COORDS

    def _getRoundAreaCoords(self, h, w, y, x, form):
        # --- generate coords area
        area = [[y - 1, x - 1], [y - 1, x], [y - 1, x + 1],  # ul u0 ur
                [y, x - 1], [y, x], [y, x + 1],  # 0l 00 0r
                [y + 1, x - 1], [y + 1, x], [y + 1, x + 1]]  # dl d0 dr

        # --- looking for exception
        for offset, p in enumerate(area):
            if p[0] < 0:
                area[offset][0] = 0
            elif p[0] > h - 1:
                area[offset][0] = h - 1
            if p[1] < 0:
                area[offset][1] = 0
            elif p[1] > w - 1:
                area[offset][1] = w - 1

        # --- delete "bad" coords
        area = [(p[0], p[1]) for p in area]
        area = list(set(area))

        # --- form of output
        if form == '2d':
            return area
        if form == '1d':
            return [self._2to1(p[0], p[1], self.field_width) for p in area]

    # --- --- PRETTIFYERS
    # -- PRINT FIELD
    def printField(self):
        # ----- prettify output
        field_string = ''

        self.field[self.y0, self.x0] = 'X'

        for row in self.field:
            field_string = field_string + ' '.join(row) + '\n'

        print(field_string)
        print('--' * self.field_width)
        print('field size: ' + str(self.field_height) + ' x ' + str(self.field_width))
        print('mines count: ' + str(collections.Counter(self.field.ravel())['*']))

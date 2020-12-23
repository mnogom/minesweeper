// https://ru.vuejs.org/v2/guide/events.html#Модификаторы-клавиш-мыши -- middle mouse key

new Vue ({
	el: "#app-2",
	data: {
		width: 9,
		height: 9,
		mines: 10,
		field: [[]],
		url: 'a',
		s: 0,
		
		tst: '',
		
		game_start: false,
		flag_count: 0,
		
		numbers_styles: {
			0: 'value-00',
			1: 'value-01',
			2: 'value-02',
			3: 'value-03',
			4: 'value-04',
			5: 'value-05',
			6: 'value-06',
			7: 'value-07',
			8: 'value-08',
			9: 'value-09',
			'*': 'value-mine',
			'f': 'value-flag'
		}
	},
	
	mounted: function() {
	    if (localStorage.width) {
	      this.width = parseInt(localStorage.width)
	    }
	    if (localStorage.height) {
	      this.height = parseInt(localStorage.height)
	    }
	    if (localStorage.mines) {
	      this.mines = parseInt(localStorage.mines)
	    }
	},
	
	methods: {
		
		// Change size of field
		change_size: function (event) {
			id = event.target.id
			
			if (id == 'W') {
				this.width = Math.abs(event.target.value)
			} else if (id == 'H') {
				this.height = Math.abs(event.target.value)
			} else if (id == 'M') {
				this.mines = Math.abs(event.target.value)
			}
		},
		
		// Save coockie [?]
		save_config: function() {
			localStorage.width = this.width
			localStorage.height = this.height
			localStorage.mines = this.mines
		},
		
		// Ask server for field and open first cell
		init_game: function (event) {
			
			this.save_config()
			
			y0 = event.target.id.split(',')[1]-1
			x0 = event.target.id.split(',')[2]-1
			// x y w h m
			url = 'https://mine.aloy.xyz/gmf?x=' + x0 + '&y=' + y0 + '&w=' + this.width + '&h=' + this.height + '&m=' + this.mines
			this.url = url
			
			axios.get(url).then(response => {
				this.field = response.data.field
				
				yx_area = this.get_area_to_open([y0+1, x0+1], [])
				this.render_cells(yx_area)
			})
			
			this.game_start = true
		},
		
		// Get area of coords
		get_area: function (coord, h, w) {
			y = coord[0]
			x = coord[1]
			
			area_coord = [
				[y-1, x-1], [y-1, x  ], [y-1, x+1],
				[y,   x-1],             [y  , x+1],
				[y+1, x-1], [y+1, x  ], [y+1, x+1]
			]
			
			area_coord = area_coord.filter(function(item) {
				return !((item[0] < 1)
					 || (item[0] > h)
					 || (item[1] < 1)
					 || (item[1] > w))
			})
			
			return area_coord
		},

		// Check if field in coords is mine, 0 or another number
		check_cell: function (coord, f) {
			yf = coord[0]-1
			xf = coord[1]-1
			
			if (f[yf][xf] == 0) {
				return 0
			} else if (f[yf][xf] == "*") {
				return 2
			} else {
				return 1
			}
		},

		// (core) Get area for open
		get_area_to_open: function (coord, yx_checked) {
			
			isin = false
			for (var i = 0; i < yx_checked.length; i++) {
				if ((coord[0] == yx_checked[i][0]) && (coord[1] == yx_checked[i][1])) {
					isin = true
					break
				}
			}

			if (isin == false) {

				yx_checked.push(coord)
					
				cell_status = this.check_cell(coord, this.field)
				
				if (cell_status == 0) {
					var area_coord = this.get_area(coord, this.height, this.width)
					
					for (var i = 0; i < area_coord.length; i++) {							
						yx_checked = this.get_area_to_open(area_coord[i], yx_checked)
					}
				}
			}
			
			return yx_checked
		},
		
		// Change css classes for cells to open
		render_cells: function(yx_area) {
			
			for (var i = 0; i < yx_area.length; i++) {
				yi = yx_area[i][0]
				xi = yx_area[i][1]
				
				value = this.field[yi-1][xi-1]
				
				el = document.getElementById("1," + yi + "," + xi)
				
				el.innerHTML = value
	
				el.classList = []
				el.classList.add("play-cell-opened")
				el.classList.add(this.numbers_styles[value])
			}
			
			s = this.check_status(yx_area)
			this.s = s // check this out [0]
			
			if (s == 0) {
				
			} else if (s == 1) {
				alert('You win!')
			} else if (s == -1) {
// 				alert("you lose") // check this out [1]
				this.render_mines()
				//this.restart()
			} else {
				alert('error :( reload the page, please')
			}
		},
		
		
		// render all mines if loose
		render_mines: function() {
			
			for (var i = 0; i < this.height; i++) {
				for (var j = 0; j < this.width; j++) {
					if (this.field[i][j] == "*") {
						yi = i + 1;
						xi = j + 1;
						el = document.getElementById("1," + yi + "," + xi)
						
						el.innerHTML = value
			
						el.classList = []
						el.classList.add("play-cell-opened")
						el.classList.add(this.numbers_styles[value])
					}
				}
			}
		},
		
		
		// Open cell (left click)
		open_cell: function(event) {
			
			if (event.target.innerHTML == "e") {
					
				y = Math.abs(event.target.id.split(",")[1])
				x = Math.abs(event.target.id.split(",")[2])
				
				yx_area = this.get_area_to_open([y, x], [])
				this.render_cells(yx_area)
			}
		},

		
		// Restart 
		restart: function() {
			cell = document.getElementsByName("name-cell")
			
			for (var i = 0; i < cell.length; i++) {
				this.flag_count = 0
				cell[i].classList = "play-cell-closed"
				cell[i].innerHTML = "e"
			}
			
			this.game_start = false;
		},
		
		// Check status
		check_status: function(coords) {
			
			for (var i = 0; i < coords.length; i++) {
			
				yi = coords[i][0]
				xi = coords[i][1]
				
				if (this.field[yi-1][xi-1] == "*") {
					return -1
				}
				
			}
			
// 			console.log(document.getElementsByClassName("play-cell-opened").length, ' // ', this.height*this.width - this.mines)
			
			if (document.getElementsByClassName("play-cell-opened").length == this.height*this.width - this.mines) {
				return 1
			}
			
			return 0
		},
		
		change_status: function(s) {
			if (s == 1) {
				alert("you win")
			} else if (s == -1) {
// 				alert("you lose") // check this out [1]
				this.restart()
			}
		},
		
		// Contextmenu function
		put_mine: function(event) {
			
			cell_obj = event.target
			
			// if game start
			if (this.game_start) {
				
				// post flag if cell is empty
				if (cell_obj.innerHTML == "e") {
					
					this.flag_count = this.flag_count + 1
					cell_obj.innerHTML = "f"
					cell_obj.classList.add(this.numbers_styles["f"])
				}
				
				// remove flag if there is flag on cell
				else if (cell_obj.innerHTML == "f") {
					
					this.flag_count = this.flag_count - 1
					cell_obj.innerHTML = "e"
					cell_obj.classList.remove(this.numbers_styles["f"])
				}
				
				// if 1,2,3,4,5,6,7,8
				else if ( (cell_obj.innerHTML != "0") && (cell_obj.innerHTML != "*") ) {
					
					y = Math.abs(event.target.id.split(",")[1])
					x = Math.abs(event.target.id.split(",")[2])
					coord = [y, x]
					
					// get area
					yx_area = this.get_area(coord, this.height, this.width)
					
					// on area
					flag_count_area = 0
					closed_area = []
					
					for (var i = 0; i < yx_area.length; i++) {
						
						yi = yx_area[i][0]
						xi = yx_area[i][1]
						
						cell_element = document.getElementById("1," + yi + "," + xi)
						
						// count of flags
						if (cell_element.innerHTML == "f") {
							flag_count_area = flag_count_area + 1
						}
						
						// coord of empty cells
						if (cell_element.innerHTML == "e") {
							closed_area.push([yi, xi])
						}
						
					}
					
					// if count of flags and cell numbers are equels and there are closed cell around
					if ( (flag_count_area == cell_obj.innerHTML) && (closed_area.length != 0) ) {
						
						for (var i = 0; i < closed_area.length; i++) {
							yi = closed_area[i][0]
							xi = closed_area[i][1]
							
							yx_area = this.get_area_to_open([yi, xi], [])
							this.render_cells(yx_area)					
						}
					}
					
				}
			}
			
			// prevent standart function on right click
			event.preventDefault()
			
		}
	}
})
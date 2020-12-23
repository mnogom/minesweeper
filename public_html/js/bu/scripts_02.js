new Vue ({
	el: "#app-2",
	data: {
		width: 30,
		height: 16,
		mines: 99,
		field: [[]],
		url: 'a',
		
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
	
	methods: {
		
		// -------- change size of field
		
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
		
		// -------- ask server for field
		
		init_game: function (event) {
			this.game_start = true
			
			y0 = event.target.id.split(',')[1]-1
			x0 = event.target.id.split(',')[2]-1
			url = 'http://mine.aloy.xyz/gmf?x=' + x0 + '&y=' + y0
			this.url = url
			
			axios.get(url).then(response => {
				this.field = response.data.field
				
				yx_area = this.open_area([y0+1, x0+1], this.field, [], this.height, this.width)
			
				for (var i = 0; i < yx_area.length; i++) {
					yi = yx_area[i][0]
					xi = yx_area[i][1]
					
					value = this.field[yi-1][xi-1]
					
					el = document.getElementById("1," + yi + "," + xi)
					
					el.innerHTML = value
					el.classList.add("play-cell-opened")
					el.classList.add(this.numbers_styles[value])
					el.classList.remove("play-cell-closed")
				}
			})
		},
		
		// -------- open cell funciton
		

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

		open_area: function (coord, f, yx_checked, h, w) {
			
			isin = false
			for (var i = 0; i < yx_checked.length; i++) {
				if ((coord[0] == yx_checked[i][0]) && (coord[1] == yx_checked[i][1])) {
					isin = true
					break
				}
			}

			if (isin == false) {

				yx_checked.push(coord)
					
				cell_status = this.check_cell(coord, f)
				
				if (cell_status == 0) {
					var area_coord = this.get_area(coord, h, w)
					
					for (var i = 0; i < area_coord.length; i++) {							
						yx_checked = this.open_area(area_coord[i], f, yx_checked, h, w)
					}
				}
			}
			
			return yx_checked
		},
		
		open_cell: function(event) {	
					
					
			y = Math.abs(event.target.id.split(",")[1])
			x = Math.abs(event.target.id.split(",")[2])
			
			yx_area = this.open_area([y, x], this.field, [], this.height, this.width)
			
			for (var i = 0; i < yx_area.length; i++) {
				yi = yx_area[i][0]
				xi = yx_area[i][1]
				
				value = this.field[yi-1][xi-1]
				
				el = document.getElementById("1," + yi + "," + xi)
				
				el.innerHTML = value
				el.classList.add("play-cell-opened")
				el.classList.add(this.numbers_styles[value])
				el.classList.remove("play-cell-closed")
			}
			
			this.tst = event.target.id.split(",")[1] + " : " + event.target.id.split(",")[2]
			
			// --------
			
		},

		
		// -------- restart 
		
		restart: function() {
			cell = document.getElementsByName("cell")
			
			for (var i = 0; i < cell.length; i++) {
				value = cell[i].innerHTML
				
				cell[i].classList.add("play-cell-closed")
				cell[i].classList.remove("play-cell-opened")
				cell[i].classList.remove(this.numbers_styles[value])
				
				this.flag_count = 0
				cell[i].classList.remove(this.numbers_styles['*'])
				cell[i].classList.remove(this.numbers_styles['f'])
				
				cell[i].innerHTML = "e"
			}
			
			this.game_start = false;
		},
		
		// -------- contextmenu function
		
		put_mine: function(event) {
			
			cell_obj = event.target
			
			// if game start
			if (this.game_start) {
				
				// post flag
				if (cell_obj.innerHTML == "e") {
					
					this.flag_count = this.flag_count + 1
					cell_obj.innerHTML = "f"
					cell_obj.classList.add(this.numbers_styles["f"])
				}
				
				// remove flag
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
					flag_count = 0
					closed_area = []
					
					for (var i = 0; i < yx_area.length; i++) {
						
						yi = yx_area[i][0]
						xi = yx_area[i][1]
						
						cell_element = document.getElementById("1," + yi + "," + xi)
						
						// count count of flags
						if (cell_element.innerHTML == "f") {
							flag_count = flag_count + 1
						}
						
						// coord of empty cells
						if (cell_element.innerHTML == "e") {
							closed_area.push([yi, xi])
						}
						
					}
					
					if ( (flag_count == cell_obj.innerHTML) && (closed_area.length != 0) ) {
						
						for (var i = 0; i < closed_area.length; i++) {
							yi = closed_area[i][0]
							xi = closed_area[i][1]
							
							yx_area = this.open_area([yi, xi], this.field, [], this.height, this.width)
			
							for (var j = 0; j < yx_area.length; j++) {
								yi = yx_area[j][0]
								xi = yx_area[j][1]
								
								value = this.field[yi-1][xi-1]
								
								el = document.getElementById("1," + yi + "," + xi)
								
								el.innerHTML = value
								el.classList.add("play-cell-opened")
								el.classList.add(this.numbers_styles[value])
								el.classList.remove("play-cell-closed")
							}
							
						}
					}
					
				}
			}
			
			event.preventDefault()
			
		}
	}
})
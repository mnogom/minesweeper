/*
new Vue ({
	el: "#app-1",
	data: {
		width: '',
		height: '',
		mines: '',
		field: [],
		cell_class: 'grid-item',
		css_styles: {
			0: 'grid-item value-00',
			1: 'grid-item value-01',
			2: 'grid-item value-02',
			3: 'grid-item value-03',
			4: 'grid-item value-04',
			5: 'grid-item value-05',
			6: 'grid-item value-06',
			7: 'grid-item value-07',
			8: 'grid-item value-08',
			9: 'grid-item value-09',
			'*': 'grid-item value-mine'
		}
	},
	
	methods: {
		download_field: function () {
			axios.get("http://mine.aloy.xyz/gmf?x=9&y=15").then(response => {
				this.height = response.data.size[0]
				this.width = response.data.size[1]
				this.mines = response.data.mines
				this.field = response.data.field
			})
		}
	}
	
})
*/

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
			})
		},
		
		// -------- open cell funciton
		
		open_cell: function(event) {
			
			function get_area(coord, h, w) {
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
			}
			
			function check_cell(coord, f) {
				yf = coord[0]-1
				xf = coord[1]-1
				
				if (f[yf][xf] == 0) {
					return 0
				} else if (f[yf][xf] == "*") {
					return 2
				} else {
					return 1
				}
			}


			// -DANGER ZONE-------------------------------------------------------------------------------
			function open_area(coord, f, yx_checked, h, w) {
				
				isin = false
				for (var i = 0; i < yx_checked.length; i++) {
					if ((coord[0] == yx_checked[i][0]) && (coord[1] == yx_checked[i][1])) {
						isin = true
						break
					}
				}

				if (isin == false) {

					yx_checked.push(coord)
						
					cell_status = check_cell(coord, f)
					
					if (cell_status == 0) {
						var area_coord = get_area(coord, h, w)
						
						for (var i = 0; i < area_coord.length; i++) {							
							yx_checked = open_area(area_coord[i], f, yx_checked, h, w)
						}
					}
				}
				
				return yx_checked
			}
			// -------------------------------------------------------------------------------------------
			
			
			
			y = Math.abs(event.target.id.split(",")[1])
			x = Math.abs(event.target.id.split(",")[2])
			
			yx_area = open_area([y, x], this.field, [], this.height, this.width)
			
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
				
				cell[i].innerHTML = "*"
			}
			
			this.game_start = false;
		},
		
		// -------- contextmenu function
		
		put_mine: function(event) {
			
			if (this.game_start) {
				
				// put flag
				if (event.target.innerHTML == "e") {
					this.flag_count = this.flag_count + 1
					event.target.innerHTML = "f"
					event.target.classList.add(this.numbers_styles["f"])
				}
				
				// remove flag
				else if (event.target.innerHTML == "f") {
					this.flag_count = this.flag_count - 1
					event.target.innerHTML = "e"
					event.target.classList.remove(this.numbers_styles["f"])
				}
				
				else if (event.target.innerHTML == "1") {
					
				}
			}
			
			event.preventDefault()
			
		}
		
/*
		put_mine: function(event) {
			
			if (event.target.innerHTML == "*") {
				
				this.flag_count = this.flag_count + 1
				event.target.innerHTML = "f"
				event.target.classList.add(this.numbers_styles["f"])

			} else if (event.target.innerHTML == "f") {
				
				this.flag_count = this.flag_count - 1
				event.target.innerHTML = "*"
				event.target.classList.remove(this.numbers_styles["f"])

			}
			
		    event.preventDefault();
		}
*/
		
	}
})


/*
	
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9 - count of mines around
	e - closed cell
	* - mine
	f - user flag

*/
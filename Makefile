start:
	export FLASK_APP=passenger_wsgi.py && \
	python3 -m flask run

restart:
	tocuh tmp/restart.txt
.PHONY: all clean build deploy

all: clean build deploy

clean:
	npm run clean

build:
	npm run build

deploy:
	npm run deploy

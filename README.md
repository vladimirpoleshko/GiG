# GiG - lightweight css lib (gulp version)

## Overview

Builds with Normalize.css instead of Meyerweb reset

Mobile first

Basic styles for simple page styling


## Frontend

1. Run `npm install gulp -g`
2. Run `npm install`.
3. Run `npm run dev` to build templates and start watching for changes on localhost:3000.

## GULP TASKS

1. `gulp watch` watch for changes in sass, images, scripts, templates without browserSync.
2. `gulp build` building full frontend, copying assets after clean, building sass and templates.
3. `gulp serve` running server for browserSync via proxy (localhost:8000 default)

## Development guides

1. All output pages are in public_html folder.
2. Pages partials (head,header,footer,scripts) in src/templates/partials folder.
3. All main styles are in src/assets/scss folder.

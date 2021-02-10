# Conteo
A video-based penpal service powered by data and dedicated to bringing people
together.

## Description
The most fundamental human instinct is to connect with others. In this
uncertain time of COVID-19, that need for connection is being hampered by the
necessities of social distancing. Even after there is a cure or a vaccine for
COVID-19, we anticipate that many people will be hesitant about engaging in
crowded activities, and that social habits will be altered for a long time,
if not permanently. That, combined with the already pervasive political and
cultural rifts in our society, highlights the importance of alternative means
of connecting with others. Our aim is to alleviate the ‘social’ part of
‘social distancing’ and help to turn it instead into merely physical
distancing, by launching a video-based penpals platform.

Our project will create a website for users to match with and send video
correspondence to other users. An intelligent matching system, driven by real
data, will provide key insights into making meaningful connections between
users. We will allow users to create customizable profiles and adjust
matching parameters to their preferences. A clean, intuitive user interface
will guide users and empower them with creative recording and editing tools.
Additionally, a data-driven security system will help ensure users are
following legal guidelines and automate detection and flagging where needed.

### Technical Skills Required
- Backend
  - Django
  - Image processing engine
  - *Storage (Needs discussion)*
  - Linter

- Frontend
  - React
  - Typescript
  - MaterialUI
  - *Some video library*
  - ReactRouter
  - Authentication and token management
  - Redux (maybe)
  - Linter

- Other
  - Git
  - *A CI library with git hooks*
  - Server host (Tux?)
  - *Probably legal stuff*

## Installation
Ensure the following prerequistes are installed:
- npm
- Python ^3.9

### Django
From the root of the project clone, create a python virtual environment

    python3 -m venv venv

Activate the virtual environment

    . venv/bin/activate

Install python dependencies

    pip install -r requirements.txt

Create an .env file under `conteo/` (See `.env.example`)

    touch conteo/.env

Create the database

    ./manage.py migrate

Run the web server

    ./manage.py runserver

### frontend
From `frontend/`, install dependencies

    npm i

Build `main.js` and watch for changes

    npm start

Now you should be able to navigate to `http://localhost:8000` and view the
webpage. Any changes made to python or typescript files should be automatically
rebuilt. Refresh the page to see the changes.

## Making Changes
Before committing changes to python files, be sure to check the code for style
and lint errors with `black`, `isort` and `flake8`. Likewise for typescript
changes, use `npm run lint` and `npm run format`. These tools can likely be
integrated into your editor of choice. Otherwise, the commands can be run
from the terminal to operate on your files. Ensure you add the updated files
to the index before committing again.

Automatic pre-commit checks can be enabled to ensure problems are addressed
before commiting by enabling the git hooks located in the [.hooks/](.hooks)
directory.

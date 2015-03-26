REM Runs automated tasks commonly used during development, such as:
REM   * Starting HTTP server.
REM   * Running Karma Unit Tests.
REM   * Running Gulp "watch" tasks (like ESLint code linting).

start cmd /k "npm start"
start cmd /k "npm test"
start cmd /k "gulp"

exit

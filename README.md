# VersionFinderApp

VersionFinderApp is an Angular-based web application designed to manage and track product releases and their dependencies across multiple projects.

## Features

- Display releases for multiple projects
- Add and remove dependencies between releases
- Filter releases by name, description, or release date

## Prerequisites

- Node.js (v14 or later)
- Angular CLI (v18.2.2)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/VersionFinderApp.git
   cd VersionFinderApp
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Project Structure

The main components of the project are:

- `ProductReleasesComponent`: Manages the display and interaction with releases and dependencies.
- `ReleaseService`: Handles API calls to fetch and update release and dependency data.
- `Release` and `Dependency` models: Define the data structures used in the application.

## API Integration

The application interacts with a backend API running on `http://localhost:3000`. Ensure the backend server is running and accessible.

## Styling

The application uses SCSS for styling. The main styles for the `ProductReleasesComponent` can be found in `src/app/components/product-releases/product-releases.component.scss`.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

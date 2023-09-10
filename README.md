# Gendac Proficiency Assessment

Tayla Orsmond - 2023

## About

This project is a proficiency assessment as part of my application to join Gendac as a graduate developer. It is a simple web application that allows users to view a list of products, add, edit and delete products.

## Built With

![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat-square&logo=angular&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=flat-square&logo=sass&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Angular Material](https://img.shields.io/badge/Angular_Material-007ACC?style=flat-square&logo=angular&logoColor=white)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.1.

## Features

- View a list of products
- Add a new product
- Edit an existing product
- Delete a product (with batch delete functionality)
- Filter products by name, id, price and category
- Sort products by name, id, price and category

The application makes use of a table to display the products since this makes the most sense for a product dashboard application. The table is paginated, and the user can select how many products they would like to view per page.

## Design

![Figma Design](https://img.shields.io/badge/Figma-FF0000?style=flat-square&logo=figma&logoColor=white)  
The Figma design for this project can be found [here](https://www.figma.com/file/mgQNSQarWe5f5dzNzr93RO/Gendac-Proficiency-Assessment---Design?type=design&node-id=0%3A1&mode=design&t=K1CJDJOcKhNBNPNP-1).

## Project Structure

The project is structured as follows:

```
src
├── app
│   ├── confirm-dialog      # Dialog component for confirming product deletion
│   ├── product-dashboard   # Main component for the application
│   ├── product-details     # Component for viewing and editing product details
│   ├── product-list        # Component for viewing a list of products
│   ├── message.service.ts  # Service for displaying messages to the user
│   ├── product.service.ts  # Service for handling product data
│   ├── product.ts          # Product model interface
|   ├── ...
├── assets
├── styles                 # Contains _variables.scss and _mixins.scss as well as a reset file
├── ...
```

*Detailed descriptions of each component and service can be found in each component/service's respective .ts file.*

## Getting Started

### Prerequisites

This project uses the latest LTS versions of Node.js and Angular CLI. You will need to have these installed on your machine to run the project. You can download them here:

- [Node.js](https://nodejs.org/en/)
- [Angular CLI](https://angular.io/cli)

Ensure that you have the latest version of node installed by running the following command:

```sh
node -v
```

### Installation

1. Clone the repo (or alternatively download the zip file and extract it)

   ```sh
   git clone "https://github.com/tayla-orsmond gendac-proficiency-assessment"
    ```

2. Install NPM packages

    ```sh
    npm install
    ```

3. Run the project

    ```sh
    ng serve
    ```

    This will run the project in development mode.
4. Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any of the source files.

## Running unit tests

Unit tests are available for the `confirm-dialog` and `product-details` components.

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io). Due to time constraints, only a few basic unit tests have been written for this project. The tests can be found in the each component's respective `.spec.ts` file in their respective folders.

# PubMed Publication Search Project

A simple single-page application built with React and Flask to allow users to query for publications on PubMed and view information about the search results.

Main files created for this project:

- `backend/`: Directory containing the Flask backend server code.

  - `server.py`: Backend server script providing endpoints for searching PubMed publications and retrieving publication details.

  - `requirements.txt`: File listing the Python dependencies required for the backend server.

- `frontend/`: Directory containing the React frontend SPA code.

  - `src/`: Directory containing the source code of the React application.

    - `App.js`: Main component of the React application, handling the overall structure and logic. Makes calls to the `/search` and `/deails` endpoints in the Flask server, and passes the results to the necessary components.

    - `SearchForm.js`: Component for the search form, allowing users to input search queries.

    - `ResultsList.js`: Component for displaying search results and publication details. Makes calls to the `/details` endpoint in the Flask sever.

- `README.md`: This file, containing information about the project, its functionalities, and usage instructions.

## Technologies Used

- React: Frontend JavaScript library for building user interfaces.
- Axios: Promise-based HTTP client for making requests from the frontend.
- Flask: Backend web framework for Python.
- E-utilities API: National Center for Biotechnology Information (NCBI) API for querying publications.

### Backend Server

The backend server is built with Flask, a Python web framework. It provides two main endpoints:

1. **Search Endpoint** (`/search`):

   - Files created: `server.py`

   - **Method:** `POST`
   - **Parameters:**
     - `query` (string): The search query.
     - `retstart` (integer, optional): Pagination offset (default: 0).
     - `retmax` (integer, optional): Total number of results to be shown (default: 0).
   - **Functionality:** Performs a search query on PubMed using the provided query string and returns a list of PubMed IDs (PMIDs) matching the query.

2. **Details Endpoint** (`/details`):
   - **Method:** `GET`
   - **Parameters:**
     - `ids` (list of strings): List of PubMed IDs (PMIDs) for which detailed information is requested.
     - `fields` (list of strings, optional): Fields to be returned. By default, all fields are given. The following fields can be specified:
       - ["PMID", "Title", "Abstract", "AuthorList", "Journal", "PublicationYear", "MeSHTerms"]
   - **Functionality:** Retrieves detailed information about PubMed publications with the specified PMIDs, including title, abstract, authors, journal, publication year, and MeSH terms.

### Frontend Application

The frontend single-page application is developed with React, a JavaScript library for building user interfaces. It provides the following functionality:

1. **Search Form:**

   - Allows users to input a search query and submit it to search PubMed publications.

2. **Results List:**

   - Displays a list of search results, including basic information such as title and publication year.
   - Supports pagination for browsing through search results pages.
   - Enables users to view detailed information about a selected publication, by clicking the "View Details" button next to each result.
     - Shows detailed information about a selected publication, including title, abstract, authors, journal, publication year, and MeSH terms.
     - Provides a link to the original webpage of each publication on PubMed for further reference.

## Usage

To run this application, download this repo and follow these setup steps:

1. **Backend Server:**

   - Navigate to the `backend` directory.
   - Install dependencies using `pip install -r requirements.txt`.
   - Run the server with `python server.py`.

2. **Frontend SPA:**
   - Navigate to the `frontend` directory.
   - Install dependencies using `npm install`.
   - Run the application with `npm start`.
   - Access the application in your web browser at `http://localhost:3000`.

### Notes

- Ensure that the backend server is running before accessing the frontend SPA.
- The frontend SPA communicates with the backend server to perform search queries and retrieve publication details.

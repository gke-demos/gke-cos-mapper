# GKE to COS Mapper - Development Plan

This document outlines the development plan followed to build the GKE to COS Version Mapper application, based on the series of user requests.

## 1. Initial Application Requirements (MVP)

The initial goal was to build a single-page, single-file HTML web application to map GKE versions to their corresponding Container-Optimized OS (COS) versions.

* **Data:**
    * **Source:** Fetch data from `https://www.gstatic.com/gke-image-maps/gke-to-cos.json` on initial page load.
    * **Fields:** Parse the data, identifying `gke_version` as the key and `image` as the value.
    * **Schema:** The data source provides a root JSON object containing an `entries` key, which holds the array of version mappings. The plan must account for parsing this nested structure.
* **Core UI & Functionality:**
    * **Dropdown:** Create an HTML `<select>` dropdown.
    * **Table:** Create an HTML `<table>` with two columns: "GKE Version" and "COS Version".
    * **Interaction:** When a user selects a version from the dropdown, the table must be populated with all matching entries.
* **Key Feature Requirements:**
    * **Dropdown Population:** The dropdown must be dynamically populated from the fetched data. It must contain two distinct groups (`<optgroup>`):
        1.  **Full GKE Versions:** Every unique `gke_version` string (e.g., `1.30.5-gke.100`).
        2.  **Minor Wildcards:** A derived list of unique minor versions (e.g., `1.30`) displayed as `1.30.x`.
    * **Wildcard Filtering:** Selecting a minor wildcard (e.g., `1.30.x`) must filter the table to show *all* entries where the `gke_version` starts with `1.30.`.
    * **COS Version Linking:** The "COS Version" text in the results table must be a functional hyperlink to the Google Cloud release notes. The link format must be dynamically constructed.
        * **Example Input:** `cos-121-18867-199-52`
        * **Example Output URL:** `https://cloud.google.com/container-optimized-os/docs/release-notes/m121#cos-121-18867-199-52_`
    * **Data Refresh:** Include a "Refresh Data" button that re-fetches the JSON data and repopulates the dropdown without requiring a full page reload.
* **Design:**
    * Use Tailwind CSS for a minimalistic, clean, and user-friendly interface.

## 2. Debugging & Iteration Plan

This phase addressed data-loading failures and implementation clarifications based on user feedback.

1.  **Problem: "Failed to fetch" Error.**
    * **Analysis:** This is a standard Cross-Origin Resource Sharing (CORS) browser security error. The browser is blocking the request from the web app's domain to `gstatic.com`.
    * **Solution:** Implement a CORS proxy. The plan is to prepend `https://corsproxy.io/?` to the original data URL to bypass this restriction.

2.  **Problem: "Data not in expected array format" Error.**
    * **Analysis:** The initial fix attempt (Step 2.1) failed. The error, combined with user clarification, revealed the root cause: The code was treating the entire JSON *response object* as an array, but the data is nested.
    * **Solution (The Correct Fix):** Modify the `loadData` function.
        1.  Fetch the data from the proxy.
        2.  Parse the full JSON response.
        3.  Access the `entries` property from the parsed object (`jsonData.entries`).
        4.  Use this `entriesArray` as the master list for all further processing.

## 3. Containerization Plan (Cloud Run)

The final requirement was to package the application to run on Cloud Run. This requires creating a container that serves the static `gke-cos-mapper.html` file via a web server.

1.  **Create `server.js`:**
    * Use Node.js and the Express framework.
    * Configure Express to serve all static files from a directory named `/static`.
    * Configure the Dockerfile to rename `gke-cos-mapper.html` to `index.html` and place it inside `/static`.
    * Add a wildcard route (`app.get('*', ...)`) to serve `index.html` for all other requests. This ensures the app loads correctly.
    * Listen on the port specified by the Cloud Run environment variable (`process.env.PORT`) or default to `8080`.

2.  **Create `package.json`:**
    * Define the project, add `express` as the single production dependency.
    * Create a `start` script (`node server.js`) that the `Dockerfile` will use as its entry point.

3.  **Create `Dockerfile`:**
    * Use a lightweight `node:20-alpine` base image.
    * Set the working directory to `/app`.
    * Copy `package.json` and run `npm install --omit=dev` to install only production dependencies.
    * Create the `/app/static` directory.
    * Copy `server.js` to `/app/`.
    * Copy the `gke-cos-mapper.html` file from the build context into the container at `/app/static/index.html`.
    * Set the final `CMD` to `[ "npm", "start" ]`.

4.  **Create `.dockerignore`:**
    * Exclude `node_modules`, `.git`, and the `Dockerfile` itself to ensure a fast, clean build context.

## 4. UI & Theming Update

This phase implements a visual redesign to align with the Google Cloud brand identity.

1.  **Theme Change:** Convert the application from an initial dark-mode theme to a light-mode theme using a clean `bg-white` card on a `bg-gray-50` body.
2.  **Color Palette Update:** Apply Google-inspired colors (Tailwind's `blue-600`) to primary interactive elements, including the "Refresh Data" button and the COS version hyperlinks in the results table.
3.  **UI Fix (Logo):** Replaced the initial, incorrect placeholder SVG (which rendered as a solid blue hexagon) with the exact SVG markup provided by the user to display the correct, multi-color official GKE logo.
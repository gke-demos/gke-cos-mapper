# GKE to COS Version Mapper

## Description

This application is a simple utility that provides a user-friendly way to find the specific Container-Optimized OS (COS) version associated with any given Google Kubernetes Engine (GKE) version.

It fetches the official version map from Google and displays it in a clean, filterable interface.

### How to Use

1.  When the application loads, it automatically fetches the latest version data and populates the dropdown menu.
2.  Click the **"Select GKE Version"** dropdown to see all available versions. These are organized into two groups:
    * **Minor Versions (Wildcard):** Choose an option like `1.30.x` to see *all* COS versions that have run on any GKE 1.30.x patch release. This is useful for seeing the history of a minor channel.
    * **Full GKE Versions:** Choose a specific patch version like `1.30.5-gke.100` to see the single, exact COS version it maps to.
3.  The table will instantly update to show your filtered results.
4.  The **COS Version** listed in the table is a clickable link that will take you directly to that image's specific entry in the official Google Cloud Release Notes.
5.  Click the **"Refresh Data"** button at any time to fetch the newest version list from Google without needing to reload the webpage.

## Build | Run | Deploy

### Run Locally

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Run the application:
    ```bash
    npm start
    ```
    The application will be available at http://localhost:8080.

### Build Docker Image

```bash
docker build -t gke-cos-mapper .
```

### Run Docker Image Locally

```bash
docker run -p 8080:8080 gke-cos-mapper
```
The application will be available at http://localhost:8080.

### Deploy to Cloud Run

1.  Deploy the application:
    ```bash
    gcloud run deploy gke-cos-mapper --source . --allow-unauthenticated
    ```
2.  Access the application at the URL provided by Cloud Run.
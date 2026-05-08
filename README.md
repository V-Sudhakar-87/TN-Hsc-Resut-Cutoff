# Tamil Nadu HSC Results Portal

Tamil Nadu HSC Results Portal is a full-stack web application that fetches student results from the official TN Results website and displays them in a clean and responsive interface.

The application automatically calculates:

* Engineering Cutoff
* Medical Cutoff
* PASS / FAIL Status
* Total Marks
* Percentage

It also supports PDF result download and responsive mobile design.

---

## Features

* Official TN HSC Result Fetch
* Real-Time Result Scraping
* Engineering Cutoff Calculation
* Medical Cutoff Calculation
* PASS / FAIL Detection
* PDF Download Support
* Responsive UI Design
* Result Cache System
* Government Portal Style Interface

---

## Technologies Used

* Node.js
* Express.js
* HTML5
* CSS3
* JavaScript
* Axios
* Cheerio
* html2pdf.js

---

## How It Works

1. User enters Register Number and Date of Birth
2. Backend connects to the official TN Results website
3. Student result data is scraped from the result page
4. Marks are processed and cutoff values are calculated
5. Results are displayed in a responsive result card
6. User can download the result as PDF

---

## Cutoff Logic

### Engineering Cutoff

Maths + (Physics + Chemistry) / 2

### Medical Cutoff

Biology + (Physics + Chemistry) / 2

---

## PASS / FAIL Logic

* If any subject mark is below 35 → FAIL
* If total marks are below 210 → FAIL
* FAIL students will not receive cutoff calculations

---

## Run Locally

```bash
npm install
node server.js
```

Open:

```bash
http://localhost:5000
```

---

## Folder Structure

```bash
project/
│
├── backend/
│   ├── server.js
│   ├── scraper.js
│   ├── cache.js
│   ├── package.json
│   │
│   └── public/
│       ├── index.html
│       ├── style.css
│       ├── script.js
│       │
│       └── image/
│           └── images.png
```

---

## Disclaimer

This project fetches publicly available examination result data from the official Tamil Nadu Results website for educational and demonstration purposes only.

All result data belongs to the Directorate of Government Examinations, Tamil Nadu.


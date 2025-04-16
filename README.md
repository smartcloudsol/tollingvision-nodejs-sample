# 🌐 TypeScript Sample Application for Tolling Vision

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-12%2B-brightgreen)](https://nodejs.org/)
[![npm](https://img.shields.io/npm/v/typescript)](https://www.npmjs.com/)

This repository contains a sample **Node.js / TypeScript** application that demonstrates how to use [Tolling Vision](https://tollingvision.com) — a Dockerized AI-powered service for tolling companies. Tolling Vision extracts valuable information from vehicle images or image sequences, including:

- **ANPR/ALPR** – Automatic Number Plate Recognition  
- **MMR** – Make and Model Recognition  
- **ADR** – Dangerous Goods Sign Recognition

Tolling Vision is highly scalable and integrates easily into existing systems via **gRPC**. For integration guidance, visit the [How to use Tolling Vision](https://tollingvision.com/how-to-use-tolling-vision/) tutorial.

This sample specifically demonstrates usage of the `search` function of the `TollingVisionService`, ideal for simpler analysis workflows where a single image is used to detect a license plate and extract MMR information.

---

## ✅ Prerequisites

Ensure the following are installed:

- **Node.js** (v12.0.0 or later)
- **npm** (v6.0.0 or later)

---

## 🚀 Getting Started

### 1. 📦 Clone the Repository

```bash
git clone https://github.com/smartcloudsol/tollingvision-nodejs-sample.git
cd tollingvision-nodejs-sample
```

### 2. 🛠️ Install & Build the Project

```bash
npm install
npm run build
```

### 3. ▶️ Run the Sample

```bash
npm run dev
```

Once the application is running, open your browser and navigate to the Demo page (e.g., `http://localhost:3000`) to test image upload and analysis.

---

## 📎 Resources

- [Official Website](https://tollingvision.com)
- [How to Use Tolling Vision](https://tollingvision.com/how-to-use-tolling-vision/)
- [Get Started Guide](https://tollingvision.com/get-started)

---

## 🛠️ License

This project is provided for demonstration purposes.  
Licensed under the [MIT License](./LICENSE).

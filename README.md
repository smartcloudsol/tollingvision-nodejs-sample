# TypeScript Example Program for Tolling Vision

This repository contains a sample Node.js / TypeScript application that demonstrates how to use [Tolling Vision](https://tollingvision.com). Tolling Vision is a Dockerized service for tolling companies, utilizing AI-based recognition engines. It extracts ANPR/ALPR (Automatic Number Plate Recognition), MMR (Make and Model Recognition), and ADR (Dangerous Goods Signs Recognition) information from images and image sequences.

Tolling Vision is highly scalable and can be easily integrated into existing systems via gRPC. For detailed instructions on how to integrate it, please refer to our [How to use Tolling Vision](https://tollingvision.com/how-to-use-tolling-vision/) tutorial. The sample program in this repository specifically utilizes the `search` function of the TollingVisionService. This function is designed for simple image analysis scenarios, processing an image of a vehicle to determine the license plate and to extract MMR (Make and Model Recognition) information.

## 💻 Prerequisites

Before getting started, ensure you have the following prerequisites installed:

Node.js (>=12.0.0)
npm (>=6.0.0)

## 📋 Instructions

### 👨‍💻 Clone the Repository

To clone the repository, use the following commands:

```bash
git clone https://github.com/smartcloudsol/tollingvision-nodejs-sample.git
cd tollingvision-nodejs-sample
```

### 💻 Build the project

Use npm to install dependencies and build the project:

```bash
npm install && npm run build
```

### 🚘 Run the Sample

You can run the application using the following command:

```bash
npm run dev
```

Once the application is running, you can open the Demo page in your browser.

For more examples, please visit our [Get Started](https://tollingvision.com/get-started) page.

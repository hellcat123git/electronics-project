# 1N4007 Diode V-I Simulation

A visually stunning, interactive web application that simulates the Voltage-Current (V-I) characteristics of a standard 1N4007 silicon diode. 

Built with React, Vite, Tailwind CSS v4, and Recharts, this educational tool allows users to explore both the Forward and Reverse bias states of a diode in real-time.

## Features
* **Interactive Control Panel**: Smooth sliders and toggles to adjust input voltage.
* **Real-time V-I Graph**: Dynamic Cartesian coordinate graph tracing the current and voltage.
* **Animated Circuit Diagram**: A live SVG circuit representation showing current flow (when past the knee voltage) and reverse bias blockage.
* **Accurate Approximations**: Uses mathematical modeling (Shockley diode equation approximations) to accurately represent the 0.7V knee voltage and reverse leakage current.

## Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

## Installation & Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/hellcat123git/electronics-project.git
   cd electronics-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **View the app:**
   Open your browser and navigate to the local URL provided in the terminal (usually `http://localhost:5173`).

## Technologies Used
* **React** + **Vite**
* **Tailwind CSS v4** for styling
* **Recharts** for live graphing
* **Framer Motion** for buttery-smooth animations

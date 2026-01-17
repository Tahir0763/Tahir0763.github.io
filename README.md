# Tahir Hussain | Data Scientist & AI Engineer Portfolio

A cutting-edge, interactive portfolio website showcasing expertise in Data Science, Machine Learning, and AI Engineering. This project features a modern, responsive design with 3D elements and an integrated AI chatbot powered by Google's Gemini API.

## 🚀 Features

*   **Interactive 3D Experience**: Features a 3D hologram model powered by React Three Fiber.
*   **AI-Powered Chat Assistant**: An integrated chatbot ("Nexus") capable of answering questions about my experience and skills, powered by Google Gemini.
*   **Dynamic CV Generator**: Built-in utility to generate and download a professionally formatted PDF resume on demand.
*   **Project Showcase**: Filterable gallery of data and AI projects with detailed descriptions and links.
*   **Responsive Design**: Fully optimized for seamless viewing on desktops, tablets, and mobile devices.
*   **Secure Deployment**: Automated deployment pipeline via GitHub Actions with secure API key management.

## 🛠️ Tech Stack

*   **Frontend Framework**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/) - Ensuring fast development and optimized builds.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) - For modern, responsive styling.
*   **AI Integration**: [Google Gemini API](https://deepmind.google/technologies/gemini/) - Powering the intelligent chat interface.
*   **3D Graphics**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) & [Drei](https://github.com/pmndrs/drei) - For rendering 3D assets.
*   **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) - custom utility for client-side PDF creation.
*   **Icons**: [Lucide React](https://lucide.dev/) - Beautiful, consistent icon set.

## 💻 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Tahir0763/Tahir-Hussain-Portfolio.git
    cd Tahir-Hussain-Portfolio
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your Google Gemini API key:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```

## 📦 Deployment

This project is configured for automated deployment to **GitHub Pages**.

*   Any push to the `main` branch triggers the GitHub Actions workflow in `.github/workflows/deploy.yml`.
*   The site is built and deployed to the `gh-pages` branch effectively serving the content.

## 📬 Contact

**Tahir Hussain**

*   [LinkedIn](https://www.linkedin.com/in/tahir-hussain-487107293/)
*   [GitHub](https://github.com/Tahir0763)
*   Email: [tahirhussain0307@gmail.com](mailto:tahirhussain0307@gmail.com)

---

© 2024 Tahir Hussain. All Rights Reserved.

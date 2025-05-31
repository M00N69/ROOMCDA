# Plan for Interactive MCDA Regulation Application

## Overall Goal
Create a new web application (HTML, CSS, JS) that guides users to relevant food contact material regulations based on their input. The application will be entirely in French, with particular emphasis on detailed information for metals and plastics.

## Phase 1: Information Gathering and Structure Definition

### Goal 1.1: Extract and Consolidate Regulatory Information
I will use the comprehensive data from `ania-cetim-2022 MEMENTO MCDA.txt` and `Actia-guide-aptitude-des-emballages-au-contact-des-aliments-2019-2.txt` to build a robust data model. This will include:
*   General EU regulations (e.g., `REG_1935_2004`, `REG_2023_2006`).
*   Specific EU regulations for harmonized materials (e.g., plastics, active/intelligent materials, cellulose, ceramics).
*   National (French) regulations and recommendations (e.g., specific arrêtés for rubber, silicone, aluminum, stainless steel, DGCCRF fiches).
*   Council of Europe resolutions and EDQM guides for non-harmonized materials (e.g., metals, paper/carton, cork, glass, textiles, waxes, adhesives, inks).
*   Associated risks, migration limits (LMG/LMS), and relevant norms/standards for each material.

### Goal 1.2: Define the Application's Data Model (`data.json`)
I will create a single, well-structured JSON file (`data.json`) to store all this regulatory data. The structure will be designed for efficient querying based on material type, food type, and contact conditions.

## Phase 2: Application Design and Prototyping (Current Mode: Architect)

### Goal 2.1: Design the User Interface (UI) Flow
The application will guide the user through a series of interactive steps:
1.  **Welcome Page:** Introduction to the application and its purpose.
2.  **Material Selection:** User selects the primary material type (e.g., Plastiques, Métaux, Bois, Céramiques, Papier/Carton, etc.).
3.  **Conditional Questions:** Based on the selected material, the application will ask further relevant questions (e.g., "Est-ce du plastique recyclé ?", "Est-ce du verre décoré ?", "Le bois est-il traité ?").
4.  **Food Type and Contact Conditions:** User specifies the type of food (aqueux, acide, gras, sec) and the contact conditions (température, durée).
5.  **Results Display:** The application will present a summary of the relevant EU and national regulations, recommendations, applicable migration limits, and potential risks for the specified material and conditions.
6.  **Detailed Information:** Users can click on specific regulations or topics to view more detailed information, including links to original texts or relevant guides.

### Goal 2.2: Plan HTML Structure (`index.html`)
*   A clear header for the application title.
*   A sidebar for main material navigation.
*   A dynamic main content area to display questions, input forms, and regulatory results.
*   A footer for general information.

### Goal 2.3: Plan CSS Styling (`style.css`)
*   A clean, professional design with a consistent color palette (e.g., using CETIM blue as a primary accent).
*   Responsive design for optimal viewing on various devices.
*   Clear visual hierarchy for headings, text, and interactive elements.
*   Styling for information cards, tables, and lists to enhance readability.

### Goal 2.4: Plan JavaScript Logic (`script.js`)
*   **Data Loading:** Load `data.json` into the application.
*   **Dynamic UI Generation:** Populate the sidebar and main content area dynamically based on user selections.
*   **Filtering and Logic:** Implement the core logic to process user inputs and identify the most relevant regulations. This will involve conditional rendering of questions and results.
*   **Content Rendering:** Functions to format and display the regulatory information, risks, and references in an easily digestible manner.
*   **Navigation Management:** Handle transitions between different steps/pages of the application.

## Phase 3: Implementation (Switch to Code Mode)

### Goal 3.1: Create `index.html`
Develop the foundational HTML structure.

### Goal 3.2: Create `style.css`
Apply the visual design.

### Goal 3.3: Create `script.js`
Write the JavaScript code for interactivity, data processing, and dynamic content generation.

### Goal 3.4: Create `data.json`
Populate this file with the consolidated regulatory information.

## Phase 4: Review and Refinement

### Goal 4.1: Testing
Thoroughly test the application to ensure all functionalities work correctly and the information displayed is accurate.
### Goal 4.2: Content Validation
Verify that the regulatory information presented is consistent with the source documents.

## Application Flow Diagram

```mermaid
graph TD
    A[Démarrer: Page d'Accueil] --> B{Sélectionner le Type de Matériau};
    B -- Plastiques --> C{Est-ce Recyclé?};
    B -- Métaux --> D{Est-ce de l'Acier Inoxydable ou de l'Aluminium?};
    B -- Céramiques/Verre --> E{Est-ce Décoré/Cristal?};
    B -- Bois --> F{Est-ce Traité?};
    B -- Autres Matériaux --> G[Afficher les Réglementations Générales];

    C -- Oui/Non --> H{Sélectionner le Type d'Aliment};
    D -- Oui/Non --> H;
    E -- Oui/Non --> H;
    F -- Oui/Non --> H;
    G -- (si applicable) --> H;

    H -- Aqueux/Acide/Gras/Sec --> I{Sélectionner les Conditions de Contact};
    I -- Température/Durée --> J[Afficher les Réglementations Pertinentes & Risques];

    J --> K{Voir les Détails / Références};
    K --> J;
document.addEventListener('DOMContentLoaded', () => {
    const materialList = document.getElementById('material-list');
    const contentArea = document.getElementById('content-area');
    let materialsData = {};

    // Load the data from data.json
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            materialsData = data;
            populateMaterialList();
        })
        .catch(error => {
            console.error('Error loading materials data:', error);
            contentArea.innerHTML = '<p>Erreur lors du chargement des données réglementaires.</p>';
        });

    // Function to populate the material list in the sidebar
    function populateMaterialList() {
        materialList.innerHTML = '';
        // Assuming materialsData is an object where keys are material identifiers
        const sortedMaterialKeys = Object.keys(materialsData).sort(); // Simple alphabetical sort for now

        sortedMaterialKeys.forEach(materialKey => {
            // Basic check if the material data exists and has a name property
            if (materialsData[materialKey] && materialsData[materialKey].name) {
                const listItem = document.createElement('li');
                listItem.textContent = materialsData[materialKey].name;
                listItem.setAttribute('data-material-key', materialKey);
                materialList.appendChild(listItem);
            }
        });

        // Add event listeners to the material list items
        materialList.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', handleMaterialClick);
        });
    }

    // Function to handle clicks on material list items
    function handleMaterialClick(event) {
        const materialKey = event.target.getAttribute('data-material-key');
        // Remove active class from all list items
        materialList.querySelectorAll('li').forEach(item => item.classList.remove('active'));
        // Add active class to the clicked item
        event.target.classList.add('active');
        // Load and display content for the selected material
        displayMaterialContent(materialKey);
    }

    // Define a simple question flow structure (will be moved to data.json later)
    const questions = {
        'plastiques_q1': { // Renamed for consistency
            id: 'plastiques_q1',
            text: 'Est-ce du plastique recyclé ?',
            options: [
                { text: 'Oui', next: 'food_type_question' },
                { text: 'Non', next: 'food_type_question' }
            ]
        },
        'metaux_alliages_q1': { // Renamed for consistency
            id: 'metaux_alliages_q1',
            text: 'Quel type de métal/alliage utilisez-vous ?', // More general question
            options: [
                { text: 'Acier Inoxydable', next: 'food_type_question' },
                { text: 'Aluminium', next: 'food_type_question' },
                { text: 'Autre Métal/Alliage', next: 'food_type_question' }
            ]
        },
        'food_type_question': {
            id: 'food_type_question',
            text: 'Quel est le type d\'aliment en contact ?',
            options: [
                { text: 'Aqueux', next: 'contact_conditions_question' },
                { text: 'Acide', next: 'contact_conditions_question' },
                { text: 'Gras', next: 'contact_conditions_question' },
                { text: 'Sec', next: 'contact_conditions_question' }
            ]
        },
        'contact_conditions_question': {
            id: 'contact_conditions_question',
            text: 'Quelles sont les conditions de contact (température, durée) ?',
            options: [
                { text: 'Courtes et Froides (< 5°C, < 30 min)', next: 'display_results' },
                { text: 'Longues et Tempérées (> 5°C, > 30 min)', next: 'display_results' },
                { text: 'Haute Température (> 70°C)', next: 'display_results' }
            ]
        }
    };

    // Function to display a question
    function displayQuestion(questionId) {
        const question = questions[questionId];
        if (!question) {
            console.error('Question not found:', questionId);
            // Fallback or error message
            contentArea.innerHTML = '<h2>Erreur dans le questionnaire.</h2>';
            return;
        }

        contentArea.innerHTML += `<h3>${question.text}</h3>`; // Append question
        const optionsList = document.createElement('ul');
        optionsList.style.listStyle = 'none'; // Remove bullet points
        optionsList.style.padding = '0';

        question.options.forEach(option => {
            const listItem = document.createElement('li');
            listItem.textContent = option.text;
            listItem.style.cursor = 'pointer';
            listItem.style.padding = '8px 0';
            listItem.style.borderBottom = '1px solid #eee';
            listItem.addEventListener('click', () => handleAnswer(question.id, option.text, option.next));
            optionsList.appendChild(listItem);
        });
        contentArea.appendChild(optionsList);
    }

    // Function to handle user answer
    let userSelections = {}; // Store user answers

    function handleAnswer(currentQuestionId, answer, nextStep) {
        console.log(`Answered "${answer}" for question "${currentQuestionId}". Next step: ${nextStep}`);

        // Store the answer
        userSelections[currentQuestionId] = answer;

        // Clear previous question options (optional, for cleaner UI)
        // Find the last ul and remove it
        const lastUl = contentArea.querySelector('ul:last-of-type');
        if (lastUl) {
            lastUl.remove();
        }


        if (nextStep === 'display_results') {
            displayResults(); // Implement this function
        } else if (questions[nextStep]) {
            displayQuestion(nextStep); // Move to the next question
        } else {
            // If nextStep is not a recognized question ID, assume it's time to display results
            console.warn('Unknown next step:', nextStep, 'Defaulting to display results.');
            displayResults();
        }
    }

    // Function to display results
    function displayResults() {
        contentArea.innerHTML = '<h2>Résultats</h2>'; // Clear previous content and add results title
        console.log("User Selections:", userSelections);

        // Get the selected material key from userSelections (assuming it's stored somewhere, e.g., in a variable set during material click)
        // For now, let's assume the materialKey is stored in a global variable or accessible scope
        // In a real app, you'd pass it or retrieve it based on the UI state.
        // Let's add a temporary variable for the selected material key for demonstration
        const selectedMaterialKey = Object.keys(userSelections)[0]; // Assuming the first question is material-specific

        if (!selectedMaterialKey || !materialsData[selectedMaterialKey]) {
             contentArea.innerHTML += '<p>Impossible d\'afficher les résultats sans sélection de matériau.</p>';
             return;
        }

        const material = materialsData[selectedMaterialKey];

        // Display relevant regulations
        if (material.regulations && material.regulations.length > 0) {
            const regulationsTitle = document.createElement('h3');
            regulationsTitle.textContent = 'Réglementations Applicables';
            contentArea.appendChild(regulationsTitle);

            const regulationsList = document.createElement('ul');
            regulationsList.classList.add('styled-list');
            material.regulations.forEach(regKey => {
                if (materialsData[regKey]) {
                    const regItem = document.createElement('li');
                    regItem.innerHTML = `<strong>${materialsData[regKey].name} (${materialsData[regKey].scope})</strong>: ${materialsData[regKey].summary}`;
                    if (materialsData[regKey].link) {
                         regItem.innerHTML += ` <a href="${materialsData[regKey].link}" target="_blank"><i class="fas fa-external-link-alt"></i></a>`;
                    }
                    // TODO: Add filtering logic based on userSelections (food type, conditions)
                    regulationsList.appendChild(regItem);
                }
            });
            contentArea.appendChild(regulationsList);
        }

        // Display relevant risks
        if (material.risks && material.risks.length > 0) {
            const risksTitle = document.createElement('h3');
            risksTitle.textContent = 'Risques Potentiels';
            contentArea.appendChild(risksTitle);

            const risksList = document.createElement('ul');
             risksList.classList.add('styled-list');
            material.risks.forEach(riskKey => {
                 if (material.details && material.details[riskKey]) {
                    const riskItem = document.createElement('li');
                    riskItem.innerHTML = `<strong>${material.details[riskKey].name}</strong>: ${material.details[riskKey].summary}`;
                     // TODO: Add filtering logic based on userSelections (food type, conditions)
                    risksList.appendChild(riskItem);
                 }
            });
            contentArea.appendChild(risksList);
        }

        // Display other relevant details (limits, tests, etc.)
         if (material.details) {
             const detailsTitle = document.createElement('h3');
             detailsTitle.textContent = 'Détails et Exigences Spécifiques';
             contentArea.appendChild(detailsTitle);

             for (const detailKey in material.details) {
                 // Skip regulations and risks as they are handled above
                 if (material.regulations.includes(detailKey) || material.risks.includes(detailKey)) {
                     continue;
                 }

                 const detail = material.details[detailKey];
                 const detailElement = document.createElement('div');
                 detailElement.classList.add('info-card'); // Use a class for styling

                 detailElement.innerHTML = `<h4>${detail.name}</h4><p>${detail.summary}</p>`;

                 if (detail.link) {
                     detailElement.innerHTML += `<p>Lien: <a href="${detail.link}" target="_blank">${detail.link}</a></p>`;
                 }

                 if (detail.details) {
                     const detailsList = document.createElement('ul');
                     detailsList.classList.add('styled-list');
                     if (Array.isArray(detail.details)) {
                         detail.details.forEach(item => {
                             const listItem = document.createElement('li');
                             if (typeof item === 'object') {
                                 listItem.textContent = Object.entries(item).map(([key, value]) => `${key}: ${value}`).join(', ');
                             } else {
                                 listItem.textContent = item;
                             }
                             detailsList.appendChild(listItem);
                         });
                     } else {
                          const listItem = document.createElement('li');
                          listItem.textContent = detail.details;
                          detailsList.appendChild(listItem);
                     }
                      detailElement.appendChild(detailsList);
                 }

                  if (detail.details_table) {
                      const table = document.createElement('table');
                      const thead = document.createElement('thead');
                      const tbody = document.createElement('tbody');
                      const headerRow = document.createElement('tr');

                      if (detail.details_table.length > 0) {
                          Object.keys(detail.details_table[0]).forEach(header => {
                              const th = document.createElement('th');
                              th.textContent = header;
                              headerRow.appendChild(th);
                          });
                          thead.appendChild(headerRow);
                          table.appendChild(thead);

                          detail.details_table.forEach(rowData => {
                              const tr = document.createElement('tr');
                              Object.values(rowData).forEach(cellData => {
                                  const td = document.createElement('td');
                                  td.textContent = cellData;
                                  tr.appendChild(td);
                              });
                              tbody.appendChild(tr);
                          });
                          table.appendChild(tbody);
                          detailElement.appendChild(table);
                      }
                  }

                 contentArea.appendChild(detailElement);
             }
         }

        // TODO: Implement filtering logic based on userSelections (food type, conditions)
        // This will involve checking the 'scope', 'material_scope', 'food_type', 'contact_conditions'
        // or other relevant properties in the data.json entries against userSelections.
        // For now, all details are displayed.
    }


    // Function to display content for the selected material
    let currentMaterialKey = null; // Variable to store the currently selected material key

    function displayMaterialContent(materialKey) {
        currentMaterialKey = materialKey; // Store the selected material key
        contentArea.innerHTML = ''; // Clear previous content

        const material = materialsData[materialKey];
        const title = document.createElement('h2');
        title.textContent = material.name;
        contentArea.appendChild(title);

        if (material.description) {
            const description = document.createElement('p');
            description.textContent = material.description;
            contentArea.appendChild(description);
        }

        // Reset user selections for a new material
        userSelections = {};
        userSelections[materialKey] = material.name; // Store the selected material

        // Initial call to start the flow based on material
        if (materialKey === 'plastiques') {
             displayQuestion('plastiques_q1');
        } else if (materialKey === 'metaux_alliages') {
             displayQuestion('metaux_alliages_q1');
        }
        else {
             // For other materials, skip material-specific questions and go directly to food type
             displayQuestion('food_type_question');
        }
    }


    // Initial content display (optional, could be a welcome message)
     contentArea.innerHTML = '<h2>Bienvenue</h2><p>Sélectionnez un matériau dans la liste pour commencer.</p>';
});
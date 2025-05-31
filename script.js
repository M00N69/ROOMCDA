document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const materialNavigation = document.getElementById('material-navigation');
    let materialsData = {};

    // Function to load data.json
    async function loadData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            materialsData = await response.json();
            console.log('Data loaded:', materialsData);
            renderMaterialNavigation();
        } catch (error) {
            console.error('Error loading data:', error);
            mainContent.innerHTML = `<p>Erreur lors du chargement des données: ${error.message}</p>`;
        }
    }

    // Function to render material navigation in the sidebar
    function renderMaterialNavigation() {
        const ul = document.getElementById('material-list'); // Use the existing ul
        ul.innerHTML = ''; // Clear previous content

        for (const materialKey in materialsData) {
            const material = materialsData[materialKey];
            const li = document.createElement('li');
            li.textContent = material.name;
            li.dataset.materialKey = materialKey;
            li.addEventListener('click', () => {
                showMaterialPage(materialKey);
            });
            ul.appendChild(li);
        }
    }

    // Function to show a specific material page
    function showMaterialPage(materialKey) {
        // Remove active class from all pages and navigation links
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.querySelectorAll('#material-list li').forEach(link => link.classList.remove('active'));

        // Add active class to the current navigation link
        const currentNavLink = document.querySelector(`#material-list li[data-material-key="${materialKey}"]`);
        if (currentNavLink) {
            currentNavLink.classList.add('active');
        }

        let materialPage = document.getElementById(`page-${materialKey}`);
        if (!materialPage) {
            materialPage = document.createElement('section');
            materialPage.id = `page-${materialKey}`;
            materialPage.classList.add('page');
            mainContent.appendChild(materialPage);
        }

        renderMaterialContent(materialKey, materialPage);
        materialPage.classList.add('active');
    }

    // Function to render content for a specific material
    function renderMaterialContent(materialKey, pageElement) {
        const material = materialsData[materialKey];
        if (!material) {
            pageElement.innerHTML = `<h2>Matériau non trouvé</h2><p>Les informations pour "${materialKey}" ne sont pas disponibles.</p>`;
            return;
        }

        let htmlContent = `<h2>${material.name}</h2>`;

        // Display general regulations if available
        if (material.general_regulations && material.general_regulations.length > 0) {
            htmlContent += `<div class="info-card"><h4>Réglementations Générales</h4><ul class="styled-list">`;
            material.general_regulations.forEach(reg => {
                htmlContent += `<li><strong>${reg.name}:</strong> ${reg.description} ${reg.link ? `<a href="${reg.link}" target="_blank" class="external-link"><i class="fas fa-external-link-alt"></i></a>` : ''}</li>`;
            });
            htmlContent += `</ul></div>`;
        }

        // Display specific regulations if available
        if (material.specific_regulations && material.specific_regulations.length > 0) {
            htmlContent += `<div class="info-card"><h4>Réglementations Spécifiques</h4><ul class="styled-list">`;
            material.specific_regulations.forEach(reg => {
                htmlContent += `<li><strong>${reg.name}:</strong> ${reg.description} ${reg.link ? `<a href="${reg.link}" target="_blank" class="external-link"><i class="fas fa-external-link-alt"></i></a>` : ''}</li>`;
            });
            htmlContent += `</ul></div>`;
        }

        // Display national regulations if available
        if (material.national_regulations && material.national_regulations.length > 0) {
            htmlContent += `<div class="info-card"><h4>Réglementations Nationales (France)</h4><ul class="styled-list">`;
            material.national_regulations.forEach(reg => {
                htmlContent += `<li><strong>${reg.name}:</strong> ${reg.description} ${reg.link ? `<a href="${reg.link}" target="_blank" class="external-link"><i class="fas fa-external-link-alt"></i></a>` : ''}</li>`;
            });
            htmlContent += `</ul></div>`;
        }

        // Display risks if available
        if (material.risks && material.risks.length > 0) {
            htmlContent += `<div class="info-card warning"><h4>Risques Associés</h4><ul class="styled-list">`;
            material.risks.forEach(risk => {
                htmlContent += `<li>${risk}</li>`;
            });
            htmlContent += `</ul></div>`;
        }

        // Display migration limits if available
        if (material.migration_limits && material.migration_limits.length > 0) {
            htmlContent += `<div class="info-card"><h4>Limites de Migration (LMG/LMS)</h4><ul class="styled-list">`;
            material.migration_limits.forEach(limit => {
                htmlContent += `<li><strong>${limit.name}:</strong> ${limit.value} - ${limit.notes}</li>`;
            });
            htmlContent += `</ul></div>`;
        }

        // Display norms/standards if available
        if (material.norms_standards && material.norms_standards.length > 0) {
            htmlContent += `<div class="info-card"><h4>Normes et Standards</h4><ul class="styled-list">`;
            material.norms_standards.forEach(norm => {
                htmlContent += `<li><strong>${norm.name}:</strong> ${norm.description} ${norm.link ? `<a href="${norm.link}" target="_blank" class="external-link"><i class="fas fa-external-link-alt"></i></a>` : ''}</li>`;
            });
            htmlContent += `</ul></div>`;
        }

        // Add conditional questions if available
        if (material.questions && material.questions.length > 0) {
            htmlContent += `<h3>Questions Spécifiques au Matériau</h3>`;
            material.questions.forEach((question, index) => {
                htmlContent += `
                    <div class="question-container" data-question-id="q-${materialKey}-${index}">
                        <div class="question-title">${question.text}</div>
                        <ul class="options-list">
                            ${question.options.map(option => `<li class="option-item" data-value="${option.value}">${option.text}</li>`).join('')}
                        </ul>
                    </div>
                `;
            });
        }

        // Add global questions for food type and contact conditions
        htmlContent += `
            <h3>Type d'Aliment et Conditions de Contact</h3>
            <div class="question-container">
                <div class="question-title">Type d'aliment :</div>
                <ul class="options-list" id="food-type-options">
                    <li class="option-item" data-value="aqueux">Aqueux (eau, jus, lait)</li>
                    <li class="option-item" data-value="acide">Acide (fruits, vinaigre)</li>
                    <li class="option-item" data-value="gras">Gras (huiles, beurre)</li>
                    <li class="option-item" data-value="sec">Sec (céréales, pâtes)</li>
                </ul>
            </div>
            <div class="question-container">
                <div class="question-title">Température de contact (°C) :</div>
                <input type="number" id="contact-temperature" class="form-input" value="20">
            </div>
            <div class="question-container">
                <div class="question-title">Durée de contact (heures) :</div>
                <input type="number" id="contact-duration" class="form-input" value="24">
            </div>
            <button class="btn btn-primary" onclick="processMaterialQuestions('${materialKey}')">Afficher les Réglementations</button>
        `;

        pageElement.innerHTML = htmlContent;

        // Add event listeners for new option items
        pageElement.querySelectorAll('.options-list .option-item').forEach(item => {
            item.addEventListener('click', function() {
                const parentOptionsList = this.closest('.options-list');
                parentOptionsList.querySelectorAll('.option-item').forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                // Store the selected value in a data attribute on the parent question container
                const questionContainer = this.closest('.question-container');
                if (questionContainer) {
                    questionContainer.dataset.selectedValue = this.dataset.value;
                }
            });
        });
    }

    // Helper function to check if an item applies based on food type
    function appliesToFoodType(item, foodType) {
        if (!item.food_type_impact || item.food_type_impact.includes('all')) {
            return true;
        }
        return item.food_type_impact.includes(foodType);
    }

    // Helper function to check if an item applies based on contact conditions
    function appliesToContactConditions(item, temperature, duration) {
        if (!item.contact_conditions_impact || item.contact_conditions_impact.includes('all')) {
            return true;
        }
        const temp = parseInt(temperature);
        const dur = parseInt(duration);

        // Example logic: if a regulation is for prolonged contact, and duration is short, it doesn't apply
        if (item.contact_conditions_impact.includes('prolonged_contact') && dur < 24) {
            return false;
        }
        // Example logic: if a regulation is for high temperature, and temp is low, it doesn't apply
        if (item.contact_conditions_impact.includes('high_temperature') && temp < 70) { // Assuming high temp > 70C
            return false;
        }
        return true;
    }

    // Helper function to check if an item applies based on material-specific answers
    function appliesToMaterialSpecificQuestions(item, materialAnswers) {
        if (item.applies_if_recycled && materialAnswers.recycled !== 'oui') {
            return false;
        }
        if (item.applies_if_stainless_steel && materialAnswers.metal_type !== 'acier_inoxydable') {
            return false;
        }
        if (item.applies_if_aluminum && materialAnswers.metal_type !== 'aluminium') {
            return false;
        }
        if (item.applies_if_treated && materialAnswers.treated !== 'oui') {
            return false;
        }
        if (item.applies_if_decorated && materialAnswers.decorated !== 'oui') {
            return false;
        }
        if (item.applies_if_printed_coated && materialAnswers.printed_coated !== 'oui') {
            return false;
        }
        // Add more conditions for other material-specific questions
        return true;
    }

    // Function to process all questions and display results
    window.processMaterialQuestions = (materialKey) => {
        const material = materialsData[materialKey];
        if (!material) return;

        let materialAnswers = {};
        // Collect material-specific question answers from data-selected-value
        document.querySelectorAll(`#page-${materialKey} .question-container[data-question-id]`).forEach(container => {
            const questionId = container.dataset.questionId;
            const selectedValue = container.dataset.selectedValue;
            if (selectedValue) {
                // Extract the question type from the questionId (e.g., 'q-plastiques-0' -> 'recycled')
                if (materialKey === 'plastiques') {
                    if (questionId.endsWith('-0')) materialAnswers.recycled = selectedValue;
                    if (questionId.endsWith('-1')) materialAnswers.plastic_type = selectedValue;
                } else if (materialKey === 'metaux') {
                    if (questionId.endsWith('-0')) materialAnswers.metal_type = selectedValue;
                } else if (materialKey === 'bois') {
                    if (questionId.endsWith('-0')) materialAnswers.treated = selectedValue;
                } else if (materialKey === 'ceramiques' || materialKey === 'verre') {
                    if (questionId.endsWith('-0')) materialAnswers.decorated = selectedValue;
                } else if (materialKey === 'papier_carton') {
                    if (questionId.endsWith('-0')) materialAnswers.recycled = selectedValue;
                    if (questionId.endsWith('-1')) materialAnswers.printed_coated = selectedValue;
                }
            }
        });

        // Collect global food type and contact conditions
        const foodType = document.querySelector('#food-type-options .option-item.active')?.dataset.value || '';
        const contactTemperature = document.getElementById('contact-temperature').value;
        const contactDuration = document.getElementById('contact-duration').value;

        let resultsHtml = `<h3>Réglementations et Informations Pertinentes</h3>`;

        const filterAndDisplay = (items, title, cardClass = '') => {
            const filteredItems = items.filter(item =>
                appliesToFoodType(item, foodType) &&
                appliesToContactConditions(item, contactTemperature, contactDuration) &&
                appliesToMaterialSpecificQuestions(item, materialAnswers)
            );

            if (filteredItems.length > 0) {
                resultsHtml += `<div class="info-card ${cardClass}"><h4>${title}</h4><ul class="styled-list">`;
                filteredItems.forEach(item => {
                    resultsHtml += `<li><strong>${item.name}:</strong> ${item.description} ${item.link ? `<a href="${item.link}" target="_blank" class="external-link"><i class="fas fa-external-link-alt"></i></a>` : ''} ${item.value ? `- ${item.value}` : ''} ${item.notes ? `- ${item.notes}` : ''}</li>`;
                });
                resultsHtml += `</ul></div>`;
            }
        };

        filterAndDisplay(material.general_regulations || [], 'Réglementations Générales');
        filterAndDisplay(material.specific_regulations || [], 'Réglementations Spécifiques');
        filterAndDisplay(material.national_regulations || [], 'Réglementations Nationales (France)');

        // Risks are generally always relevant, but can be filtered if specific conditions are added to data.json
        if (material.risks && material.risks.length > 0) {
            resultsHtml += `<div class="info-card warning"><h4>Risques Associés</h4><ul class="styled-list">`;
            material.risks.forEach(risk => {
                // For now, risks are not filtered by food type/contact conditions unless specified in data.json
                resultsHtml += `<li>${risk}</li>`;
            });
            resultsHtml += `</ul></div>`;
        }

        filterAndDisplay(material.migration_limits || [], 'Limites de Migration (LMG/LMS)');
        filterAndDisplay(material.norms_standards || [], 'Normes et Standards');

        // Display selected food type and contact conditions
        resultsHtml += `
            <div class="info-card">
                <h4>Conditions de Contact Saisies</h4>
                <ul class="styled-list">
                    <li><strong>Type d'aliment:</strong> ${foodType || 'Non spécifié'}</li>
                    <li><strong>Température de contact:</strong> ${contactTemperature}°C</li>
                    <li><strong>Durée de contact:</strong> ${contactDuration} heures</li>
                </ul>
            </div>
        `;

        let resultsSection = document.getElementById(`results-${materialKey}`);
        if (!resultsSection) {
            resultsSection = document.createElement('div');
            resultsSection.id = `results-${materialKey}`;
            resultsSection.classList.add('results-section');
            document.getElementById(`page-${materialKey}`).appendChild(resultsSection);
        }
        resultsSection.innerHTML = resultsHtml;
    };

    // Initial data load
    loadData();
});
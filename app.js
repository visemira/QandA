document.addEventListener("DOMContentLoaded", () => {
    const questionInput = document.getElementById("questionInput");
    const answerDisplay = document.getElementById("answer");
    const languageSelector = document.getElementById("language");
    const languageLabel = document.getElementById("languageLabel");
    const questionTitle = document.getElementById("questionTitle");
    const loadImagesButton = document.getElementById("loadImagesButton");
    const imagesDisplay = document.getElementById("imagesDisplay");

    // Base URL for relative image paths
    const baseUrl = "https://raw.githubusercontent.com/visemira/QandA/refs/heads/main";

    // Translations for different languages
    const translations = {
        de: {
            languageLabel: "Sprache wählen:",
            questionTitle: "Frage und Antwort",
            placeholder: "Geben Sie hier Ihre Frage ein...",
            noAnswerText: "Keine Antwort gefunden. Versuchen Sie, eine andere Frage einzugeben."
        },
        en: {
            languageLabel: "Select language:",
            questionTitle: "Question and Answer",
            placeholder: "Enter your question here...",
            noAnswerText: "No answer found. Try typing a different question."
        },
        es: {
            languageLabel: "Seleccionar idioma:",
            questionTitle: "Pregunta y respuesta",
            placeholder: "Ingresa tu pregunta aquí...",
            noAnswerText: "No se encontró respuesta. Intenta escribir una pregunta diferente."
        },
        ru: {
            languageLabel: "Выберите язык:",
            questionTitle: "Вопрос и ответ",
            placeholder: "Введите свой вопрос здесь...",
            noAnswerText: "Ответ не найден. Попробуйте ввести другой вопрос."
        },
        it: {
            languageLabel: "Scegli la lingua:",
            questionTitle: "Domanda e risposta",
            placeholder: "Inserisci la tua domanda qui...",
            noAnswerText: "Nessuna risposta trovata. Prova a digitare una domanda diversa."
        },
        "zh-CN": {
            languageLabel: "选择语言:",
            questionTitle: "问题与答案",
            placeholder: "在这里输入您的问题...",
            noAnswerText: "未找到答案。尝试输入不同的问题。"
        },
        vi: {
            languageLabel: "Chọn ngôn ngữ:",
            questionTitle: "Câu hỏi và trả lời",
            placeholder: "Nhập câu hỏi của bạn ở đây...",
            noAnswerText: "Không tìm thấy câu trả lời. Hãy thử nhập câu hỏi khác."
        },
        fr: {
            languageLabel: "Sélectionner la langue:",
            questionTitle: "Question et réponse",
            placeholder: "Entrez votre question ici...",
            noAnswerText: "Aucune réponse trouvée. Essayez de poser une autre question."
        },
        "zh-TW": {
            languageLabel: "選擇語言:",
            questionTitle: "問題與答案",
            placeholder: "在這裡輸入您的問題...",
            noAnswerText: "未找到答案。請嘗試輸入不同的問題。"
        }
    };

    // Function to load and display images based on selected language
    function loadImages(language) {
        const fileName = `data/images_${language}.json`; // Language-specific images JSON

        fetch(fileName)
            .then(response => response.json())
            .then(images => {
                imagesDisplay.innerHTML = ""; // Clear previous images

                images.forEach(image => {
                    const imageUrl = image.question.startsWith("/") ? baseUrl + image.question : image.question;
                    const answers = image.answer.join(", ");
                    imagesDisplay.innerHTML += `
                        <div class="flex flex-col justify-center items-center overflow-hidden bg-white rounded-lg bg-gray-300 border-2 border-black shadow-lg">
                            <img src="${imageUrl}" alt="Image" class="mt-1 w-12 rounded-lg">
                            <div class="flex flex-col w-full items-center bg-yellow-100">
                                <p class="p-1">${answers}</p>
                            </div>
                        </div>
                    `;
                });
            })
            .catch(error => {
                console.error('Error loading images:', error);
                imagesDisplay.innerHTML = "<p class='text-red-500'>Failed to load images.</p>";
            });
    }

    // Function to load and search questions based on selected language
    function loadQuestions(language) {
        const fileName = `data/questions_${language}.json`; // Language-specific questions JSON

        fetch(fileName)
            .then(response => response.json())
            .then(questions => {
                // Initialize Fuse.js for fuzzy searching
                const options = {
                    keys: ["question"],
                    threshold: 0.4,
                    distance: 100,
                    tokenize: true,
                    findAllMatches: true,
                    ignoreLocation: true,
                    minMatchCharLength: 2
                };

                const fuse = new Fuse(questions, options);

                // Debounced search input
                let timeoutId;
                questionInput.addEventListener("input", () => {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        const query = questionInput.value.trim();
                        if (query === "") {
                            answerDisplay.innerHTML = ""; // Clear answer if input is empty
                            return;
                        }

                        const result = fuse.search(query);
                        if (result.length > 0) {
                            answerDisplay.innerHTML = result[0].item.answer
                                .map(answer => {
                                    if (isImageUrl(answer)) {
                                        const imageUrl = isRelativeUrl(answer) ? baseUrl + answer : answer;
                                        return `<div class="bg-green-200 p-2 rounded shadow-sm">
                                                    <img src="${imageUrl}" alt="Answer Image" class="max-w-full h-auto rounded">
                                                </div>`;
                                    } else {
                                        return `<div class="bg-green-200 p-2 rounded shadow-sm">${answer}</div>`;
                                    }
                                })
                                .join(""); // Create each answer in a box
                        } else {
                            answerDisplay.textContent = translations[language].noAnswerText;
                        }
                    }, 300); // 300ms delay
                });
            })
            .catch(error => {
                console.error('Error loading questions:', error);
                answerDisplay.textContent = translations[language].noAnswerText;
                answerDisplay.classList.add('text-red-500'); // Add red text color for error
            });
    }

    // Function to check if a URL is an image
    function isImageUrl(url) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
        return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
    }

    // Function to check if a URL is relative
    function isRelativeUrl(url) {
        return !url.startsWith("http://") && !url.startsWith("https://");
    }

    // Function to update the UI text based on the selected language
    function updateUI(language) {
        languageLabel.textContent = translations[language].languageLabel;
        questionTitle.textContent = translations[language].questionTitle;
        questionInput.placeholder = translations[language].placeholder;
    }

    // Toggle the visibility of images and adjust grid layout
    function toggleImagesVisibility() {
        const isImagesVisible = imagesDisplay.style.display !== "none";
        imagesDisplay.style.display = isImagesVisible ? "none" : "grid";

        if (!isImagesVisible) {
            imagesDisplay.classList.remove("grid-cols-3");
            imagesDisplay.classList.add("grid-cols-1");
        } else {
            imagesDisplay.classList.remove("grid-cols-1");
            imagesDisplay.classList.add("grid-cols-3");
        }
    }

    // Initial setup: hide images and set to 3 columns
    imagesDisplay.style.display = 'grid'; // Hide images initially
    imagesDisplay.classList.add("grid-cols-3"); // Set grid to 3 columns initially

    // Load default language questions (e.g., English)
    const savedLanguage = localStorage.getItem("selectedLanguage") || "en"; // Default to "en"
    languageSelector.value = savedLanguage;
    loadQuestions(savedLanguage); // Load questions based on saved language
    updateUI(savedLanguage); // Update UI with selected language
    loadImages(savedLanguage); // Load images for selected language

    // Change language based on user selection
    languageSelector.addEventListener("change", (e) => {
        const selectedLanguage = e.target.value;
        loadQuestions(selectedLanguage);
        updateUI(selectedLanguage);
        loadImages(selectedLanguage); // Load corresponding images
        localStorage.setItem("selectedLanguage", selectedLanguage); // Save the selected language
    });

    // Toggle images visibility on button click
    loadImagesButton.addEventListener("click", toggleImagesVisibility);
});

document.addEventListener('DOMContentLoaded', () => {
    const startCameraButton = document.getElementById('start-camera');
    const takePhotoButton = document.getElementById('take-photo');
    const uploadPhotoInput = document.getElementById('upload-photo');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const photo = document.getElementById('photo');
    const ingredientsDiv = document.getElementById('ingredients');
    const recipeDiv = document.getElementById('recipe');
    const resultsDiv = document.getElementById('results');
    const ingredientsTitle = document.getElementById('ingredients-title');
    const recipeTitle = document.getElementById('recipe-title');

    let stream;

    // Your Vercel backend URL (Replace with your actual deployed API URL)
    const API_URL = "https://your-vercel-backend.vercel.app/chat"; 

    // Start Camera
    startCameraButton.addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.style.display = 'block';
            takePhotoButton.disabled = false;
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    });

    // Take Photo
    takePhotoButton.addEventListener('click', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        photo.src = dataUrl;
        photo.style.display = 'block';

        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        video.style.display = 'none';

        // Simulate food detection (Replace with a real API later)
        detectIngredients(["Tomato", "Cheese", "Basil"]);
    });

    // Handle Photo Upload
    uploadPhotoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            photo.src = e.target.result;
            photo.style.display = 'block';

            // Simulate food detection (Replace with an AI image API)
            detectIngredients(["Chicken", "Garlic", "Pepper"]);
        };
        reader.readAsDataURL(file);
    });

    // Function to Simulate Ingredient Detection (Replace with an Image AI API)
    function detectIngredients(ingredients) {
        ingredientsDiv.innerHTML = ingredients.join(", ");
        ingredientsTitle.style.display = 'block';

        // Send ingredients to backend ChatGPT API
        getRecipe(ingredients.join(", "));
    }

    // Send Ingredients to ChatGPT Backend API
    async function getRecipe(ingredients) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: `I have these ingredients: ${ingredients}. What can I cook?` })
            });

            const data = await response.json();
            recipeDiv.innerText = data.reply;
            recipeTitle.style.display = 'block';
            resultsDiv.style.display = 'block';
        } catch (error) {
            console.error('Error fetching recipe:', error);
            recipeDiv.innerText = "Error generating recipe. Please try again.";
        }
    }
});

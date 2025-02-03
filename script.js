const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const formatBtns = document.querySelectorAll('.format-btn');
const removeBgBtn = document.getElementById('removeBgBtn');
const downloadBtn = document.getElementById('downloadBtn');
const newImageBtn = document.getElementById('newImageBtn');
const downloadOptions = document.querySelector('.download-options');
let selectedFormat = 'png';

// File Upload Handling
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.backgroundColor = '#f8f9ff';
});
dropZone.addEventListener('dragleave', () => {
    dropZone.style.backgroundColor = 'white';
});
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImage(file);
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleImage(file);
});

function handleImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = 'block';
        downloadOptions.style.display = 'none';
        removeBgBtn.style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
}

// Format Selection
formatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        formatBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedFormat = btn.dataset.format;
    });
});

// Background Removal (API Integration)
removeBgBtn.addEventListener('click', async () => {
    if (!fileInput.files[0]) {
        alert('Please upload an image first!');
        return;
    }

    document.querySelector('.loading').style.display = 'block';

    try {
        const formData = new FormData();
        formData.append('image_file', fileInput.files[0]);

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': 'YOUR_API_KEY'
            },
            body: formData
        });

        const result = await response.blob();
        const url = URL.createObjectURL(result);

        preview.src = url;
        removeBgBtn.style.display = 'none';
        downloadOptions.style.display = 'block';
    } catch (error) {
        alert('Error processing image. Please try again.');
    } finally {
        document.querySelector('.loading').style.display = 'none';
    }
});

// Download Handler
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = preview.src;
    link.download = `background-removed.${selectedFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// New Image Handler
newImageBtn.addEventListener('click', () => {
    fileInput.value = '';
    preview.src = '';
    preview.style.display = 'none';
    downloadOptions.style.display = 'none';
    removeBgBtn.style.display = 'inline-block';
});

// ====================================================
// Phase 1: MVP - Basic Editor Functionality
// ====================================================

const markdownInput = document.getElementById('markdown-input');
const previewOutput = document.getElementById('preview-output');
const saveButton = document.getElementById('save-button');
const fileInput = document.getElementById('file-input');

// --- 1. Markdown Parser (Simple Implementation for demonstration) ---
// NOTE: In a real Obsidian-like app, we would use a robust library like 'marked.js'
function parseMarkdown(markdownText) {
    let html = markdownText;

    // Headers
    html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold/Italics
    html = html.replace(/(\*\*|__)(.+?)(\*\*|__)/g, '<strong>$2</strong>');
    html = html.replace(/(\*|_)(.+?)(\*|_)/g, '<em>$2</em>');

    // Code Blocks (Simple)
    html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
        return '<pre><code>' + code.trim() + '</code></pre>';
    });

    // Basic Line Breaks (Replace two newlines with paragraph tags)
    html = html.split('\n\n').map(p => p.trim()).filter(p => p.length > 0).join('<p>');

    return html;
}

// --- 2. Live Preview Handler ---
function updatePreview() {
    const markdownText = markdownInput.value;
    const htmlOutput = parseMarkdown(markdownText);
    previewOutput.innerHTML = htmlOutput;
}

// --- 3. Event Listeners ---

// Live update on input change
markdownInput.addEventListener('input', updatePreview);

// Initial content load (optional)
markdownInput.value = "# Welcome to Local Editor\n\nThis is a test document.\n\n## Features Implemented (MVP)\n*   Live Preview\n*   Basic Markdown Support (Headings, Bold, Code Blocks)\n\n---\n\n```javascript\n// This is a code block example\nfunction hello() {\n  console.log('Hello World!');\n}\n```";
updatePreview(); // Initial render

// Save functionality (Uses Blob to download the file)
saveButton.addEventListener('click', () => {
    const content = markdownInput.value;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'untitled_document.md'; // Default filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log("File downloaded successfully.");
});

// File Input Handler (Load file into the editor)
// We wrap the input in a label to trigger it via button click defined in HTML
document.getElementById('file-controls').addEventListener('click', (event) => {
    if (event.target.id === 'file-input') {
        // This case shouldn't happen if we use the label trick correctly, 
        // but kept for robustness.
    }
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            markdownInput.value = e.target.result;
            updatePreview();
            console.log(`File loaded: ${file.name}`);
        };
        reader.readAsText(file);
    } else {
        alert("Please select a valid .md file.");
    }
});

// --- UI Refinement: Making the button trigger the hidden input ---
// Because we put the input in the HTML structure without an explicit label setup, 
// we need a simple wrapper or modify HTML/JS slightly.
// For this initial structure, we will rely on the user selecting the file via the input element if they click the button area.
// A better way for the current structure is to add a label in HTML: <label for="file-input">파일 열기</label>
// Since I cannot edit HTML right now, I'll assume the user can trigger the input somehow or we adjust the HTML structure later.
// For now, the logic for reading the file is sound.

// **TO BE IMPLEMENTED NEXT: Phase 2 - Refinements**
// 1. File name persistence across sessions.
// 2. More robust Markdown parsing (library integration).
// 3. Implementing file tree/multiple file management.
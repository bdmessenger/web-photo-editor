import {readURL, drawCanvasImage, downloadImage, DEFAULT_OPTIONS} from './utilities.js'
  

const canvasImage = new Image();
canvasImage.crossOrigin = "Access-Control-Allow-origin";

const getSessionImage = sessionStorage.getItem('imageURL');
if(getSessionImage) canvasImage.src = getSessionImage;

var options = JSON.parse(sessionStorage.getItem('imageOptions')) || DEFAULT_OPTIONS.map(option => ({...option}));
  
const currentOptionIndex = {
    aInternal: 0,
    aListener: function(value) {},
    set state(value) {
        this.aInternal = value;
        this.aListener(value);
    },
    get state() {
        return this.aInternal;
    },
    registerListener: function(listener) {
        this.aListener = listener;
    }
}

currentOptionIndex.registerListener(function(value){
    document.querySelectorAll('#filters button').forEach((button, index) => {
        if(button.id === 'export') return;
        button.className = value === index ? "sidebar-item active" : 'sidebar-item'
    });
    updateSliderControl();
});

DEFAULT_OPTIONS.forEach((option, index) => {
    var button = document.createElement('button');
    button.className = currentOptionIndex.state === index ? "sidebar-item active" : "sidebar-item";
    button.id = option.property;
    button.innerText = option.name;
    button.onclick = e => (currentOptionIndex.state = index);
    document.getElementById('filters').append(button);
});

const myCanvas = document.getElementById('canvas')
const exportCanvas = document.getElementById('export-canvas');
const form = document.getElementById('image-form');
const slider = document.getElementById('slider-filter');

form.onsubmit = async function(e) {
    e.preventDefault();
    console.log(e.target.fileInput);
    const input = e.target.fileInput;
    const file = input.files[0];
    const url = await readURL(file);
    canvasImage.src = url;
    sessionStorage.setItem('imageURL', url);
    input.value = '';
}

var dropBoxButton = Dropbox.createChooseButton({
    success: (files) => {
        canvasImage.src = files[0].link;
        sessionStorage.setItem('imageURL', files[0].link);
    },
    linkType: "direct"
});

dropBoxButton.id = "dropbox-button";


document.getElementById("form-overlay-buttons").appendChild(dropBoxButton);

slider.addEventListener('input', e => {
    if(options[currentOptionIndex.state].value === e.target.value) return;
    options[currentOptionIndex.state].value = e.target.value;
    sessionStorage.setItem('imageOptions', JSON.stringify(options));
    drawCanvasImage(myCanvas, canvasImage, 1, options);
});

function updateSliderControl() {
    const {value, range} = options[currentOptionIndex.state];
    slider.max = range.max;
    slider.min = range.min;
    slider.value = value;
}

canvasImage.onload = e => {
    document.querySelector('.overlay').style.display = 'none';
    updateSliderControl();
    drawCanvasImage(myCanvas, canvasImage, 1, options);
}

document.getElementById('export').addEventListener('click', () => {
    drawCanvasImage(exportCanvas, canvasImage, 0, options);
    exportCanvas.toBlob(blob => (downloadImage(blob)))
});

document.getElementById('reset').addEventListener('click', () => {
    if(window.confirm('Revert to default settings?')) {
        resetFilterOptions();
        sessionStorage.setItem('imageOptions', JSON.stringify(options));
        updateSliderControl();
        drawCanvasImage(myCanvas, canvasImage, 1, options);
    }
});

document.getElementById('exit').addEventListener('click', () => {
    if(window.confirm('Exit To Menu?')) {
        canvasImage.src = '';
        document.querySelector('.overlay').style.display = 'flex';
        sessionStorage.clear();
        resetFilterOptions();
    }
})

function resetFilterOptions() {
    options = DEFAULT_OPTIONS.map(option => ({...option}));
}

window.addEventListener('resize', () => drawCanvasImage(myCanvas, canvasImage, 1, options));
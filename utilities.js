export const readURL = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(e);
    });
}

export const drawCanvasImage = (canvas, img, mode = 0, filters = []) => {
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width, canvas.height);

    switch(mode) {
        case 0:
            canvas.width  = img.width;
            canvas.height = img.height;
            ctx.filter = filters.map(option => {
                return `${option.property}(${option.value}${option.unit})`
            }).join(' ');
            ctx.drawImage(img, 0, 0, img.width, img.height);
            break;
        case 1:
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            ctx.filter = filters.map(option => {
                return `${option.property}(${option.value}${option.unit})`
            }).join(' ');
            var hRatio = canvas.width  / img.width;
            var vRatio =  canvas.height / img.height;
            var ratio  = Math.min( hRatio, vRatio );
            var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
            var centerShift_y = ( canvas.height - img.height*ratio ) / 2; 
            ctx.drawImage(img, 0,0, img.width, img.height, 
            centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);
            break;
    }
}

export const downloadImage = blob => {
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob)
    a.style = "display: none";
    a.href = url;
    a.download = "image-download";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}

export const DEFAULT_OPTIONS = [
    {
        name: 'Brightness',
        property: 'brightness',
        value: 100,
        range: {
            min: 0,
            max: 200
        },
        unit: '%'
    },
    {
        name: 'Contrast',
        property: 'contrast',
        value: 100,
        range: {
            min: 0,
            max: 200
        },
        unit: '%'
    },
    {
        name: 'Saturation',
        property: 'saturate',
        value: 100,
        range: {
            min: 0,
            max: 200
        },
        unit: '%'
    },
    {
        name: 'Grayscale',
        property: 'grayscale',
        value: 0,
        range: {
            min: 0,
            max: 100
        },
        unit: '%'
    },
    {
        name: 'Sepia',
        property: 'sepia',
        value: 0,
        range: {
            min: 0,
            max: 100
        },
        unit: '%'
    },
    {
        name: 'Hue Rotate',
        property: 'hue-rotate',
        value: 0,
        range: {
            min: 0,
            max: 360
        },
        unit: 'deg'
    },
    {
        name: 'Blur',
        property: 'blur',
        value: 0,
        range: {
            min: 0,
            max: 20
        },
        unit: 'px'
    }
];
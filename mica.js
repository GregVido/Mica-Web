/*
Copyright 2022 GregVido

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
window.addEventListener('load', async () => {

    function createMicaBackgroundFromURLImage(urlImage, darkTheme = false, applyBackground = true) {
        return new Promise((res, rej) => {
            const COLORS = {
                LIGHT: '#f3f3f3', // windows 11 color of light theme
                DARK: '#202020' // windows 11 color of dark theme
            }

            const wallpaper = new Image();
            wallpaper.src = urlImage;

            const canvas = document.createElement('canvas');

            wallpaper.addEventListener('load', () => {
                const width = wallpaper.width;
                const height = wallpaper.height;

                canvas.width = width;
                canvas.height = height;

                const context = canvas.getContext('2d');

                context.fillStyle = darkTheme ? COLORS.DARK : COLORS.LIGHT;
                context.fillRect(0, 0, width, height); // set background color

                context.filter = 'blur(150px)';

                if (darkTheme) {
                    context.filter = 'hue-rotate(24deg) saturate(200%) brightness(40%) blur(150px)';
                    context.globalAlpha = .3;
                }
                else
                    context.globalAlpha = .1;

                context.drawImage(wallpaper, 0, 0);

                if (applyBackground) {
                    document.body.style.background = `url('${canvas.toDataURL()}')`;
                    document.body.style.backgroundRepeat = 'no-repeat';
                    document.body.style.backgroundSize = 'auto';
                }
                res(canvas);
            });

        });
    }

    // createMicaBackgroundFromURLImage('wallpaper.jpg', true); // -> create mica background

    if (document.body.dataset.micaUrl) {
        let canvas = await createMicaBackgroundFromURLImage(document.body.dataset.micaUrl, document.body.classList.contains('theme-dark'), false); // create canvas with mica-texture

        // apply mica effect where html class contains 'mica'
        Object.values(document.querySelectorAll('.mica')).map((element, k) => {
            element.style.background = `url('${canvas.toDataURL()}')`; // apply mica-effect
            element.style.backgroundPosition = `${-element.offsetLeft}px ${-element.offsetTop}px`; // refresh background position
        });

        // apply acrylic effect where html class contains 'acrylic'
        Object.values(document.querySelectorAll('.acrylic')).map((element, k) => {
            element.style.backdropFilter = 'blur(20px)';
        });

        // apply drag where html class contains 'draggable'
        Object.values(document.querySelectorAll('.draggable')).map((element, k) => {
            element.style.position = 'absolute';

            let click = { x: 0, y: 0, enable: false };


            element.addEventListener('mousedown', (e) => {
                click.x = e.offsetX;
                click.y = e.offsetY;
                click.enable = true;
            });

            element.addEventListener('mouseup', (e) => {
                click.enable = false;
            });

            element.addEventListener('mousemove', (e) => {
                if (click.enable) {
                    let x = e.clientX - click.x;
                    let y = e.clientY - click.y;

                    element.style.left = x + 'px';
                    element.style.top = y + 'px';

                    element.style.backgroundPosition = `${-x}px ${-y}px`;
                }
            });
        });

        // apply border where html class contains 'border'
        Object.values(document.querySelectorAll('.border')).map((element, k) => {
            element.style.border = `1px solid rgba(87,87,87,.329)`; // add border with color
            element.style.borderRadius = `5px`; // border radius
        });
    }
});
// @ts-ignore
import { clg } from "./main";

const themeSwitch = document.querySelector('.switch-theme');
let lightTheme: boolean = true;

themeSwitch?.addEventListener('click', () => {
    document.querySelectorAll('.switch-theme img').forEach(el => {
        el.classList.toggle('disabled');
    });
    
    lightTheme = !lightTheme;

    const nc = lightTheme ? '#0A0A0A' : '#f8f2ff';
    const nc1 = lightTheme ? '#f8f2ff' : '#0A0A0A';
    const tii = lightTheme ? 'invert(100%)' : 'invert(0%)';


    document.body.style.setProperty('--theme', nc);
    document.body.style.setProperty('--primary-text-color', nc1);
    document.body.style.setProperty('--theme-image-inversion', tii)
});

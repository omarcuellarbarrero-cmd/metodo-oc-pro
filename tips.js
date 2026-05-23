export const tipsData = {
    "samsung": {
        "un40j5200": { sintoma: "Falla de parpadeo, no enciende", solucion: "Medir D8501 y reemplazar diodo." },
        "smart-tv": { sintoma: "Loop de logo/reinicio", solucion: "Cold start (tecla STOP 5seg). Si falla, reset mediante microcontrolador externo." },
        "58tu7000": { sintoma: "Reinicio cíclico/Protección", solucion: "Anular líneas CKV o VSS en panel, o instalar convertidor DC-DC regulado a 18V-19V si hay exceso de VGH." }
    },
    "lg": {
        "32lb550b": { sintoma: "Pantalla oscura, sonido ok", solucion: "Cambio de regletas LED. Verificar si V-out > 72V." },
        "42ln5700": { sintoma: "Se ve con linterna", solucion: "Cambiar kit de LEDs completo y reducir corriente de driver." }
    },
    "sony": {
        "kdl-32m3000": { 
            sintoma: "Imagen lenta y rojiza", 
            solucion: "Jumper VGH desde T-CON a COF lateral (pistas rotas).",
            recursos: "https://player.mediadelivery.net/play/651071/4dddd57a-e922-4a3c-a433-54349eca2d34"
        }
    },
    "rca": {
        "hk.t.rt2831p637": { 
            sintoma: "Pegado en el Logo", 
            solucion: "Firmware dañado. Intentar Recovery por consola. Si falla, reprogramar memoria eMMC (RT809F/H)." 
        }
    },
    "generico": {
        "tp.ms338.pb801": { sintoma: "Pegado en logo Android", solucion: "Reinstalar software o cambio de memoria eMMC." }
    }
};
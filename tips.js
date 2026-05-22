// ARCHIVO EXCLUSIVO DE TIPS - MÉTODO OC
// Aquí puede expandir, agregar o quitar texto según sus nuevos diagnósticos en banco

export const tipsContenido = `
--- DIRECTRICES GENERALES DEL MÉTODO OC ---
- Aplicar siempre un diagnóstico lógico por bloques de voltaje, descartando desde la fuente de alimentación hacia las subfuentes.
- Analizar minuciosamente los voltajes principales en la fuente (Standby, 12V, 24V) antes de intervenir la Main Board.

--- DIAGNÓSTICO EN PANALES LCD/LED Y T-CON ---
- Medir señales LVDS/Mini-LVDS para comprobar la correcta comunicación entre la Main y la T-CON.
- Verificar rigurosamente los voltajes de compuerta en la placa T-CON o sectores integrados: VGH (voltaje alto), VGL (voltaje bajo) y VCOM (voltaje de referencia).
- Identificar fallas comunes en conectores COF/TAB (Chip-on-Flex) como líneas verticales, saltos de imagen o ausencia total de video por falta de señales de reloj (CLK) o datos.

--- NOTAS ADICIONALES ---
- En pantallas modernas, revisar si existen cortocircuitos en los capacitores SMD de montaje superficial dispuestos en los extremos del panel.
`;

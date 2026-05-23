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
=== SECCIÓN SAMSUNG === 


1. =================================
MARCA: Samsung 
MODELO: UN40J5200
SINTOMA: Falla de parpadeo. No enciende. 
DESCARTE: Medir D8501. 
SOLUCION: Reemplazo de diodo.


2. =================================
MARCA: Samsung 
MODELO: Blu-ray Smart
SINTOMA: Bloqueo en logotipo ("Logo loop"). El equipo presenta reinicios cíclicos o congelamiento en la pantalla de inicio. 
DESCARTE: Prueba Dinámica: Ejecutar procedimiento de "Cold Start" manteniendo presionada la tecla física "STOP" por más de 5 segundos hasta visualizar el mensaje de confirmación "INIT" en el display frontal. 
SOLUCION: Restablecer parámetros de fábrica para inicializar el Smart Hub; en casos críticos, emular el código de reset mediante microcontrolador (ATmega328 o PIC16F84) para forzar el desbloqueo del sistema.


3. =================================
MARCA: Samsung 
MODELO: Series HD/Full HD: Ausencia de audio con barra de volumen operativa. 
SINTOMA: Visualización de la barra de volumen en pantalla, pero sin salida sonora por altavoces; el sistema muestra el ícono de audífonos activo permanentemente. 
DESCARTE: Prueba Dinámica: Ingresar al Service Mode (Info + Factory) y navegar a Control -> Sub Options. 
SOLUCION: Configurar "Fast Boot in Production" y "UART Enable" en estado "OFF" (desactivar depuración por USB). Adicionalmente, validar que el parámetro "Type" sea el correcto, ya que su desconfiguración altera la lógica del chipset de audio.


4. =================================
MARCA: Samsung 
MODELO: Smart TV
SINTOMA: Puertos HDMI sin detección de señal (Corrupción de datos EDID). Los puertos HDMI no reconocen dispositivos externos a pesar de la integridad física de los conectores.
DESCARTE: Prueba Dinámica: Acceder a la ruta SVS/Control -> Edit en el menú de servicio, activar "Edit On/Off" (valor 1) y ejecutar la reescritura hasta obtener el mensaje "Success". SOLUCION: Reprogramación de la EEPROM interna de los puertos. A diferencia del método LG (ADJ -> EDID D/L), Samsung requiere forzar el re-flash exclusivamente a través de la ruta SVS.


5. =================================
MARCA: Samsung 
MODELO: Series 4K (MU/NU/RU).
SINTOMA:El televisor no inicia; LED de standby fijo o nulo. 
DESCARTE: Prueba Dinámica: Medir 13V en el conector de la fuente (8-9V en standby, 13V en ON) y 3.3V en el sensor IR. Es imperativo verificar mediante consola UART (interfaz CP2102/CH341) el log de arranque; si el parámetro "SEC" se visualiza en "SEC 0" en lugar de "SEC 1", se confirma corrupción de datos.  Fallo de encendido (Fallo en etapa de arranque/Boot-loop). 
SOLUCION: Reprogramar la memoria SPI Flash 25Q40 (gestión de arranque del SoC) y verificar la integridad de la 25Q80 (configuración del panel).


6. =================================
MARCA: Samsung 
MODELO: Series 43K/43J/50"
SINTOMA: Fallas recurrentes en tiras LED por sobrecorriente. Protección de Backlight y optimización térmica. 
DESCARTE: Prueba Dinámica: Medir el consumo en miliamperios (mA) en la línea positiva del driver LED; el valor nominal suele ser de 783 mA. 
SOLUCION: Acceder a "Option -> MRT Option" o utilizar el acceso directo "Key 10" en el control de servicio especializado para reducir la corriente a niveles de ahorro (aprox. 489 mA), extendiendo la vida útil del componente.

7. =================================
MARCA: Samsung
MARCA: Panel 4K.
SINTOMA: El televisor entra en un bucle de reinicio cada 4 segundos (Power-loop); el SoC se protege ante un sobreconsumo detectado en la T-CON o Panel. 
DESCARTE: Protección por cortocircuito en Gate Drivers (Líneas CKV).Prueba Dinámica: Realizar la desconexión alterna de los flexores (Side A y Side B) para identificar el sector del panel con el cortocircuito interno. 
SOLUCION: Aplicar el método de enmascaramiento selectivo de señales de reloj (CKV1-CKV6) y voltajes de polarización (VGH/VGL) en el flexor del lado defectuoso para anular los drivers de puerta dañados.


8. =================================
MARCA: Samsung
MODELO: Smart TV 
SINTOMA: Tras el cambio de la placa principal, la imagen se muestra fuera de límites o con trama incorrecta. 
DESCARTE: (Post-reemplazo de Main): Geometría desajustada o imagen con zoom. Prueba Dinámica: Comparar el valor "Type" seteado en el Service Mode contra el código impreso en la etiqueta de la estructura metálica del panel (sticker interno). No utilizar la etiqueta de la tapa trasera. 
SOLUCION: Configurar el código "Type" correcto para definir la profundidad de bits (8-bit vs 10-bit), tecnología de transmisión (LVDS/V-by-One) y frecuencia de refresco (60Hz/120Hz) específicas del hardware. 


9. =================================
MARCA: Samsung 
MODELO: Smart TV.
SINTOMA:  Visualización de líneas verticales/horizontales o imagen solarizada por errores de direccionamiento. 
DESCARTE: Distorsión de imagen o patrones de líneas (Falla de T-CON). Prueba Dinámica: Navegar en el menú de servicio a SVS -> Plate Tool. 
SOLUCION: Forzar la actualización de la Data Gamma y el firmware de los Micom de la placa de control (T-CON) para restablecer la integridad de la EEPROM interna y corregir la distorsión cromática.


10. =================================
MARCA: Samsung 
MODELO: BN41-02528. 
SINTOMA: Síntoma: El televisor permanece inoperante sin respuesta a la orden de Power.
DESCARTE: Intento de recuperación mediante carga de dump BN41-02528 en sector de arranque. Prueba Dinámica: Verificación de comunicación SPI tras escritura. 
SOLUCION: Archivo incompatible para la revisión del procesador; se requiere dump alternativo.

11. =================================
MARCA: Samsung.
MODELO: IC 604.
SINTOMA: Equipo bloqueado con presencia de LED de Stand By.
DESCARTE: Validación de datos en la posición de circuito IC 604 (25q40). Prueba Dinámica: Lectura y comparación de Checksum del archivo cargado. 
SOLUCION: Fallo en la activación del ciclo de inicio; el archivo probado no disparó el proceso de arranque del microprocesador.


12. =================================
MARCA: Samsung 
MODELO: BN41-02635: 
SINTOMA: Inoperatividad total inicial. Prueba Dinámica. 
DESCARTE: Restauración mediante técnica de compatibilidad cruzada con dump de placa distinta. Prueba Dinámica: Sobrescritura de la memoria 25q40 con archivo BN41-02635 y validación de Checksum. 
SOLUCION: Recuperación exitosa del sistema; el firmware permitió la inicialización del SoC y el arranque completo.


13. =================================
MARCA: Samsung 
MODELO: Serie UN-NU / UN-RU (49", 50", 55")
SINTOMA: Reinicio o rayas horizontales. Causa: 90% daño interno del panel LCD. 
SOLUCION: Anular líneas CKV.


14. =================================
MARCA: Samsung 
MODELO: 58TU 7000/8000: 
SINTOMA: Activación del modo de prueba T-CON Ready. El televisor se reinicia cíclicamente o no presenta video. 
DESCARTE: Prueba Dinámica: Desconectar flex de datos/voltaje al panel y realizar puente entre puntos de prueba TR de Y1 y TR de Y3; medir 15V en pin 1 del conector y 3.2V en puntos de prueba. 
SOLUCION: Cerrar circuito Y1-Y3 para verificar estado operativo de la Mainboard y el conversor DC-DC.


15. =================================
MARCA: Samsung 
MODELO: 58TU 7000/8000: 
SINTOMA: Falla de activación del conversor DC-DC por protección. 
DESCARTE: Ausencia de los 3.2V en puntos de prueba Y1/Y3 tras realizar el puente. Prueba Dinámica: Medir voltaje en los puntos de prueba TR de la placa principal. 
SOLUCION: Retirar el diodo zener de protección ubicado en la parte inferior de la placa, cerca del conector de la fuente.


16. =================================
MARCA: Samsung 
MODELO: 58TU 6900/7000/8000: 
SINTOMA: Identificación de sector afectado (Descarte). Protección por cortocircuito interno en el panel. 
DESCARTE: Prueba Dinámica: Con modo T-CON Ready activo, desconectar alternadamente los sectores izquierdo y derecho del panel; esperar un tiempo de 2 a 5 minutos para confirmar estabilidad. 
SOLUCION: Aislar el sector que genera el reinicio para proceder con la anulación de señales.

17. =================================
MARCA: Samsung 
MODELO: 58TU 7000/8000: 
SINTOMA: Protección por exceso de voltaje VGH (Estrés Térmico). El televisor se protege o presenta deterioro acelerado del panel. 
DESCARTE: Prueba Dinámica: Medir VGH original (24V) y verificar si el equipo se sostiene al disminuirlo. 
SOLUCION: Retirar resistencia de paso de VGH e instalar un conversor DC-DC (Boot Converter) regulado a 18V-19V para alimentar el panel de forma estable.

18. =================================
MARCA: Samsung 
MODELO: 58TU 8000
SINTOMA:  Interferencia por señales de reloj en corto. Reinicio persistente o imagen con interferencia visual. 
DESCARTE: Prueba Dinámica: Evaluación visual de la estabilidad tras aislar sectores. SOLUCION: Realizar corte de líneas CK (1 al 8) por encima de los puntos de prueba; si la falla persiste, conectar los puntos TR (entrada al panel) a tierra (GND).

19. =================================
MARCA: Samsung 
MODELO: 58TU 6900/7000/8000: 
SINTOMA: Falla crítica de reinicio por VSS (BSS). El equipo continúa reiniciándose tras anular las señales CK. 
DESCARTES: Prueba Dinámica: Verificación de estabilidad post-corte de CK. 
SOLUCION: Anular la línea VSS (adyacente a VGH) realizando el corte antes del punto de paso (trujol) para asegurar la desconexión total del voltaje hacia el panel.

20. =================================
MARCA: Samsung 
MODELO: 58TU 8000: 
SINTOMA: Síntoma: Imagen con tonalidad lavada, blanca o con "desgarramiento" oscuro en el sector recuperado. 
DESCARTES: Medir VSS e inyectar voltajes de referencia. 
SOLUCION: Inyectar 6V (tomados de condensadores de 6.8V) en la línea VSS del panel; inyectar entre 14V y 15V en la línea VGH del sector afectado para igualar el color.

21. =================================
MARCA: Samsung 
MODELO: 58TU 6900/7000/8000: 
SINTOMA: Síntoma: Imagen con problemas de corrector de gama (muy blanca) tras intervenir el sector derecho. 
DESCARTES: Observar si el sector izquierdo se sostiene solo pero presenta imagen blanca al intentar recuperar el derecho. 
SOLUCION: Reconstruir pistas del sector derecho y realizar la reparación (anulación de VSS/CK) en el sector izquierdo.

22.================================= 
MARCA: Samsung 
MODELO: 55DU7000K. 
SINTOMA:  Enciende directo con solo conectar a la AC.  No hay vídeo, no hay audio, no apaga del remoto, si hay backlight. 
DESCARTES: No hay voltaje de 12 en los conversores DC/DC en la Mainboard.
SOLUCION: Se encontró fusible abierto en la fuente DC/DC cerca al IC204 y un condensador SMD en corto circuito.

38. =================================
MARCA: Samsung 
MODELO: 58TU 6900/7000/8000. 
SINTOMA: Se reinicia. 
DESCARTES: Desconecto las cintas Flex, y continua reiniciando. 
SOLUCION: Necesito un video explicativo.
VIDEO: [https://player.mediadelivery.net/play/651071/9f6179be-1997-4144-b6dd-0d56cba9790b](https://player.mediadelivery.net/play/651071/9f6179be-1997-4144-b6dd-0d56cba9790b)


=== SECCIÓN GENÉRICOS === 


23.=================================

MARCA:  43" Genérico LED: Interrupción de circuito en retroiluminación. 
SINTOMA: Pantalla negra con sonido funcional. Prueba Dinámica: Realizar "Torch test" para confirmar imagen tenue y medir V-out en el driver LED. 
SOLUCION: Reemplazo de tiras LED en serie.


24. =================================
MARCA: 49" Edge LED: Agotamiento de diodos en bordes. 
SINTOMA: Esquinas oscuras y falta de uniformidad lumínica. Prueba Dinámica: Comprobación de tiras laterales con LED tester y verificación de alineación de la placa LGP. 
SOLUCION: Reemplazo de tiras Edge LED y realineación de hojas difusoras.


25. =================================
MARCA: 55" Genérico LED: Oxidación en vínculo de señales (COF). 
SINTOMA: Líneas verticales en la mitad izquierda de la pantalla. Prueba Dinámica: Aplicar calor controlado (aire caliente) sobre el COF para observar cambios temporales y medir rieles de la T-CON. 
SOLUCION: Reemplazo de panel por falla de unión (bonding).


26.=================================
MARCA: 49" Genérico LED: Desprendimiento de controlador de columna. 
SINTOMA: Línea vertical única en el sector derecho. Prueba Dinámica: Test de OSD para descartar Main Board y aplicar presión mecánica leve en los bordes del cristal. SOLUCION: Reemplazo de panel (daño estructural en COF).


 27.=================================

MARCA: 50" Genérico LED (Agotamiento): Degradación térmica por antigüedad. SINTOMA: Media pantalla con parpadeo constante. Prueba Dinámica: Aislamiento de ribbons de la T-CON y medición de estabilidad en voltajes VGH/VGL. 
SOLUCION: Declarar como chatarra (Scrap) debido a falla permanente en COF y edad del panel.


28. =================================
MARCA: 55" Samsung LED: Inestabilidad de señales de direccionamiento. 
SINTOMA: Parpadeo (flickering) en la mitad de la pantalla. Prueba Dinámica: Inspección visual de vínculos COF y descarte de voltajes de la placa T-CON. 
SOLUCION: Reemplazo total del panel


29.=================================
 MARCA: Genérico LED TV: Ausencia de señales de datos (White Screen). 
SINTOMA: Pantalla blanca total sin imagen ni menús. Prueba Dinámica: Medir continuidad de fusible T-CON y presencia de voltajes de conmutación VGH/VGL. 
SOLUCION: Limpieza de cables LVDS o reemplazo de placa T-CON.

30. =================================
MARCA: Genérico LED TV: Cortocircuito en drivers de fila. 
SINTOMA: Líneas horizontales estáticas o parpadeantes. Prueba Dinámica: Medición de rieles VGH, VGL y AVDD; inspección de ribbons de salida de T-CON. 
SOLUCION: Aislamiento por método de cinta Kapton o reemplazo de panel

31. =================================

MARCA: GENERICO 
MODELO: Main TP.MS338.PB801: Pegado en logo Android. 
CAUSA: Firmware corrupto o eMMC agotada. 
SOLUCION: Reinstalar soft o cambiar memoria.

32. =================================
MARCA: RCA 
MODELO: Main HK.T.RT2831P637: Pegado en el Logo. 
CAUSA: Firmware dañado. 
SOLUCION: En algunos sirve un Recovery mediante Consola. Si no funciona toca desoldar la memoria y grabarla con un Grabador como el RT809F o el H.


=== SECCIÓN LG === 


33. =================================
MARCA: LG 
MODELO: 32LB550B: Pantalla oscura. Síntoma: Hay sonido no hay imagen. Prueba: Voltaje driver LED > 72V. 
SOLUCION: Cambio de regletas.


34. =================================
MARCA: LG 
MODELO: 43” LED: Corrupción lógica de arranque. Síntoma: Bloqueo permanente en el logotipo inicial.. Prueba Dinámica: Verificación de estabilidad en hardware (voltajes y backlight estables) . 
SOLUCION: Ejecución de "Forced Recovery Mode" mediante firmware oficial vía USB.

35.================================= 
MARCA: LG 
MODELO: 42LN5700: Sonido ok, no hay imagen (se ve con linterna). Causa: LED abierto. 
SOLUCION: Cambiar kit completo y bajar corriente de LEDs.
=================================

36. =================================
MARCA: LG 
MODELO: Serie LJ/UJ: Imagen azulada/púrpura. Causa: Fósforo de LEDs agotado. SOLUCION: Cambio total de regletas LED.




=== SECCIÓN SONY ===


37.================================= 
MARCA: SONY 
MODELO: KDL-32M3000
SINTOMA: Imagen lenta y rojiza. 
DESCARTE: Se descarta T-CON y Mainboard. 
CAUSA: Falta VGH en COF lateral por pistas internas rotas. 
SOLUCION: Jumper desde T-CON a COF. 
[VIDEO]: https://player.mediadelivery.net/play/651071/4dddd57a-e922-4a3c-a433-54349eca2d34
[PDF]: https://www.mediafire.com/file/4g23cvomzdh62he/KDL-32M3000+Chasis+MA1.pdf/file
=================================

 

`;

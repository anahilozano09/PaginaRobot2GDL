const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

const X_min = -35;
const X_max = 35;
const Y_min = -35;
const Y_max = 35;

// 3. Mapeo de Coordenadas: de Plano a Píxel
/**
 * Convierte una coordenada X del plano (ej. -5) a una coordenada de píxel (ej. 125).
 * @param {number} x La coordenada X en el plano cartesiano.
 * @returns {number} La coordenada X en píxeles.
 */
function mapX(x) {
    // Escala: (x - X_min) / (X_max - X_min) da un valor entre 0 y 1
    // Multiplicado por W lo escala al ancho del canvas
    return W * (x - X_min) / (X_max - X_min);
}

/**
 * Convierte una coordenada Y del plano (ej. 5) a una coordenada de píxel (ej. 125).
 * @param {number} y La coordenada Y en el plano cartesiano.
 * @returns {number} La coordenada Y en píxeles.
 */
function mapY(y) {
    // Nota: Las coordenadas Y del canvas crecen hacia abajo. 
    // Por eso usamos (Y_max - y) en lugar de (y - Y_min) para invertir el eje.
    return H * (Y_max - y) / (Y_max - Y_min);
}

// 4. Funciones de Dibujo (Usando la Escala)

/**
 * Dibuja un punto en coordenadas cartesianas (x, y).
 * @param {number} x Coordenada X del plano.
 * @param {number} y Coordenada Y del plano.
 */
function dibujarPunto(x, y, color) {
    const px = mapX(x); // Transforma X
    const py = mapY(y); // Transforma Y

    ctx.beginPath();
    ctx.arc(px, py, 4, 0, 2 * Math.PI); // Radio ligeramente más grande para visibilidad
    ctx.fillStyle = color;
    ctx.fill();
}
  
/**
 * Dibuja una línea entre dos puntos en coordenadas cartesianas (x, y).
 * @param {number} x1 Coordenada X del punto 1.
 * @param {number} y1 Coordenada Y del punto 1.
 * @param {number} x2 Coordenada X del punto 2.
 * @param {number} y2 Coordenada Y del punto 2.
 */
function dibujarLinea(x1, y1, x2, y2, color, ancho) {
    const px1 = mapX(x1);
    const py1 = mapY(y1);
    const px2 = mapX(x2);
    const py2 = mapY(y2);

    ctx.beginPath();
    ctx.moveTo(px1, py1);
    ctx.lineTo(px2, py2);
    ctx.strokeStyle = color;
    ctx.lineWidth = ancho;
    ctx.stroke();
};


function dibujarEjes() {
    ctx.strokeStyle = '#000'; // Negro
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(mapX(X_min), mapY(0));
    ctx.lineTo(mapX(X_max), mapY(0));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(mapX(0), mapY(Y_min));
    ctx.lineTo(mapX(0), mapY(Y_max));
    ctx.stroke();
    
    drawTicks(); 

    ctx.fillStyle = 'black'
    ctx.font = '14px Arial'
    ctx.fillText('X [cm]', mapX(X_max) - 40, mapY(0) - 15)
    ctx.fillText('Y [cm]', mapX(0) + 18, mapY(Y_max) + 22)

    // Etiquetas de la grafica
    dibujarLinea(30,34,35,34,"Purple",7)
    etiqueta(24,33.2, "l1 inicial")
    dibujarLinea(30,32,35,32,"OrangeRed",7)
    etiqueta(24,31, "l2 inicial")
    dibujarLinea(30,30,35,30,"RebeccaPurple",7)
    etiqueta(22.5,29, "l1 deseado")
    dibujarLinea(30,28,35,28,"Orange",7)
    etiqueta(22.5,27, "l2 deseado")

}

function drawTicks() {
    ctx.fillStyle = '#555';
    ctx.font = '10px Arial';
    const tickLength = 4;
    
    // Marcas en el eje X
    for (let x = Math.ceil(X_min); x <= Math.floor(X_max); x++) {
        if (x !== 0 && x % 5 === 0 && (x > -35 && x < 35 )) { 
            const px = mapX(x);
            const py_origin = mapY(0);

            ctx.beginPath();
            ctx.moveTo(px, py_origin - tickLength);
            ctx.lineTo(px, py_origin + tickLength);
            ctx.stroke();

            ctx.fillText(x.toString(), px - 5, py_origin + 15);
        }
    }

    // Marcas en el eje Y
    for (let y = Math.ceil(Y_min); y <= Math.floor(Y_max); y++) {
        if (y !== 0 && y % 5 === 0 && (y > -35 && y < 35 )) { 
            const px_origin = mapX(0);
            const py = mapY(y);
    
            ctx.beginPath();
            ctx.moveTo(px_origin - tickLength, py);
            ctx.lineTo(px_origin + tickLength, py);
            ctx.stroke();
    
            ctx.fillText(y.toString(), px_origin + 5, py + 5);
        }
    }
}

dibujarEjes();

function etiqueta(x, y , texto, color='black'){
    px = mapX(x)
    py = mapY(y)
    ctx.fillStyle = color
    ctx.font = '12px Arial'
    ctx.fillText(texto, px+5, py-5)

}

// Coordenadas iniciales
// Se define la funcion que maneja el estado inicial de los eslabones

function estadoInicial(){
    l1 = 12
    l2 = 12
    c = 2
    l2_c = l2 + c
    Xi = 14
    Yi = 14

    dist = Math.sqrt((Math.pow(Xi,2))+(Math.pow(Yi,2)))

    alpha_rad= Math.atan2(Yi,Xi)

    D = (Math.pow(l1, 2) + Math.pow(l2_c, 2) - Math.pow(dist, 2)) / (2 * l1 * l2_c);

    sin_beta = Math.sqrt(1-Math.pow(D,2))
    beta_rad = Math.atan2(sin_beta, D)

    //theta_1 = 90 grados, esto es igual a pi medios
    theta_1a_rad = Math.PI / 2

    X_l1 = l1*Math.cos(theta_1a_rad)
    Y_l1 = l1*Math.sin(theta_1a_rad)

    //Obteniendo las distancias que hay entre X_l1 y Y_l1 respecto a Xi y Yi
    dif_x = Xi - X_l1
    dif_y = Yi - Y_l1

    theta_2a_rad = Math.atan2(dif_y,dif_x) - theta_1a_rad


    X_l2 = X_l1 + l2*Math.cos(theta_1a_rad+theta_2a_rad)
    Y_l2 = Y_l1 + l2*Math.sin(theta_1a_rad+theta_2a_rad)

    dibujarLinea(0,0,X_l1,Y_l1,"Purple",4)
    dibujarLinea(X_l1,Y_l1, X_l2, Y_l2, "OrangeRed",4)

    //Dibujamos la pinza
   
    anguloTotal = theta_1a_rad + theta_2a_rad
    dibujarPinza(X_l2, Y_l2, anguloTotal, 2)


    dibujarPunto(Xi,Yi, "Red")
    etiqueta(Xi, Yi, `(${Xi},${Yi})`, "Red")

}

function dibujarPinza(Xf, Yf, anguloTotal, longitud){
    direccion_X = Math.cos(anguloTotal)
    direccion_Y = Math.sin(anguloTotal)

    perp_X = -direccion_Y
    perp_Y = direccion_X

    base_X = Xf
    base_Y = Yf

    punta_X = Xf + direccion_X * longitud
    punta_Y = Yf + direccion_Y * longitud

    garra_1_X = punta_X + perp_X * 1
    garra_1_Y = punta_Y + perp_Y * 1

    garra_2_X = punta_X - perp_X * 1
    garra_2_Y = punta_Y - perp_Y * 1

    dibujarLinea(base_X, base_Y, punta_X, punta_Y, "Gray", 2)
    dibujarLinea(punta_X, punta_Y, garra_1_X, garra_1_Y, "Gray", 2)
    dibujarLinea(punta_X, punta_Y, garra_2_X, garra_2_Y, "Gray", 2)

}

function trayectoria(x1, y1, x2, y2, color, ancho){
    longitud_segmento = 5
    distancia_segmento = 3

    dist_X = x2 - x1
    dist_Y = y2 - y1

    dist_Total = Math.sqrt(Math.pow(dist_X,2)+Math.pow(dist_Y,2))
    pasos = dist_Total / (longitud_segmento + distancia_segmento)

    direccion_X = dist_X / dist_Total
    direccion_Y = dist_Y / dist_Total

    px_1 = mapX(x1)
    py_1 = mapY(y1)
    px_2 = mapX(x2)
    py_2 = mapY(y2)

    ctx.strokeStyle = color
    ctx.lineWidth = ancho
    
    ctx.setLineDash([longitud_segmento, distancia_segmento])
    ctx.beginPath()
    ctx.moveTo(px_1, py_1)
    ctx.lineTo(px_2, py_2)
    ctx.stroke()

    ctx.setLineDash([])

}


const formulario = document.getElementById("CoordenadasUsuario");

function coordDest (event){
    event.preventDefault();

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    dibujarEjes()
    estadoInicial()

    const Xd = document.getElementById("Xd").value;
    const Yd = document.getElementById("Yd").value;

    if (!isNaN(Xd) && !isNaN(Yd)){
        dibujarPunto(Xd,Yd,"red");

        //Calculando el eslabon l1
        l1 = 12
        l2 = 12
        c = 2
        l2_c = l2+c
        
        dist = Math.sqrt((Math.pow(Xd,2))+(Math.pow(Yd,2)))

        alpha_rad= Math.atan2(Yd,Xd)
        alpha_grad = alpha_rad*180/Math.PI

        
        if (dist > (l1+l2_c) || dist < Math.abs(l1-l2_c)){
            alert("El punto (" + Xd + "," + Yd + ") está fuera del alcance del robot.")
            return;
        }

        //Checar esto
        D = (Math.pow(l1, 2) + Math.pow(l2_c, 2) - Math.pow(dist, 2)) / (2 * l1 * l2_c);

        sin_beta = Math.sqrt(1-Math.pow(D,2))
        beta_rad = Math.atan2(sin_beta, D)

        //Checar las ecuaciones
        //Es 1-D²
        //Codo abajo
        theta_2a_rad = Math.PI-beta_rad


        gamma_a_rad = Math.atan2(l2_c * Math.sin(theta_2a_rad), l1 + l2_c * Math.cos(theta_2a_rad))

        theta_1a_rad = alpha_rad - gamma_a_rad


        //Para el eslabon 1

        X_l1 = l1*Math.cos(theta_1a_rad)
        Y_l1 = l1*Math.sin(theta_1a_rad)


        //Para el eslabon 2
        X_l2 = l1*Math.cos(theta_1a_rad) + l2*Math.cos(theta_1a_rad+theta_2a_rad)
        Y_l2 = l1*Math.sin(theta_1a_rad) + l2*Math.sin(theta_1a_rad+theta_2a_rad)

        //Calculamos el angulo total para dibujar la pinza
        anguloTotal = theta_1a_rad + theta_2a_rad

        
        dibujarLinea(0,0,X_l1,Y_l1,"RebeccaPurple",4)
        dibujarLinea(X_l1,Y_l1, X_l2, Y_l2, "Orange",4)
        dibujarPinza(X_l2,Y_l2,anguloTotal,2)

        dibujarPunto(Xd, Yd, "Green")

        etiqueta(Xd, Yd, `(${Xd}, ${Yd})`, "Green")

        trayectoria(Xi, Yi, Xd, Yd, "Blue", 2)

        //Graficamos

        datos = obtenerTrayectoria(Xi, Yi, Xd, Yd, l1, l2, c)
        graficarAngulos(datos)
       
    }
    else{
        alert("Los valores ingresados no son válidos")
    }
    
}

//Funciones para la grafica de los angulos respecto al tiempo

function angulos(x, y , l1, l2, c){
    l2_c = l2+c
    dist = Math.sqrt(Math.pow(x,2)+Math.pow(y,2))
    if (dist < 1e-6) return { theta_1: 0, theta_2: 0 };

    D = (l1**2 + l2_c**2 - dist**2) / (2 * l1 * l2_c)
    D = Math.max(-1, Math.min(1,D))

    sin_beta = Math.sqrt(Math.max(0, (1-Math.pow(D,2))))
    beta_rad = Math.atan2(sin_beta, D)
    theta_2 = Math.PI - beta_rad
    alpha_rad = Math.atan2(y,x)
    gamma_rad =  Math.atan2(l2_c * Math.sin(theta_2), l1 + l2_c * Math.cos(theta_2))
    theta_1 = alpha_rad - gamma_rad

    return {theta_1, theta_2}
}

function obtenerTrayectoria(Xi, Yi, Xd, Yd, l1, l2, c) {
    arreglo_tiempo = [];
    paso_tiempo = 0.01;      
    tiempo_final = 20;   

    for (let t = 0; t <= tiempo_final; t += paso_tiempo) {
        const x = Xi + (t / tiempo_final) * (Xd - Xi);
        const y = Yi + (t / tiempo_final) * (Yd - Yi);

        const { theta_1, theta_2 } = angulos(x, y, l1, l2, c);
        arreglo_tiempo.push({ t, theta_1, theta_2 });
    }

    return arreglo_tiempo;
}


function graficarAngulos(datos) {
    const canvas_G = document.getElementById("grafica");
    const ctx_G = canvas_G.getContext("2d");
    ctx_G.clearRect(0, 0, canvas_G.width, canvas_G.height);

    const margen = 50;
    const W = canvas_G.width - 2 * margen;
    const H = canvas_G.height - 2 * margen;

    // Convertir todos los ángulos a grados
    const datos_grados = datos.map(d => ({
        t: d.t,
        theta_1: d.theta_1 * 180 / Math.PI,
        theta_2: d.theta_2 * 180 / Math.PI
    }));

    const tiempo_max = Math.max(...datos_grados.map(d => d.t));
    const tiempo_min = Math.min(...datos_grados.map(d => d.t));
    const theta_1_max = Math.max(...datos_grados.map(d => d.theta_1));
    const theta_1_min = Math.min(...datos_grados.map(d => d.theta_1));
    const theta_2_max = Math.max(...datos_grados.map(d => d.theta_2));
    const theta_2_min = Math.min(...datos_grados.map(d => d.theta_2));
    const global_max = Math.max(theta_1_max, theta_2_max);
    const global_min = Math.min(theta_1_min, theta_2_min);

    // Funciones de mapeo
    function mapT(t) {
        return margen + ((t - tiempo_min) / (tiempo_max - tiempo_min)) * W;
    }
    function mapTheta(th) {
        return margen + H - ((th - global_min) / (global_max - global_min)) * H;
    }

    // --- Ejes ---
    ctx_G.strokeStyle = "#333";
    ctx_G.lineWidth = 1.2;
    ctx_G.beginPath();
    ctx_G.moveTo(margen, margen);
    ctx_G.lineTo(margen, margen + H);
    ctx_G.lineTo(margen + W, margen + H);
    ctx_G.stroke();

    // --- Etiquetas de los ejes ---
    ctx_G.fillStyle = "black";
    ctx_G.font = "13px Arial";
    ctx_G.textAlign = "center";
    ctx_G.fillText("Tiempo (t)", margen + W / 2, margen + H + 35);

    ctx_G.save();
    ctx_G.translate(15, margen + H / 2);
    ctx_G.rotate(-Math.PI / 2);
    ctx_G.textAlign = "center";
    ctx_G.fillText("Ángulo (°)", 0, 0);
    ctx_G.restore();

    // --- Ticks eje X ---
    const numTicksX = 10;
    ctx_G.textAlign = "center";
    ctx_G.font = "11px Arial";
    for (let i = 0; i <= numTicksX; i++) {
        const t = tiempo_min + (i / numTicksX) * (tiempo_max - tiempo_min);
        const x = mapT(t);
        ctx_G.beginPath();
        ctx_G.moveTo(x, margen + H);
        ctx_G.lineTo(x, margen + H + 5);
        ctx_G.stroke();
        ctx_G.fillText(t.toFixed(1), x, margen + H + 20);
    }

    // --- Ticks eje Y ---
    const numTicksY = 8;
    ctx_G.textAlign = "right";
    ctx_G.font = "11px Arial";
    for (let i = 0; i <= numTicksY; i++) {
        const th = global_min + (i / numTicksY) * (global_max - global_min);
        const y = mapTheta(th);
        ctx_G.beginPath();
        ctx_G.moveTo(margen - 5, y);
        ctx_G.lineTo(margen, y);
        ctx_G.stroke();
        ctx_G.fillText(th.toFixed(1), margen - 10, y + 3);
    }

    // --- Curva θ₁ ---
    ctx_G.strokeStyle = "blue";
    ctx_G.lineWidth = 1.8;
    ctx_G.beginPath();
    for (let i = 0; i < datos_grados.length; i++) {
        const x = mapT(datos_grados[i].t);
        const y = mapTheta(datos_grados[i].theta_1);
        if (i === 0) ctx_G.moveTo(x, y);
        else ctx_G.lineTo(x, y);
    }
    ctx_G.stroke();

    // --- Curva θ₂ ---
    ctx_G.strokeStyle = "red";
    ctx_G.lineWidth = 1.8;
    ctx_G.beginPath();
    for (let i = 0; i < datos_grados.length; i++) {
        const x = mapT(datos_grados[i].t);
        const y = mapTheta(datos_grados[i].theta_2);
        if (i === 0) ctx_G.moveTo(x, y);
        else ctx_G.lineTo(x, y);
    }
    ctx_G.stroke();

    // --- Leyenda en recuadro ---
    const legendX = margen + W - 130;
    const legendY = margen + 10;
    const legendW = 110;
    const legendH = 40;

    ctx_G.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx_G.strokeStyle = "#aaa";
    ctx_G.lineWidth = 1;
    ctx_G.beginPath();
    ctx_G.rect(legendX, legendY, legendW, legendH);
    ctx_G.fill();
    ctx_G.stroke();

    // Texto dentro de la leyenda
    ctx_G.font = "13px Arial";
    ctx_G.textAlign = "left";
    ctx_G.fillStyle = "blue";
    ctx_G.fillText("θ1(t)", legendX + 25, legendY + 15);
    ctx_G.fillStyle = "red";
    ctx_G.fillText("θ2(t)", legendX + 25, legendY + 32);

    // Líneas de color en la leyenda
    ctx_G.strokeStyle = "blue";
    ctx_G.beginPath();
    ctx_G.moveTo(legendX + 8, legendY + 10);
    ctx_G.lineTo(legendX + 22, legendY + 10);
    ctx_G.stroke();

    ctx_G.strokeStyle = "red";
    ctx_G.beginPath();
    ctx_G.moveTo(legendX + 8, legendY + 27);
    ctx_G.lineTo(legendX + 22, legendY + 27);
    ctx_G.stroke();
}



const boton = document.getElementById("Coordenadas");
boton.addEventListener("click", coordDest);
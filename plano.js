const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;


const X_MIN = -35;
const X_MAX = 35;
const Y_MIN = -35;
const Y_MAX = 35;

// 3. Mapeo de Coordenadas: de Plano a Píxel
/**
 * Convierte una coordenada X del plano (ej. -5) a una coordenada de píxel (ej. 125).
 * @param {number} x La coordenada X en el plano cartesiano.
 * @returns {number} La coordenada X en píxeles.
 */
function mapX(x) {
    // Escala: (x - X_MIN) / (X_MAX - X_MIN) da un valor entre 0 y 1
    // Multiplicado por W lo escala al ancho del canvas
    return W * (x - X_MIN) / (X_MAX - X_MIN);
}

/**
 * Convierte una coordenada Y del plano (ej. 5) a una coordenada de píxel (ej. 125).
 * @param {number} y La coordenada Y en el plano cartesiano.
 * @returns {number} La coordenada Y en píxeles.
 */
function mapY(y) {
    // Nota: Las coordenadas Y del canvas crecen hacia abajo. 
    // Por eso usamos (Y_MAX - y) en lugar de (y - Y_MIN) para invertir el eje.
    return H * (Y_MAX - y) / (Y_MAX - Y_MIN);
}

// 4. Funciones de Dibujo (Usando la Escala)

/**
 * Dibuja un punto en coordenadas cartesianas (x, y).
 * @param {number} x Coordenada X del plano.
 * @param {number} y Coordenada Y del plano.
 */
function drawPoint(x, y, color) {
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
function drawLine(x1, y1, x2, y2, color, ancho) {
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


function drawAxes() {
    ctx.strokeStyle = '#000'; // Negro
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(mapX(X_MIN), mapY(0));
    ctx.lineTo(mapX(X_MAX), mapY(0));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(mapX(0), mapY(Y_MIN));
    ctx.lineTo(mapX(0), mapY(Y_MAX));
    ctx.stroke();
    
    drawTicks(); 
}

function drawTicks() {
    ctx.fillStyle = '#555';
    ctx.font = '10px Arial';
    const tickLength = 4;
    
    // Marcas en el eje X
    for (let x = Math.ceil(X_MIN); x <= Math.floor(X_MAX); x++) {
        if (x !== 0 && x % 5 === 0) { 
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
    for (let y = Math.ceil(Y_MIN); y <= Math.floor(Y_MAX); y++) {
        if (y !== 0 && y % 5 === 0) { 
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

drawAxes();

// Coordenadas iniciales

//Eslabon 1 (morado), eslabon 2 (naranja)
drawLine(0, 0, 14, 0, "purple",4);
drawLine(14, 0, 14, 14, "orangered",4);

//Pinza
drawLine(14,14,14,15.5,"gray",1.5);
drawLine(14,15.5,13,15.5,"gray",1.5);
drawLine(13,15.5,13,16.5,"gray",1.5);
drawLine(14,15.5,15,15.5,"gray",1.5);
drawLine(15,15.5,15,16.5,"gray",1.5);


drawPoint(0, 0, "black");
drawPoint(14, 14, "black");
drawPoint(14, 0, "black");

//Coordenadas dadas por el usuario

const formulario = document.getElementById("CoordenadasUsuario");

function coordDest (event){
    event.preventDefault();

    const Xd = document.getElementById("Xd").value;
    const Yd = document.getElementById("Yd").value;

    if (!isNaN(Xd) && !isNaN(Yd)){
        drawPoint(Xd,Yd,"red");

        //Calculando el eslabon l1
        l1 = 12
        l2 = 12
        c = 2
        dist = Math.sqrt((Math.pow(Xd,2))+(Math.pow(Yd,2)))
        // console.log("El valor de la distancia es: ", dist)
        alpha_rad = Math.atan2(Yd,Xd)
        alpha_grad = alpha_rad*180/Math.PI
        // console.log("El valor de phi en radianes es: ", phi_rad)
        // console.log("El valor de phi en grados es:", phi_grad)
        
        if (dist > (l1+l2) || dist < Math.abs(l1-l2)){
            alert("El punto (" + Xd + "," + Yd + ") está fuera del alcance del robot.");
            return;
        }

        //Checar esto
        D_rad = (Math.pow(dist,2)-Math.pow(l1,2)-Math.pow(l2+c,2))/((2*l1)(l2+c))
        D_grad = D_rad*180/Math.PI

        //Es 1-D²
        //theta_2_rad = Math.atan2(Math.sqrt(1-))



        // // console.log("El valor de alpha en radianes es:", alpha_rad)
        // // console.log("El valor de alpha en grados es:", alpha_grad)
        // beta_rad = Math.acos()
        // beta_grad = beta_rad*180/Math.PI

        // theta_positivo = Math.PI - beta_rad
        // theta_negativo = -(Math.PI - beta_rad)

        // //Codo abajo
        // codo_abajo = phi_rad + alpha_rad

        // //Codo arriba
        // codo_arriba = phi_rad - alpha_rad

        // //Para codo abajo

        // X_union_abajo = l1*Math.cos(codo_abajo)
        // Y_union_abajo = l2*Math.sin(codo_abajo)

        // drawLine(0,0,X_union_abajo,Y_union_abajo,"RebeccaPurple")
        // drawLine(X_union_abajo,Y_union_abajo, Xd, Yd, "Orange")

        // //Para codo arriba

        // X_union_arriba = l1*Math.cos(codo_arriba)
        // Y_union_arriba = l2*Math.sin(codo_arriba)

        // drawLine(0,0,X_union_arriba,Y_union_arriba,"Orchid")
        // drawLine(X_union_arriba,Y_union_arriba, Xd, Yd, "DeepPink")
    }
    else{
        alert("Los valores ingresados no son válidos")
    }
    
}

const boton = document.getElementById("Coordenadas");
boton.addEventListener("click", coordDest);
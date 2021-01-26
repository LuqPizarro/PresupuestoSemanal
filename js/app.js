// Variables
const formulario = document.querySelector('#agregar-gasto');
const listaGastos = document.querySelector('#gastos');


// Eventos
eventListeners()
function eventListeners(){
    
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto)

}


// Clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = []
    };


    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante()
    };

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado
    };


    // El quilombo es aca
    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id)
        this.calcularRestante()
    }
    
};

class UI{

    insertarPresupuesto(cantidad){
        const {presupuesto, restante} = cantidad;

        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    };

    imprimirAlerta(mensaje, tipo){
        const div = document.createElement('div');
        div.classList.add('text-center', 'alert');
        div.textContent = mensaje;

        if(tipo === 'error'){
            div.classList.add('alert-danger')
        } else {
            div.classList.add('alert-success')
        };

        document.querySelector('.primario').insertBefore(div, formulario);

        setTimeout(() =>{
            div.remove()
        }, 2000)
    };

    mostrarGastos(gastos){

        this.limpiarHTML();

        gastos.forEach( gasto => {
            
            const {nombre, cantidad, id} = gasto
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            li.dataset.id = id;
            li.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> €${cantidad} </span>`

            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = '&times';
            btnBorrar.onclick = () => {
                eliminarGasto(id)
            }
            li.appendChild(btnBorrar);

            listaGastos.appendChild(li)

        });
    }

    limpiarHTML(){
        while(listaGastos.firstChild){
            listaGastos.removeChild(listaGastos.firstChild)
        }
    };

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    };

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;
        const div = document.querySelector('.restante')

        if((presupuesto / 4) > restante){
            div.classList.remove('alert-success', 'alert-warning');
            div.classList.add('alert-danger');
        } else if((presupuesto/2) > restante) {
            div.classList.remove('alert-success');
            div.classList.add('alert-warning')
        } else {
            div.classList.remove('alert-danger', 'alert-warning');
            div.classList.add('alert-success')
        }

        if(restante <= 0){
            ui.imprimirAlerta('Se agoto el saldo', 'error');
            document.querySelector('button[type="submit"]').disabled = true;
        } else {
            document.querySelector('button[type="submit"]').disabled = false
        }
    }
}



//Instancia
let presupuesto;
const ui = new UI();



//Funciones
function preguntarPresupuesto(){

    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?')
    
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    };

    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);

};

function agregarGasto(e){
    e.preventDefault();

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if (nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');

        return;
    } else if (cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error')

        return;
    }


    const gasto = {nombre, cantidad, id: Date.now()};

    presupuesto.nuevoGasto(gasto);

    ui.imprimirAlerta('Gasto agregado correctamente');

    const {gastos, restante} = presupuesto
    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto)

    formulario.reset()

};

function eliminarGasto(id){
    presupuesto.eliminarGasto(id)

    const {gastos, restante} = presupuesto
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto)

}
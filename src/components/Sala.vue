<template>
    <div class="container">
        <div class="pantalla">
            <p class="font-weight:bold">Pantalla</p>
        </div>

        <div class="container asientos">
            <div class="row">
                <div class="col asiento" 
                v-for="item in asientos" 
                :key="item" v-text="item.id" 
                v-bind:id="item.id"
                v-bind:class="{disponible: item.disponible, ocupado: !item.disponible, pointer: asientoDisponible(item)}"
                @click="selectAsiento">
                    
                </div>
            </div>
        </div>
        <div class="botones">
            <b-button :aria-disabled="contador == 0" @click="guardar" variant="success">Guardar</b-button>
            <b-button style="margin-left:10px;" :aria-disabled="contador == 0" @click="cancelar" variant="danger">Cancelar</b-button>
            <b-button style="margin-left:10px;" @click="liberar">Liberar</b-button>
        </div>

        <div style="margin-top:25px;">
            <strong>Asientos Seleccionados {{contador}} </strong>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase';

const path = 'salas'
const pathId = '1'

export default {
    created(){
        //this.actualizarEle()
        this.id = firebase.database().ref('/users').push().key
        
        firebase.database()
        .ref(path)
        .child(pathId)
        .on('value', snapshot => this.cargarEle(snapshot.val() ) )
    },
    data(){
        return{
            id: '',
            contador: 0,
            asientos:[]
        }
    },
    methods: {
        selectAsiento: function(event){
            let asiento = this.asientos.find(a => a.id == event.target.id)
            if (asiento.adquirido || (asiento.user_id != null && asiento.user_id != this.id)){

                this.$notify({
                    group: 'foo', type:'error', title:'Error', text:'No es posible seleccionar el asiento '+asiento.id
                })
                return
            }
            asiento.disponible = !asiento.disponible 
            asiento.user_id = this.id
            this.actualizarEle()

            this.contador = this.asientosSelec().length
        },
        actualizarEle: function(){
            this.validarAsientos()
            firebase.database()
            .ref(path)
            .child(pathId)
            .set(this.asientos)
        },
        validarRespuesta: function(error,commited,snapshot){
            if (error){
                this.$notify({
                    group: 'foo', type:'error', title:'Error', text:'No es posible completar la operacion'
                })
            }
            if(commited){
                this.$notify({
                    group: 'foo', type:'success', title:'Exito', text:'Asientos adquiridos con Exito'
                })
            }

            console.log(snapshot.val())
        },
        cargarEle: function(data){
            this.asientos = data
        },
        validarAsientos: function(){
            this.asientosSelec().forEach(function(asiento){
                asiento.adquirido = true
            })
        },
        guardar: function(){
            firebase.database()
            .ref(path)
            .child(pathId)
            .transaction(
                valoresDB => this.validarCompra(valoresDB),
                (error,commited,snapshot) => this.validarRespuesta(error,commited,snapshot)
            )
            this.contador = 0
        },
        validarCompra: function(valoresDB){
            this.asientosSelec().forEach(function(asiento){
                if (valoresDB.find(a => a.id == asiento.id).adquirido){
                    return
                }
                asiento.adquirido = true
            })
            return this.asientos
        },
        cancelar: function(){
            this.asientosSelec().forEach(function(asiento){
                asiento.user_id = null
                asiento.disponible = true
            })
            this.actualizarEle()
            this.contador = 0
        },
        asientoDisponible: function(asiento){
            return !asiento.adquirido && (asiento.user_id == null || asiento.user_id == this.id)
        },
        asientosSelec: function(){
            return this.asientos.filter(a => !a.disponible && !a.adquirido)
        },
        liberar: function(){
            this.asientos.forEach(function(asiento){
                asiento.adquirido = false
                asiento.disponible = true
                asiento.user_id = null
            })
            this.actualizarEle()
            this.contador = 0
        }
    }
}
</script>

<style >
.pantalla{
    background-color: hsl(70, 82%, 60%);
}
p{
    color: white;
    font-size: 1.8em;
}
.asientos{
    margin-top: 60px;
}
.asiento{
    color: white;
    margin: 3px;
    font-weight: bold;
}
.disponible{
    background-color: hsl(138, 100%, 58%);
}
.ocupado{
    background-color: hsl(0, 89%, 48%);
}
.botones{
    margin-top: 1em;
}
.pointer{
    cursor: pointer;
}
</style>
export interface Animales{

    idanimal: string;
    nombre: string;
    tropilla: string;
    categoria: string;
    orejaizquierda: string;
    orejaderecha: string;
    alta: string;
    baja: string;
    causabaja: string;
    peso: string;
    editable?: boolean;
    editableAgregar?: boolean;
    agregar?: boolean;
    backup?: string;

}  

export interface CausasdeBaja{
    causabaja: string;
    nombre: string;
    editable?: boolean;
    editableAgregar?: boolean;
    agregar?: boolean;
    backup?: string;
}

export interface Tropillas{
    tropilla: string;
    nombre: string;
    empresa: string;
    alta: string;
    editable?: boolean;
    editableAgregar?: boolean;
    agregar?: boolean;
    backup?: string;
}

export interface Corral{
    lotecorral: string;
    nombre: string;
    tipo: string;
    hectareas: string;
    numero: string;
    deposito: string;
    editable?: boolean;
    editableAgregar?: boolean;
    agregar?: boolean;
    backup?: string;
}
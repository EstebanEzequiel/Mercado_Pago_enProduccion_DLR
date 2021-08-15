export interface Endpoints {
    backupEndpoint?: string;
    backupMetodo?: string;
    backupTabla?: string;
    endpoint: string;
    metodo: string;
    seguridad: string;
    tabla: string;
    endpointProp: EndpointProperties[];
    editable?: boolean;
    editableAgregar?: boolean;
    agregar?: boolean;
  
}

export interface EndpointProperties {
    backupEndpoint?: string;
    backupMetodo?: string;
    endpoint: string;
    metodo: string;
    propiedad: string;
    columna: string;
    requerido: string;
    tipo: number;
    editableP?: boolean;
    editableAgregarP?: boolean;
    agregarP?: boolean;
    params?: boolean
}

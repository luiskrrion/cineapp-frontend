import { Usuario } from './usuario';

export class Cliente {
    idCliente: number;
    nombres: string;
    apellidos: string;
    fechaNac: Date;
    dni: string;
    usuario: Usuario;
    
    _foto: any;
    _isFoto: boolean;
}
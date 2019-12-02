import { Cliente } from './../_model/cliente';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  
  clienteCambio = new Subject<Cliente[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST}/clientes`;    
  //url: string = `${environment.HOST}/${environment.MICRO_CRUD}/clientes`;
  
  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Cliente[]>(this.url);
    console.log("paso aqui listar");
  }

  fotoPorId(id: number){
    return this.http.get(`${this.url}/foto/${id}`, {
      responseType: 'blob'
    });
    console.log("paso aqui fotoPorId");
  }

  listarPorId(id: number) {
    return this.http.get(`${this.url}/${id}`);
    console.log("paso aqui listarPorId");
  }


  registrar(cliente: Cliente, file?: File) {
    let formdata: FormData = new FormData();
    formdata.append('file', file);

    const clienteBlob = new Blob([JSON.stringify(cliente)], { type: "application/json" });
    formdata.append('cliente', clienteBlob);

    const usuarioBlob = new Blob([JSON.stringify(cliente.usuario)], {type: "application/json"});
    formdata.append('usuario', usuarioBlob);

    return this.http.post(`${this.url}`, formdata);
    console.log("paso aqui registrar");
  }

  modificar(cliente: Cliente, file?: File) {
    let formdata: FormData = new FormData();
    formdata.append('file', file);

    const clienteBlob = new Blob([JSON.stringify(cliente)], { type: "application/json" });
    formdata.append('cliente', clienteBlob);

    const usuarioBlob = new Blob([JSON.stringify(cliente.usuario)], {type: 'application/json'});
    formdata.append('usuario', usuarioBlob);
    
    return this.http.put(`${this.url}`, formdata);
    console.log("paso aqui modificar");
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
  
}

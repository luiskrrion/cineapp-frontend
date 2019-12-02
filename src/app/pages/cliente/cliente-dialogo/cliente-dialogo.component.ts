import { Usuario } from './../../../_model/usuario';
import { Cliente } from 'src/app/_model/cliente';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ClienteService } from 'src/app/_service/cliente.service';
import { UsuarioService } from 'src/app/_service/usuario.service';

@Component({
  selector: 'app-cliente-dialogo',
  templateUrl: './cliente-dialogo.component.html',
  styleUrls: ['./cliente-dialogo.component.css']
})
export class ClienteDialogoComponent implements OnInit {

  cliente: Cliente;
  usuario: Usuario;
  imagenData: any;
  imagenEstado: boolean = false;
  selectedFiles: FileList;
  currentFileUpload: File;
  labelFile: string;

  constructor(private dialogRef: MatDialogRef<ClienteDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data: Cliente, private clienteService: ClienteService, private usuarioService: UsuarioService, private sanitization: DomSanitizer) { }

  ngOnInit() {
    this.cliente = new Cliente();
    this.usuario = new Usuario();

    if (this.data.idCliente > 0) {
      this.usuarioService.listarPorId(this.data.idCliente).subscribe( info => {
        this.cliente.idCliente = info['cliente'].idCliente;
        this.cliente.apellidos = info['cliente'].apellidos;
        this.cliente.nombres = info['cliente'].nombres;
        this.cliente.fechaNac = info['cliente'].fechaNac;
        this.cliente.dni = info['cliente'].dni;
        this.usuario.nombre = info['nombre'];
      });

      this.clienteService.fotoPorId(this.data.idCliente).subscribe(data => {
        if (data.size > 0) {
          this.convertir(data);
        }
      });
    }

  }

  convertir(data: any) {
    let reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      let base64 = reader.result;      
      //this.imagenData = base64;      
      this.setear(base64);
    }
  }

  setear(x: any) {
    this.imagenData = this.sanitization.bypassSecurityTrustResourceUrl(x);
    this.imagenEstado = true;
  }

  operar() {
    this.cliente.usuario = this.usuario;

    if (this.selectedFiles != null) {
      this.currentFileUpload = this.selectedFiles.item(0);
    } else {
      this.currentFileUpload = new File([""], "blanco");
    }

    if (this.cliente != null && this.cliente.idCliente > 0) {
      this.clienteService.modificar(this.cliente, this.currentFileUpload).subscribe(data => {
        this.clienteService.listar().subscribe(clientes => {
          this.clienteService.clienteCambio.next(clientes);
          this.clienteService.mensajeCambio.next("Se modifico");
        });
      });
    } else {
      this.clienteService.registrar(this.cliente, this.currentFileUpload).subscribe(data => {
        this.clienteService.listar().subscribe(clientes => {
          this.clienteService.clienteCambio.next(clientes);
          this.clienteService.mensajeCambio.next("Se registro");
        });
      });
    }
    this.dialogRef.close();
  }

  selectFile(e: any) {    
    console.log(e);
    this.labelFile = e.target.files[0].name;
    this.selectedFiles = e.target.files;
  }

  cancelar() {
    this.dialogRef.close();
  }
  
}
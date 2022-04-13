 ;GENERADO CON INNO SCRIPT STUDIO
;https://www.kymoto.org/products/inno-script-studio


#define MyAppName "mercadopago"
#define MyAppVersion "0.0.1"
#define MyAppPublisher "DLR S.A"
#define MyAppURL "http://www.dlr.com.ar/"
#define MyAppExeName "mercadopago.exe"

[Setup]
AppId={{456ASFDS-45DS-F4D5-A4G9-456EAC938F94}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName=C:\Sistemas\{#MyAppName}
DefaultGroupName={#MyAppName}
OutputBaseFilename=InstallMercadoPago
Compression=lzma
SolidCompression=yes

[Languages]
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "mercado_pago.exe"; DestDir: "{app}"; DestName: "{#MyAppExeName}"; Flags: ignoreversion
Source: "srv-config.json"; DestDir: "{app}"; DestName: "srv-config.json"; Flags: ignoreversion onlyifdoesntexist
Source: "nssm"; DestDir: "{app}"; DestName: "nssm.exe"; Flags: ignoreversion
; NOTE: Don't use "Flags: ignoreversion" on any shared system files
Source: "DB.sql"; DestDir: "{app}"; DestName: "DB.sql"; Flags: ignoreversion

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\nssm.exe"; Parameters: "install mercadopago ""{app}\{#MyAppExeName}"""; Flags: runhidden waituntilterminated
Filename: "{app}\nssm.exe"; Parameters: "set mercadopago Start SERVICE_DELAYED_AUTO_START"; Flags: runhidden waituntilterminated
Filename: "{app}\nssm.exe"; Parameters: "start mercadopago"; Flags: runhidden waituntilterminated

[UninstallRun]
Filename: {app}\nssm.exe; Parameters: "stop mercadopago" ; Flags: runhidden waituntilterminated
Filename: {app}\nssm.exe; Parameters: "remove mercadopago" ; Flags: runhidden waituntilterminated

[PreCompile]
Name: "compilar.bat"; Flags: cmdprompt redirectoutput runminimized

[Code]
var
  CustomQueryPage: TInputQueryWizardPage;

procedure AddCustomQueryPage();
begin
  CustomQueryPage := CreateInputQueryPage(
    wpWelcome,
    'Seleccion el nombre del servicio',
    'Antes de continuar asegurese de que no existe un servicio con el mismo nombre',
    'Este nombre identificara a la instancia de PedidosAluwindWeb');

  { Add items (False means it's not a password edit) }
  CustomQueryPage.Add('Nombre de Servicio:', False);
  CustomQueryPage.Values[0] := 'PedidosAluwind';
end;

procedure InitializeWizard();
begin
end;

function GetServiceName(Value: string): string;
begin
  Result := CustomQueryPage.Values[0]
end;
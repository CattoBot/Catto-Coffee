# Función para mostrar una UI sencilla con Out-GridView
function Show-Menu {
    param (
        [string]$Title,
        [string[]]$Options
    )

    $selection = $Options | Out-GridView -Title $Title -PassThru
    return $selection
}

# Menú principal
$mainMenuOptions = @("Instalar Dependencias", "Actualizar Dependencias", "Desinstalar Programas", "Salir")
$mainSelection = Show-Menu -Title "Catto Coffee - Instalador" -Options $mainMenuOptions

# Funciones para instalar dependencias
function Install-Dependencies {
    Write-Host "Iniciando la instalación de dependencias..."

    # Instalación de Winget
    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
        Write-Host "Instalando Winget..."
        # Descarga e instalación de Winget
        Invoke-WebRequest -Uri "https://aka.ms/getwinget" -OutFile "winget.msixbundle"
        Add-AppxPackage winget.msixbundle
    } else {
        Write-Host "Winget ya está instalado."
    }

    # Instalación de Node.js, npm, Git, Docker y MySQL Workbench
    Write-Host "Instalando Node.js, Git, Docker y MySQL Workbench..."
    winget install --id Microsoft.NodeJS -e
    winget install --id Docker.DockerDesktop -e
    winget install --id Oracle.MySQLWorkbench -e
    npm install

    Write-Host "Instalacion completa."
}

# Acciones según la selección del menú
switch ($mainSelection) {
    "Instalar Dependencias" {
        Install-Dependencies
    }
    "Actualizar Dependencias" {
        Write-Host "Actualizando dependencias..."
        npm update
    }
    "Salir" {
        Write-Host "Saliendo del instalador..."
    }
}

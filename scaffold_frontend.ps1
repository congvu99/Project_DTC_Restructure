$ErrorActionPreference = "Stop"

$FrontendDir = "frontend"
Set-Location $FrontendDir

# Initialize Vite React + TS project
npm create vite@latest dtc-web -- --template react-ts

Set-Location dtc-web

# Install core KendoReact dependencies
npm install @progress/kendo-react-grid @progress/kendo-react-data-tools @progress/kendo-data-query @progress/kendo-theme-default @progress/kendo-react-excel-export @progress/kendo-react-pdf @progress/kendo-drawing

# Create module folders
$Modules = @("QuanTri", "KHHN", "KHTH", "CTMTQG", "DuToan", "BaoCao", "DuAnKKVM")
$BaseDir = "src/modules"

New-Item -ItemType Directory -Force -Path $BaseDir | Out-Null

foreach ($module in $Modules) {
    $modulePath = "$BaseDir/$module"
    New-Item -ItemType Directory -Force -Path $modulePath | Out-Null
    
    # Standard sub-folders per module
    New-Item -ItemType Directory -Force -Path "$modulePath/components" | Out-Null
    New-Item -ItemType Directory -Force -Path "$modulePath/hooks" | Out-Null
    New-Item -ItemType Directory -Force -Path "$modulePath/services" | Out-Null
    New-Item -ItemType Directory -Force -Path "$modulePath/pages" | Out-Null
}

Write-Host "Frontend scaffolding complete!"

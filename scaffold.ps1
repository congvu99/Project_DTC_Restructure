$ErrorActionPreference = "Stop"

$ProjectName = "DTC"
$BackendDir = "backend"
$FrontendDir = "frontend"
$Modules = @("QuanTri", "KHHN", "KHTH", "CTMTQG", "DuToan", "BaoCao", "DuAnKKVM")

# Create main directories
New-Item -ItemType Directory -Force -Path $BackendDir | Out-Null
New-Item -ItemType Directory -Force -Path $FrontendDir | Out-Null

Set-Location $BackendDir

# Create Solution
dotnet new sln -n $ProjectName

# Create API Host
$ApiDir = "src/API/DTC.API"
New-Item -ItemType Directory -Force -Path $ApiDir | Out-Null
dotnet new webapi -n DTC.API -o $ApiDir
dotnet sln add "$ApiDir/DTC.API.csproj"

# Create Shared Layer
$SharedLayers = @("Domain", "Application", "Infrastructure")
foreach ($layer in $SharedLayers) {
    $path = "src/Shared/DTC.Shared.$layer"
    New-Item -ItemType Directory -Force -Path $path | Out-Null
    dotnet new classlib -n "DTC.Shared.$layer" -o $path
    dotnet sln add "$path/DTC.Shared.$layer.csproj"
}

# Add Shared References
dotnet add "src/Shared/DTC.Shared.Application/DTC.Shared.Application.csproj" reference "src/Shared/DTC.Shared.Domain/DTC.Shared.Domain.csproj"
dotnet add "src/Shared/DTC.Shared.Infrastructure/DTC.Shared.Infrastructure.csproj" reference "src/Shared/DTC.Shared.Application/DTC.Shared.Application.csproj"

# Scaffold Modules
foreach ($module in $Modules) {
    $modulePath = "src/Modules/$module"
    New-Item -ItemType Directory -Force -Path $modulePath | Out-Null
    
    # Only create actual projects for QuanTri to start with
    if ($module -eq "QuanTri") {
        $Layers = @("Domain", "Application", "Infrastructure", "Presentation")
        foreach ($layer in $Layers) {
            $projName = "DTC.$module.$layer"
            $projPath = "$modulePath/$projName"
            New-Item -ItemType Directory -Force -Path $projPath | Out-Null
            dotnet new classlib -n $projName -o $projPath
            dotnet sln add "$projPath/$projName.csproj"
            
            # Remove Class1.cs
            Remove-Item "$projPath/Class1.cs" -ErrorAction SilentlyContinue
        }
        
        # Add References for QuanTri
        dotnet add "$modulePath/DTC.QuanTri.Application/DTC.QuanTri.Application.csproj" reference "$modulePath/DTC.QuanTri.Domain/DTC.QuanTri.Domain.csproj"
        dotnet add "$modulePath/DTC.QuanTri.Application/DTC.QuanTri.Application.csproj" reference "src/Shared/DTC.Shared.Application/DTC.Shared.Application.csproj"
        
        dotnet add "$modulePath/DTC.QuanTri.Infrastructure/DTC.QuanTri.Infrastructure.csproj" reference "$modulePath/DTC.QuanTri.Application/DTC.QuanTri.Application.csproj"
        dotnet add "$modulePath/DTC.QuanTri.Infrastructure/DTC.QuanTri.Infrastructure.csproj" reference "src/Shared/DTC.Shared.Infrastructure/DTC.Shared.Infrastructure.csproj"
        
        dotnet add "$modulePath/DTC.QuanTri.Presentation/DTC.QuanTri.Presentation.csproj" reference "$modulePath/DTC.QuanTri.Application/DTC.QuanTri.Application.csproj"
        
        # API references QuanTri Presentation & Infrastructure (for DI registration)
        dotnet add $ApiDir reference "$modulePath/DTC.QuanTri.Presentation/DTC.QuanTri.Presentation.csproj"
        dotnet add $ApiDir reference "$modulePath/DTC.QuanTri.Infrastructure/DTC.QuanTri.Infrastructure.csproj"
    } else {
        # Just create folder structure for other modules
        New-Item -ItemType Directory -Force -Path "$modulePath/Domain" | Out-Null
        New-Item -ItemType Directory -Force -Path "$modulePath/Application" | Out-Null
        New-Item -ItemType Directory -Force -Path "$modulePath/Infrastructure" | Out-Null
        New-Item -ItemType Directory -Force -Path "$modulePath/Presentation" | Out-Null
    }
}

# API also needs Shared Infrastructure
dotnet add $ApiDir reference "src/Shared/DTC.Shared.Infrastructure/DTC.Shared.Infrastructure.csproj"

Set-Location ..

Write-Host "Scaffolding complete!"

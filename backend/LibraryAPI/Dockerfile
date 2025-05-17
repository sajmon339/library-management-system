# Użycie obrazu .NET Core Runtime jako bazy
FROM mcr.microsoft.com/dotnet/aspnet:8.0.5 AS base
WORKDIR /app
EXPOSE 80

# Obraz SDK do budowy aplikacji
FROM mcr.microsoft.com/dotnet/sdk:8.0.302 AS build
WORKDIR /src
COPY ["LibraryAPI.csproj", "./"]
RUN dotnet restore "./LibraryAPI.csproj"

COPY . .
RUN dotnet publish "LibraryAPI.csproj" -c Release -o /app/publish

# Finalny obraz
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "LibraryAPI.dll"]
